/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_VERSION: string;
    readonly VITE_API_URL?: string;
    readonly VITE_API_SERVER: string;
    readonly VITE_API_PORT: string;
    // add more variables here as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  