const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");
const prettier = require("eslint-config-prettier");


module.exports = defineConfig([
  expoConfig,
  prettier,
  {
    ignores: ["dist/*"],
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "react-hooks/set-state-in-effect": "off",
    },
  }
]);
