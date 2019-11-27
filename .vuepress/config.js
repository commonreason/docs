module.exports = {
  title: "Common Reason",
  description: "Blockchain based on relational database and logic programming.",
  themeConfig: {
    repo: 'commonreason/docs',
    editLinks: true,
    smoothScroll: true,
    lastUpdated: 'Last Updated',
    sidebar: [
      '/',
    ]
  },
  plugins: [
    [
      'vuepress-plugin-clean-urls',
      {
        normalSuffix: '/',
        indexSuffix: '/',
        notFoundPath: '/404.html',
      },
    ],
    [
      'autometa',
      {
        site: {
          name: 'Common Reason',
          twitter: 'sorpaas',
        },
        canonical_base: 'https://commonreason.dev',
      }
    ]
  ],
};
