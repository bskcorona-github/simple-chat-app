// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 開発ツールの有効化
  devtools: { enabled: true },

  // サーバーサイドレンダリングを無効化 (完全な SPA)
  ssr: false,

  // 環境変数設定
  runtimeConfig: {
    public: {
      pusherKey: process.env.NEXT_PUBLIC_PUSHER_KEY || "c993d50743d259a69fa6",
      pusherCluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap3",
      backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000",
    },
  },
  

  // Nitro のプリレンダリング設定
  nitro: {
    prerender: {
      routes: ['/'], // ルートページを事前生成
    },
  },

  compatibilityDate: '2024-11-26',
});
console.log("Loaded runtimeConfig:", {
  pusherKey: process.env.NEXT_PUBLIC_PUSHER_KEY,
  pusherCluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
});