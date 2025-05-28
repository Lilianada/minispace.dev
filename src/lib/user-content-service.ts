import { adminDb, isAdminAvailable } from './firebase/admin';

/**
 * Service for fetching user-generated content
 * Used for dynamic pages, posts, and other user content
 */

interface PageData {
  title: string;
  content: string;
  description?: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  meta?: Record<string, any>;
  [key: string]: any;
}

interface UserData {
  displayName?: string;
  bio?: string;
  email?: string;
  socialLinks?: string;
  [key: string]: any;
}

/**
 * Simple page info for navigation purposes
 */
interface PageInfo {
  slug: string;
  title: string;
}

/**
 * Fetch a user's page content from Firestore
 * 
 * @param username - The username of the user
 * @param slug - The slug of the page (e.g., 'about', 'projects')
 * @returns The page data or null if not found
 */
export async function getUserPageData(username: string, slug: string): Promise<PageData | null> {
  // If Firebase Admin is not available, return demo content for development
  if (!isAdminAvailable() || !adminDb) {
    console.log(`[UserContentService] Firebase Admin not available, using demo content for ${username}/${slug}`);
    return getDemoPageContent(username, slug);
  }
  
  try {
    console.log(`[UserContentService] Fetching page content for: ${username}/${slug}`);
    
    const pageDoc = await adminDb
      .collection('users')
      .doc(username)
      .collection('pages')
      .doc(slug)
      .get();
      
    if (!pageDoc.exists) {
      console.log(`[UserContentService] Page not found: ${username}/${slug}`);
      return null;
    }
    
    return {
      ...(pageDoc.data() as PageData),
      slug
    };
  } catch (error) {
    console.error(`[UserContentService] Error fetching page content for ${username}/${slug}:`, error);
    return null;
  }
}

/**
 * Fetch a user's basic profile data from Firestore
 * 
 * @param username - The username of the user
 * @returns The user data or null if not found
 */
export async function getUserData(username: string): Promise<UserData | null> {
  // If Firebase Admin is not available, return demo content for development
  if (!isAdminAvailable() || !adminDb) {
    console.log(`[UserContentService] Firebase Admin not available, using demo content for user: ${username}`);
    return {
      displayName: username,
      bio: `This is a demo bio for ${username}`,
      email: `${username}@example.com`,
      socialLinks: 'Twitter, GitHub, LinkedIn'
    };
  }
  
  try {
    console.log(`[UserContentService] Fetching user data for: ${username}`);
    
    const userDoc = await adminDb
      .collection('users')
      .doc(username)
      .get();
      
    if (!userDoc.exists) {
      console.log(`[UserContentService] User not found: ${username}`);
      return null;
    }
    
    return userDoc.data() as UserData;
  } catch (error) {
    console.error(`[UserContentService] Error fetching user data for ${username}:`, error);
    return null;
  }
}

/**
 * Get a user's theme settings
 * 
 * @param username - The username of the user
 * @returns The theme ID or 'altay' as default
 */
export async function getUserTheme(username: string): Promise<string> {
  if (!isAdminAvailable() || !adminDb) {
    return 'altay';
  }
  
  try {
    const themeDoc = await adminDb
      .collection('users')
      .doc(username)
      .collection('settings')
      .doc('theme')
      .get();
      
    if (!themeDoc.exists) {
      return 'altay';
    }
    
    return (themeDoc.data()?.themeId as string) || 'altay';
  } catch (error) {
    console.error(`[UserContentService] Error fetching theme for ${username}:`, error);
    return 'altay';
  }
}

/**
 * Fetch a user's custom pages for navigation
 * 
 * @param username - The username of the user
 * @returns Array of page data objects with slug and title
 */
export async function getUserCustomPages(username: string): Promise<PageInfo[]> {
  // If Firebase Admin is not available, return demo pages for development
  if (!isAdminAvailable() || !adminDb) {
    console.log(`[UserContentService] Firebase Admin not available, using demo pages for navigation`);
    // Return only pages that we know are supported by themes
    return [
      { slug: 'about', title: 'About' },
      { slug: 'projects', title: 'Projects' },
      { slug: 'contact', title: 'Contact' }
    ];
  }
  
  try {
    console.log(`[UserContentService] Fetching custom pages for navigation: ${username}`);
    
    // Get all published pages for the user
    const pagesSnapshot = await adminDb
      .collection('users')
      .doc(username)
      .collection('pages')
      .where('published', '==', true)
      .get();
      
    if (pagesSnapshot.empty) {
      console.log(`[UserContentService] No custom pages found for ${username}`);
      return [];
    }
    
    // Get user's theme to verify which pages can be properly rendered
    const themeId = await getUserTheme(username);
    
    // Get all pages first
    const allPages = pagesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        slug: doc.id,
        title: data.title || doc.id.charAt(0).toUpperCase() + doc.id.slice(1)
      };
    });
    
    // Filter to only include pages that can be rendered consistently
    const renderedPages: PageInfo[] = [];
    
    for (const page of allPages) {
      // Always include standard pages that most themes support
      if (['about', 'projects', 'contact', 'resume', 'blog'].includes(page.slug)) {
        renderedPages.push(page);
        continue;
      }
      
      // For custom pages, check if they can be rendered with the user's theme
      const canRender = await canRenderPageWithTheme(page.slug, themeId);
      if (canRender) {
        renderedPages.push(page);
      } else {
        console.log(`[UserContentService] Excluding page '${page.slug}' from navigation as it may have layout issues`);
      }
    }
    
    console.log(`[UserContentService] Found ${renderedPages.length} custom pages for user ${username} (from total of ${allPages.length})`);
    return renderedPages;
    
  } catch (error) {
    console.error(`[UserContentService] Error fetching user custom pages: ${error}`);
    return [];
  }
}

