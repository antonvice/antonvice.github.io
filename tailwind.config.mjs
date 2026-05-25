/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        dark: '#26171f',
        'theme-color': '#ff5fa2',
        'nav-link': '#1894c7',
        'nav-active': '#ff5fa2',
        'sidebar-name': '#ff5fa2',
        'accent-cyan': '#57c7eb',
        'accent-yellow': '#ffe66d',
        'accent-coral': '#ff5fa2',
        'neon-blue': '#4cc9f0',
        'deep-blue': '#155e75',
        'electric-blue': '#7bdff2',
        'midnight-blue': '#26171f',
        'text-coral-light': '#bd2f6f',
        'neon-magenta': '#ff5fa2',
      },
      fontFamily: {
        'cyberpunk': ['Rajdhani', 'sans-serif'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
        'vt323': ['VT323', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 0.3s ease-in-out infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%': { transform: 'translateX(-2px)' },
          '20%': { transform: 'translateX(2px)' },
          '30%': { transform: 'translateX(-2px)' },
          '40%': { transform: 'translateX(2px)' },
          '50%': { transform: 'translateX(-2px)' },
        },
        'neon-pulse': {
          '0%, 100%': { textShadow: '3px 3px 0 rgba(38, 23, 31, 0.16)' },
          '50%': { textShadow: '5px 5px 0 rgba(255, 95, 162, 0.24)' },
        },
      },
    },
  },
}
