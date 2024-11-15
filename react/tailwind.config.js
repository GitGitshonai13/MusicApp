/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
          'custom-rgba': 'rgba(0, 0, 0, 0.4)', // ここでrgbaを設定
      },
      fontFamily: {
        'sans': ['Helvetica', 'Arial', 'sans-serif'],
        'serif': ['Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}

