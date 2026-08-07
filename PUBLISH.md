# Publishing Guide

This guide explains how to automatically build and publish `@kayingai/kaying-filetree` to npm using GitHub Actions.

## Prerequisites

- An [npm](https://www.npmjs.com/) account.
- The npm package name `@kayingai/kaying-filetree` is available (or owned by you).
- Push access to the `https://github.com/kaying-studio/kaying-filetree.git` repository.

## One-time Setup

### 1. Create an npm Access Token

1. Log in to [npmjs.com](https://www.npmjs.com/).
2. Click your avatar → **Access Tokens**.
3. Click **Generate New Token** → **Classic Token**.
4. Select the **Publish** permission.
5. Copy the generated token (you will only see it once).

### 2. Add the Token to GitHub Secrets

1. Open your repository on GitHub.
2. Go to **Settings → Secrets and variables → Actions**.
3. Click **New repository secret**.
4. Name: `NPM_TOKEN`
5. Value: paste the npm token from step 1.
6. Click **Add secret**.

### 3. Enable GitHub Actions

The following workflows are already included in the repository:

- `.github/workflows/ci.yml` — runs type checking and building on every push and pull request to `main`/`master`.
- `.github/workflows/release.yml` — publishes to npm when a GitHub Release is published.
- `npm run build:release` — runs type checking and generates the publishable build artifact.

No extra configuration is required if you use the default `main` or `master` branch.

## Publishing a New Version

### Step 1. Update the Version

Locally, update the version in `package.json` following [Semantic Versioning](https://semver.org/):

```bash
npm version patch   # 0.1.0 -> 0.1.1
# or
npm version minor   # 0.1.0 -> 0.2.0
# or
npm version major   # 0.1.0 -> 1.0.0
```

This command:
- Updates `package.json`.
- Creates a git commit.
- Creates a git tag (e.g., `v0.1.1`).

### Step 2. Push the Tag

```bash
git push origin main --follow-tags
```

### Step 3. Create a GitHub Release

1. Go to your repository on GitHub.
2. Click **Releases → Draft a new release**.
3. Choose the tag you just pushed (e.g., `v0.1.1`).
4. Fill in the release title and notes.
5. Click **Publish release**.

Once the release is published, the `Release` workflow will automatically:
- Install dependencies.
- Run `npm run typecheck`.
- Run `npm run build`.
- Publish the package to npm with provenance.

### Step 4. Verify

1. Check the **Actions** tab to confirm the workflow succeeded.
2. Visit `https://www.npmjs.com/package/@kayingai/kaying-filetree` to confirm the new version is live.

## Manual Publishing (Fallback)

If you need to publish manually:

```bash
npm login
npm run build:release
npm publish --access public
```

## Notes

- The release workflow uses `npm publish --provenance --access public`. Provenance requires npm CLI 9.5.0+ and a public npm package.
- If the package name is not yet created on npm, the first publish will create it.
- Make sure `package.json` has the correct `version` before creating a release.
