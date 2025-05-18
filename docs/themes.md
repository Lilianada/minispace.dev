Here's a **step-by-step breakdown** of how to go about building the **first theme** for Minispace, under the **"Personal Blog"** category. This will be the initial version of the site hosted on subdomains like `username.minispace.dev`. Everything below avoids code and focuses on implementation in **plain text**.

---

## 🔖 Theme Overview

**Theme Name:** *Rubik theme*

**Category:** *Personal*

**Pages:**

1. Home (`/`)  - can be renamed
2. About (`/about`) - can be renamed
3. Posts list (`/posts`)  - can be renamed
4. Single Post (`/posts/[id]`)  - can be renamed

**Priority Goals:**

* Lightweight
* Fast
* Minimal JavaScript
* Minimal fonts (1–2 at most, with system fonts fallback)
* Mobile-first responsive
* Customizable text and content areas

---

## 🎨 Theme Structure (Per Page)

### 1. **Home Page**

**Sections (aka Blocks):**

* Hero section with name, tagline, and optional avatar
* Short introduction paragraph
* Call-to-action (e.g. “Read my thoughts” linking to `/posts`) this is why i said user can have different posts type, they can change the link from `/posts` to `/notes` or whatever they like.
* Optional recent posts preview (e.g. 5 recent posts with titles and dates)

**Customizable Elements:**

* Name
* Tagline
* Bio text
* Avatar (optional)
* Colors (background, text, links)
* Font (choose from limited system-safe options)

---

### 2. **About Page**

**Sections:**

* Title (“About Me” or similar)
* Full-width body content
* Optional links (email, socials)

**Customizable Elements:**

* Full markdown or rich text content block
* Optional contact links

---

### 3. **Posts Page (`/posts`)**

**Sections:**

* Header with title (e.g. “All Posts”)
* List of blog posts (title, date, short excerpt)

**Customizable Elements:**

* Post title
* Publish date
* Summary (auto-generated or input manually)

---

### 4. **Single Post Page (`/posts/[id]`)**

**Sections:**

* Title
* Date
* Full content
* Tags (optional)
* Back to posts link

**Customizable Elements:**

* Title
* Body (rich text/markdown)
* Date
* Tags
* Custom slug

---

## 🧩 Theme Settings Structure

Each theme will define **blocks per page**. Blocks are individual components that accept content.

Example:

```plaintext
Theme: Personal Blog

Pages:
- Home
  - HeroBlock
  - IntroBlock
  - CTAButtonBlock
  - RecentPostsBlock

- About
  - TitleBlock
  - RichTextBlock
  - SocialLinksBlock

- Posts
  - TitleBlock
  - PostListBlock

- Post
  - TitleBlock
  - MetaBlock (Date, Tags)
  - ContentBlock
  - BackLinkBlock
```

Each block is customizable via the **dashboard UI**, stored in the user’s `siteCustomization` document.

---

## 📂 Where to Store Content

In Firebase:

* User collection: `/users/{uid}`
* Subcollection: `/siteCustomization/personalBlogTheme`
* Inside it:

  * `/pages/home/blocks`
  * `/pages/about/blocks`
  * `/pages/posts/blocks`
  * `/pages/post/blocks`

Each block will have its type, content, style values (optional), and order.

---

## ⚙️ Technical Considerations

* Use static generation where possible (SSG), especially for public-facing subdomains.
* Avoid client-side routing unless necessary. Prefer direct HTML/CSS rendering.
* Minimal JavaScript for basic interactivity.
* Limit fonts to:

  * System default (`sans-serif`, `serif`)
  * One web font optionally loaded from a CDN (if performance budget allows)
* Avoid animation libraries or large utility libraries (keep bundle size small).

---

## 📄 Example: Default Content

### Home Page (Default for new users)

* HeroBlock: "Hi, I’m DemoUser"
* IntroBlock: "Welcome to my blog. I write about life, learning, and ideas."
* CTAButtonBlock: "Read my posts"
* RecentPostsBlock: "No posts yet"

