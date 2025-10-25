#!/usr/bin/env node

/**
 * Release-it plugin to update app version in app.config.js
 * This ensures the mobile app version matches the semantic version
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  version: (pluginConfig, context) => {
    const { version, previousVersion } = context;
    const versionFile = pluginConfig.versionFile || 'app.config.js';
    const versionFilePath = path.resolve(versionFile);

    console.log(
      `📱 Updating app version from ${previousVersion} to ${version}`
    );

    try {
      // Read the current app.config.js
      let content = fs.readFileSync(versionFilePath, 'utf8');

      // Update version in app.config.js
      // Look for version: "x.x.x" pattern
      const versionRegex = /version:\s*["']([^"']+)["']/;
      const newContent = content.replace(versionRegex, `version: "${version}"`);

      if (newContent === content) {
        console.log('⚠️  No version found in app.config.js, adding it...');
        // If no version found, add it after the name field
        const nameRegex = /name:\s*["']([^"']+)["']/;
        const nameMatch = content.match(nameRegex);
        if (nameMatch) {
          const newContent = content.replace(
            nameMatch[0],
            `${nameMatch[0]},\n  version: "${version}"`
          );
          fs.writeFileSync(versionFilePath, newContent, 'utf8');
        } else {
          console.log('❌ Could not find name field in app.config.js');
          return;
        }
      } else {
        fs.writeFileSync(versionFilePath, newContent, 'utf8');
      }

      console.log(`✅ Updated ${versionFile} version to ${version}`);

      // Also update package.json if needed
      const packageJsonPath = path.resolve('package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      packageJson.version = version;
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2) + '\n'
      );
      console.log(`✅ Updated package.json version to ${version}`);
    } catch (error) {
      console.error(`❌ Error updating version: ${error.message}`);
      throw error;
    }
  },
};
