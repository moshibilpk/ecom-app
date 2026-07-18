const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = [
  ...expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: [
      "node_modules/",
      ".expo/",
      "web-build/",
      "dist/",
      "ios/",
      "android/",
      "babel.config.js",
      "metro.config.js",
    ],
  },
];
