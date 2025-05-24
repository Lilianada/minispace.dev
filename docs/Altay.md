<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Jane Doe</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="site-header">
    <div class="header-content">
      <span class="site-logo">Jane Doe</span>
      <nav>
        <a href="index.html" class="nav-link">Home</a>
        <a href="about.html" class="nav-link">About</a>
        <a href="writingall.html" class="nav-link">Posts</a>
      </nav>
    </div>
  </header>

  <main class="main-layout">
    <!-- CONTENT GOES HERE -->
    <!-- Use server-side includes or templating to insert page content here -->
  </main>

  <footer class="site-footer">
    <div class="footer-content">
      <span class="footer-email">jane@hey.com</span>
      <span class="footer-right">Built with Minispace</span>
    </div>
  </footer>
</body>
</html>

<!-- Home Page (wrapped with layout.html) -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Jane Doe</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="site-header">
    <div class="header-content">
      <span class="site-logo">Jane Doe</span>
      <nav>
        <a href="index.html" class="nav-link active">Home</a>
        <a href="about.html" class="nav-link">About</a>
        <a href="writingall.html" class="nav-link">Posts</a>
      </nav>
    </div>
  </header>
  <main class="main-layout">
    <section class="about-hero about-hero-noimg">
      <div>
        <h1 class="about-title">Hi, I'm Jane</h1>
        <p class="about-desc">
          I’m a software engineer passionate about frontend infrastructure, monorepos, and developer experience.<br>
          I started this blog to share things I’m learning and thinking about, and to have a small, personal place on the web that feels like home. I believe that writing is the best way to sharpen ideas and connect with others who care about building and tinkering.<br>
          <span class="about-socials">
            <a href="https://twitter.com/janedoe" target="_blank">Twitter</a> · 
            <a href="https://mastodon.social/@janedoe" target="_blank">Mastodon</a> · 
            <a href="https://bsky.app/profile/janedoe.bsky.social" target="_blank">Bluesky</a> · 
            <a href="https://github.com/janedoe" target="_blank">GitHub</a> · 
            <a href="https://linkedin.com/in/janedoe" target="_blank">LinkedIn</a> · 
            <a href="/rss.xml" target="_blank">RSS</a>
          </span>
        </p>
      </div>
    </section>
    <section id="writing" class="writing-section">
      <h2 class="writing-title">Writing</h2>
      <div class="section-desc">Thoughts on stuff that I care about.</div>
      <div class="writings-list">
        <ul>
          <li>
            <a href="post.html">Great software is composed; not written</a>
            <span class="writing-desc">A collection of thoughts from the past decade.</span>
            <div class="writing-meta">December 3, 2024 · 2 mins read</div>
          </li>
          <li>
            <a href="post.html">Three definitions of success</a>
            <span class="writing-desc">How to build your own hedonic treadmill.</span>
            <div class="writing-meta">December 21, 2020 · 7 mins read</div>
          </li>
          <li>
            <a href="post.html">2020 in review</a>
            <span class="writing-desc">Exploring my boundaries of self-destruction.</span>
            <div class="writing-meta">December 16, 2020 · 5 mins read</div>
          </li>
        </ul>
        <a href="writingall.html" class="view-more-btn">View more &rarr;</a>
      </div>
    </section>
   
    <hr class="divider" />
  </main>
  <footer class="site-footer">
    <div class="footer-content">
      <span class="footer-email">jane@hey.com</span>
      <span class="footer-right">Built with Minispace</span>
    </div>
  </footer>
</body>
</html>


