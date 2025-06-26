// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: [
            {
                'android-blue': {
                    'primary': '#a8c7fa',
                    'primary-content': '#001d35',
                    'secondary': '#c2c7d0',
                    'secondary-content': '#2e3133',
                    'accent': '#dce1f9',
                    'accent-content': '#394455',
                    'neutral': '#f0f0f0',
                    'neutral-content': '#1c1b1f',
                    'base-100': '#fdfcff',
                    'base-200': '#f3f4f8',
                    'base-300': '#e8e9ed',
                    'base-content': '#1c1b1f',
                    'info': '#0061a4',
                    'success': '#006e1c',
                    'warning': '#b8860b',
                    'error': '#ba1a1a',
                },
                'android-green': {
                    'primary': '#a2cf6e',
                    'primary-content': '#1e360b',
                    'secondary': '#bccb9a',
                    'secondary-content': '#2c341c',
                    'accent': '#d9e7b8',
                    'accent-content': '#38422b',
                    'neutral': '#f0f0f0',
                    'neutral-content': '#1b1c18',
                    'base-100': '#fcfdf6',
                    'base-200': '#f2f4ec',
                    'base-300': '#e7e9e1',
                    'base-content': '#1b1c18',
                    'info': '#0061a4',
                    'success': '#006e1c',
                    'warning': '#b8860b',
                    'error': '#ba1a1a',
                },
            },
            "light", "dark", "cupcake", "emerald", "synthwave", "corporate",
            "dracula", "garden", "forest", "aqua", "lofi", "pastel",
            "fantasy", "wireframe", "black", "luxury", "cmyk", "autumn",
            "business", "acid", "lemonade", "night", "coffee", "winter",
            "dim", "nord", "sunset"
        ],
    },
};