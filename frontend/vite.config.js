import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            { find: '@', replacement: path.resolve(__dirname, 'src') },
            { find: '@pages', replacement: path.resolve(__dirname, 'src', 'pages') },
            { find: '@api', replacement: path.resolve(__dirname, 'src', 'api') },
            { find: '@components', replacement: path.resolve(__dirname, 'src', 'components') },
            { find: '@utils', replacement: path.resolve(__dirname, 'src', 'utils') },
            { find: '@containers', replacement: path.resolve(__dirname, 'src', 'containers') },
        ]
    }
})
