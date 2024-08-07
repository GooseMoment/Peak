import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
    base: "./", // https://github.com/vitejs/vite/discussions/5081#discussioncomment-1525248
    envDir: "..",
    server: {
        port: 3000,
        host: "0.0.0.0",
    },
    plugins: [react()],
    resolve: {
        alias: [
            { find: "@", replacement: path.resolve(__dirname, "src") },
            {
                find: "@pages",
                replacement: path.resolve(__dirname, "src", "pages"),
            },
            {
                find: "@api",
                replacement: path.resolve(__dirname, "src", "api"),
            },
            {
                find: "@components",
                replacement: path.resolve(__dirname, "src", "components"),
            },
            {
                find: "@utils",
                replacement: path.resolve(__dirname, "src", "utils"),
            },
            {
                find: "@containers",
                replacement: path.resolve(__dirname, "src", "containers"),
            },
            {
                find: "@assets",
                replacement: path.resolve(__dirname, "src", "assets"),
            },
            {
                find: "@queries",
                replacement: path.resolve(__dirname, "src", "queries"),
            },
            {
                find: "@routers",
                replacement: path.resolve(__dirname, "src", "routers"),
            },
        ],
    },
})
