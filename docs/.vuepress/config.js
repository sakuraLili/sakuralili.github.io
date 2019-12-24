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
      { text: '学习资源', link: '/resource/' },
      { text: '前端学习手册', link: '/handbook/'}
    ],
    // sidebar: 'auto',
    displayAllHeaders: true,
    sidebar: {
      '/resource/': [
        'tools.md',
        'api.md'
      ],
      '/handbook/': [
        'chapter-0.md',
        'chapter-1.md'
      ],
      '/blog/': [
        'JavaScript/',
        'CSS/',
        'Vue/',
        'HTML/',
        'functional/',
        'charts/',
        'question/',
        'other/',
      ]
    },
    lastUpdated: 'Last Updated'
  }
}
