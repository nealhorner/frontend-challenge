#!/usr/bin/env node
// CI check: a pull request must raise the app version by exactly one semver
// step over its base branch (see "Every PR increments the app version" in
// CLAUDE.md), and package-lock.json must match package.json.
//
// Usage: node scripts/check-version-bump.mjs <base-ref>   e.g. origin/main

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SEMVER = /^(\d+)\.(\d+)\.(\d+)$/;

/** Parse "x.y.z" into numbers, or null if it isn't a plain release version. */
export function parseVersion(version) {
  const match = SEMVER.exec(version ?? '');
  return match ? match.slice(1, 4).map(Number) : null;
}

/** The version one major, minor or patch step above `base`. */
export function nextVersions(base) {
  const [major, minor, patch] = parseVersion(base);
  return {
    major: `${major + 1}.0.0`,
    minor: `${major}.${minor + 1}.0`,
    patch: `${major}.${minor}.${patch + 1}`
  };
}

/**
 * Compare the PR's version with the base branch's. Returns { ok, level,
 * message }, where level is the bump ("major" | "minor" | "patch") when ok.
 */
export function checkVersionBump({ baseVersion, headVersion, lockVersions = [] }) {
  if (!parseVersion(baseVersion)) {
    return { ok: false, message: `Base version "${baseVersion}" isn't a plain x.y.z version.` };
  }
  if (!parseVersion(headVersion)) {
    return { ok: false, message: `Version "${headVersion}" isn't a plain x.y.z version.` };
  }

  const mismatched = lockVersions.filter((v) => v !== headVersion);
  if (mismatched.length) {
    return {
      ok: false,
      message:
        `package-lock.json has version ${mismatched[0]} but package.json has ${headVersion}. ` +
        'Bump with `npm version <level> --no-git-tag-version` so both files match.'
    };
  }

  const next = nextVersions(baseVersion);
  const level = Object.keys(next).find((key) => next[key] === headVersion);
  if (level) {
    return { ok: true, level, message: `Version ${baseVersion} → ${headVersion} (${level}).` };
  }

  const options = `${next.patch} (patch), ${next.minor} (minor) or ${next.major} (major)`;
  const reason =
    headVersion === baseVersion
      ? `The version is still ${baseVersion}, the same as the base branch.`
      : `${headVersion} isn't one step above the base branch's ${baseVersion}.`;
  return {
    ok: false,
    message:
      `${reason} Every PR must bump it to ${options}: ` +
      'run `npm version <patch|minor|major> --no-git-tag-version` and commit both files.'
  };
}

function main() {
  const baseRef = process.argv[2];
  if (!baseRef) {
    console.error('Usage: node scripts/check-version-bump.mjs <base-ref>  (e.g. origin/main)');
    process.exit(2);
  }

  const basePackage = JSON.parse(
    execFileSync('git', ['show', `${baseRef}:package.json`], { encoding: 'utf8' })
  );
  const headPackage = JSON.parse(readFileSync('package.json', 'utf8'));
  const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));

  const result = checkVersionBump({
    baseVersion: basePackage.version,
    headVersion: headPackage.version,
    lockVersions: [lock.version, lock.packages?.['']?.version]
  });

  if (result.ok) {
    console.log(`✓ ${result.message}`);
  } else {
    // GitHub Actions shows ::error lines as annotations on the run.
    console.error(`::error title=Version not bumped::${result.message}`);
    console.error(`✗ ${result.message}`);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
