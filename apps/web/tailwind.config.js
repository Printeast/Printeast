/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    pink: "#E23E83", // "Hot Pink"
                    orange: "#FF7A39", // "Coral Orange"
                },
                base: {
                    bg: "#F9F8F6", // Primary Background
                    card: "#FFFFFF", // Card Background
                    border: "#E5E7EB", // Borders
                },
                text: {
                    main: "#111827",
                    secondary: "#4B5563",
                    muted: "#9CA3AF",
                }
            },
            backgroundImage: {
                "printeast-gradient": "linear-gradient(135deg, #E23E83 0%, #FF7A39 100%)",
            },
            fontFamily: {
                sans: ["var(--font-wix-text)", "Inter", "sans-serif"],
                display: ["var(--font-wix-display)", "Poppins", "sans-serif"],
            },
            animation: {
                "shimmer": "shimmer 2s infinite",
                "spin-slow": "spin 8s linear infinite",
            },
            keyframes: {
                shimmer: {
                    "100%": { transform: "translateX(100%)" },
                },
            },
        },
    },
    plugins: [],
};