/**
 * Check if a page slug can be properly rendered by a theme
 * 
 * @param slug - The page slug
 * @param themeId - The theme ID
 * @returns Boolean indicating if the page can be rendered with consistent layout
 */
async function canRenderPageWithTheme(slug: string, themeId: string): Promise<boolean> {
  try {
    // Import theme service dynamically to avoid circular dependencies
    const { getThemeById } = await import('./theme-service');
    
    // Get theme manifest
    const theme = await getThemeById(themeId);
    if (!theme) return false;
    
    // Check if theme has a template for this page type
    if (theme.templates[slug]) {
      // Direct template exists
      return true;
    }
    
    // Check if theme has a 'custom' template for generic pages
    if (theme.templates.custom) {
      return true;
    }
    
    // Check if theme has an 'about' template we can use as fallback
    if (theme.templates.about) {
      return true;
    }
    
    // No suitable template found
    return false;
  } catch (error) {
    console.error(`[UserContentService] Error checking page renderability: ${error}`);
    // Be conservative - if we can't check, assume it can't be rendered consistently
    return false;
  }
}

/**
 * Get demo page content for development mode
 * 
 * @param username - The username
 * @param slug - The page slug
 * @returns Demo page data
 */
function getDemoPageContent(username: string, slug: string): PageData | null {
  const now = new Date().toISOString();
  
  // Map of demo pages and their content
  const demoPages: Record<string, Omit<PageData, 'slug'>> = {
    'home': {
      title: `${username}'s Home Page`,
      content: `<div class="content-wrapper">
        <h1>Welcome to ${username}'s Site</h1>
        <p>This is a custom home page created with Minispace's dynamic page system.</p>
        <div class="featured-content">
          <div class="feature-card">
            <h2>About Me</h2>
            <p>Learn more about me and my background.</p>
            <a href="/about" class="feature-link">Read More</a>
          </div>
          <div class="feature-card">
            <h2>My Projects</h2>
            <p>Check out some of the projects I've been working on.</p>
            <a href="/projects" class="feature-link">View Projects</a>
          </div>
        </div>
      </div>`,
      description: `${username}'s custom home page on Minispace`,
      createdAt: now,
      updatedAt: now,
      published: true
    },
    'about': {
      title: `About ${username}`,
      content: `<div class="content-wrapper">
        <h1>About ${username}</h1>
        <p>Hi! I'm ${username}, a developer passionate about building great products.</p>
        <h2>Background</h2>
        <p>I've been coding for over 5 years, specializing in web development and design.</p>
        <h2>Skills</h2>
        <ul>
          <li>JavaScript & TypeScript</li>
          <li>React & Next.js</li>
          <li>UI/UX Design</li>
          <li>Firebase & Cloud Services</li>
        </ul>
      </div>`,
      description: `About ${username} - personal information and background`,
      createdAt: now,
      updatedAt: now,
      published: true
    },
    'projects': {
      title: `${username}'s Projects`,
      content: `<div class="content-wrapper">
        <h1>My Projects</h1>
        <div class="projects-grid">
          <div class="project-card">
            <h2>Project Alpha</h2>
            <p>A responsive web application built with React and Firebase.</p>
            <div class="project-links">
              <a href="#" class="project-link">View Project</a>
              <a href="#" class="project-link">GitHub</a>
            </div>
          </div>
          <div class="project-card">
            <h2>Cool App</h2>
            <p>Mobile app developed with React Native featuring real-time updates.</p>
            <div class="project-links">
              <a href="#" class="project-link">View Project</a>
              <a href="#" class="project-link">GitHub</a>
            </div>
          </div>
        </div>
      </div>`,
      description: `${username}'s portfolio of projects and work samples`,
      createdAt: now,
      updatedAt: now,
      published: true
    },
    'contact': {
      title: `Contact ${username}`,
      content: `<div class="content-wrapper">
        <h1>Get in Touch</h1>
        <p>Have a project or question? Feel free to reach out!</p>
        <div class="contact-info">
          <div class="contact-method">
            <h3>Email</h3>
            <p><a href="mailto:${username}@example.com">${username}@example.com</a></p>
          </div>
          <div class="contact-method">
            <h3>Social Media</h3>
            <ul class="social-links">
              <li><a href="#">Twitter</a></li>
              <li><a href="#">GitHub</a></li>
              <li><a href="#">LinkedIn</a></li>
            </ul>
          </div>
        </div>
      </div>`,
      description: `Contact information and ways to reach ${username}`,
      createdAt: now,
      updatedAt: now,
      published: true
    }
  };
  
  // Return the requested page or null if not found
  if (!demoPages[slug]) {
    return null;
  }
  
  return {
  ...demoPages[slug],
  slug,
  title: '',
  content: '',
  createdAt: '',
  updatedAt: '',
  published: false
};
}