---

## 🌐 Subdomain Routing

When user visits `demouser.minispace.dev`:

* Default theme loads with pages configured under `siteCustomization`
* If no custom content: show default placeholder
* Always use lightweight version of the site — no dashboard/admin scripts included

---

## 🧠 Next Steps

1. Finalize content block types and naming
2. Build JSON schema for block customization
3. Create content management UI under `/dashboard/site-customisation`
4. Build the rendering logic that loads published content and maps it to components
5. Optimize for static export and subdomain delivery

---

Absolutely — those are essential structural components and must be part of your theme system for each site. Here's how to approach **Header Navigation, Sidebar, Hamburger Menu, and Footer** for Minispace's themes, starting with the "Personal Blog" theme:

---

## 🧭 Global Layout Elements (Apply to All Pages)

### 1. **Header Navigation (Top Navbar)**

#### Purpose:

* Show site title
* Provide main navigation links (e.g., Home, About, Posts)
* May include social icons or a dark/light toggle (optional)

#### Customizable:

* Site title (text )
* Menu items (label + link)
* Font and background color
* Sticky or static behavior

#### Mobile:

* Hamburger menu for mobile devices
* Tapping hamburger reveals sidebar or dropdown with nav links

#### Stored in Firebase under:

`/siteCustomization/layout/header`

#### Default Example:

```plaintext
- Title: DemoUser’s Blog
- Menu: [Home, About, Posts]
```

---

### 2. **Sidebar (Optional)**

#### Purpose:

* Used in blog-like layouts or documentation-style layouts
* Shows categories, tags, or topics
* Helps with deep content navigation

#### For Personal Blog Theme:

* **Not visible on Home/About**
* **Visible on `/posts` and `/posts/[id]`** if enabled

#### Customizable:

* Visibility (on/off)
* Title (e.g., “Topics” or “Categories”)
* Content (tags, topic list)

#### Stored in Firebase under:

`/siteCustomization/layout/sidebar`

---

### 3. **Hamburger Menu (Mobile Nav Toggle)**

#### Purpose:

* Used on smaller screens to toggle nav visibility

#### Behavior:

* Toggles display of full-page nav or side drawer
* Links replicate header menu

#### Customizable:

* Icon style (basic customization)
* Slide-in direction (left/right)

#### Stored in:

Same place as header but tied to screen size/responsiveness

---

### 4. **Footer**

#### Purpose:

* Provide site-wide footer info

#### Default Sections:

* Text ( “Powered by Minispace)
* Copyright
* Optional links - gotten from their profile social links (socials, contact, GitHub)

#### Customizable:

* Text block (markdown or plain text)
* Color background / text
* Link list (label + href)

#### Stored in Firebase under:

`/siteCustomization/layout/footer`

#### Default Footer for all users (pro users can edit but for now 'Coming Soon'):

```plaintext
- © 2025 {username}
- Powered by Minispace
```

---

## 🔧 How These Fit Together

**Every page** (Home, About, Posts, Post) will follow this structure:

```plaintext
[Header]
 ├─ Logo or Title
 ├─ Navigation Links
 └─ Hamburger (on mobile)

[Optional Sidebar]
 ├─ List of tags, topics, categories

[Main Content]
 ├─ Page-specific blocks (Hero, List, Post Content, etc.)

[Footer]
 ├─ Copyright / Links / Text
```

---

## 💾 In the Database

Firebase structure might look like:

```plaintext
/siteCustomization
  └── layout
        ├── header
        ├── sidebar
        ├── footer
```

Each of these contains:

* visibility (true/false)
* content (text, link array)
* style options (colors, fonts)

---

## 🚀 Performance Considerations

* Load layout elements statically (during build) for SSG
* Use shared minimal layout components with props pulled from Firebase
* Avoid JavaScript-heavy nav or sidebar libraries
* Collapse layout into pure HTML/CSS on exportable builds (e.g., for GitHub Pages)

---
