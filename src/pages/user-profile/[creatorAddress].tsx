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

const UserProfilePage = (resolvedTheme, setTheme) => {
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
			<div className="flex ">
				<UserProfile creatorAddress={creatorAddress} />
			</div>
		</div>
	)
}

export default UserProfilePage
