module.exports = {
  title: 'Hello World',
  description: 'Personal blog',
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
      { text: '个人文章', link: '/blog/' },
      { text: '学习资源', link: '/'}
    ],
    // sidebar: 'auto',
    displayAllHeaders: true,
    sidebar: {
      '/blog/': [
        'JavaScript/',
        'CSS/',
        'Vue/',
        'HTML/',
        'functional/',
        'question/',
        'other/',
      ]
    },
    lastUpdated: 'Last Updated'
  }
}
