import type { NextPage } from 'next'
import { FC, useEffect, useRef, useState } from 'react'
import 'tailwindcss/tailwind.css'
import useGlobalStore from '@/stores/globalStore'
import UnlockedSanity from '../components/UnlockedSanity'
import { ThemeProvider } from 'next-themes'
import Head from 'next/head'
import { APP_NAME, DONLYFANS_ABI, CONTRACT_ADDRESS, ORACLE_ADDRESS } from '@/lib/consts'
import { ethers } from 'ethers'
import {
	useAccount,
	useContractRead,
	usePrepareContractWrite,
	useContractWrite,
	useProvider,
	useWaitForTransaction,
	useContractEvent,
	useContract,
} from 'wagmi'
import { Toaster } from 'react-hot-toast'
import PurchasedSecrets from '@/components/PurchasedSecrets'
import Header from '@/components/Header'
import Posts from '@/components/Posts'
import { Sidebar } from '@/components'
import styles from '../../styles/Feed.module.scss'
import fonts from '../../styles/Fonts.module.scss'
import PinkButton from '@/components/reusable/PinkButton'
import Ad from '@/components/reusable/Ad'
import Suggestion from '@/components/reusable/Suggestion'
import { TfiReload } from 'react-icons/tfi'
import { AiOutlineLeft } from 'react-icons/ai'
import { AiOutlineRight } from 'react-icons/ai'
import { TbFreeRights } from 'react-icons/tb'
import Link from 'next/link'
import LockedPost from '@/components/LockedPost'
import Connect from '@/components/reusable/Connect'
import { client, urlFor } from '@/lib/sanityClient'
import { allPostsQuery } from '@/lib/utils'

const FeedSanity: FC = () => {
	const scrollRef = useRef(null)
	const { isConnected, address } = useAccount()
	const provider = useProvider()
	const [postsSanity, setPostsSanity] = useState(null)

	useEffect(() => {
		console.log('fetching data')
		const createdPostsQuery = allPostsQuery()

		client.fetch(createdPostsQuery).then(data => {
			setPostsSanity(data)
			console.log('fetched data', data)
		})
	}, [])
	const subscribers = useGlobalStore(state => state.subscribers)
	const unlockedSanityPosts = postsSanity?.filter(
		postSanity =>
			subscribers.some(item => item.creator === postSanity.postedBy && item.subscriber === address) ||
			postSanity.postedBy === address
	)
	const requests = useGlobalStore(state => state.requests)
	//const myUnlockedPosts = requests.filter(request => request.subscriber === address)
	console.log('unlocked posts', unlockedSanityPosts)
	const posts = useGlobalStore(state => state.posts)
	//const lockedPosts = posts.filter(post => !unlockedSanityPosts.some(request => request.cipherId.eq(post.cipherId)))
	const lockedSanityPosts = postsSanity?.filter(
		post => !unlockedSanityPosts.some(request => request._id === post._id)
	)
	console.log('locked post', lockedSanityPosts)
	const lockedSanityPostsUser = lockedSanityPosts?.map(post => {
		return {
			...post,
			purchased: false,
		}
	})
	// const lockedPostsUser = lockedPosts.map(post => {
	// 	return {
	// 		...post,
	// 		purchased: requests.some(request => request.subscriber === address && request.cipherId.eq(post.cipherId)),
	// 	}
	// })
	// console.log('locked post user', lockedPostsUser)

	console.log('posts:', posts)
	return (
		<div>
			<Head>
				<title>{`${APP_NAME}`}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Toaster position="top-center" reverseOrder={true} />
			{/* <Header resolvedTheme={resolvedTheme} setTheme={setTheme} /> */}

			{/* <div className=" flex md:flex-row bg-gray-100 dark:bg-gray-800 flex-col h-screen transition-height duration-75 ease-out">
				<Sidebar resolvedTheme={resolvedTheme} />
				<div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
					<div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-800 sm:items-center py-4 sm:pt-0">
						<div className="relative flex  justify-center  bg-gray-100 dark:bg-gray-800 sm:items-center py-4 sm:pt-0">
							<div className="max-w-5xl mx-auto px-6 lg:px-8">
								<PurchasedSecrets />

								<Posts />
							</div>
						</div>
					</div>
				</div>
			</div> */}
			<div className={styles.container}>
				<div className={styles.bg}>
					<img src="/Profile/kinbaBGv2.png" alt="" className={styles.intro} />
				</div>
				{/* <div className={styles.header}>HEADER GOES HERE</div> */}
				<div className={styles.main}>
					<div className={styles.sidebar}>
						<Sidebar />
					</div>
					<div className={styles.content}>
						<div className={styles.homeContainer}>
							<div className={`${styles.homeTitle} ${fonts.bodyText}`}>HOME</div>
							<div className={styles.createButton}>
								<Link href="/newPost">
									<a>
										<PinkButton text={'PUBLISH NEW+'} />
									</a>
								</Link>
							</div>
						</div>
						<div className={styles.postContainer}>
							{unlockedSanityPosts && (
								<div className="grid grid-rows-1 gap-6 p-4 w-full transition-all">
									{unlockedSanityPosts.map(post => (
										<UnlockedSanity key={post._id} post={post} {...post} />
									))}
								</div>
							)}
							{/* {myUnlockedPosts.length > 0 ? (
								<div className="grid grid-rows-1 gap-6 p-4 w-full transition-all">
									{myUnlockedPosts.map(sale => (
										<Unlocked key={sale.requestId.toNumber()} {...sale} />
									))}
								</div>
							) : (
								// 	<div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 w-full transition-all">
								// 	{creators.map(sale => (
								// 		//<CreatorsSubscribedTo key={creator.toString()} {...creator} />
								// 		<li>{sale.requestId.toNumber()}</li>
								// 	))}
								// </div>
								''
							)} */}

							<div className="grid grid-rows-1 gap-6 p-4 w-full transition-all">
								{lockedSanityPostsUser &&
									lockedSanityPostsUser.map(post => (
										<LockedPost
											key={post._id}
											{...post}
											uri={post.uri}
											creator={post.postedBy}
											// displayName={post.poster?.displayName}
											// userName={post.poster?.userName}
										/>
									))}
							</div>
						</div>
					</div>
					<div className={styles.suggested}>
						<Connect />
						<div className={styles.top}>
							<div className={styles.searchBar}>
								<form>
									<input type="search" placeholder="" className={styles.search} />
									{/* <img src="/Profile/searchicon.png" alt="" className={styles.searchIcon} /> */}
								</form>
							</div>
							<div className={styles.mainAdvertisment}>
								{/* <Ad image={'/Profile/girl.png'} price={'$2.25'} /> */}
								<div className={styles.topBox}>
									<p className={`${fonts.bodyText} ${styles.suggestionsTitle}`}>SUGGESTIONS</p>
									<div className={styles.iconContainer}>
										<TbFreeRights size="25px" />
										<TfiReload size="20px" />
										<AiOutlineLeft size="20px" />
										<AiOutlineRight size="20px" />
									</div>
								</div>
								<Suggestion
									pfp={'/Profile/girl.png'}
									username={'@Prettyprincess'}
									banner="/Profile/layingdown.png"
									name={'LovelyLayla'}
								/>
								<Suggestion
									pfp={'/Profile/girl2.png'}
									username={'@poleQueen'}
									banner="/Profile/sitting2.png"
									name={'ThePolePrincess'}
								/>
							</div>
							<div className={styles.termsOfService}>
								<p className={` ${fonts.lightText}`}>Privacy · Cookie Notice · Terms of Service</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default FeedSanity
