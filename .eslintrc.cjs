/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  ignorePatterns: ["!**/.server", "!**/.client"],

  // Base config
  extends: ["eslint:recommended", "prettier"],
  plugins: ["check-file", "unused-imports", "prettier"],

  overrides: [
    // React
    {
      files: ["**/*.{js,jsx,ts,tsx}"],
      plugins: ["react", "jsx-a11y", "react-hooks", "tailwindcss", "unicorn"],
      extends: [
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:tailwindcss/recommended",
        "plugin:prettier/recommended",
        "plugin:unicorn/recommended",
      ],
      settings: {
        react: {
          version: "detect",
        },
        formComponents: ["Form"],
        linkComponents: [
          { name: "Link", linkAttribute: "to" },
          { name: "NavLink", linkAttribute: "to" },
        ],
        "import/resolver": {
          typescript: {},
        },
        rules: {
          "@typescript-eslint/explicit-function-return-type": [
            "error",
            {
              allowExpressions: true,
              allowTypedFunctionExpressions: true,
            },
          ],
          "react/function-component-definition": [
            "error",
            {
              namedComponents: "arrow-function",
              unnamedComponents: "arrow-function",
            },
          ],
          "no-unused-vars": "off",
          "unicorn/no-array-for-each": "off",
          "unused-imports/no-unused-imports": "error",
          "unused-imports/no-unused-vars": [
            "warn",
            {
              vars: "all",
              varsIgnorePattern: "^_",
              args: "after-used",
              argsIgnorePattern: "^_",
            },
          ],
        },
      },
    },

    // Typescript
    {
      files: ["**/*.{ts,tsx}"],
      plugins: ["@typescript-eslint", "import"],
      parser: "@typescript-eslint/parser",
      settings: {
        "import/internal-regex": "^~/",
        "import/resolver": {
          node: {
            extensions: [".ts", ".tsx"],
          },
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
      ],
    },

    // Node
    {
      files: [".eslintrc.cjs"],
      env: {
        node: true,
      },
    },
    {
      plugins: ["check-file"],
      files: ["src/**/!(__tests__)/*"],
      rules: {
        "check-file/folder-naming-convention": [
          "error",
          {
            "**/*": "KEBAB_CASE",
          },
        ],
      },
    },
  ],
};
