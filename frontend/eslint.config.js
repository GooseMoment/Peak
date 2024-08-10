import pluginJs from "@eslint/js"
import airbnb from "eslint-config-airbnb"
import eslintConfigPrettier from "eslint-config-prettier"
import pluginReact from "eslint-plugin-react"
import globals from "globals"
import tseslint from "typescript-eslint"

// TODO: convert to flat config after airbnb updates its repo

export default [
    pluginJs.configs.recommended,
    pluginReact.configs.flat.recommended,
    pluginReact.configs.flat["jsx-runtime"],
    eslintConfigPrettier,
    ...tseslint.configs.recommended,
    {
        plugins: {
            airbnb,
        },
        files: ["**/*.{js,mjs,cjs,jsx}"],
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
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
        },
    },
]
