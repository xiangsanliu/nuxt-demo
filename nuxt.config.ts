// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui'
  ],
  css: ['~/assets/css/main.css'],
  // 强制开启未来功能（可选，Nuxt 4 推荐）
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-07-15',
  nitro: {
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  }, devtools: { enabled: true },
  ui: {
    fonts: false,
  },
  vite: {
    server: {
      allowedHosts: ['.cnb.run']
    }
  }
})
