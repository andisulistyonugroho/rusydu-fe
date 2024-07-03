// vuetify.config.ts
import type { ExternalVuetifyOptions } from 'vuetify-nuxt-module'
import {md3} from 'vuetify/blueprints'
export default {
  /* vuetify options */
  blueprint: md3,
  theme: {
    // defaultTheme: window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light',
    defaultTheme: 'light',
    themes: {
      dark: {
        colors: {
          primary: '#FFFFFF'
          // primary: '#FFD580'
        }
      },
      light: {
        dark: false,
        colors: {
          // primary: '#22549F',
          // secondary: '#E39139',
        }
      },
    }
  }
} satisfies ExternalVuetifyOptions