<!-- About Page (wrapped with layout.html) -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>About – Jane Doe</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="site-header">
    <div class="header-content">
      <span class="site-logo">Jane Doe</span>
      <nav>
        <a href="index.html" class="nav-link">Home</a>
        <a href="about.html" class="nav-link active">About</a>
        <a href="writingall.html" class="nav-link">Posts</a>
      </nav>
    </div>
  </header>
  <main class="main-layout">
    <section class="about-hero about-hero-noimg">
      <div>
        <h1 class="about-title">About</h1>
        <p class="about-desc">
          Hi, I'm Jane Doe.<br><br>
          I’m a software engineer passionate about frontend infrastructure, monorepos, and developer experience. 
          My journey has taken me from small startups to larger companies, always on the hunt for a balance of craft, impact, and joy.<br><br>
          I started this blog to have a place on the web that feels personal, honest, and a little bit whimsical. I believe in the power of tiny web spaces, digital gardens, and writing for yourself before anyone else.<br><br>
          <b>What you'll find here:</b>
          <ul class="about-list">
            <li>Essays and notes on engineering, building, and learning</li>
            <li>Book notes from things I've read and loved</li>
            <li>Occasional experiments, personal stories, and digital tinkering</li>
          </ul>
          <b>Elsewhere</b><br>
          <span class="about-socials">
            <a href="https://twitter.com/janedoe" target="_blank">Twitter</a> · 
            <a href="https://mastodon.social/@janedoe" target="_blank">Mastodon</a> · 
            <a href="https://bsky.app/profile/janedoe.bsky.social" target="_blank">Bluesky</a> · 
            <a href="https://github.com/janedoe" target="_blank">GitHub</a> · 
            <a href="https://linkedin.com/in/janedoe" target="_blank">LinkedIn</a> · 
            <a href="/rss.xml" target="_blank">RSS</a>
          </span>
        </p>
      </div>
    </section>
    <hr class="divider" />
  </main>
  <footer class="site-footer">
    <div class="footer-content">
      <span class="footer-email">jane@hey.com</span>
      <span class="footer-right">Built with Minispace</span>
    </div>
  </footer>
</body>
</html>


<!-- All Posts Page (wrapped with layout.html) -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>All Posts – Jane Doe</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="site-header">
    <div class="header-content">
      <span class="site-logo">Jane Doe</span>
      <nav>
        <a href="index.html" class="nav-link">Home</a>
        <a href="about.html" class="nav-link">About</a>
        <a href="writingall.html" class="nav-link active">Posts</a>
      </nav>
    </div>
  </header>
  <main class="main-layout">
    <h1 class="writingall-title">Writing</h1>
    <div class="section-desc" style="margin-bottom:1.5em;">All my posts, essays, and jotting-downs.</div>
    <section class="writingall-list">
      <ul>
        <li>
          <a href="post.html">Great software is composed; not written</a>
          <span class="writingall-desc">A collection of thoughts from the past decade.</span>
          <div class="writingall-meta">December 3, 2024 · 2 mins read</div>
        </li>
        <li>
          <a href="post.html">Three definitions of success</a>
          <span class="writingall-desc">How to build your own hedonic treadmill.</span>
          <div class="writingall-meta">December 21, 2020 · 7 mins read</div>
        </li>
        <li>
          <a href="post.html">2020 in review</a>
          <span class="writingall-desc">Exploring my boundaries of self-destruction.</span>
          <div class="writingall-meta">December 16, 2020 · 5 mins read</div>
        </li>
        <li>
          <a href="post.html">Release your mentors</a>
          <span class="writingall-desc">Don't be a daydreaming fucktard.</span>
          <div class="writingall-meta">December 11, 2020 · 4 mins read</div>
        </li>
        <li>
          <a href="post.html">A private email setup with noise reduction</a>
          <span class="writingall-desc">My justification for paying 3.29 EUR per month for something free.</span>
          <div class="writingall-meta">December 5, 2020 · 6 mins read</div>
        </li>
        <li>
          <a href="post.html">Enhancing book notes with metadata</a>
          <span class="writingall-desc">You can read, you can code. So why not?</span>
          <div class="writingall-meta">November 9, 2020 · 4 mins read</div>
        </li>
        <li>
          <a href="post.html">Transparent business</a>
          <span class="writingall-desc">How I imagine my utopia.</span>
          <div class="writingall-meta">November 9, 2020 · 1 min read</div>
        </li>
      </ul>
    </section>
    <hr class="divider" />
  </main>
  <footer class="site-footer">
    <div class="footer-content">
      <span class="footer-email">jane@hey.com</span>
      <span class="footer-right">Built with Minispace</span>
    </div>
  </footer>
</body>
</html>

