/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Scans all JS/JSX files in src
  ],
  theme: {
    extend: {
      // Add custom colors/gradients to match your MUI theme
      colors: {
        primary: {
          main: '#667eea',
          dark: '#5a67d8',
        },
        error: {
          main: '#f44336',
          50: '#ffebee',
        },
        warning: {
          main: '#ff9800',
          50: '#fff3e0',
        },
        success: {
          main: '#4caf50',
        },
        text: {
          primary: '#333',
          secondary: '#666',
        },
        background: {
          default: '#f8fafc',
          paper: '#ffffff',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        // Add more gradients as needed
      },
    },
  },
  plugins: [],
};