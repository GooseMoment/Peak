import { defineConfig } from 'vite'
import path from "path"

import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    base: "./", // https://github.com/vitejs/vite/discussions/5081#discussioncomment-1525248
    server: {
        port: 3000,
        host: "0.0.0.0",
    },
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            injectRegister: "script-defer",
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
            },
            devOptions: {
                enabled: true,
            },
            manifest: {
                name: 'Peak',
                short_name: 'Peak',
                description: 'Pick, Peek, Peck, and Peak.',
                theme_color: '#ffffff',
                icons: [
                    {
                        "src": "pwa-64x64.png",
                        "sizes": "64x64",
                        "type": "image/png"
                    },
                    {
                        "src": "pwa-192x192.png",
                        "sizes": "192x192",
                        "type": "image/png"
                    },
                    {
                        "src": "pwa-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png"
                    },
                    {
                        "src": "maskable-icon-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png",
                        "purpose": "maskable"
                    }
                ]
            },
        }),
    ],
    resolve: {
        alias: [
            { find: '@', replacement: path.resolve(__dirname, 'src') },
            { find: '@pages', replacement: path.resolve(__dirname, 'src', 'pages') },
            { find: '@api', replacement: path.resolve(__dirname, 'src', 'api') },
            { find: '@components', replacement: path.resolve(__dirname, 'src', 'components') },
            { find: '@utils', replacement: path.resolve(__dirname, 'src', 'utils') },
            { find: '@containers', replacement: path.resolve(__dirname, 'src', 'containers') },
            { find: '@assets', replacement: path.resolve(__dirname, 'src', 'assets') },
            { find: '@queries', replacement: path.resolve(__dirname, 'src', 'queries') },
        ]
    }
})