<!-- Single Post Page (wrapped with layout.html) -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Great software is composed; not written – Jane Doe</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="site-header">
    <div class="header-content">
      <span class="site-logo">Jane Doe</span>
      <nav>
        <a href="index.html" class="nav-link">Home</a>
        <a href="about.html" class="nav-link">About</a>
        <a href="writingall.html" class="nav-link">Posts</a>
      </nav>
    </div>
  </header>
  <main class="main-layout post-main">
    <article>
      <h1 class="post-title">Great software is composed; not written</h1>
      <div class="post-meta">December 3, 2024 · 2 mins read</div>
      <div class="post-content">
        <p>
          Over the past decade, I’ve come to believe that great software is not simply written, but composed—like music, like essays, like architecture.
        </p>
        <p>
          Code is a living thing. It’s shaped by the ideas, constraints, and whims of its author. When we compose software, we draw from patterns, adapt, and intentionally craft something that’s more than just its lines.
        </p>
        <h2>What does it mean to compose?</h2>
        <ul>
          <li>To reuse motifs, patterns, and abstractions.</li>
          <li>To layer small ideas into something greater.</li>
          <li>To edit, revise, and shape the structure with care.</li>
        </ul>
        <p>
          The best codebases I’ve seen are not the result of brute force or genius, but the result of thoughtful composition over time.
        </p>
        <p>
          <i>What are you composing today?</i>
        </p>
      </div>
    </article>
    <hr class="divider" />
  </main>
  <footer class="site-footer">
    <div class="footer-content">
      <span class="footer-email">jane@hey.com</span>
      <span class="footer-right">Built with Minispace</span>
    </div>
  </footer>
</body>
</html>

<!--  Base Styles (Shared across all pages) -->
:root {
  --bg: #111110;
  --text: #e4e4e7;
  --muted: #b1b1b3;
  --accent: #ffd900;
  --font: 'Inter', system-ui, sans-serif;
  --link-hover: #fffbe7;
}

html, body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  font-size: 15px;
  line-height: 1.6;
}

a {
  color: var(--accent);
  text-decoration: none;
  transition: color .16s;
}

a:hover, a:focus {
  color: var(--link-hover);
  text-decoration: underline;
}

.site-header {
  width: 100%;
  background: transparent;
  padding: 20px 0 8px 0;
  animation: fadeInDown 0.8s cubic-bezier(.39,.58,.57,1.01);
}
.header-content {
  max-width: 540px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2em;
  padding: 0 20px;
}
.site-logo {
  font-weight: 600;
  color: var(--text);
  font-size: 1em;
  letter-spacing: -1px;
  font-family: var(--font);
  user-select: none;
  animation: siteLogoPop 1.2s cubic-bezier(.39,.58,.57,1.01);
}
@keyframes siteLogoPop {
  0% { transform: scale(.85) rotate(-6deg); opacity: 0; }
  80% { transform: scale(1.07) rotate(3deg); opacity: 1;}
  100% { transform: scale(1) rotate(0deg);}
}
nav {
  display: flex;
  gap: 1.2em;
}
.nav-link {
  color: var(--muted);
  text-decoration: none;
  font-weight: 500;
  font-size: 1em;
  padding: 0.18em 0.75em;
  border-radius: 1em;
  opacity: 0.92;
  transition: background .12s, color .12s;
  position: relative;
  outline: none;
}
.nav-link.active,
.nav-link:hover,
.nav-link:focus-visible {
  background: #18181b;
  color: var(--accent);
}
.nav-link.active::after {
  content: "";
  display: block;
  margin: 0 auto;
  width: 18px;
  height: 2px;
  background: var(--accent);
  border-radius: 1px;
  margin-top: 2px;
  animation: navUnderline 0.7s cubic-bezier(.39,.58,.57,1.01);
}
@keyframes navUnderline {
  0% { width: 0; opacity: 0;}
  100% { width: 18px; opacity: 1;}
}
.main-layout {
  max-width: 540px;
  margin: 0 auto;
  padding: 0 18px;
  animation: fadeIn 1s cubic-bezier(.39,.58,.57,1.01);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(28px);}
  to { opacity: 1; transform: none;}
}
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-16px);}
  to { opacity: 1; transform: none;}
}

