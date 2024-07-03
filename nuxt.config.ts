// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config"
export default defineNuxtConfig({
  devtools: { enabled: true },
  devServer: {
    // host: '0.0.0.0',
    port: 8080
  },
  ssr: false,
  app: {
    head: {
      charset: 'utf-16',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Catat',
      meta: [
        { name: 'description', content: 'Biar gampang dilihat lagi' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/@mdi/font@6.5.95/css/materialdesignicons.min.css'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Poppins&display=swap'
        }
      ]
    }
  },
  css: ['@/assets/main.scss'],
  modules: [
    'vuetify-nuxt-module',
    'dayjs-nuxt',
    'nuxt-lodash',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt'
  ],
  vuetify: {
    moduleOptions: {
    },
    vuetifyOptions: {
      
    }
  }
})
