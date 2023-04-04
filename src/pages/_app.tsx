import 'tailwindcss/tailwind.css'
import { ThemeProvider } from 'next-themes'
import { configureStore } from '@reduxjs/toolkit'
import Web3Provider from '@/components/Web3Provider'
import { Routes, Route } from 'react-router-dom'
import { UserProfile } from '@/components'
import counterReducer from '@/lib/reduxStore'
import { Provider } from 'react-redux'

const App = ({ Component, pageProps }) => {
	const store = configureStore({ reducer: counterReducer })
	return (
		<>
			{' '}
			<Provider store={store}>
				<ThemeProvider attribute="class">
					<Web3Provider>
						<Component {...pageProps} />
					</Web3Provider>
				</ThemeProvider>
			</Provider>
		</>
	)
}

export default App
