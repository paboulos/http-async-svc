module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "plugin:@typescript-eslint/recommended", // Uses recommended rules from @typescript-eslint/eslint-plugin
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to override conflicting rules in @typescript-eslint/eslint-plugin
    "plugin:prettier/recommended", // integrates eslint-plugin-prettier and eslint-config-prettier. always the last configuration in the extends array.
  ],
  rules: {
    // Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
  },
};
