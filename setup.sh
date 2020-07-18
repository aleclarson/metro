# Hook up our local Jest clone.
lerna exec --scope=metro 'yarn link jest-worker jest-docblock jest-haste-map'
lerna exec --scope=metro-core 'yarn link jest-haste-map'
lerna exec --scope=metro-cache 'yarn link jest-serializer'

# Install dependencies and link local packages together.
lerna bootstrap

# Run `yarn link` in each package.
lerna exec 'yarn link' > /dev/null 2>&1
