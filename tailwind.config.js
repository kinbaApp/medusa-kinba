/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				customPink: '#fd2ac4',
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
}
