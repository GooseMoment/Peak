import { defineConfig } from "@vite-pwa/assets-generator/config"

const preset = {
    transparent: {
        sizes: [64, 192, 512],
        favicons: [[48, "favicon.ico"]],
        padding: 0,
    },
    maskable: {
        sizes: [512],
        padding: 0,
    },
    apple: {
        sizes: [180],
        padding: 0.11,
        resizeOptions: {
            background: "#ff4a03",
        },
    },
}

export default defineConfig({
    headLinkOptions: {
        preset: "2023",
    },
    preset,
    images: ["public/logo.svg"],
})
