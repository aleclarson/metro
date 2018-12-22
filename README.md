# aleclarson/metro

A fork of `metro` with support for symlinks in `node_modules`.

Current `metro` version: `0.45.0`

```sh
# Install root dependencies.
pnpm i

# Link every "package.json" in the "packages" directory
# and look in "../jest/packages" for reusable packages:
USING="../jest" node ./scripts/link.js

# Install each package.
cd packages
ls -1 | xargs -I {} sh -c 'cd {}; [ -f package.json ] && pnpm i --prod && pnpm link'
```
