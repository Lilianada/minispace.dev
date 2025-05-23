Here is a step-by-step guide to creating a clean, consistent, and easily maintainable theming system for Minispace. This approach prioritizes simplicity, clarity, and extensibility, ensuring themes are easy to build, customize, and render with plain HTML and CSS (and only minimal JavaScript where absolutely necessary).

---

### 1. **Define a Clear Folder and File Structure**

Begin by organizing your theme in a predictable and simple directory format. Each theme should live in its own folder inside a root `themes` directory. Inside the theme folder, include:

* A `layout.html` file: the base template that wraps all pages.
* Individual page templates: e.g., `home.html`, `post.html`, `about.html`.
* A `theme.css` file: the main stylesheet.
* A `manifest.json` or `manifest.ts` file: metadata and customization options.
* An optional `assets/` folder: for theme-specific images, fonts, or icons.

Example structure:

```
themes/
  simple/
    layout.html
    home.html
    post.html
    about.html
    theme.css
    manifest.json
    assets/
      thumbnail.png
```

---

### 2. **Use Layout.html as the Root Shell**

`layout.html` should act as the consistent outer shell for all pages. It includes:

* The HTML `<head>` with metadata and a link to the theme stylesheet.
* A consistent `<header>`, main content container, and `<footer>`.
* A placeholder where the selected page content will be injected dynamically using a placeholder like `{{{content}}}`.

This ensures a single source of truth for site layout and allows each inner page to focus solely on its content.

---

### 3. **Make Page Templates Only Contain Unique Content**

Templates like `home.html`, `post.html`, and `about.html` should not include the full page structure. They should only include content-specific markup like post lists or page bodies.

Each of these templates should assume it will be wrapped by `layout.html`, so they should only focus on the body content, not metadata, styles, or global headers/footers.

---

### 4. **Use Consistent Handlebars-like Template Variables**

Define a core set of variables and helpers accessible inside any theme:

* `{{site.title}}`, `{{site.description}}`, `{{site.username}}`, `{{navigation}}`
* `{{posts}}` with sub-properties like `title`, `slug`, `excerpt`, `coverImage`, `publishedAt`
* `{{{content}}}` for injecting nested content
* `{{currentYear}}` for dynamic dates
* `{{formatDate date}}` for readable dates

Keep the variable syntax consistent across all templates to reduce learning curves.

---

### 5. **Keep the CSS Simple, Flexible, and Well-Scoped**

Use a single `theme.css` file to define all theme styles. Stick to a minimal number of CSS variables, such as:

* `--ms-background`
* `--ms-text`
* `--ms-primary`
* `--ms-font-body`
* `--ms-font-heading`

Avoid utility libraries or frameworks like Tailwind or Bootstrap. Instead, define plain CSS that styles standard HTML elements and theme-specific classes like `.ms-header`, `.ms-main`, `.ms-post-card`, etc.

Structure your CSS with predictable sections:

1. CSS Variables
2. Reset and base styles
3. Layout (header, footer, container)
4. Components (cards, hero, grid)
5. Typography
6. Media queries

Use `:root` to define light and dark mode variables if needed.

---

### 6. **Manifest File as the Source of Metadata and Customization**

Create a simple `manifest.json` or `manifest.ts` file for each theme. This file serves three purposes:

1. Describe the theme (name, author, description, version)
2. List template files (layout, home, post, about)
3. Define customizable variables (colors, fonts, toggles)

Organize it in a structured way, and make all values editable via a visual theme editor later if needed. The customization fields will be injected as CSS variables or class names by the rendering engine.

---

### 7. **Support Optional Custom CSS Injection**

Allow users to provide additional custom CSS. This should be injected into the page after the main theme CSS to allow overrides.

In `layout.html`, provide a placeholder like `{{{userCSS}}}` to inject the user's styles inline inside a `<style>` tag.

---

### 8. **Minimize JavaScript**

Only use JavaScript if it's strictly necessary. Some examples where minimal JavaScript might be justified:

* Handling theme toggles like dark mode
* A mobile nav toggle
* Copy to clipboard buttons for code blocks

Use plain JavaScript, and scope it clearly. Do not include frameworks or libraries unless it's critical to the theme’s function.

---

### 9. **Plan for No-Build Static Rendering**

Assume that themes will be compiled server-side or pre-rendered. Therefore:

* Do not rely on dynamic browser-side rendering
* Avoid AJAX or client-side routing
* Use fully-formed anchor links (e.g., `/post/my-article`)
* Generate clean, crawlable HTML output

This makes themes work well in Jamstack and static-site scenarios.

---

### 10. **Build a Starter Theme First**

Before building multiple themes, create a single “starter” theme:

* Minimal but complete
* Includes all core pages
* Uses all template variables
* Demonstrates customization options clearly

Use this as the reference for all future themes and documentation.

---

### 11. **Documentation for Theme Creators**

Provide a markdown guide alongside your starter theme:

* Explains folder structure and file naming
* Describes template variables and helpers
* Lists all customization options
* Includes sample screenshots
* Explains how to preview the theme locally

Encourage theme creators to copy the starter theme and iterate.

---

### 12. **Preview and Testing Workflow**

Make sure you have a simple workflow to preview themes during development. For example:

* Run a local server that renders templates with mock data
* Auto-reload on changes
* View templates on various screen sizes

This helps designers validate layout, accessibility, and responsiveness early.

---

### 13. **Theme Packaging for Distribution**

When a theme is complete:

* Ensure all templates and assets are inside a single folder
* Include the manifest file and thumbnail
* Remove dev-only files or unused assets
* Validate that all links and paths work
* Zip the folder or publish it via a theme marketplace if available

---

### 14. **Support for Custom Pages**

Allow users to create additional static pages like `/projects`, `/books`, etc. Provide a fallback mechanism that uses a default layout and page style if no custom template is found for a specific route.

This avoids having to write a custom HTML file for every new page.

---

### 15. **Accessibility and Readability**

Design themes with accessibility in mind:

* Use semantic HTML (section, article, nav, header, footer)
* Ensure good color contrast for text
* Make links and buttons keyboard navigable
* Avoid small font sizes or low-contrast text

A simple, readable site benefits all users, including those using assistive technology.

---

By following these principles step-by-step, you will create a sustainable theming system for Minispace that is both flexible for developers and intuitive for end users building clean static sites.
