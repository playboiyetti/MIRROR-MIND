/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#000000",
                backgroundEnd: "#0B0B12",
                accentPrimary: "#9B5CFF",
                accentDanger: "#FF3B5C",
                accentMind: "#3AFFD8",
                accentGold: "#FFC857",
                textSecondary: "rgba(255,255,255,0.68)",
                textMuted: "rgba(255,255,255,0.42)",
                divider: "rgba(255,255,255,0.08)",
            },
            fontFamily: {
                sans: ['"SF Pro Display"', 'Roboto', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                'card': '24px',
                'button': '16px',
                'button-sm': '14px',
            },
            aspectRatio: {
                'card': '0.66',
            },
            animation: {
                'gradient-slow': 'gradient 15s ease infinite',
            },
            keyframes: {
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
            },
        },
    },
    plugins: [],
}
