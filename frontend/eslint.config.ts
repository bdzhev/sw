import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import { globalIgnores } from "eslint/config";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import importPlugin from "eslint-plugin-import";
import pluginVue from "eslint-plugin-vue";
import eslintParserVue from "vue-eslint-parser";

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
    languageOptions: {
      parser: eslintParserVue,
      parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"],
      },
    },
    plugins: {
      import: importPlugin,
      vue: pluginVue,
      "better-tailwindcss": eslintPluginBetterTailwindcss,
    },
    rules: {
      ...eslintPluginBetterTailwindcss.configs["recommended-warn"].rules,
      ...eslintPluginBetterTailwindcss.configs["recommended-error"].rules,
      "better-tailwindcss/multiline": "off",
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [
            {
              pattern: "@shared/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@entities/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@features/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@widgets/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@pages/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "vue/max-len": ["error", { code: 90, template: 90, ignoreStrings: true }],
      "vue/max-attributes-per-line": [
        "error",
        {
          singleline: 3,
          multiline: {
            max: 1,
          },
        },
      ],
      "vue/html-closing-bracket-newline": [
        "error",
        {
          singleline: "never",
          multiline: "always",
        },
      ],
      "eol-last": ["error", "always"],
      semi: ["error", "always"],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "arrow-body-style": ["error", "always"],
      curly: ["error", "all"],
      "consistent-return": "error",
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "return" },
      ],
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/main.css",
        tailwindConfig: "tailwind.config.js",
      },
    },
  },

  globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]),

  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  skipFormatting,
);
