/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // asset-hub isolated module palette (green/gold). Single source of truth for module colors.
        ah: {
          green: '#00693E',
          'green-d': '#004C2E',
          'green-br': '#0A7A48', // forest xanh dịu — stop sáng-vừa cho gradient brand (rõ chuyển màu nhưng không chói)
          'green-l': '#E9F3EE',
          gold: '#C59C37',
          ink: '#1d2521',
          muted: '#6a7873',
          line: '#dde5e1',
          bg: '#f0f4f2',
          card: '#ffffff',
          // env-chip + search-pill accents (header). Sync with theme/colors.ts.
          pale: '#F4F7F5',
          amber: '#B8860B',
          'amber-l': '#FEF9EC', // pale amber wash — warning banners / pending badge
          red: '#7A1F2B',
          'red-l': '#FDF2F3', // pale red wash — error banners / rejected badge / diff-removed rows
        },
      },
      // Named "disciplined bold" surfaces for the skill UI redesign.
      // Bold treatments are confined to hero bands, sticky bars, and hover states;
      // referencing them by token keeps hex out of components (ah-* is canonical).
      boxShadow: {
        'ah-glow': '0 16px 36px -14px rgba(0,105,62,0.38)', // card hover lift glow
        'ah-glow-sm': '0 4px 12px -2px rgba(0,105,62,0.30)', // buttons / sticky-bar-on-scroll
        // Soft neutral float for resting cards/panels — full-frame depth without color cast.
        'ah-float': '0 1px 2px rgba(16,32,24,0.04), 0 8px 24px -12px rgba(16,32,24,0.14)',
        // Pronounced neutral float for resting list cards — more depth than ah-float, still no color cast.
        'ah-float-md': '0 2px 4px rgba(16,32,24,0.05), 0 12px 28px -10px rgba(16,32,24,0.18)',
      },
      backgroundImage: {
        // brand/hero gradient — dark→base→bright forest green
        'ah-hero': 'linear-gradient(135deg, #004C2E 0%, #00693E 55%, #0A7A48 100%)',
        // subtle page/section wash — barely-there green tint for empty areas
        'ah-mist': 'radial-gradient(120% 80% at 50% 0%, #E9F3EE 0%, rgba(233,243,238,0) 60%)',
        // vivid brand gradient for masked card-border-on-hover — forest → bright green → gold
        'ah-border-glow': 'linear-gradient(135deg, #00693E 0%, #0A7A48 50%, #C59C37 100%)',
      },
      // Shimmer sweep cho AssetHubBrand (dải sáng chéo lướt qua nền gradient xanh).
      // Sweep nhanh trong ~55% chu kỳ rồi nghỉ off-screen → hiệu ứng lấp lánh tinh tế, không rối.
      keyframes: {
        'ah-shimmer': {
          '0%': { transform: 'translateX(-160%) skewX(-14deg)' },
          '55%, 100%': { transform: 'translateX(260%) skewX(-14deg)' },
        },
      },
      animation: {
        'ah-shimmer': 'ah-shimmer 4.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
