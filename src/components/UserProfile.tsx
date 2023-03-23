import React, { useState, useEffect } from 'react'
import useGlobalStore from '@/stores/globalStore'
import { APP_NAME, CONTRACT_ADDRESS, DONLYFANS_ABI, CREATOR_ABI } from '@/lib/consts'
import {
	useProvider,
	useAccount,
	useContractRead,
	usePrepareContractWrite,
	useContractWrite,
	useWaitForTransaction,
	useContract,
	useContractEvent,
} from 'wagmi'
import PostListing from './PostListing'
import { BigNumber, ethers } from 'ethers'
import { formatEther, getAddress, parseEther } from 'ethers/lib/utils'
import Unlocked from './Unlocked'
import { arbitrumGoerli } from 'wagmi/chains'
import toast from 'react-hot-toast'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import styles from '../../styles/UserProfile.module.scss'
import fonts from '../../styles/Fonts.module.scss'
import { Sidebar, CreateNewProfile } from '@/components'
import { AiOutlinePicture } from 'react-icons/ai'
import { BsCameraVideo } from 'react-icons/bs'
import { AiOutlineHeart } from 'react-icons/ai'
import PinkButton from '@/components/reusable/PinkButton'
import Ad from '@/components/reusable/Ad'
import Link from 'next/link'
import Modal from 'react-modal'
import Connect from './reusable/Connect'

