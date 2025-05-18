Since my goal is to allow users to host their sites under subdomains like `username.minispace.dev`, here’s how we can **plan and structure everything** to support subdomain-based deployment in a fast, secure, and scalable way, using **Next.js** (App Router), while keeping bundle size small.

---

## ✅ Goal

Users get personal sites like:

```
username.minispace.dev
```

Each site is:

* Themed (based on a selected visual theme).
* Multi-page (about, blog, contact, etc.).
* Block-based (each page contains content sections like hero, projects, etc.).
* Customizable (optional safe CSS overrides).
* Fast-loading, static, and CDN-delivered.

---

## 🧭 Updated To-Do for Subdomain-Based Minisites

### 1. **Domain/Subdomain Handling Strategy**

To serve user sites at `username.minispace.dev`:

* Use **Next.js middleware** to extract the subdomain from the request.
* Based on the subdomain (`username`), load the corresponding content and theme.
* Optionally store each user’s site config (theme, pages, content) in flat files or a DB.

**Key Points:**

* You’ll have one actual deployed app.
* Middleware checks the host, extracts `username`, and maps that to content.

---

### 2. **Project Structure**

Organize user data like this:

```
/content
  /username
    config.json       ← user’s selected theme, pages
    about.json        ← structured page content
    blog.json
    custom.css        ← optional, scoped custom styles
```

Themes are stored like:

```
/themes
  /minimal
    layout.tsx
    components/
  /editorial
    layout.tsx
```

---

### 3. **Routing & Middleware (no SSR)**

* Use **static routes** for all common pages (`/about`, `/blog`, etc.).
* Use **middleware** to capture the `Host` header:

  * Extract the `username` from `username.minispace.dev`.
  * Store this username in cookies or headers to use in the App Router.
* At build time, generate static paths per known user and page.

This enables true **static generation per subdomain**.

---

### 4. **Page & Theme Resolution Logic**

When rendering a page:

* Determine the user from subdomain.
* Read their config.
* Resolve:

  * Which theme to use.
  * Which page to load.
  * Which blocks to render.
* The theme loads only required components and styles for that page.

Only the selected theme's files should be bundled for that build target.

---

### 5. **Theme Architecture (Multi-page Capable)**

Each theme should be:

* Modular — use reusable block components.
* Layout-aware — render page content dynamically using passed-in blocks.
* Universal — support homepage, about, contact, blog, etc., without creating new layout files for each.

You don’t need a unique layout file per page — just pass the page type and blocks into a generic renderer component for each theme.

---

### 6. **Safe Custom CSS per User**

* Let users add scoped CSS that only applies to their `.site-wrapper`.
* Prevent global or malicious styles from being applied.
* Store CSS in each user’s content folder (`custom.css`), and inject it inside a `<style>` tag within their layout scope.

Use tooling or regex to:

* Strip dangerous selectors (like `*`, `html`, `body`, `script`).
* Only allow class-based or `:root` scoped variables.

---

### 7. **Static Generation (SSG) & Deployment**

To deploy everything fast:

* Use **`generateStaticParams()`** in Next.js to pre-generate pages for every known subdomain and page.
* Each generated page is built with:

  * Its theme’s styles and components.
  * Its structured content blocks.
* Deploy the app to **Vercel or Netlify Edge**, using rewrites and wildcards (`*.minispace.dev`) to support subdomains.

---

### 8. **Performance & Bundle Size**

* Do not bundle all themes — only include the active theme during build.
* Avoid client-side JavaScript except for theme-switchers or scroll effects.
* No third-party trackers, fonts, or animations unless explicitly added by the user.
* Cache HTML and assets aggressively at the CDN level.

---

## 🧩 Recap

| Task       | Strategy                                                  |
| ---------- | --------------------------------------------------------- |
| Subdomains | Use middleware to extract subdomain and route content     |
| Themes     | One layout per theme, reusable blocks, loaded per site    |
| Pages      | Defined in user config and statically generated           |
| Blocks     | Predefined types like hero, text, image, gallery, etc.    |
| Custom CSS | Scoped to `.site-wrapper`, sanitized, loaded safely       |
| Speed      | SSG, no JS hydration unless needed, only load what's used |

