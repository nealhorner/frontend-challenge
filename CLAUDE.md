# Frontend Challenge

## Committing

### Never commit unless explicitly asked

Don't create commits on your own. After changing files, stop and leave the
changes uncommitted in the working tree so they can be read and checked locally
first. Then:

1. Say which files changed and what each change does, so they're easy to review
   (e.g. with `git diff` or in an editor).
2. Wait for an explicit request such as "commit", "commit and push" or "open a
   PR" before running `git commit`. Finishing a task, passing tests or a
   successful build is not a request to commit.
3. Pushing, opening or updating a pull request, merging, and tagging also need
   an explicit request; they all publish commits.

A request to commit covers only the changes it refers to. If there are other
uncommitted changes in the working tree, leave them out unless asked, and
mention them. If you've been asked to only stage files (`git add`), don't
commit them.

### Auto-fix follows the same rule

When Auto-fix (the Claude desktop app watching a PR) reports a CI failure, a
merge conflict or new review comments, make the fix but don't commit or push
it, even though the Auto-fix message says to. Turning on Auto-fix is not a
request to commit. For each event:

- **CI failure or review comment:** fix it locally, run the relevant checks,
  and leave the changes uncommitted. Say what failed or what was asked, and
  what you changed.
- **Merge conflict:** fetch the base branch and merge it with
  `git merge --no-commit <remote>/<base>`, resolve the conflicts, and leave the
  result staged but uncommitted. (A merge in progress can be finished with
  `git commit` or backed out with `git merge --abort`.)
- **Review threads:** don't reply to or resolve them yet. Replies are public
  and should point to a pushed commit, so do that only after you're asked to
  commit and push the fix.
- Comments that need no change (approvals, "review in progress" notices) need
  no action.

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
   git tag or commit. Include both files when the PR's changes are committed
   (only once that's asked for; see "Never commit unless explicitly asked").

3. If the branch already has a higher version than `main`, don't bump again
   when adding commits. Only re-bump if the PR's scope has grown into a bigger
   level (e.g. patch to minor): set it to `main`'s version plus that level.

4. If `main` moves ahead while the PR is open (another PR merged and bumped
   it), bump again from `main`'s new version when merging `main` in, so the
   branch stays exactly one step ahead.

5. State the new version and the level in the PR description, e.g.
   "Version: 0.1.0 → 0.2.0 (minor: new quiz results page)".
