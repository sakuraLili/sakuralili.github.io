module.exports = {
  title: 'Hello World',
  description: 'Personal blog',
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
        'functional/',
      ]
    },
    lastUpdated: 'Last Updated'
  }
}
