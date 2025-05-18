/**
 * Rubik Theme Configuration
 * 
 * This file defines the configuration for the Rubik theme,
 * including default content, layout options, and customizable elements.
 */

export interface ThemeConfig {
  name: string;
  category: string;
  description: string;
  version: string;
  author: string;
  preview: string;
  pages: {
    [key: string]: {
      title: string;
      path: string;
      blocks: BlockConfig[];
    };
  };
  layout: {
    header: HeaderConfig;
    footer: FooterConfig;
    sidebar?: SidebarConfig;
  };
  defaultStyles: {
    colors: {
      background: string;
      text: string;
      primary: string;
      secondary: string;
      accent: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
  };
}

export interface BlockConfig {
  id: string;
  type: string;
  title: string;
  content: any;
  order: number;
  styles?: any;
}

export interface HeaderConfig {
  title: string;
  menu: {
    label: string;
    path: string;
  }[];
  sticky: boolean;
  styles?: any;
}

export interface FooterConfig {
  text: string;
  showSocials: boolean;
  showPoweredBy: boolean;
  styles?: any;
}

export interface SidebarConfig {
  visible: boolean;
  title: string;
  content: any;
  styles?: any;
}

/**
 * Default configuration for the Rubik theme
 */
const rubikThemeConfig: ThemeConfig = {
  name: "Rubik",
  category: "Personal",
  description: "A clean, minimal theme for personal blogs and portfolios",
  version: "1.0.0",
  author: "Minispace",
  preview: "/themes/rubik/preview.png",
  pages: {
    home: {
      title: "Home",
      path: "/",
      blocks: [
        {
          id: "hero",
          type: "hero",
          title: "Hero Section",
          content: {
            heading: "Hi, I'm DemoUser",
            subheading: "Writer, thinker, creator",
            showAvatar: true,
          },
          order: 1,
        },
        {
          id: "intro",
          type: "text",
          title: "Introduction",
          content: {
            text: "Welcome to my blog. I write about life, learning, and ideas that matter to me. Feel free to explore my thoughts and reach out if anything resonates with you.",
          },
          order: 2,
        },
        {
          id: "cta",
          type: "cta",
          title: "Call to Action",
          content: {
            text: "Read my posts",
            link: "/posts",
            buttonStyle: "primary",
          },
          order: 3,
        },
        {
          id: "recent-posts",
          type: "recent-posts",
          title: "Recent Posts",
          content: {
            count: 3,
            showDate: true,
            showExcerpt: true,
          },
          order: 4,
        },
      ],
    },
    about: {
      title: "About",
      path: "/about",
      blocks: [
        {
          id: "about-title",
          type: "title",
          title: "Page Title",
          content: {
            text: "About Me",
          },
          order: 1,
        },
        {
          id: "about-content",
          type: "rich-text",
          title: "About Content",
          content: {
            text: `# Hello, I'm DemoUser

I'm a writer and creator passionate about sharing ideas and stories.

## My Background

I've been writing for over 5 years on topics ranging from technology to personal development.

## What I Do

- Writing insightful blog posts
- Exploring new ideas
- Connecting with readers

Feel free to reach out if you'd like to connect!`,
          },
          order: 2,
        },
        {
          id: "contact-links",
          type: "social-links",
          title: "Contact Links",
          content: {
            showEmail: true,
            showSocial: true,
          },
          order: 3,
        },
      ],
    },
    posts: {
      title: "Posts",
      path: "/posts",
      blocks: [
        {
          id: "posts-title",
          type: "title",
          title: "Page Title",
          content: {
            text: "All Posts",
          },
          order: 1,
        },
        {
          id: "posts-list",
          type: "posts-list",
          title: "Posts List",
          content: {
            postsPerPage: 10,
            showDate: true,
            showExcerpt: true,
            showTags: true,
          },
          order: 2,
        },
      ],
    },
    post: {
      title: "Post",
      path: "/posts/[slug]",
      blocks: [
        {
          id: "post-title",
          type: "title",
          title: "Post Title",
          content: {},
          order: 1,
        },
        {
          id: "post-meta",
          type: "post-meta",
          title: "Post Metadata",
          content: {
            showDate: true,
            showTags: true,
            showAuthor: true,
          },
          order: 2,
        },
        {
          id: "post-content",
          type: "post-content",
          title: "Post Content",
          content: {},
          order: 3,
        },
        {
          id: "back-link",
          type: "back-link",
          title: "Back Link",
          content: {
            text: "Back to all posts",
            link: "/posts",
          },
          order: 4,
        },
      ],
    },
  },
  layout: {
    header: {
      title: "DemoUser's Blog",
      menu: [
        { label: "Home", path: "/" },
        { label: "About", path: "/about" },
        { label: "Posts", path: "/posts" },
      ],
      sticky: true,
    },
    footer: {
      text: "Powered by Minispace",
      showSocials: true,
      showPoweredBy: true,
    },
    sidebar: {
      visible: false,
      title: "Categories",
      content: {
        showCategories: true,
        showTags: true,
      },
    },
  },
  defaultStyles: {
    colors: {
      background: "#ffffff",
      text: "#333333",
      primary: "#3b82f6",
      secondary: "#6b7280",
      accent: "#f97316",
    },
    fonts: {
      heading: "'Rubik', sans-serif",
      body: "'Rubik', system-ui, sans-serif",
    },
  },
};

export default rubikThemeConfig;
