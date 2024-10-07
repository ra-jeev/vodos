// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-30',

  future: { compatibilityVersion: 4 },

  modules: ['@nuxthub/core', '@nuxt/eslint', '@nuxt/ui'],

  hub: {
    ai: true,
    database: true,
  },

  runtimeConfig: {
    public: {},
  },

  eslint: {
    config: {
      stylistic: false,
    },
  },

  devtools: { enabled: true },
});