const UserProfile = ({ creatorAddress }) => {
	const provider = useProvider()
	const { isConnected, address } = useAccount()
	const [isOpen, setIsOpen] = useState(false)
	const [subscriptionPrice, setSubscriptionPrice] = useState('')
	const customStyles = {
		overlay: {
			backgroundColor: 'rgba(0, 0, 0, 0.6)',
		},
		content: {
			top: '50%',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-50%',
			transform: 'translate(-50%, -50%)',
		},
	}
	const {
		data: creatorContractAddress,
		isError,
		isLoading,
	} = useContractRead({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		functionName: 'getCreatorContractAddress',
		args: [creatorAddress],
		chainId: arbitrumGoerli.id,
		onSuccess(data) {
			console.log('Success', creatorAddress)
		},
	})
	const {
		data: isSubscriber,
		isError: isErrorGetFoller,
		isLoading: isLoadingGetFoller,
	} = useContractRead({
		address: creatorContractAddress,
		abi: CREATOR_ABI,
		functionName: 'isSubscriber',
		args: [address],
		chainId: arbitrumGoerli.id,
	})

	const [subscriber, setSubscriber] = useState(isSubscriber)
	const updatePosts = useGlobalStore(state => state.updatePosts)
	const updateRequests = useGlobalStore(state => state.updateRequests)
	const updateDecryptions = useGlobalStore(state => state.updateDecryptions)
	const addPost = useGlobalStore(state => state.addPost)
	const addRequest = useGlobalStore(state => state.addRequest)
	const addDecryption = useGlobalStore(state => state.addDecryption)
	const addSubscriber = useGlobalStore(state => state.addSubscriber)
	const updateCreators = useGlobalStore(state => state.updateCreators)
	const addCreator = useGlobalStore(state => state.addCreator)
	useContractEvent({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		eventName: 'NewSubscriber',
		listener(creator, subscriber, price) {
			if (subscriber == address) {
				addSubscriber({ creator, subscriber, price })
			}
		},
	})
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

			const creatorsListFilter = donlyFans.filters.NewCreatorProfileCreated()
			const newCreatorsProfile = await donlyFans.queryFilter(creatorsListFilter)
			console.log(newCreatorsProfile)

			if (iface && newCreatorsProfile) {
				const creators = newCreatorsProfile.reverse().map((filterTopic: any) => {
					const result = iface.parseLog(filterTopic)
					const { creatorAddress, price, period } = result.args
					return { creatorAddress, price, period } as Creator
				})
				updateCreators(creators)
			}
		}
		getEvents()
	}, [address, subscriber])
	const requests = useGlobalStore(state => state.requests)
	const [creator] = useGlobalStore(state => state.creators).filter(
		creator => creator.creatorAddress === creatorAddress
	)
	const price = creator?.price
	const period = creator?.period
	const userPosts = useGlobalStore(state => state.posts).filter(post => post.creator === creatorAddress)
	// const userPosts = useGlobalStore(state => state.posts)
	const myUnlockedPosts = requests.filter(
		request => request.subscriber == address && request.creator === creatorAddress
	)
	const posts = useGlobalStore(state => state.posts)
	const lockedPosts = userPosts.filter(post => !myUnlockedPosts.some(request => request.cipherId.eq(post.cipherId)))
	console.log('locked post', lockedPosts)
	const lockedPostsUser = lockedPosts.map(post => {
		return {
			...post,
			purchased: requests.some(request => request.subscriber === address && request.cipherId.eq(post.cipherId)),
		}
	})
	console.log('locked post user', lockedPostsUser)

	// console.log('userPosts:', userPosts)
	// console.log('posts:', posts)
	// console.log('requestts:', requests)

	const { config: configSubscribe } = usePrepareContractWrite({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		functionName: 'subscribe',
		//args: ['0x${creatorAddress}'],
		args: [getAddress(creatorAddress || ethers.constants.AddressZero)],
		//enabled: Boolean(evmPoint),
		overrides: { value: parseEther(subscriptionPrice || '0.0') },
		chainId: arbitrumGoerli.id,
	})

	const { data: dataSubscribe, write: subscribe } = useContractWrite(configSubscribe)

	useWaitForTransaction({
		hash: dataSubscribe?.hash,
		onSuccess: txData => {
			toast.dismiss()
			toast.success(
				<a
					href={`https://goerli.arbiscan.io/tx/${txData.transactionHash}`}
					className="inline-flex items-center text-blue-600 hover:underline"
					target="_blank"
					rel="noreferrer"
				>
					Successfully subscribed to content creator profile! View on Etherscan
					<svg
						className="ml-2 w-5 h-5"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
						<path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
					</svg>
				</a>
			)

			setSubscriber(true)
		},
		onError: e => {
			toast.dismiss()
			toast.error(`Failed to subscribe: ${e.message}`)
		},
	})

	const subscribeToCreator = async () => {
		if (parseEther(subscriptionPrice) < price) {
			console.log('not enough eth')
			toast.dismiss()
			toast.error(`Subscription price is ${formatEther(price)} ETH`)
		} else {
			toast.loading('Subscribing..')
			subscribe?.()
			console.log(configSubscribe)
		}
	}

	//const userPost = posts.some(post => post.creator === creatorAddress)
	if (!isConnected) {
		return (
			<div className={styles.pleaseConnect}>
				Please connect your wallet
				<Connect />
			</div>
		)
	}
	return (
		<div>
			<Head>
				<title>{`${APP_NAME}`}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Toaster position="top-center" reverseOrder={true} />
			<div className={styles.container}>
				<div className={styles.video}>
					{/* This is the Profile BG - You can comment out the img and use the video if you like */}

					{/* <video loop autoPlay muted id="video" className={styles.intro}>
						<source src="/Login/kinba.mp4" type="video/mp4" />
					</video> */}
					<img src="/Profile/kinbaBGv2.png" alt="" className={styles.intro} />
				</div>
				<div className={styles.main}>
					<div className={styles.sidebar}>
						<Sidebar />
					</div>
					<div className={styles.content}>
						<div className={styles.headerImage}>
							<img src="/Profile/layingdown.png" alt="" />
						</div>
						<div className={styles.profilepic}>
							<div className={styles.pinkring}>
								<div className={styles.purplering}>
									<div>
										<img src="/Profile/girl.png" alt="" className={styles.image} />
									</div>
								</div>
							</div>
						</div>
						<div className={styles.bio}>
							<div className={styles.likeAndShare}>
								{/* these two assets will eventually need functionality added  */}
								<img src="/Profile/heartIcon.png" alt="" className={styles.likeIcon} />
								<img src="/Profile/shareIcon.png" alt="" className={styles.shareIcon} />
							</div>
							<div className={styles.bottomhalf}>
								{/* INTERPOLATE USER INFO HERE  */}
								<div className={`${styles.nameAndPostInfo}`}>
									<p className={`${styles.name} ${fonts.bold}`}>Anne Onyme</p>
									<img src="/Profile/verified.png" alt="" className={styles.verified} />
									<div className={styles.postsCount}>
										<AiOutlinePicture size="20px" color="white" />
										<p className={fonts.lightText}>643 ·</p>
									</div>
									<div className={styles.videoCount}>
										<BsCameraVideo size="20px" color="white" />
										<p className={fonts.lightText}>291 ·</p>
									</div>

									<div className={styles.likeCount}>
										<AiOutlineHeart size="20px" color="white" />
										<p className={fonts.lightText}>528.8K </p>
									</div>
								</div>
								<div className={`${styles.username} ${fonts.lightText}`}>@anneonyme</div>
								<div className={`${styles.bioText} ${fonts.lightText}`}>
									Exclusive Anne Onyme Kinba profile {creatorAddress}
								</div>
							</div>
						</div>
						{subscriber ? (
							<div className={styles.youAreSubscribedButton}>
								<p className={fonts.bodyText}>You are subscribed to this profile! </p>
							</div>
						) : (
							<div className={styles.subscriptionInfo}>
								<h2 className={`${styles.subTitle} ${fonts.extraBold}`}>SUBSCRIPTION</h2>
								<p className={`${styles.offer} ${fonts.lightText}`}>
									Limited time offer: -80% for the first month!
								</p>
								<div className={styles.bannerContainer}>
									<div className={styles.banner}>
										<p className={`${styles.bannerText} ${fonts.lightText}`}>
											Only {formatEther(price || 0.0)} ETH - Limited Time Only - Exclusive Content
										</p>
										<div className={styles.smallpinkring}>
											<div className={styles.smallpurplering}>
												<img src="/Profile/girl.png" alt="" className={styles.smallpfp} />
											</div>
										</div>
									</div>
								</div>
								<div className={styles.firstsubcontainer}>
									<button onClick={() => setIsOpen(true)}>
										<PinkButton text={'SUBSCRIBE'} />
									</button>
									<Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} style={customStyles}>
										<div className="p-6 max-w-sm bg-white rounded-lg border border-purple-200 shadow-md ">
											<div className="pt-4 text-center text-black">
												<label className="block">
													<span className="text-lg font-mono font-light  my-4 text-purple-600 ">
														Subscribe to see content!
													</span>

													<input
														required
														type="number"
														placeholder="ETH"
														className="form-input my-5 block w-full text-black"
														value={subscriptionPrice}
														onChange={e => setSubscriptionPrice(e.target.value)}
													/>
												</label>
											</div>
											<button
												disabled={!isConnected}
												className="font-semibold mb-2 text-sm text-white py-2 px-3 rounded-sm transition-colors bg-indigo-600 dark:bg-indigo-800 hover:bg-black dark:hover:bg-gray-50 dark:hover:text-gray-900 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-25"
												onClick={() => subscribeToCreator()}
											>
												Subscribe
											</button>
										</div>
										<button onClick={() => setIsOpen(false)}>Close Modal</button>
									</Modal>
									<div className={styles.pinkLine}></div>
									<div className={`${styles.price} ${fonts.lightText}`}>
										{' '}
										{formatEther(price || 0.0)} ETH for {formatEther(period || 0.0)} days
									</div>
								</div>
								<div className={styles.date}>
									<p>February 24th 2023</p>
								</div>
								<div className={styles.subContainer}>
									<div className={`${styles.subscriptionSubTitle} ${fonts.bodyText}`}>
										Subscription plans
									</div>
									<div className={styles.subPlans}>
										<PinkButton text={'3 MONTHS - 50% OFF'} />
										<div className={styles.pinkLine}></div>
										<p className={`${styles.price} ${fonts.lightText}`}>{0.1} ETH total</p>
									</div>
								</div>
							</div>
						)}
						{/* <p className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white truncate"> */}
						{/* <div className={styles.priceAndPeriod}>
							Price:{' '}
							{price ? (BigNumber.from(0).eq(price) ? 'Free' : `${formatEther(price)} ETH`) : 'no price'}{' '}
							, Period: {period ? formatEther(period) : 'undefined'} days
						</div> */}
						{/* </p> */}
						<>
							{/* <p className="text-base font-mono font-light dark:text-gray-300 ml-2">
						Subscribe to see the content!
					</p> */}
							{/* <div className="grid grid-rows-1  gap-6 p-4 w-full transition-all">
								{posts.map(post => (
									<PostListing key={post.cipherId.toNumber()} {...post} />
								))}
							</div> */}

							{lockedPostsUser.map(post => (
								<PostListing key={post.cipherId.toNumber()} {...post} uri={post.uri} />
							))}
						</>

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
					</div>
					{/* Adds are here  */}

					<div className={styles.rightContainer}>
						<div className={styles.top}>
							<Connect />
							<div className={styles.searchBar}>
								<form>
									<input type="search" placeholder="" className={styles.search} />
									{/* <img src="/Profile/searchicon.png" alt="" className={styles.searchIcon} /> */}
								</form>
							</div>
							<div className={styles.mainadvertisment}>
								<Ad
									creatorAddress={creatorAddress}
									image={'/Profile/girl.png'}
									price={formatEther(price || 0.0)}
									period={formatEther(period || 0.0)}
									// subscriptionPrice={subscriptionPrice}
									// isConnected={}
									// subscribeToCreator={}
									// setSubscriptionPrice={}
								/>
							</div>
						</div>
						<div className={styles.bottom}>
							<div className={styles.privacypolicy}>
								{/* These should be turned into links  */}
								<p className={`${styles.privacy} ${fonts.lightText}`}>
									Privacy. Cookie Notice. Terms of Service
								</p>
							</div>
							<div className={styles.bottomButtons}>
								<div className={styles.subList}>
									{creatorAddress === address && (
										<Link href="/listofsubscribers">
											<a>
												<PinkButton text={'SUBSCRIBER LIST'} />
											</a>
										</Link>
									)}
								</div>
								<div className={styles.publishButton}>
									<Link href="/newPost">
										<a>
											<PinkButton text={'PUBLISH NEW +'} />
										</a>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserProfile
