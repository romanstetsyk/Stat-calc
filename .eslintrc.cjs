/* eslint-env node */
module.exports = {
  env: { browser: true, es2021: true },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: true,
      // node: true,
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:jsx-a11y/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    // project: "./tsconfig.json",
  },
  plugins: ["react", "@typescript-eslint", "react-refresh", "jsx-a11y"],
  rules: {
    "react-refresh/only-export-components": "warn",
    // fixes 'React' must be in scope when using JSX
    "react/react-in-jsx-scope": 0,
    "sort-imports": [
      "error",
      {
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
      },
    ],
    // eslint-plugin-import
    "import/order": [
      "error",
      {
        // "newlines-between": "always",
        alphabetize: {
          order: "asc",
          orderImportKind: "asc",
          caseInsensitive: true,
        },
        // imports that should go before everything else
        pathGroupsExcludedImportTypes: [
          "react",
          "react-router-dom",
          "react-dom/client",
        ],
        pathGroups: [
          {
            pattern: "~/**",
            group: "external",
            position: "after",
          },
          {
            pattern: "{react,react-router-dom,react-dom/client}",
            // pattern: "react-router-dom",
            group: "builtin",
            position: "before",
          },
        ],
      },
    ],
  },
};
