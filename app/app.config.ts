export default defineAppConfig({
  title: 'SFHelp',
  email: 'communications@sfcollege.edu',
  github: 'https://github.com/ccbikai/sink',
  twitter: 'https://sink.cool/kai',
  telegram: 'https://sink.cool/telegram',
  mastodon: 'https://sink.cool/mastodon',
  blog: 'https://sfcollege.edu/',
  description: 'A lil link shortener for Santa Fe College',
  image: 'https://sink.cool/banner.png',
  previewTTL: 300, // 5 minutes
  slugRegex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
  reserveSlug: [
    'dashboard',
  ],
})
