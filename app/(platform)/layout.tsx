"use client";
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"
import { dark } from '@clerk/themes';
import { useTheme } from "next-themes"

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {

    const { theme } = useTheme();

    console.log(theme);

    return (
        <ClerkProvider
            appearance={{
                baseTheme: (theme === "light" || theme === "system") ? undefined : dark,
            }}
            >
            <Toaster />
            {children}
        </ClerkProvider>
    );
};

export default PlatformLayout;