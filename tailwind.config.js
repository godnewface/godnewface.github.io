/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/**/*.js",
    "./music/**/*.html",
    "./music/music-data.json"
  ],
  safelist: [
    'mix',
    'metal',
    'punk',
    'reggae',
    'k-pop',
    'fade-in-up',
    'col-lg-4',
    'col-md-6',
    'btn',
    'btn-outline-primary',
    'text-center',
    'modal',
    'modal-dialog',
    'modal-xl',
    'modal-header',
    'modal-title',
    'modal-body',
    'btn-close',
    'list-inline',
    'list-inline-item',
    'shadow-sm',
    'rounded',
    'border',
    'p-3',
    'mb-4'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};