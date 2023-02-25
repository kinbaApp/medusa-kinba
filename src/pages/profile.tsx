import type { NextPage } from 'next'
import 'tailwindcss/tailwind.css'
import PostForm from '@/components/PostForm'
import { ThemeProvider } from 'next-themes'
import Head from 'next/head'
import { APP_NAME, DONLYFANS_ABI, CONTRACT_ADDRESS, ORACLE_ADDRESS } from '@/lib/consts'
import { Toaster } from 'react-hot-toast'
import PurchasedSecrets from '@/components/PurchasedSecrets'
import Header from '@/components/Header'
import Posts from '@/components/Posts'
import WithdrawFund from '@/components/WithdrawFund'
import SubscribersList from '@/components/SubscribersList'
import Link from 'next/link'
import { Sidebar } from '@/components'

const Profile: NextPage = () => {
	return (
		<div>
			<Head>
				<title>{`${APP_NAME}`}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Toaster position="top-center" reverseOrder={true} />
			<Header />
			<div className=" flex md:flex-row bg-gray-100 dark:bg-gray-800 flex-col h-screen transition-height duration-75 ease-out">
				<Sidebar />

				<div className="relative flex justify-center min-h-screen bg-gray-100 dark:bg-gray-800 sm:items-center py-2 sm:pt-0">
					<div className="my-auto relative flex justify-center py-2 px-6 sm:pt-0 ">
						<WithdrawFund />
					</div>
					<div className="  m-10 px-20  ">
						<PostForm />
						{/* </div>
				<div className="max-w-6xl mx-auto px-6 lg:px-8"> */}
						{/* <SubscribersList /> */}
					</div>
					<div className="my-auto relative flex justify-center py-2 px-6 sm:pt-0">
						<Link href="/listofsubscribers">
							<a
								className="font-semibold mb-2 text-sm text-white py-2 px-3 rounded-sm transition-colors bg-indigo-600 dark:bg-indigo-800 hover:bg-black dark:hover:bg-gray-50 dark:hover:text-gray-900 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-25
"
							>
								List of subscribers
							</a>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Profile
