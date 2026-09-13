/// <reference types="vite/client" />

declare module '*.avif' {
  const src: string
  export default src
}

declare module '*.geojson' {
  const value: GeoJSON.FeatureCollection
  export default value
}

interface ImportMetaEnv {
  readonly VITE_PUBLIC_SITE_URL?: string
  readonly VITE_ADMIN_BASE_PATH?: string
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
