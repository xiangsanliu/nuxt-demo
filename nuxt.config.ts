// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n'
  ],
  i18n: {
    locales: [
      { code: 'en', label: 'English' },
      { code: 'zh-CN', label: '简体中文' },
      { code: 'zh-TW', label: '繁體中文' }
    ],
    defaultLocale: 'zh-CN',
    strategy: 'no_prefix',
    vueI18n: 'i18n.config.ts'
  },
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
  app: {
    head: {
      title: 'Asset Overview',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' },
        { name: 'description', content: 'Asset Overview' }
      ]
    }
  },
  ui: {
    fonts: false,
  },
  vite: {
    server: {
      allowedHosts: ['.cnb.run']
    }
  }
})
