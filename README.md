# MINISPACE &nbsp; <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/minimize.svg" alt="Minispace Logo" height="20" />

> Your own mini corner of the internet.

<p align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/minimize.svg" width="60" alt="Minispace Logo" />
</p>

<p align="center">
  <b>Built with React • Firebase Powered • Minimal by Design</b>
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=white"/>
  <img alt="Lucide" src="https://img.shields.io/badge/Lucide_Icons-000000?style=for-the-badge&logo=lucide&logoColor=white"/>
</p>

---

## Founder’s Note

The internet gave us a way to find people who live hundreds, even thousands of miles away — all with just a few clicks.
It gave everyone the chance to create a presence, a space, an identity. To design and refine it. To make it their own. To give it personality. To add little bits that make it feel like home.

Stumbling into these spaces, exploring them, breaking them down, reading what the writer has to say — that’s where I get my fair share of daily dopamine.

So... why should everyone have one?

The real question is, *why not?*

You can do whatever you want with it. Add whatever you like — without constraints, without restrictions.
Build something you may never get to have in real life. Or just make something simple — something that’s good enough to tell the tiny bits that make you *you*. Share stories, memories, scattered thoughts, and little moments.

If you’ve ever wanted to do that, but didn’t know where to start…
I’m building **Minispace** for you.

With Minispace, you can carve out your own little corner of the web.


---

## Features
- Personal subdomains for each user (`username.minispace.dev`)
- Customizable pages (home, projects, archive, etc.)
- Multiple navigation style options
- Customizable footer text
- Extremely lightweight and fast-loading blogs
- No client-side JavaScript for blog pages
- Secure authentication with Firebase
- Cloud Firestore database
- Dashboard for content management
- Responsive on all devices

---

## Tech Stack
- **Frontend:** Next.js App Router
- **Icons:** `lucide-react`
- **Authentication:** Firebase Auth + Firebase Admin SDK
- **Database:** Firebase Firestore
- **Themes:** Static HTML/CSS with customizable templates
- **Rendering:** Server-side theme rendering with zero client JS 

## Development Setup

### Firebase Configuration

1. Create a Firebase project with Authentication and Firestore
2. Add your Firebase credentials to `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. Set up Firebase Admin SDK (for server-side rendering):
   - Follow instructions in [docs/firebase-admin-setup.md](docs/firebase-admin-setup.md)
   - Run `node scripts/validate-firebase-admin.js` to verify your setup

### Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
- **Styling:** Inline CSS for fast loading
- **Subdomain Routing:** Next.js middleware
- **Hosting:** Vercel

---

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mini.git
   cd mini
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project
   - Enable **Authentication** (Email/Password)
   - Create a **Firestore** database
   - Add your Firebase configuration to `.env.local`

4. **Run the app locally**
   ```bash
   npm run dev
   ```

---

## Project Structure
```
/src
  /app
    /[username]          → Dynamic user routes
    /[username]/dashboard → User dashboard pages
    /api                 → API routes
  /components            → UI Components
  /lib                   → Utilities, theme service, middleware
  /middleware.ts         → Handles subdomain routing
/themes                  → Theme templates
/docs                    → Documentation
```

## Documentation
- [Subdomain Routing Guide](./docs/subdomain-routing-guide.md)
- [Firebase Admin Setup](./docs/firebase-admin-setup.md)
- [Theming Guide](./docs/theming.md)

---

## License
MIT License.  
Feel free to fork, customize, and make it yours!

---

## Final Note
MINISPACE is intentionally lightweight.  
No bloated JavaScript. No tracking. No distractions.  
Just your content, delivered blazingly fast. ✍🏽

---

built by me, [Lily](https://github.com/lilianada)# minispace.dev