/* === Footer === */
.site-footer {
  width: 100%;
  padding: 0 0 24px 0;
  background: transparent;
  animation: fadeInUp 0.7s cubic-bezier(.39,.58,.57,1.01);
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px);}
  to { opacity: 1; transform: none;}
}
.footer-content {
  max-width: 540px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--muted);
  font-size: 0.95em;
  letter-spacing: 0.01em;
  padding: 0 20px;
}
.footer-email,
.footer-right {
  color: var(--muted);
}

/* === Divider === */
.divider {
  border: none;
  border-top: 1px solid #212022;
  margin: 28px 0 18px 0;
  width: 100%;
  opacity: 0.7;
}

/* ===== Home Page ===== */
.about-hero {
  display: flex;
  align-items: flex-start;
  gap: 1.2em;
  margin-top: 32px;
  margin-bottom: 30px;
}
.about-hero-noimg {
  padding-left: 0;
}
.about-title {
  font-size: 1.38rem;
  font-weight: 600;
  margin-bottom: 0.28em;
  color: #fff;
  letter-spacing: -0.01em;
  margin-top: 2px;
  animation: fadeInLeft 1.1s cubic-bezier(.39,.58,.57,1.01);
}
@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-28px);}
  to { opacity: 1; transform: none;}
}
.about-desc {
  color: #e4e4e7;
  font-size: .95em;
  margin: 0;
  font-weight: 400;
  line-height: 1.6;
  animation: fadeIn 1.4s cubic-bezier(.39,.58,.57,1.01);
}
.about-list {
  margin: 0 0 1em 1.3em;
  padding: 0;
  color: #d4d4d8;
  font-size: .95em;
}
.about-list li {
  margin-bottom: 0.2em;
}
.about-socials {
  display: block;
  margin-top: 0.7em;
  font-size: .95em;
  color: var(--muted);
  animation: fadeInUp 1.7s cubic-bezier(.39,.58,.57,1.01);
}
.about-socials a {
  color: var(--accent);
  text-decoration: none;
  margin: 0 2px;
  transition: color .12s;
  position: relative;
}
.about-socials a:hover,
.about-socials a:focus-visible {
  color: var(--link-hover);
  text-decoration: underline;
}
.about-socials a::before {
  content: '';
  display: inline-block;
  width: 0;
  height: 2px;
  background: var(--accent);
  vertical-align: middle;
  transition: width .2s;
  margin-right: 0;
}
.about-socials a:hover::before,
.about-socials a:focus-visible::before {
  width: 12px;
}

/* Home: Section Links (Writing, Book Notes, etc.) */
.sections-list {
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 17px;
}
.section-link {
  display: flex;
  flex-direction: column;
  gap: 0.5px;
}
.section-title {
  color: var(--accent);
  font-weight: 500;
  font-size: .98em;
  text-decoration: none;
  margin-bottom: 1.5px;
  transition: color .13s;
}
.section-title:hover,
.section-title:focus-visible {
  color: var(--link-hover);
}

/* Home: Writing/Book Notes List preview */
.writings-list {
  margin-top: 0px;
  margin-bottom: 12px;
}
.writings-list ul {
  list-style: none;
  padding: 0;
  margin: 0 0 10px 0;
  display: flex;
  flex-direction: column;
  gap: 13px;
}
.writings-list li {
  display: flex;
  flex-direction: column;
  gap: 2px;
  opacity: 0;
  animation: fadeInListItem 0.7s cubic-bezier(.39,.58,.57,1.01) forwards;
}
.writings-list li:nth-child(1) { animation-delay: .10s;}
.writings-list li:nth-child(2) { animation-delay: .20s;}
.writings-list li:nth-child(3) { animation-delay: .30s;}
.writings-list li:nth-child(4) { animation-delay: .40s;}
.writings-list li:nth-child(5) { animation-delay: .50s;}
.writings-list li:nth-child(6) { animation-delay: .55s;}
.writings-list li:nth-child(7) { animation-delay: .60s;}
@keyframes fadeInListItem {
  to { opacity: 1;}
}
.writings-list a {
  color: var(--accent);
  font-size: .97em;
  font-weight: 500;
  text-decoration: none;
  transition: color .13s;
}
.writings-list a:hover,
.writings-list a:focus-visible {
  color: var(--link-hover);
  text-decoration: underline;
}
.writing-desc {
  color: #d4d4d8;
  font-size: .91em;
  margin-left: 0.5em;
}
.writing-meta {
  color: #b1b1b3;
  font-size: .91em;
  margin-left: 0.5em;
}
.view-more-btn {
  display: inline-block;
  background: none;
  color: var(--accent);
  font-weight: 500;
  font-size: .97em;
  border: none;
  margin-top: 6px;
  padding: 0;
  text-decoration: none;
  cursor: pointer;
  transition: color .13s;
  animation: fadeInUp 1.5s cubic-bezier(.39,.58,.57,1.01);
}
.view-more-btn:hover,
.view-more-btn:focus-visible {
  color: var(--link-hover);
  text-decoration: underline;
}

