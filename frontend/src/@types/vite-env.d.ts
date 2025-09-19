/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />
/// <reference types="vite-plugin-pwa/info" />

interface ImportMetaEnv {
    readonly VITE_API_BASEURL: string
    readonly VITE_VAPID_PUBLIC_KEY: string
    readonly VITE_DEFAULT_PROFILE_IMG: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
