/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["plugin:prettier/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "warn",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
