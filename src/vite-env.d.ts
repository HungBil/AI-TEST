/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CROWN_AUTH_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
