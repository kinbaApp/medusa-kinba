import type { NextPage } from 'next'
import { FC, useEffect, useRef } from 'react'
import 'tailwindcss/tailwind.css'
import useGlobalStore from '@/stores/globalStore'
import Unlocked from '../components/Unlocked'
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
import PostListing from '@/components/PostListing'
import Connect from '@/components/reusable/Connect'

const Content: FC = () => {
	const scrollRef = useRef(null)
	const { isConnected, address } = useAccount()
	const provider = useProvider()

	const updatePosts = useGlobalStore(state => state.updatePosts)
	const updateRequests = useGlobalStore(state => state.updateRequests)
	const updateDecryptions = useGlobalStore(state => state.updateDecryptions)
	const addPost = useGlobalStore(state => state.addPost)
	const addRequest = useGlobalStore(state => state.addRequest)
	const addDecryption = useGlobalStore(state => state.addDecryption)

	useContractEvent({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		eventName: 'NewPost',
		listener(creator, cipherId, name, description, uri) {
			addPost({ creator, cipherId, name, description, uri })
		},
	})

	useContractEvent({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		eventName: 'NewPostRequest',
		listener(subscriber, creator, requestId, cipherId) {
			if (subscriber === address) {
				addRequest({ subscriber, creator, requestId, cipherId })
			}
		},
	})

	useContractEvent({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		eventName: 'PostDecryption',
		listener(requestId, ciphertext) {
			addDecryption({ requestId, ciphertext })
		},
	})

	const donlyFans = useContract({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		signerOrProvider: provider,
	})

	useEffect(() => {
		const getEvents = async () => {
			const iface = new ethers.utils.Interface(DONLYFANS_ABI)

			const newPostFilter = donlyFans.filters.NewPost()
			console.log(newPostFilter)
			const newPosts = await donlyFans.queryFilter(newPostFilter)

			if (iface && newPosts) {
				const posts = newPosts.reverse().map((filterTopic: any) => {
					const result = iface.parseLog(filterTopic)
					const { creator, cipherId, name, description, uri } = result.args
					return { creator, cipherId, name, description, uri } as Post
				})
				updatePosts(posts)
			}

			const newRequestFilter = donlyFans.filters.NewPostRequest(address)
			const newRequests = await donlyFans.queryFilter(newRequestFilter)

			if (iface && newRequests) {
				const requests = newRequests.reverse().map((filterTopic: any) => {
					const result = iface.parseLog(filterTopic)
					const { subscriber, creator, requestId, cipherId } = result.args
					return { subscriber, creator, requestId, cipherId } as Request
				})
				updateRequests(requests)
			}

			const postDecryptionFilter = donlyFans.filters.PostDecryption()
			const postDecryptions = await donlyFans.queryFilter(postDecryptionFilter)

			if (iface && postDecryptions) {
				const decryptions = postDecryptions.reverse().map((filterTopic: any) => {
					const result = iface.parseLog(filterTopic)
					const { requestId, ciphertext } = result.args
					return { requestId, ciphertext } as Decryption
				})
				updateDecryptions(decryptions)
			}
		}
		getEvents()
	}, [address])

	const requests = useGlobalStore(state => state.requests)
	const myUnlockedPosts = requests.filter(request => request.subscriber === address)
	console.log('unlocked posts', myUnlockedPosts)
	const posts = useGlobalStore(state => state.posts)
	const lockedPosts = posts.filter(post => !myUnlockedPosts.some(request => request.cipherId.eq(post.cipherId)))
	console.log('locked post', lockedPosts)
	const lockedPostsUser = lockedPosts.map(post => {
		return {
			...post,
			purchased: requests.some(request => request.subscriber === address && request.cipherId.eq(post.cipherId)),
		}
	})
	console.log('locked post user', lockedPostsUser)

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
							{myUnlockedPosts.length > 0 ? (
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
							)}

							<div className="grid grid-rows-1 gap-6 p-4 w-full transition-all">
								{lockedPostsUser.map(post => (
									<PostListing key={post.cipherId.toNumber()} {...post} uri={post.uri} />
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

export default Content
