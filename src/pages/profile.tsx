import type { NextPage } from 'next'
import 'tailwindcss/tailwind.css'
import PostForm from '@/components/PostForm'
import { ThemeProvider } from 'next-themes'
import Head from 'next/head'
import { APP_NAME, DONLYFANS_ABI, CONTRACT_ADDRESS, ORACLE_ADDRESS } from '@/lib/consts'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import PurchasedSecrets from '@/components/PurchasedSecrets'
import Header from '@/components/Header'
import Posts from '@/components/Posts'
import WithdrawFund from '@/components/WithdrawFund'
import SubscribersList from '@/components/SubscribersList'
import Link from 'next/link'
import { Sidebar, CreateNewProfile } from '@/components'
import { useAccount, useContractRead } from 'wagmi'
import { arbitrumGoerli } from 'wagmi/chains'
import { constants } from 'ethers'
import { useRouter } from 'next/router'
import styles from '../../styles/Profile.module.scss'
import Image from 'next/image'
import fonts from '../../styles/Fonts.module.scss'
const Profile: NextPage = () => {
	const { isConnected, address } = useAccount()
	const router = useRouter()
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

	useEffect(() => {
		if (!isConnected) {
			console.log('Not connected')
		}
		if (isCreator && isConnected) {
			// @ts-ignore
			router.push(router.push(`user-profile/${address?.toString()}`))
		}
	})
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
					<video loop autoPlay muted id="video" className={styles.intro}>
						<source src="/Login/kinba.mp4" type="video/mp4" />
					</video>
				</div>
				<div className={styles.main}>
					{/* All of this data will need to be taken from the users account  */}
					{/* Hard coding all images and info untitl i access db */}
					<div className={styles.sidebar}>
						<Sidebar />
					</div>
					<div className={styles.content}>
						<div className={styles.headerImage}>
							<img src="/Profile/stock.png" alt="" />
						</div>
						<div className={styles.profilepic}>
							<div className={styles.pinkring}>
								<div className={styles.blackring}>
									<div>
										<img src="/Profile/girl.png" alt="" className={styles.image} />
									</div>
								</div>
							</div>
						</div>
						<div className={styles.bio}>
							<div className={styles.likeAndShare}>heart and share</div>
							<div className={styles.bottomhalf}>
								{/* INTERPOLATE USER INFO HERE  */}
								<div className={`${fonts.bold}`}> name pink checkmark postts videos and likes</div>
								<div>username</div>
								<div>bio</div>
							</div>
						</div>
						<div className={styles.subscriptionInfo}>SUBSCRIBE</div>
					</div>
					<div className={styles.subscriptions}>Subscribe messages will go here</div>
				</div>
			</div>
		</div>
	)
}

export default Profile
