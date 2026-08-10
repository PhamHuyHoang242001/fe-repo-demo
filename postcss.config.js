const tailwindcss = require('tailwindcss');
module.exports = {
  plugins: [
    'postcss-import',
    'tailwindcss/nesting',
    'postcss-preset-env',
    tailwindcss,
    'postcss-nesting',
    'autoprefixer',
  ],
};
