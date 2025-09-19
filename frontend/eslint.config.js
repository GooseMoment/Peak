import eslint from "@eslint/js"
import pluginQuery from "@tanstack/eslint-plugin-query"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import pluginReact from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import globals from "globals"
import tseslint from "typescript-eslint"

export default [
    {
        ignores: ["dist/*", "**/*.config.js", "public/*"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    pluginReact.configs.flat["jsx-runtime"],
    eslintConfigPrettier,
    ...pluginQuery.configs["flat/recommended"],
    reactHooks.configs["recommended-latest"],
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            "react/prop-types": "off",
            "no-console": "error",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            "no-restricted-imports": [
                "warn",
                {
                    patterns: [
                        "@/pages/*",
                        "@/api/*",
                        "@/components/*",
                        "@/utils/*",
                        "@/containers/*",
                        "@/assets/*",
                        "@/queries/*",
                        "@/routers/*",
                        "@/public/*",
                    ],
                },
            ],
            "no-use-before-define": [
                "error",
                {
                    functions: false,
                    classes: true,
                    variables: false,
                    allowNamedExports: false,
                },
            ],
            "no-duplicate-imports": [
                "warn",
                {
                    allowSeparateTypeImports: true,
                },
            ],
            "react-hooks/exhaustive-deps": "off", // TODO: enable this after typing Task-related files
        },
    },
]
