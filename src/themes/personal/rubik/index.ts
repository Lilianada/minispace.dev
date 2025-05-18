// Theme Configuration
import themeConfig from './theme.config';

// Layout Components
import Layout from './components/Layout';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

// Block Components
import HeroBlock from './blocks/HeroBlock';
import TextBlock from './blocks/TextBlock';
import CTABlock from './blocks/CTABlock';
import TitleBlock from './blocks/TitleBlock';
import RichTextBlock from './blocks/RichTextBlock';
import RecentPostsBlock from './blocks/RecentPostsBlock';
import SocialLinksBlock from './blocks/SocialLinksBlock';
import PostsListBlock from './blocks/PostsListBlock';
import PostMetaBlock from './blocks/PostMetaBlock';
import PostContentBlock from './blocks/PostContentBlock';
import BackLinkBlock from './blocks/BackLinkBlock';

// Page Components
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PostsPage from './pages/PostsPage';
import PostPage from './pages/PostPage';

// Preview Component
import ThemePreview from './preview/ThemePreview';

// Theme definition
const RubikTheme = {
  name: 'Rubik',
  category: 'personal',
  config: themeConfig,
  components: {
    // Layout components
    Layout,
    Header,
    Footer,
    Sidebar,
    
    // Block components
    HeroBlock,
    TextBlock,
    CTABlock,
    TitleBlock,
    RichTextBlock,
    RecentPostsBlock,
    SocialLinksBlock,
    PostsListBlock,
    PostMetaBlock,
    PostContentBlock,
    BackLinkBlock,
    
    // Page components
    HomePage,
    AboutPage,
    PostsPage,
    PostPage,
  },
  preview: ThemePreview,
};

export default RubikTheme;

// Export individual components for direct use
export {
  themeConfig,
  Layout,
  Header,
  Footer,
  Sidebar,
  HeroBlock,
  TextBlock,
  CTABlock,
  TitleBlock,
  RichTextBlock,
  RecentPostsBlock,
  SocialLinksBlock,
  PostsListBlock,
  PostMetaBlock,
  PostContentBlock,
  BackLinkBlock,
  HomePage,
  AboutPage,
  PostsPage,
  PostPage,
  ThemePreview,
};
