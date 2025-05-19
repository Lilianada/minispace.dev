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
  
  const portfolioThemeConfig: ThemeConfig = {
    name: "Portfolio",
    category: "Portfolio",
    description: "A modern, bold portfolio theme for developers and creatives.",
    version: "1.0.0",
    author: "Lilianada",
    preview: "/themes/portfolio/preview.png",
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
              heading: "Lilianada",
              subheading: "Frontend Developer & Designer",
              showAvatar: true,
              avatarUrl: "/avatar.png",
              cta: {
                text: "View Projects",
                link: "/projects"
              }
            },
            order: 1
          },
          {
            id: "skills",
            type: "skills",
            title: "Skills",
            content: {
              skills: ["React", "TypeScript", "CSS", "Figma", "GSAP", "Next.js"]
            },
            order: 2
          },
          {
            id: "featured-projects",
            type: "project-grid",
            title: "Featured Projects",
            content: {
              count: 3
            },
            order: 3
          }
        ]
      },
      about: {
        title: "About",
        path: "/about",
        blocks: [
          {
            id: "about-title",
            type: "title",
            title: "About Me",
            content: {
              text: "About Me",
              alignment: "center"
            },
            order: 1
          },
          {
            id: "about-content",
            type: "text",
            title: "About Content",
            content: {
              text: "Hi! I'm Lilianada, a passionate frontend developer and designer. I combine code and creativity to build delightful, accessible interfaces. My favorite stack: React, JS/TS, CSS, and a dash of animation."
            },
            order: 2
          }
        ]
      },
      projects: {
        title: "Projects",
        path: "/projects",
        blocks: [
          {
            id: "projects-title",
            type: "title",
            title: "Projects",
            content: {
              text: "Projects",
              alignment: "center"
            },
            order: 1
          },
          {
            id: "projects-list",
            type: "project-grid",
            title: "All Projects",
            content: {
              count: 12
            },
            order: 2
          }
        ]
      },
      project: {
        title: "Project",
        path: "/projects/:id",
        blocks: [
          {
            id: "project-title",
            type: "title",
            title: "Project Title",
            content: {
              text: "Project Title",
              alignment: "left"
            },
            order: 1
          },
          {
            id: "project-content",
            type: "project-card",
            title: "Project Content",
            content: {},
            order: 2
          }
        ]
      },
      contact: {
        title: "Contact",
        path: "/contact",
        blocks: [
          {
            id: "contact-title",
            type: "title",
            title: "Contact",
            content: {
              text: "Contact",
              alignment: "center"
            },
            order: 1
          },
          {
            id: "contact-content",
            type: "contact",
            title: "Contact Content",
            content: {
              email: "your.email@example.com",
              socials: {
                github: "Lilianada",
                twitter: "yourtwitter",
                linkedin: "yourlinkedin"
              }
            },
            order: 2
          }
        ]
      }
    },
    layout: {
      header: {
        title: "Lilianada",
        menu: [
          { label: "Home", path: "/" },
          { label: "Projects", path: "/projects" },
          { label: "About", path: "/about" },
          { label: "Contact", path: "/contact" }
        ],
        sticky: true
      },
      footer: {
        text: "© 2025 Lilianada. Made with 💜",
        showSocials: true,
        showPoweredBy: true
      },
      sidebar: {
        visible: false,
        title: "",
        content: {}
      }
    },
    defaultStyles: {
      colors: {
        background: "#1a1c23",
        text: "#f6f6fa",
        primary: "#db43ff",
        accent: "#4756ff"
      },
      fonts: {
        heading: "'Inter', system-ui, sans-serif",
        body: "'Inter', system-ui, sans-serif"
      }
    }
  };
  
  export default portfolioThemeConfig;