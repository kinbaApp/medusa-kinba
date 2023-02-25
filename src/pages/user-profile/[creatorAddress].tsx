import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import React, { useState, useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'
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
import CreatorsList from '@/components/CreatorsList'
import UserProfile from '@/components/UserProfile'
import { Sidebar } from '@/components'

const UserProfilePage = () => {
	const router = useRouter()
	const { address } = useAccount()
	const { creatorAddress } = router.query
	const scrollRef = useRef(null)

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

				<div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
					<div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-800 sm:items-center py-4 sm:pt-0">
						<div className="relative flex  justify-center  bg-gray-100 dark:bg-gray-800 sm:items-center py-4 sm:pt-0">
							<div className="max-w-5xl mx-auto px-6 lg:px-8">
								<UserProfile creatorAddress={creatorAddress} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserProfilePage
