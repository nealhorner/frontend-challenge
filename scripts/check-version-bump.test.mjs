import { describe, expect, it } from 'vitest';
import { checkVersionBump, nextVersions } from './check-version-bump.mjs';

describe('nextVersions', () => {
  it('lists the one-step bumps', () => {
    expect(nextVersions('1.4.2')).toEqual({ major: '2.0.0', minor: '1.5.0', patch: '1.4.3' });
  });
});

describe('checkVersionBump', () => {
  const ok = (headVersion) => checkVersionBump({ baseVersion: '0.1.0', headVersion });

  it('accepts exactly one patch, minor or major step', () => {
    expect(ok('0.1.1')).toMatchObject({ ok: true, level: 'patch' });
    expect(ok('0.2.0')).toMatchObject({ ok: true, level: 'minor' });
    expect(ok('1.0.0')).toMatchObject({ ok: true, level: 'major' });
  });

  it('rejects an unchanged version', () => {
    const result = ok('0.1.0');
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/still 0\.1\.0/);
    expect(result.message).toMatch(/0\.1\.1 \(patch\), 0\.2\.0 \(minor\) or 1\.0\.0 \(major\)/);
  });

  it('rejects skipped or malformed bumps', () => {
    expect(ok('0.1.2').ok).toBe(false); // two patch steps
    expect(ok('0.2.1').ok).toBe(false); // minor bump must reset patch
    expect(ok('0.0.9').ok).toBe(false); // going backwards
    expect(ok('0.2.0-beta.1').ok).toBe(false); // prerelease isn't a plain version
  });

  it('requires package-lock.json to match', () => {
    const result = checkVersionBump({
      baseVersion: '0.1.0',
      headVersion: '0.1.1',
      lockVersions: ['0.1.0', '0.1.1']
    });
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/package-lock\.json has version 0\.1\.0/);
  });

  it('passes when package-lock.json matches', () => {
    expect(
      checkVersionBump({
        baseVersion: '0.1.0',
        headVersion: '0.2.0',
        lockVersions: ['0.2.0', '0.2.0']
      })
    ).toMatchObject({ ok: true, level: 'minor' });
  });
});
