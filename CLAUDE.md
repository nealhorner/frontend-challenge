# Frontend Challenge

## Pull requests

### Every PR increments the app version

The app version is `version` in `package.json` (mirrored in `package-lock.json`).
Every pull request must raise it by exactly one step compared with `main`, as
part of the PR's own commits. The "Check version bump" CI job enforces this, so
a PR fails until it's done. Check locally with `npm run check:version`.

1. Check the version on `main` and on the branch:

   ```bash
   git fetch origin main
   git show origin/main:package.json | node -p "JSON.parse(require('fs').readFileSync(0)).version"
   node -p "require('./package.json').version"
   ```

2. If the branch is still at `main`'s version, bump it with the level that
   fits the PR's biggest change ([semver](https://semver.org)):

   - `patch`: bug fixes, copy edits, small styling tweaks, dependency updates.
   - `minor`: new features, pages or settings; noticeable UI changes.
   - `major`: breaking changes, e.g. renamed or newly required environment
     variables, or deploy steps someone must do by hand.

   ```bash
   npm version <patch|minor|major> --no-git-tag-version
   ```

   This updates both `package.json` and `package-lock.json` without creating a
   git tag or commit. Commit both files with the PR's changes.

3. If the branch already has a higher version than `main`, don't bump again
   when adding commits. Only re-bump if the PR's scope has grown into a bigger
   level (e.g. patch to minor): set it to `main`'s version plus that level.

4. If `main` moves ahead while the PR is open (another PR merged and bumped
   it), bump again from `main`'s new version when merging `main` in, so the
   branch stays exactly one step ahead.

5. State the new version and the level in the PR description, e.g.
   "Version: 0.1.0 → 0.2.0 (minor: new quiz results page)".
