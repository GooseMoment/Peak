import pluginJs from "@eslint/js"
import airbnb from "eslint-config-airbnb"
import pluginReact from "eslint-plugin-react"
import globals from "globals"

// TODO: convert to flat config after airbnb updates its repo

export default [
    pluginJs.configs.recommended,
    pluginReact.configs.flat.recommended,
    pluginReact.configs.flat["jsx-runtime"],
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
            "no-unused-vars": "warn",
        },
    },
]
