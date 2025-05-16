import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...tseslint.configs.recommended,
  js.configs.recommended,
  prettier,
  {
    ignores: ["dist", ".eslintrc.cjs", "node_modules/*"],
  },
  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      "@typescript-eslint": tseslint.plugin,
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // React
      "react/react-in-jsx-scope": "off",

      // Core JS rules
      "block-scoped-var": "error",
      eqeqeq: ["error", "smart"],
      "func-style": ["error", "declaration", { allowArrowFunctions: true }],
      "no-console": "warn",
      "no-duplicate-imports": "error",
      "no-empty": "error",
      "no-extra-boolean-cast": "error",
      "no-redeclare": "error",
      "no-undef": "error",
      "no-unreachable": "error",
      "no-unused-vars": "off",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-destructuring": ["error", { object: true, array: false }],
      "quote-props": ["error", "as-needed"],
      "spaced-comment": ["error", "always", { markers: ["/"] }],

      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",

      // Simple Import Sort
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // Import Plugin
      "import/first": "error",
      "import/named": "off",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/no-unresolved": "error",
    },
  },
];

export default eslintConfig;
