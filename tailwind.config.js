/** @type {import('tailwindcss').Config} */
module.exports = {
    // 1) Tell Tailwind where to find your classes:
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        // 2) Map your CSS variables into utility classes:
        fontFamily: {
          mission: ["var(--font-mission)"],       // Press Start 2P
          risklive: ["var(--font-risklive)"],     // IBM Plex Sans
        },
        // 3) Re-declare your float keyframes so you can use animate-float:
        keyframes: {
          float: {
            "0%, 100%": { transform: "translateY(0)" },
            "50%":      { transform: "translateY(-10px)" },
          },
        },
        animation: {
          float: "float 5s ease-in-out infinite",
        },
      },
    },
    plugins: [],
  };
  