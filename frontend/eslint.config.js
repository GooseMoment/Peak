import globals from "globals"
import pluginJs from "@eslint/js"
import pluginReact from "eslint-plugin-react"


export default [
    pluginJs.configs.recommended,
    pluginReact.configs.flat.recommended, 
    pluginReact.configs.flat["jsx-runtime"],
    {
        files: ["**/*.{js,mjs,cjs,jsx}"],
        languageOptions: { 
            globals: {...globals.browser, ...globals.node},
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
]
