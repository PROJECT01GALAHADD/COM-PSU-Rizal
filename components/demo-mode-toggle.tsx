"use client";

import { Button } from "@/components/ui/button";
import { useDemoMode } from "./demo-mode-context";
import { demoLogin, demoLogout } from "@/utils/mock-data";
import { useRouter } from "next/navigation";

export function DemoModeToggle() {
    const { isDemo, demoUser, refreshDemoState } = useDemoMode();
    const router = useRouter();

    const handleDemoLogin = async () => {
        // For simplicity, we'll use the demo student account
        const user = await demoLogin("student@demo.psu.edu.ph", "demo123");
        refreshDemoState();
        if (user) {
            router.push("/student");
        }
    };

    const handleDemoLogout = () => {
        demoLogout();
        refreshDemoState();
        router.push("/");
    };

    return (
        <div className="flex items-center gap-2">
            {isDemo ? (
                <>
                    <span className="text-sm text-muted-foreground">
                        Demo Mode ({demoUser?.role})
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDemoLogout}
                    >
                        Exit Demo
                    </Button>
                </>
            ) : (
                <Button variant="outline" size="sm" onClick={handleDemoLogin}>
                    Try Demo
                </Button>
            )}
        </div>
    );
}