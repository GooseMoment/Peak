import globals from "globals"
import pluginJs from "@eslint/js"
import pluginReact from "eslint-plugin-react"


export default [
    {
        files: ["**/*.{js,mjs,cjs,jsx}"],
        languageOptions: { globals: {...globals.browser, ...globals.node} },
        plugins: {
            js: pluginJs.configs.recommended,
            jsx: pluginReact.configs["jsx-runtime"],
            react: pluginReact.configs.recommended,
        }
    },
]
