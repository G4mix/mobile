module.exports = {
  env: {
    browser: true,
    es2021: true,
    "react-native/react-native": true
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-native/all",
    "airbnb",
    "prettier",
    "plugin:@tanstack/eslint-plugin-query/recommended"
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ["react", "react-native", "@typescript-eslint", "prettier", "@tanstack/query"],
  rules: {
    "no-param-reassign": "off",
    "no-nested-ternary": "off",
    "prettier/prettier": [
      "error",
      { singleQuote: false, trailingComma: "none" }
    ],
    "react/react-in-jsx-scope": "off",
    "react/require-default-props": "off",
    "react-native/no-inline-styles": "off",
    "react-native/no-color-literals": "off",
    "react/jsx-filename-extension": [
      1,
      { extensions: [".js", ".jsx", ".ts", ".tsx"] }
    ],
    "@typescript-eslint/no-unused-vars": "warn",
    "no-console": "warn",
    "import/prefer-default-export": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "import/extensions": "off",
    "react/jsx-props-no-spreading": "off",
    "import/no-unresolved": "off",
    "global-require": "off",
    "@typescript-eslint/no-require-imports": "off",
    "@tanstack/query/exhaustive-deps": "error",
    "@tanstack/query/no-deprecated-options": "error",
    "@tanstack/query/prefer-query-object-syntax": "error",
    "@tanstack/query/stable-query-client": "error"
  }
};
