#!/bin/sh
set -e

currentDir=$(cd "$(dirname "$0")" && pwd)
pluginDir=$currentDir/../plugins
outputDir=$currentDir/output
rm -rf "$outputDir"
mkdir -p "$outputDir"

dynamicReadmeHeader="\n\n$(cat "$currentDir/dynamic-header.md")\n\n"

# More details on dynamic-plugins can be found here:
# https://developers.redhat.com/rhdh/plugins

echo ===================================
echo Exporting frontend plugin
echo ===================================
cd "$pluginDir/humanitec"
npx --yes @red-hat-developer-hub/cli plugin export --clean
echo "# @humanitec/backstage-plugin-dynamic$dynamicReadmeHeader$(cat ./dist-dynamic/README.md)" > ./dist-dynamic/README.md
npm pack ./dist-dynamic --pack-destination "$outputDir"
echo ===================================
echo Exporting backend plugin
echo ===================================
cd "$pluginDir/humanitec-backend"
npx --yes @red-hat-developer-hub/cli plugin export --clean
echo "# @humanitec/backstage-plugin-backend-dynamic$dynamicReadmeHeader$(cat ./dist-dynamic/README.md)" > ./dist-dynamic/README.md
npm pack ./dist-dynamic --pack-destination "$outputDir"
echo ===================================
echo Exporting backend scaffolder module
echo ===================================
cd "$pluginDir/humanitec-backend-scaffolder-module"
npx --yes @red-hat-developer-hub/cli plugin export --clean
echo "# @humanitec/backstage-plugin-scaffolder-backend-module-dynamic$dynamicReadmeHeader $(cat ./dist-dynamic/README.md)" > ./dist-dynamic/README.md
npm pack ./dist-dynamic --pack-destination "$outputDir"
