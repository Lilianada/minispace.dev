// Import themes by category
import RubikTheme from './personal/rubik';
import PortfolioTheme from './personal/portfolio';

// Theme categories
export const themeCategories = [
  {
    id: 'personal',
    name: 'Personal',
    description: 'Themes designed for personal blogs and portfolios',
    themes: [RubikTheme, PortfolioTheme],
  },
  // Additional categories can be added here as they are developed
  // {
  //   id: 'business',
  //   name: 'Business',
  //   description: 'Themes designed for business websites',
  //   themes: [],
  // },
  // {
  //   id: 'creative',
  //   name: 'Creative',
  //   description: 'Themes designed for creative portfolios and showcases',
  //   themes: [],
  // },
];

// Export all themes as a flat array for easy access
export const allThemes = themeCategories.flatMap(category => category.themes);

// Helper function to get a theme by name
export function getThemeByName(name: string) {
  return allThemes.find(theme => theme.name === name);
}

// Helper function to get themes by category
export function getThemesByCategory(categoryId: string) {
  const category = themeCategories.find(cat => cat.id === categoryId);
  return category ? category.themes : [];
}

// Export default theme (first theme in the first category)
export default themeCategories[0].themes[0];