/* ===== About Page ===== */
.about-title {
  /* Already defined above, just for clarity */
}
.about-desc {
  /* Already defined above, just for clarity */
}
.about-list {
  margin: 0 0 1em 1.3em;
  padding: 0;
  color: #d4d4d8;
  font-size: .95em;
}
.about-list li {
  margin-bottom: 0.2em;
}
.about-socials {
  margin-top: 1em;
  display: block;
  font-size: .95em;
  color: var(--muted);
}

/* ===== All-Posts Page ===== */
.writingall-title {
  font-size: 1.38rem;
  font-weight: 600;
  color: #fff;
  margin-top: 38px;
  margin-bottom: 0.18em;
  letter-spacing: -0.01em;
  animation: fadeInLeft 1.1s cubic-bezier(.39,.58,.57,1.01);
}
.writingall-list ul {
  list-style: none;
  padding: 0;
  margin: 0 0 10px 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.writingall-list li {
  display: flex;
  flex-direction: column;
  gap: 2px;
  opacity: 0;
  animation: fadeInListItem 0.45s cubic-bezier(.39,.58,.57,1.01) forwards;
}
.writingall-list li:nth-child(1) { animation-delay: .06s;}
.writingall-list li:nth-child(2) { animation-delay: .12s;}
.writingall-list li:nth-child(3) { animation-delay: .18s;}
.writingall-list li:nth-child(4) { animation-delay: .24s;}
.writingall-list li:nth-child(5) { animation-delay: .30s;}
.writingall-list li:nth-child(6) { animation-delay: .36s;}
.writingall-list li:nth-child(7) { animation-delay: .42s;}
.writingall-list a {
  color: var(--accent);
  font-size: .97em;
  font-weight: 500;
  text-decoration: none;
  transition: color .13s;
}
.writingall-list a:hover,
.writingall-list a:focus-visible {
  color: var(--link-hover);
  text-decoration: underline;
}
.writingall-desc {
  color: #d4d4d8;
  font-size: .91em;
  margin-left: 0.5em;
}
.writingall-meta {
  color: #b1b1b3;
  font-size: .91em;
  margin-left: 0.5em;
}

/* ===== Single Post Page ===== */
.post-main {
  margin-top: 34px;
  margin-bottom: 48px;
  max-width: 600px;
  animation: fadeIn 1.1s cubic-bezier(.39,.58,.57,1.01);
}
.post-title {
  font-size: 1.38rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.18em;
  letter-spacing: -0.01em;
}
.post-meta {
  color: #b1b1b3;
  font-size: .91em;
  margin-bottom: 2em;
}
.post-content {
  color: #e4e4e7;
  font-size: 1em;
  line-height: 1.75;
  animation: fadeIn 1.2s cubic-bezier(.39,.58,.57,1.01);
}
.post-content a {
  color: var(--accent);
  text-decoration: underline;
  transition: color .13s;
}
.post-content a:hover,
.post-content a:focus-visible {
  color: var(--link-hover);
}
.post-content h2 {
  font-size: 1.13rem;
  font-weight: 600;
  color: #fff;
  margin-top: 2em;
  margin-bottom: .5em;
}
.post-content ul, .post-content ol {
  margin-left: 1.5em;
  margin-bottom: 1em;
}

/* ===== Responsive ===== */
@media (max-width: 600px) {
  .main-layout, .header-content, .footer-content {
    padding-left: 7vw;
    padding-right: 7vw;
  }
  .about-title, .writing-title, .writingall-title, .post-title { font-size: 1.11rem; }
}