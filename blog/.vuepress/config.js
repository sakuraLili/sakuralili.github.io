module.exports = {
  title: '既然选择了远方，便只顾风雨兼程',
  description: 'Personal blog',
  theme: '@vuepress/theme-blog',
  configureWebpack: {
    resolve: {
      alias: {
        '@alias': './public/images'
      }
    }
  },
  head: [
    ['link', { ref: 'icon', href: './public/favicon.icon' }]
  ],
  themeConfig: {
    nav: [
      { text: 'Blog', link: '/' },
      { text: 'Tags', link: '/tag/' },
      { text: '学习资源', link: '/resource/' },
      { text: '前端学习手册', link: '/handbook/'}
    ],
    // sidebar: 'auto',
    displayAllHeaders: true,
    sidebarDepth: 3,
  }
}
