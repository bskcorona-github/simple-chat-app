// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // サーバーサイドレンダリングを無効化して完全な SPA とする
  ssr: false,

  // Nitro のプリレンダリング設定
  nitro: {
    prerender: {
      routes: ['/'], // ルートページを事前生成
    },
  },
});
