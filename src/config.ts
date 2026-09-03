import type {
  ExpressiveCodeConfig,
  LicenseConfig,
  NavBarConfig,
  ProfileConfig,
  SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
  title: "Zblog",
  subtitle: "个人技术博客",
  lang: "zh_CN",
  themeColor: {
    hue: 250,
    fixed: false,
  },
  banner: {
    enable: false,
    src: "assets/images/demo-banner.png",
    position: "center",
    credit: {
      enable: false,
      text: "",
      url: "",
    },
  },
  toc: {
    enable: true,
    depth: 2,
  },
  favicon: [],
};

export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.About,
    {
      name: "Zwiki",
      url: "https://zwiki.gitbook.io/zwiki-docs/",
      external: true,
    },
    {
      name: "GitHub",
      url: "https://github.com/zzkkoo8/Zblog",
      external: true,
    },
  ],
};

export const profileConfig: ProfileConfig = {
  avatar: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgcng9IjU2IiBmaWxsPSIjMTgxODFiIi8+PHRleHQgeD0iMTI4IiB5PSIxNjciIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCxzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0NCIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0id2hpdGUiPlo8L3RleHQ+PC9zdmc+",
  name: "zzkkoo8",
  bio: "记录技术实践、故障复盘与工程思考。",
  links: [
    {
      name: "GitHub",
      icon: "fa6-brands:github",
      url: "https://github.com/zzkkoo8/Zblog",
    },
    {
      name: "Zwiki",
      icon: "material-symbols:menu-book-outline",
      url: "https://zwiki.gitbook.io/zwiki-docs/",
    },
  ],
};

export const licenseConfig: LicenseConfig = {
  enable: false,
  name: "",
  url: "",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
  theme: "github-dark",
};
