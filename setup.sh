lerna bootstrap

# Run `yarn link` in each package.
cd packages
ls -1 | xargs -I {} sh -c 'cd {}; yarn link'

# Hook up our local Jest clone.
cd metro
yarn link jest-worker jest-docblock jest-haste-map
cd ../metro-core
yarn link jest-haste-map
cd ../metro-cache
yarn link jest-serializer
