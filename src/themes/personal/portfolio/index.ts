import themeConfig from './theme.config';

// Layout Components
import Layout from './components/Layout';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

// Block Components
import HeroBlock from './blocks/HeroBlock';
import ProjectGridBlock from './blocks/ProjectGridBlock';
import ProjectCardBlock from './blocks/ProjectCardBlock';
import SkillsBlock from './blocks/SkillsBlock';
import ContactBlock from './blocks/ContactBlock';
import TitleBlock from './blocks/TitleBlock';

// Page Components
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectPage from './pages/ProjectPage';
import ContactPage from './pages/ContactPage';

// Preview
import ThemePreview from './preview/ThemePreview';

const PortfolioTheme = {
  name: 'Portfolio',
  category: 'portfolio',
  config: themeConfig,
  components: {
    Layout,
    Header,
    Footer,
    Sidebar,
    HeroBlock,
    ProjectGridBlock,
    ProjectCardBlock,
    SkillsBlock,
    ContactBlock,
    TitleBlock,
    HomePage,
    AboutPage,
    ProjectsPage,
    ProjectPage,
    ContactPage,
  },
  preview: ThemePreview,
};

export default PortfolioTheme;

export {
  themeConfig,
  Layout,
  Header,
  Footer,
  Sidebar,
  HeroBlock,
  ProjectGridBlock,
  ProjectCardBlock,
  SkillsBlock,
  ContactBlock,
  TitleBlock,
  HomePage,
  AboutPage,
  ProjectsPage,
  ProjectPage,
  ContactPage,
  ThemePreview,
};