---

Since we're using **Firebase** as our database, here's how we can **adapt everything we've discussed** to fit our Firebase schema and make our site structure, theming, and subdomain routing work seamlessly.

---

## ✅ Assumed Firebase Structure

Here’s your current document layout:

```
/users
  /[userId]
    name
    username
    email
    ...
    /userSettings
      theme: "minimal"
      mode: "dark"
      ...
    /siteCustomization
      pages: [
        {
          slug: "about",
          blocks: [ ... ]
        },
        {
          slug: "projects",
          blocks: [ ... ]
        }
      ]
```

---

## 🧭 Firebase-Powered Minispace Flow

### 1. **User Site Identification via Subdomain**

* Use Next.js Middleware to extract the subdomain:

  ```
  username.minispace.dev
  ↓
  username = subdomain
  ```

* Lookup Firebase:

  * Find the `/users` document where `username == subdomain`.
  * Fetch:

    * `/userSettings`
    * `/siteCustomization`

This gives you:

* Theme
* Pages & blocks
* Any custom CSS

You can cache these lookups to avoid multiple reads.

---

### 2. **Per-Page Rendering Flow**

Each route like `/about`, `/projects`, `/blog`:

1. Use `generateStaticParams()` in Next.js to generate these routes for each known user.
2. At build/runtime (depending on if you're prerendering or rendering at edge):

   * Get the username from middleware.
   * Query Firebase to get that user's `siteCustomization.pages`.
   * Find the page with the matching `slug`.
   * Pass the blocks + theme into a `PageRenderer` component.

---

### 3. **Theme Resolution from Firebase**

* Theme name is stored in `userSettings.theme`.
* You only import components from that specific theme folder:

  ```
  import { PageLayout, BlockRenderer } from "@/themes/[theme]"
  ```
* You dynamically resolve the right theme per request.

You can also support `light`, `dark`, or `auto` from `userSettings.mode`.

---

### 4. **Blocks from Firebase**

Each `page` in `/siteCustomization` has a list of blocks:

```json
{
  "slug": "about",
  "blocks": [
    { "type": "hero", "data": { "heading": "Hi, I'm Jo!" } },
    { "type": "text", "data": { "body": "Welcome to my space..." } },
    { "type": "imageGallery", "data": { ... } }
  ]
}
```

You pass this to a generic `BlockRenderer`:

```ts
blocks.map((block) => <BlockRenderer key={block.id} {...block} />)
```

---

### 5. **Safe Custom CSS**

Allow an optional field like `userSettings.customCSS`.

**Render it inside** a `<style>` tag scoped under a `.site-wrapper` class:

```html
<style>
  .site-wrapper {
    /* User CSS here */
  }
</style>
```

**To protect your app:**

* Sanitize user CSS using a parser or regex (remove `*`, `html`, `script`, etc.)
* Only allow class-based or `:root` CSS variables.

---

### 6. **Authentication (Optional)**

* You can choose to make sites **public** (no auth needed to view) but require auth to edit.
* Firebase Auth + Firestore rules will handle this.

---

### 7. **Deploy & Hosting Notes**

* Use **wildcard subdomain hosting**: `*.minispace.dev`.
* If you deploy to **Vercel**, set up a wildcard domain and connect it to your Next.js app.
* Firebase functions are **not needed for page rendering** unless you want to use SSR — avoid to keep it light.

---

## 🔄 Recap of What Happens per Page Load

| Step               | What Happens                                                        |
| ------------------ | ------------------------------------------------------------------- |
| 1. Middleware      | Extracts `username` from `host`                                     |
| 2. Firebase Lookup | Find user with `username`, get `userSettings` & `siteCustomization` |
| 3. Route Match     | Find page with slug matching the route (`about`, `blog`, etc.)      |
| 4. Theme Load      | Dynamically import selected theme components                        |
| 5. Block Rendering | Render blocks in order inside the page layout                       |
| 6. Custom CSS      | Inject if present, scoped, and sanitized                            |

---
