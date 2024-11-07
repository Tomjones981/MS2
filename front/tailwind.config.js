const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      marginTop: {
        '-100': '-25rem',
        
      },
      
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
};
