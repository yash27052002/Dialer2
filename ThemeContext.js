import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from './colors';

// Create a ThemeContext with a default value
const ThemeContext = createContext(colors.light); // Provide default light theme

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme(); // Get the current color scheme (light or dark)

  // Provide the current theme colors, defaulting to 'light' if colorScheme is undefined or invalid
  const theme = colors[colorScheme] || colors.light;

  console.log('Color Scheme:', colorScheme); // Log color scheme
  console.log('Theme:', theme); // Log theme

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext);
