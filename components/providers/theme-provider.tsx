"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    isDark: boolean;
    toggle: () => void;
    setManual: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function shouldBeDark(): boolean {
    if (typeof window === "undefined") return false;
    const hour = new Date().getHours();
    return hour < 6 || hour >= 19;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [manualDark, setManualDark] = useState<boolean | null>(null);
    const [timeDark, setTimeDark] = useState<boolean>(false);

    // Initialize time-based theme
    useEffect(() => {
        setTimeDark(shouldBeDark());

        // Check every minute
        const interval = setInterval(() => {
            setTimeDark(shouldBeDark());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const isDark = manualDark ?? timeDark;
    const theme = isDark ? "dark" : "light";

    const toggle = useCallback(() => {
        setManualDark((prev) => {
            // If we are currently in auto mode (null), we want to toggle AWAY from the current calculated state
            if (prev === null) return !timeDark;
            return !prev;
        });
    }, [timeDark]);

    const setManual = useCallback((val: boolean) => {
        setManualDark(val);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggle, setManual }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
