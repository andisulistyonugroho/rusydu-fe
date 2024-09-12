// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config"
import { md3 } from 'vuetify/blueprints'
export default defineNuxtConfig({
  devtools: { enabled: true },
  devServer: {
    // host: '0.0.0.0',
    port: 8080
  },
  ssr: false,
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000/api'
    }
  },
  app: {
    head: {
      charset: 'utf-16',
      viewport: 'width=device-width, initial-scale=1',
      title: 'RUSDU',
      meta: [
        { name: 'description', content: 'Biar gampang dilihat lagi' }
      ],
      link: [
        { rel: 'icon', href: '/64x64.png' },
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
        }, {
          rel: "apple-touch-icon",
          href: "/apple-touch-icon.png"
        }
      ]
    }
  },
  css: ['@/assets/main.scss'],
  modules: [
    'vuetify-nuxt-module',
    'dayjs-nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@unocss/nuxt',
    '@vite-pwa/nuxt'
  ],
  pwa: {
    manifest: {
      name: 'RUSDU',
      short_name: 'Rusdu',
      description: 'Jaga kelola harta',
      background_color: '#000000',
      theme_color: '#000000',
      icons: [
        {
          src: '64x64.png',
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: '192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
    },
    devOptions: {
      suppressWarnings: true,
      enabled: true,
      type: 'module'
    }
  },
  vuetify: {
    moduleOptions: {
    },
    vuetifyOptions: {
      icons: {
        defaultSet: 'unocss-mdi',
      },
      blueprint: md3,
      theme: {
        defaultTheme: 'light',
      },
      labComponents: ['VDateInput']
    }
  }
})