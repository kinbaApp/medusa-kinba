import 'tailwindcss/tailwind.css'
import { ThemeProvider } from 'next-themes'

import Web3Provider from '@/components/Web3Provider'
import { Routes, Route } from 'react-router-dom'
import { UserProfile } from '@/components'

const App = ({ Component, pageProps }) => {
	return (
		<>
			<ThemeProvider attribute="class">
				<Web3Provider>
					<Component {...pageProps} />
				</Web3Provider>
			</ThemeProvider>
		</>
	)
}

export default App
