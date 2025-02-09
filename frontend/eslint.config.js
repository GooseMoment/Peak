import eslint from "@eslint/js"
import pluginQuery from "@tanstack/eslint-plugin-query"
import eslintConfigPrettier from "eslint-config-prettier"
import pluginReact from "eslint-plugin-react"
import globals from "globals"
import tseslint from "typescript-eslint"

export default [
    {
        ignores: ["dist/*", "**/*.config.js", "public/*", "**/registerSW.js"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    pluginReact.configs.flat["jsx-runtime"],
    eslintConfigPrettier,
    ...pluginQuery.configs["flat/recommended"],
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
                "error",
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
                    ],
                },
            ],
        },
    },
]
