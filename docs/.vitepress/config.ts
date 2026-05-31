import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'SaaS Boilerplate',
  description: 'Dokumentasi boilerplate aplikasi SaaS modern siap pakai',
  lang: 'id-ID',
  base: '/docs/',
  outDir: '../public/docs',
  markdown: { html: true },

  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'SaaS Boilerplate',

    nav: [
      { text: 'Panduan', link: '/guide/introduction' },
      { text: 'Komponen', link: '/components/button' },
    ],

    sidebar: [
      {
        text: 'Memulai',
        items: [
          { text: 'Pengenalan', link: '/guide/introduction' },
          { text: 'Quick Start', link: '/guide/quick-start' },
          { text: 'Struktur Folder', link: '/guide/structure' },
          { text: 'Cara Kustomisasi', link: '/guide/customization' },
        ],
      },
      {
        text: 'Autentikasi',
        items: [
          { text: 'Alur Auth & JWT', link: '/guide/auth' },
          { text: 'Routing & Proteksi', link: '/guide/routing' },
          { text: 'Session Guard', link: '/guide/session' },
        ],
      },
      {
        text: 'Design System',
        items: [
          { text: 'Warna & Tema', link: '/guide/design-system' },
          { text: 'Animasi', link: '/guide/animation' },
        ],
      },
      {
        text: 'UI Components',
        items: [
          { text: 'Button', link: '/components/button' },
          { text: 'Input & Textarea', link: '/components/input' },
          { text: 'Select', link: '/components/select' },
          { text: 'Alert & Badge', link: '/components/alert-badge' },
          { text: 'Spinner', link: '/components/spinner' },
          { text: 'Modal', link: '/components/modal' },
          { text: 'Card & StatCard', link: '/components/card' },
          { text: 'Table & Pagination', link: '/components/table' },
          { text: 'EmptyState', link: '/components/empty-state' },
          { text: 'Avatar', link: '/components/avatar' },
          { text: 'Tabs', link: '/components/tabs' },
          { text: 'SidebarNav', link: '/components/sidebar-nav' },
          { text: 'PageHeader', link: '/components/page-header' },
          { text: 'Navbar & ProGate', link: '/components/navbar-progate' },
        ],
      },
      {
        text: 'Halaman',
        items: [
          { text: 'Overview Halaman', link: '/guide/pages' },
          { text: 'Static Pages', link: '/guide/static-pages' },
          { text: 'Admin Panel', link: '/guide/admin' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Jieeevest/crypto-ex' },
    ],

    footer: {
      message: 'SaaS Boilerplate — React + TypeScript + Vite',
    },

    search: {
      provider: 'local',
    },
  },
})
