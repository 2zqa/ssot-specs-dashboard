const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      colors: {
        // These colors are exposed by VoIPGRID simply as CSS variables.
        // We need to do it this way because VoIPGRID holds the colors for each partner's brand.
        'primary': 'var(--brand-color-primary)',
        'primary-light': 'var(--brand-color-primary-light)',
        'primary-dark': 'var(--brand-color-primary-dark)',
        'navbar': 'var(--brand-color-navbar)',

        'error-accent-1': '#E00000',

        // Temporary redirect
        'tr-gray-accent-1': '#F9F9F9',

        // Opening hours basic
        // Need to check with UX which colors are used in BA and have those consistent here, at least
        // colors that are not in the design system components.
        'ohb-white': '#ffffff',
        'ohb-disabled': '#F8F8FA',
        'ohb-border': '#CBCBCB',
        'ohb-gray-accent-2': '#d3d3d3',
        'ohb-gray-accent-3': '#e3e3e3',
        'ohb-gray-accent-4': '#8D8C94',
        'ohb-gray-accent-5': '#A69D9D',
        'ohb-green-accent-1': '#00A550',
        'ohb-green-accent-2': '#2B9F3E',
        'ohb-error-accent-1': '#E00000',
        'ohb-error-accent-2': '#FFF5F5',
        'ohb-blue-accent-1': '#E9F4FF',
        'ohb-blue-accent-2': '#B5D2EF',

        // Support code
        'support-code-blue': '#7BB2DC',
        'support-code-red': '#DC7B7B',

        // Queue dashboard
        'background': '#f6f7fb',
        'header': '#343b52',
        'intro': '#7b7f8c',

        // Feature announcements
        'section-header': '#A3A3A3',
        'section-background': '#FCFBFB',
        'section-border': '#EEEBEB',
        'section-hr': '#CCCCCC',
        'fa-grey-accent': '#F5F5F5',

        // Components
        'red-accent-1': '#E00000',
        'red-accent-2': '#FFF5F5',
        'orange-accent-1': '#fd9e31',
        'gray-accent-1': '#e6e7eb',
        'gray-accent-2': '#d5d7dd',
        'blue-accent-1': '#E9F4FF',
        'blue-accent-2': '#B5D2EF',
        'black-accent-1': '#2A3042',

        // Design system
        'ds-white': '#fff',
        'ds-orange-400': '#ec6437',
        'ds-orange-500': '#E94E1B',
        'ds-orange-600': '#d14314',
        'ds-blue-grey-50': '#f5f7fa',
        'ds-blue-grey-100': '#e6e7eb',
        'ds-blue-grey-300': '#d5d7dd',
        'ds-blue-grey-900': '#2A3042',
        'ds-black': '#000',
        'ds-black-opacity-15': 'rgba(0,0,0,0.15)',
        'ds-black-opacity-25': 'rgba(0,0,0,0.25)',
        'ds-black-opacity-40': 'rgba(0,0,0,0.4)',
        'ds-purple-400': '#2f06b5',
        'ds-purple-500': '#270597',
        'ds-grey-300': '#adafb6',
        'ds-grey-400': '#999ba4',
        'ds-grey-500': '#333333',
        'ds-blue-400': '#4ab3e2',
        'ds-blue-500': '#38acdf',
        'ds-red-500': '#e00000',
        'ds-blue-interaction-default': '#2D77F6',
        'ds-blue-interaction-hover': '#225DC1',
      },
      spacing: {
        // Design system
        'ds-1': '4px',
        'ds-2': '8px',
        'ds-3': '12px',
        'ds-4': '16px',
        'ds-6': '24px',
        'ds-8': '32px',
        'ds-0.5': '2px',
        'ds-px': '1px',
        'ds-1.5': '6px',
        'ds-2.5': '10px',
        'ds-3.5': '14px',
      },
      borderWidth: {
        // Design system
        'ds-1': '4px',
        'ds-2': '8px',
        'ds-3': '12px',
        'ds-4': '16px',
        'ds-6': '24px',
        'ds-8': '32px',
        'ds-0.5': '2px',
        'ds-px': '1px',
        'ds-1.5': '6px',
        'ds-2.5': '10px',
        'ds-3.5': '14px',
      },
      borderRadius: {
        // Design system
        'ds-1': '4px',
        'ds-2': '8px',
        'ds-3': '12px',
        'ds-4': '16px',
        'ds-6': '24px',
        'ds-8': '32px',
        'ds-0.5': '2px',
        'ds-px': '1px',
        'ds-1.5': '6px',
        'ds-2.5': '10px',
        'ds-3.5': '14px',
      },
      boxShadow: {
        // Design system
        'ds-button-primary-shadow-default': 'inset 0px -2px 0px 0px rgba(0,0,0,0.25), 0px 1px 4px 0px rgba(0,0,0,0.15)',
        'ds-input-radio-checked-inner': 'inset 0px 0px 0px 3px $white',
        'ds-button-primary-shadow-hover-active-focus':
          'inset 0px -2px 0px 0px rgba(0,0,0,0.4), 0px 1px 4px 0px rgba(0,0,0,0.15)',
        'ds-button-secondary-shadow-default': 'inset 0px -2px 0px 0px #e6e7eb, 0px 2px 4px 0px rgba(0,0,0,0.15)',
        'ds-button-secondary-shadow-hover-active-focus':
          'inset 0px -2px 0px 0px #d5d7dd, 0px 2px 4px 0px rgba(0,0,0,0.15)',
        'ds-radio-checked-inner': 'inset 0px 0px 0px 3px #fff',
        'ds-tabcordion-active': 'inset 0px -2px 0px 0px #e6e7eb, 0px 1px 4px 0px rgba(0,0,0,0.15)',
        'ds-input-shadow-focus': '0px 0px 2px 0px #4ab3e2',
        'ds-input-shadow-default-hover-error-disabled': 'inset 0px 1px 2px 0px #e6e7eb',
        'ds-dropdown-options-shadow-default': '0px 1px 4px 0px rgba(0,0,0,0.15)',
        'ds-pagination-shadow-inset': 'inset 0 1px 0 0 #e6e7eb, inset 0 0 8px 0 #e6e7eb',
      },
      fontSize: {
        // Design system
        'ds-fs-sm': '14px',
        'ds-fs-base': '16px',
        'ds-fs-lg': '20px',
        'ds-fs-xl': '24px',
        'ds-fs-xxl': '26',
      },
      fontWeight: {
        // Design system
        'ds-fw-light': '300',
        'ds-fw-medium': '500',
        'ds-fw-semibold': '600',
        'ds-fw-bold': '700',
        'ds-fw-normal': '400',
      },
      lineHeight: {
        // Design system
        'ds-lh-xs': '20px',
        'ds-lh-sm': '22',
        'ds-lh-base': '24',
        'ds-lh-md': '26px',
        'ds-lh-xl': '30',
      },
      animation: {
        blink: 'blink 1s step-end 0s infinite',
        borderFocus: 'borderFocus 2s ease-in-out',

        // animationDuration for below animations gets defined in the components itself
        showHide: 'showHide 0s steps(1,end) 0s 1',
        showHideReverse: 'showHide 0s step-end 0s 1 reverse',
        spinner: 'spin 0s linear 0s 1',
      },
      keyframes: {
        blink: {
          '0%': { borderColor: 'transparent' },
          '50%': { borderColor: '#000000' },
          '100%': { borderColor: 'transparent' },
        },
        borderFocus: {
          '25%': { borderColor: 'var(--brand-color-primary)' },
          '50%': { borderColor: '#e5e7eb' },
          '75%': { borderColor: 'var(--brand-color-primary)' },
          '100%': { borderColor: '#e5e7eb' },
        },
        showHide: {
          '0%': { opacity: 1 },
          '50%, 100%': { opacity: 0 },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      gridTemplateRows: {
        '1-auto': 'repeat(1, auto)',
        '2-auto': 'repeat(2, auto)',
        '3-auto': 'repeat(3, auto)',
        '4-auto': 'repeat(4, auto)',
        '5-auto': 'repeat(5, auto)',
        '6-auto': 'repeat(6, auto)',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',

          /* Firefox */
          'scrollbar-width': 'none',

          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    }),
  ],
};
