import { ReactNode } from "react";

// This layout is purely a pass-through for the [locale] structure
// It allows the root directory to handle initial requests before middleware redirects
export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        children
    );
}
