/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'amad-bg': 'var(--bg)',
        'amad-bg-deep': 'var(--bg-deep)',
        'amad-text': 'var(--text)',
        'amad-primary': 'var(--primary)',
        'amad-secondary': 'var(--secondary)',
      }
    },
  },
  plugins: [],
}

