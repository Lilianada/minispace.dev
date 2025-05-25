import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import {
  getThemeById,
  renderThemePage,
} from "@/lib/theme-service";

// Default preview data
const DEFAULT_PREVIEW_DATA = {
  site: {
    title: "Jane Doe",
    description:
      "I’m a software engineer passionate about frontend infrastructure, monorepos, and developer experience. I started this blog to share things I’m learning and thinking about, and to have a small, personal place on the web that feels like home. I believe that writing is the best way to sharpen ideas and connect with others who care about building and tinkering.",
    email: "jane@hey.com",
    username: "janedoe",
    socialLinks:
      '<a href="https://twitter.com/janedoe" target="_blank">Twitter</a> · <a href="https://mastodon.social/@janedoe" target="_blank">Mastodon</a> · <a href="https://bsky.app/profile/janedoe.bsky.social" target="_blank">Bluesky</a> · <a href="https://github.com/janedoe" target="_blank">GitHub</a> · <a href="https://linkedin.com/in/janedoe" target="_blank">LinkedIn</a> · <a href="/rss.xml" target="_blank">RSS</a>',
    // About page dynamic data for handlebars-friendly template
    aboutText: `Hi, I'm Jane Doe.<br><br>
    I’m a software engineer passionate about frontend infrastructure, monorepos, and developer experience. 
    My journey has taken me from small startups to larger companies, always on the hunt for a balance of craft, impact, and joy.<br><br>
    I started this blog to have a place on the web that feels personal, honest, and a little bit whimsical. I believe in the power of tiny web spaces, digital gardens, and writing for yourself before anyone else.<br><br>`,
    aboutListTitle: "What you'll find here:",
    aboutList: [
      "Essays and notes on engineering, building, and learning",
      "Book notes from things I've read and loved",
      "Occasional experiments, personal stories, and digital tinkering"
    ]
  },
  posts: [
    {
      title: "Great software is composed; not written",
      slug: "great-software-composed",
      excerpt: "A collection of thoughts from the past decade.",
      publishedAt: "2024-12-03T00:00:00.000Z",
      content: `
        <p>Over the past decade, I’ve come to believe that great software is not simply written, but composed—like music, like essays, like architecture.</p>
        <p>Code is a living thing. It’s shaped by the ideas, constraints, and whims of its author. When we compose software, we draw from patterns, adapt, and intentionally craft something that’s more than just its lines.</p>
        <h2>What does it mean to compose?</h2>
        <ul>
          <li>To reuse motifs, patterns, and abstractions.</li>
          <li>To layer small ideas into something greater.</li>
          <li>To edit, revise, and shape the structure with care.</li>
        </ul>
        <p>The best codebases I’ve seen are not the result of brute force or genius, but the result of thoughtful composition over time.</p>
        <p><i>What are you composing today?</i></p>
      `,
    },
    {
      title: "Three definitions of success",
      slug: "three-definitions-success",
      excerpt: "How to build your own hedonic treadmill.",
      publishedAt: "2020-12-21T00:00:00.000Z",
      content: `
        <p>Success can be measured in many ways. Here are three definitions that have shaped my approach to work and life.</p>
        <ol>
          <li>Making something meaningful for yourself.</li>
          <li>Making something meaningful for others.</li>
          <li>Building systems that let you keep doing both, sustainably.</li>
        </ol>
        <p>Success is less a finish line and more a treadmill. The key is to enjoy the walk.</p>
      `,
    },
    {
      title: "2020 in review",
      slug: "2020-in-review",
      excerpt: "Exploring my boundaries of self-destruction.",
      publishedAt: "2020-12-16T00:00:00.000Z",
      content: `
        <p>2020 was a year of personal boundaries, self-discovery, and learning to let go. Here’s what I learned from the chaos.</p>
        <ul>
          <li>The value of small routines</li>
          <li>Letting go of perfection</li>
          <li>Embracing uncertainty</li>
        </ul>
        <p>Looking ahead, I hope to be kinder to myself and more present in each moment.</p>
      `,
    },
    {
      title: "Release your mentors",
      slug: "release-your-mentors",
      excerpt: "Don't be a daydreaming fucktard.",
      publishedAt: "2020-12-11T00:00:00.000Z",
      content: `
        <p>We all need mentors, but at some point you have to let them go and find your own path. Don't get stuck daydreaming about what others think—build your own journey.</p>
      `,
    },
    {
      title: "A private email setup with noise reduction",
      slug: "private-email-noise",
      excerpt: "My justification for paying 3.29 EUR per month for something free.",
      publishedAt: "2020-12-05T00:00:00.000Z",
      content: `
        <p>Email can be a source of distraction. Here's how I set up a private email workflow that lets me focus on what matters.</p>
        <ul>
          <li>Minimal inbox</li>
          <li>Strong filters</li>
          <li>Paying for control and privacy</li>
        </ul>
        <p>The price is small for the peace of mind it brings.</p>
      `,
    },
    {
      title: "Enhancing book notes with metadata",
      slug: "book-notes-metadata",
      excerpt: "You can read, you can code. So why not?",
      publishedAt: "2020-11-09T00:00:00.000Z",
      content: `
        <p>Adding metadata to book notes helps me organize my thoughts and spot patterns over time. You can read, you can code. Why not both?</p>
      `,
    },
    {
      title: "Transparent business",
      slug: "transparent-business",
      excerpt: "How I imagine my utopia.",
      publishedAt: "2020-11-09T00:00:00.000Z",
      content: `
        <p>What would it look like if businesses were radically transparent? Here’s my utopian sketch of how work, money, and value could be shared openly.</p>
      `,
    },
    {
      title: "The Art of Learning",
      slug: "the-art-of-learning",
      excerpt: "Josh Waitzkin's philosophy on mastery.",
      publishedAt: "2023-10-01T00:00:00.000Z",
      content: `
        <p>Key takeaways from Josh Waitzkin’s journey in learning and teaching mastery across disciplines.</p>
      `,
    },
    {
      title: "Make it Stick",
      slug: "make-it-stick",
      excerpt: "Key ideas for effective learning.",
      publishedAt: "2023-09-18T00:00:00.000Z",
      content: `
        <p>Insights from 'Make it Stick' on how to learn deeply and retain knowledge.</p>
      `,
    },
  ],
  post: {
    title: "Great software is composed; not written",
    slug: "great-software-composed",
    publishedAt: "2024-12-03T00:00:00.000Z",
    content: `
      <p>Over the past decade, I’ve come to believe that great software is not simply written, but composed—like music, like essays, like architecture.</p>
      <p>Code is a living thing. It’s shaped by the ideas, constraints, and whims of its author. When we compose software, we draw from patterns, adapt, and intentionally craft something that’s more than just its lines.</p>
      <h2>What does it mean to compose?</h2>
      <ul>
        <li>To reuse motifs, patterns, and abstractions.</li>
        <li>To layer small ideas into something greater.</li>
        <li>To edit, revise, and shape the structure with care.</li>
      </ul>
      <p>The best codebases I’ve seen are not the result of brute force or genius, but the result of thoughtful composition over time.</p>
      <p><i>What are you composing today?</i></p>
    `,
  },
  navigation:
    '<a href="#" onclick="changePreviewPage(\'home\')" class="nav-link {{#if (eq currentPage \'home\')}}active{{/if}}">Home</a><a href="#" onclick="changePreviewPage(\'posts\')" class="nav-link {{#if (eq currentPage \'posts\')}}active{{/if}}">Writing</a><a href="#" onclick="changePreviewPage(\'about\')" class="nav-link {{#if (eq currentPage \'about\')}}active{{/if}}">About</a>',
  currentYear: new Date().getFullYear(),
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const themeId = searchParams.get("theme");
    const page = searchParams.get("page") || "home";
    const contentType = searchParams.get("contentType") || "default";

    if (!themeId) {
      return NextResponse.json(
        { error: "Theme ID is required" },
        { status: 400 }
      );
    }

    // Get the theme
    const theme = await getThemeById(themeId);
    if (!theme) {
      return NextResponse.json(
        { error: `Theme '${themeId}' not found` },
        { status: 404 }
      );
    }

    // Determine content data
    let contentData = DEFAULT_PREVIEW_DATA;

    // If using user's own content, we'd fetch that here
    if (contentType === "user") {
      // This would be replaced with actual user data from the database
      // contentData = await getUserContent(userId);
    }

    // Render the page HTML
    const html = await renderThemePage(themeId, page, contentData);

    // Load the theme CSS
    let css = "";
    const cssPath = path.join(process.cwd(), "themes", themeId, "theme.css");

    if (fs.existsSync(cssPath)) {
      css = fs.readFileSync(cssPath, "utf-8");
    }

    return NextResponse.json({ html, css });
  } catch (error) {
    console.error("Error in theme preview API:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
