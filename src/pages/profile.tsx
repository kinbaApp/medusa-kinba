/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next'
import 'tailwindcss/tailwind.css'
import Head from 'next/head'
import { APP_NAME, DONLYFANS_ABI, CONTRACT_ADDRESS, ORACLE_ADDRESS } from '@/lib/consts'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import PurchasedSecrets from '@/components/PurchasedSecrets'
import Header from '@/components/Header'
import Posts from '@/components/Posts'
import WithdrawFund from '@/components/WithdrawFund'
import SubscribersList from '@/components/SubscribersList'
import { Sidebar, CreateNewProfile } from '@/components'
import { useAccount, useContractRead } from 'wagmi'
import { arbitrumGoerli } from 'wagmi/chains'
import { constants } from 'ethers'
import { useRouter } from 'next/router'
import styles from '../../styles/Profile.module.scss'
import fonts from '../../styles/Fonts.module.scss'
import { AiOutlinePicture } from 'react-icons/ai'
import { BsCameraVideo } from 'react-icons/bs'
import { AiOutlineHeart } from 'react-icons/ai'
import PinkButton from '@/components/reusable/PinkButton'
import Ad from '@/components/reusable/Ad'
import useGlobalStore from '@/stores/globalStore'
import PostListing from '@/components/PostListing'
import Unlocked from '@/components/Unlocked'

const Profile: NextPage = resolvedTheme => {
	const { isConnected, address } = useAccount()
	const router = useRouter()
	const { creatorAddress } = router.query
	// check if creator of profile exist
	const {
		data: creatorContractAddress,
		isError,
		isLoading,
	} = useContractRead({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		functionName: 'getCreatorContractAddress',
		args: [address],
		chainId: arbitrumGoerli.id,
		onSuccess(data) {
			console.log('Success', creatorContractAddress)
		},
	})

	const isCreator = creatorContractAddress !== constants.AddressZero

	// useEffect(() => {
	// 	if (!isConnected) {
	// 		console.log('Not connected')
	// 	}
	// 	if (isCreator && isConnected) {
	// 		// @ts-ignore
	// 		router.push(`/user-profile/${address?.toString()}`)
	// 	}
	// })

	//doing this to display the posts because something is wrong with the filter on like 68
	const testPost = useGlobalStore(state => state.posts)

	const requests = useGlobalStore(state => state.requests)
	//since i'm not the creator, I added my address
	const userPosts = useGlobalStore(state => state.posts).filter(
		post => post.creator === (creatorAddress || '0x342Ed79c05E61Dfb7AF45df02100859e068E3a83')
	)
	const posts = userPosts.map(post => {
		return {
			...post,
			purchased: requests.some(request => request.subscriber === address && request.cipherId.eq(post.cipherId)),
		}
	})
	const myUnlockedPosts = requests.filter(
		request => request.subscriber == address && request.creator === creatorAddress
	)
	// console.log('requests', requests)
	// console.log('posts', posts)
	// console.log('userposts', userPosts)
	// console.log('creatoraddress', creatorAddress)
	console.log('testposts', testPost)
	return (
		<div>
			<Head>
				<title>{`${APP_NAME}`}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Toaster position="top-center" reverseOrder={true} />
			{/* <Header /> */}
			{/* <div className=" flex md:flex-row bg-gray-100 dark:bg-gray-800 flex-col h-screen transition-height duration-75 ease-out"> */}

			{/* <div className="relative flex justify-center min-h-screen bg-gray-100 dark:bg-gray-800 sm:items-center py-2 sm:pt-0">
					<div className="my-auto relative flex justify-center py-2 px-6 sm:pt-0 ">
						<WithdrawFund />
					</div>
					<div className="  m-10 px-20  ">
						{isConnected ? (
							isCreator ? (
								'You are a creator'
							) : (
								<CreateNewProfile />
							)
						) : (
							'Please connect your wallet'
						)}{' '}
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
				</div> */}
			{/* </div> */}
			<div className={styles.container}>
				<div className={styles.video}>
					{/* This is the Profile BG - You can comment out the img and use the video if you like */}

					{/* <video loop autoPlay muted id="video" className={styles.intro}>
						<source src="/Login/kinba.mp4" type="video/mp4" />
					</video> */}
					<img src="/Profile/kinbaBGv2.png" alt="" className={styles.intro} />
				</div>
				<div className={styles.main}>
					{/* All of this data will need to be taken from the users account  */}
					{/* Hard coding all images and info untitl i access db */}
					<div className={styles.sidebar}>
						<Sidebar resolvedTheme={resolvedTheme} />
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
									Exclusive Anne Onyme Kinba profile
								</div>
							</div>
						</div>
						<div className={styles.subscriptionInfo}>
							<h2 className={`${styles.subTitle} ${fonts.extraBold}`}>SUBSCRIPTION</h2>
							<p className={`${styles.offer} ${fonts.lightText}`}>
								Limited time offer: -80% for the first month!
							</p>
							<div className={styles.bannerContainer}>
								<div className={styles.banner}>
									<p className={`${styles.bannerText} ${fonts.lightText}`}>
										Only $2.25 - Limited Time Only - Exclusive Nudes
									</p>
									<div className={styles.smallpinkring}>
										<div className={styles.smallpurplering}>
											<img src="/Profile/girl.png" alt="" className={styles.smallpfp} />
										</div>
									</div>
								</div>
							</div>
							<div className={styles.firstsubcontainer}>
								<PinkButton text={'SUBSCRIBE'} />
								<div className={styles.pinkLine}></div>
								<div className={`${styles.price} ${fonts.lightText}`}>$2.25 for 1 month</div>
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
									<p className={`${styles.price} ${fonts.lightText}`}>$29 total</p>
								</div>
							</div>
						</div>
					</div>

					{/* Adds are here  */}

					<div className={styles.rightContainer}>
						<div className={styles.top}>
							<div className={styles.searchBar}>
								<form>
									<input type="search" placeholder="" className={styles.search} />
									{/* <img src="/Profile/searchicon.png" alt="" className={styles.searchIcon} /> */}
								</form>
							</div>
							<div className={styles.mainadvertisment}>
								<Ad image={'/Profile/girl.png'} price={'$2.25'} />
							</div>
						</div>
						<div className={styles.bottom}>
							<div className={styles.privacypolicy}>
								{/* These should be turned into links  */}
								<p className={`${styles.privacy} ${fonts.lightText}`}>
									Privacy. Cookie Notice. Terms of Service
								</p>
							</div>
							<div className={styles.publishButton}>
								<PinkButton text={'PUBLISH NEW +'} />
							</div>
						</div>
					</div>
				</div>
				<div className={styles.posts}>
					{testPost.map(post => (
						<PostListing purchased={false} key={post.cipherId.toNumber()} {...post} />
					))}
				</div>
				{/* {myUnlockedPosts.length > 0 ? (
					<div className={styles.unlockedContainer}>
						{myUnlockedPosts.map(sale => (
							<Unlocked key={sale.requestId.toNumber()} {...sale} />
						))}
					</div>
				) : (
					<div>nothing is working</div>
				)} */}
			</div>
		</div>
	)
}

export default Profile
