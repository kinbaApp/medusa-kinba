import { FC } from 'react'
import { useAccount, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import useGlobalStore from '@/stores/globalStore'
import { CONTRACT_ADDRESS, DONLYFANS_ABI, CREATOR_ABI } from '@/lib/consts'
import { arbitrumGoerli } from 'wagmi/chains'
import toast from 'react-hot-toast'
import styles from '../../styles/SubscribersList.module.scss'
import fonts from '../../styles/Fonts.module.scss'
import { BsSearch } from 'react-icons/bs'
import { BsFilterLeft } from 'react-icons/bs'
import { BsSortAlphaDown } from 'react-icons/bs'
//type Visibility = 'always' | 'connected' | 'not_connected'

const SubscribersList: FC = () => {
	const { isConnected } = useAccount()
	const { address } = useAccount()
	const creators = useGlobalStore(state => state.creators)

	const {
		data: creatorAddress,
		isError,
		isLoading,
	} = useContractRead({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		functionName: 'getCreatorContractAddress',
		args: [address],
		chainId: arbitrumGoerli.id,
		onSuccess(data) {
			console.log('Success', creatorAddress)
		},
	})
	const {
		data: listOfFollowers,
		isError: isErrorGetFoller,
		isLoading: isLoadingGetFoller,
	} = useContractRead({
		address: creatorAddress,
		abi: CREATOR_ABI,
		functionName: 'getSubscribers',
		//args: [],
		chainId: arbitrumGoerli.id,
	})

	console.log(listOfFollowers)

	//if ((show == 'connected' && !isConnected) || (show == 'not_connected' && isConnected)) return null

	return (
		// <div className=" bg-gray-100 dark:bg-gray-800  py-4 sm:pt-0">
		// 	{/* <button
		// 		disabled={!isConnected}
		// 		className="font-semibold mb-2 text-sm text-white py-2 px-3 rounded-sm transition-colors bg-indigo-600 dark:bg-indigo-800 hover:bg-black dark:hover:bg-gray-50 dark:hover:text-gray-900 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-25"
		// 		onClick={() => subscribeToCreator()}
		// 	>
		// 		{subscribed ? 'Subscribed' : isConnected ? 'Subscribe to unlock content' : 'Connect your wallet'}
		// 	</button> */}
		// 	<h1 className="text-2xl font-mono font-light dark:text-white mt-10 mb-6">List of subscribers</h1>
		// 	<p className="relative flex justify-center ">{listOfFollowers}</p>
		// </div>
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>Subscribers</h1>
			</div>
			<div className={styles.activityContainer}>
				<div className={styles.topHalf}>
					<div>
						<p className={`${styles.activeText}${fonts.bodyText}`}>LAST ACTIVITY</p>
					</div>
					<div className={styles.iconsContainer}>
						<BsSearch size="20px" />
						<BsFilterLeft size="20px" />
						<BsSortAlphaDown size="20px" />
					</div>
				</div>
				<div className={styles.bottomHalf}>
					<div className={styles.all}>All </div>
					<div className={styles.active}>Active</div>
					<div className={styles.expired}>Expired</div>
					<div className={styles.attreq}>Attention required</div>
				</div>
			</div>
			<div className={styles.followersContainer}>
				{listOfFollowers &&
					listOfFollowers?.map(follower => (
						<div className={styles.listItem} key={follower}>
							{follower}
						</div>
					))}
			</div>
			{/* <div className={styles.content}>{listOfFollowers}</div> */}
		</div>
	)
}

export default SubscribersList
