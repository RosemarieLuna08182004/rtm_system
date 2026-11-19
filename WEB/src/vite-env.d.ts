/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** Backend origin, e.g. https://rtm-aiven-backend.onrender.com (see src/shared/routes/base.ts) */
    readonly VITE_API_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
