import { COLORS } from '@/styles/colors';
import React, { createContext, useState, useContext } from 'react';

// Add this type if it doesn't exist
export type ThemeContextType = {
    theme: string;
    colors: {
        primary: string;
        background: string;
        text: string;
        border: string;
        secondaryText: string;
        secondaryBackground: string;
        secondaryBorder: string;
        secondaryPrimary: string;
        success: string;
        successText: string;
        buttonText: string;
        error: string;
        errorText: string;
        card: string;
        // add other colors as needed
    };
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const theme = isDarkMode ? 'dark' : 'light';
    const colors = {
        primary: isDarkMode ? COLORS.RED : COLORS.PINK,
        background: COLORS.background,
        text: COLORS.text,
        border: COLORS.border,
        secondaryText: COLORS.secondaryText,
        secondaryBackground: COLORS.secondaryBackground,
        secondaryBorder: COLORS.secondaryBorder,
        secondaryPrimary: COLORS.secondaryPrimary,
        success: COLORS.GREEN,
        successText: COLORS.WHITE,
        buttonText: COLORS.WHITE,
        error: COLORS.RED,
        errorText: COLORS.WHITE,
        card: COLORS.secondaryBackground,
    };

    return (
        <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);