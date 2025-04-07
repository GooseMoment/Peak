interface ImportMetaEnv {
    readonly VITE_API_BASEURL: string
    readonly VITE_VAPID_PUBLIC_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
