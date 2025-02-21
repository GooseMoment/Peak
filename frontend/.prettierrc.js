export default {
    tabWidth: 4,
    semi: false,
    bracketSameLine: true,
    objectWrap: "preserve",

    plugins: ["@trivago/prettier-plugin-sort-imports"],

    // @trivago/prettier-plugin-sort-imports
    importOrder: [
        "(^react$|^react-dom/client$|^react-router-dom$)",
        "(^@tanstack/react-query$|styled-components)",
        "^@routers/(.*)$",
        "^@containers/(.*)$",
        "^@pages/(.*)$",
        "^@components/(.*)$",
        "^[./]",
        "^@api/(.*)$",
        "^@utils/(.*)$",
        "^@queries/(.*)$",
        "^@assets/(.*)$",
        "^@public/(.*)$",
        "<THIRD_PARTY_MODULES>",
    ],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
}
