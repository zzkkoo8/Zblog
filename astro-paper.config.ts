import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://zzkkoo8.github.io",
    title: "Zblog",
    description: "个人技术博客，记录技术实践、故障复盘与工程思考。",
    author: "zzkkoo8",
    profile: "https://github.com/zzkkoo8",
    ogImage: "default-og.jpg",
    lang: "zh-CN",
    timezone: "Asia/Singapore",
    dir: "ltr",
  },
  posts: {
    perPage: 6,
    perIndex: 6,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/zzkkoo8/Zblog/edit/main/",
    },
    search: "pagefind",
  },
  socials: [
    {
      name: "github",
      url: "https://github.com/zzkkoo8/Zblog",
      linkTitle: "Zblog GitHub 仓库",
    },
  ],
  shareLinks: [
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "mail", url: "mailto:?subject=Zblog%20文章&body=" },
  ],
});
