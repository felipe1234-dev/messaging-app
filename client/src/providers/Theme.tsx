import React, { createContext, useContext, useState } from "react";
import { darkPalette, lightPalette } from "@constants";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

const palettes = {
    dark: darkPalette,
    light: lightPalette
};

interface ThemeValue {
    theme: "light" | "dark";
    toggleTheme: () => void;
    palette: typeof lightPalette
}

const ThemeContext = createContext<ThemeValue | undefined>(undefined);

function ThemeProvider(props: { children: React.ReactNode }) {
    const [lightTheme, setLightTheme] = useState(false);

    const toggleTheme = () => setLightTheme(prev => !prev);

    const theme = lightTheme ? "light" : "dark";
    const palette = palettes[theme];

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, palette }}>
            <StyledThemeProvider theme={palette}>
                {props.children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
}

function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
}

export { ThemeContext, ThemeProvider, useTheme };