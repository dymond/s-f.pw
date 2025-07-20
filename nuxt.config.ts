import { provider } from 'std-env'
import { currentLocales } from './i18n/i18n'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxthub/core',
    'shadcn-nuxt',
    '@vueuse/motion/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
  ],

  devtools: { enabled: true },

  colorMode: {
    classSuffix: '',
  },

  runtimeConfig: {
    siteToken: 'SFHelp',
    redirectStatusCode: '301',
    linkCacheTtl: 60,
    redirectWithQuery: false,
    homeURL: 'https://s-f.help',
    cfAccountId: '266371314ae112f9f548104104619ae6',
    cfApiToken: 'I1esRaw6b2qwmx7u0jup-Q8HB9lhqlDcc8h_Rmh_',
    dataset: 'sink',
    aiModel: '@cf/meta/llama-3.1-8b-instruct',
    aiPrompt: `You are a URL shortening assistant, please shorten the URL provided by the user into a SLUG. The SLUG information must come from the URL itself, do not make any assumptions. A SLUG is human-readable and should not exceed three words and can be validated using regular expressions {slugRegex} . Only the best one is returned, the format must be JSON reference {"slug": "example-slug"}`,
    caseSensitive: false,
    listQueryLimit: 500,
    disableBotAccessLog: false,
    public: {
      previewMode: 'false',
      slugDefaultLength: '6',
    },
  },

  routeRules: {
    '/': {
      prerender: true,
    },
    '/dashboard/**': {
      prerender: true,
      ssr: false,
    },
    '/dashboard': {
      redirect: '/dashboard/links',
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    enforceModuleCompatibility: true,
  },

  compatibilityDate: {
    cloudflare: '2025-05-08',
  },

  nitro: {
    experimental: {
      openAPI: true,
    },
    timing: true,
    rollupConfig: {
      onwarn(warning, warn) {
        // Suppress specific warnings about 'this' keyword in ES modules
        if (warning.code === 'THIS_IS_UNDEFINED') {
          return
        }
        // Suppress circular dependency warnings
        if (warning.code === 'CIRCULAR_DEPENDENCY') {
          return
        }
        warn(warning)
      },
      output: {
        manualChunks(id) {
          // Split visualization libraries into separate chunk
          if (id.includes('globe.gl') || id.includes('three') || id.includes('d3-scale')) {
            return 'globe-viz'
          }
          // Split UI component libraries
          if (id.includes('radix-vue') || id.includes('@vueuse/')) {
            return 'ui-components'
          }
          // Split icons
          if (id.includes('vue3-simple-icons') || id.includes('lucide-vue-next')) {
            return 'icons'
          }
          // Split form libraries (avoid external modules)
          if (id.includes('node_modules') && (id.includes('zod') || id.includes('@internationalized'))) {
            return 'forms'
          }
        },
      },
    },
    openAPI: {
      production: 'runtime',
      meta: {
        title: 'SFHelp API',
        description: 'A Simple / Speedy / Secure Link Shortener with Analytics, 100% run on Cloudflare.',
      },
      route: '/_docs/openapi.json',
      ui: {
        scalar: {
          route: '/_docs/scalar',
        },
        swagger: {
          route: '/_docs/swagger',
        },
      },
    },
  },

  hub: {
    ai: true,
    analytics: true,
    blob: false,
    cache: false,
    database: false,
    kv: true,
    workers: provider !== 'cloudflare_pages',
  },

  eslint: {
    config: {
      stylistic: true,
      standalone: false,
    },
  },

  i18n: {
    locales: currentLocales,
    compilation: {
      strictMessage: false,
      escapeHtml: true,
    },
    lazy: true,
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'sfhelp_i18n_redirected',
      redirectOn: 'root',
    },
    baseUrl: '/',
    defaultLocale: 'en-US',
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './app/components/ui',
  },
})
