"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DemoUser, getCurrentDemoUser, isDemoMode } from "@/utils/mock-data";

type DemoModeContextType = {
    isDemo: boolean;
    demoUser: DemoUser | null;
    refreshDemoState: () => void;
};

const DemoModeContext = createContext<DemoModeContextType>({
    isDemo: false,
    demoUser: null,
    refreshDemoState: () => {},
});

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
    const [isDemo, setIsDemo] = useState(false);
    const [demoUser, setDemoUser] = useState<DemoUser | null>(null);

    const refreshDemoState = () => {
        const demo = isDemoMode();
        setIsDemo(demo);
        setDemoUser(demo ? getCurrentDemoUser() : null);
    };

    useEffect(() => {
        refreshDemoState();
        // Listen for storage changes (e.g., when demo user logs in/out in another tab)
        const handleStorage = () => refreshDemoState();
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    return (
        <DemoModeContext.Provider value={{ isDemo, demoUser, refreshDemoState }}>
            {children}
        </DemoModeContext.Provider>
    );
}

export function useDemoMode() {
    return useContext(DemoModeContext);
}