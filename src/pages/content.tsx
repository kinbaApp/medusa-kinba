import type { NextPage } from 'next'
import 'tailwindcss/tailwind.css'
import { ThemeProvider } from 'next-themes'
import Head from 'next/head'
import { APP_NAME, DONLYFANS_ABI, CONTRACT_ADDRESS, ORACLE_ADDRESS } from '@/lib/consts'
import { Toaster } from 'react-hot-toast'
import PurchasedSecrets from '@/components/PurchasedSecrets'
import Header from '@/components/Header'
import Posts from '@/components/Posts'

const Content: NextPage = () => {
	return (
		<div>
			<Head>
				<title>{`${APP_NAME}`}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Toaster position="top-center" reverseOrder={true} />
			<Header />
			<div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-800 py-4 sm:pt-0">
				<PurchasedSecrets />

				<Posts />
			</div>
		</div>
	)
}

export default Content
