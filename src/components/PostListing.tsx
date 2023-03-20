import { DONLYFANS_ABI, CONTRACT_ADDRESS, CREATOR_ABI } from '@/lib/consts'
import { ipfsGatewayLink } from '@/lib/utils'
import useGlobalStore, { Post } from '@/stores/globalStore'
import { BigNumber, ethers } from 'ethers'
import { formatEther, getAddress, parseEther } from 'ethers/lib/utils'
import { FC } from 'react'
import toast from 'react-hot-toast'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { arbitrumGoerli } from 'wagmi/chains'
import Link from 'next/link'
import styles from '../../styles/PostListing.module.scss'
import { MdOutlineMoreHoriz } from 'react-icons/md'
import fonts from '../../styles/Fonts.module.scss'
import { AiOutlineHeart } from 'react-icons/ai'
import { TbMessageCircle2 } from 'react-icons/tb'
import { CiDollar } from 'react-icons/ci'
import { BsBookmark } from 'react-icons/bs'
const PostListing: FC<Post & { purchased: boolean }> = ({ creator, cipherId, uri, name, description, purchased }) => {
	const { isConnected, address } = useAccount()
	//const isSubscriber = true
	const creatorAddress = creator

	//get all the creators and fetch the price
	const [creator_fetched] = useGlobalStore(state => state.creators).filter(
		creator => creator.creatorAddress === creatorAddress
	)
	const price_fetched = creator_fetched?.price

	const {
		data: creatorContractAddress,
		isError,
		isLoading,
	} = useContractRead({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		functionName: 'getCreatorContractAddress',
		args: [getAddress(creatorAddress) || ethers.constants.AddressZero],
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

	const medusa = useGlobalStore(state => state.medusa)
	let evmPoint = null
	if (medusa?.keypair) {
		const { x, y } = medusa.keypair.pubkey.toEvm()
		evmPoint = { x, y }
	}

	const { config } = usePrepareContractWrite({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		functionName: 'requestPost',
		args: [cipherId, evmPoint],
		enabled: Boolean(evmPoint),
		// overrides: { value: price },
		chainId: arbitrumGoerli.id,
	})

	const { data, write: requestPost } = useContractWrite(config)

	useWaitForTransaction({
		hash: data?.hash,
		onSuccess: txData => {
			toast.dismiss()
			toast.success(
				<a
					href={`https://goerli.arbiscan.io/tx/${txData.transactionHash}`}
					className="inline-flex items-center text-blue-600 hover:underline"
					target="_blank"
					rel="noreferrer"
				>
					Post successfully unlocked with Medusa! View on Etherscan
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
		},
		onError: e => {
			toast.dismiss()
			toast.error(`Failed to unlock secret: ${e.message}`)
		},
	})

	const unlockSecret = async () => {
		toast.loading('Unlocking secret...')
		requestPost?.()
		console.log(requestPost)
		event.preventDefault()
	}

	const { config: configSubscribe } = usePrepareContractWrite({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		functionName: 'subscribe',
		//args: ['0x${creatorAddress}'],
		args: [getAddress(creatorAddress || ethers.constants.AddressZero)],
		//enabled: Boolean(evmPoint),
		overrides: { value: price_fetched },
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
			//setSubscribed(true)
		},
		onError: e => {
			toast.dismiss()
			toast.error(`Failed to subscribe: ${e.message}`)
		},
	})

	const subscribeToCreator = async () => {
		toast.loading('Subscribing..')
		subscribe?.()
		console.log(configSubscribe)
	}

	return (
		<>
			<div className={styles.container}>
				<div className={styles.postHeader}>
					<img src="/Profile/girl.png" alt="" className={styles.pfp} />
					<div className={styles.nameAndDate}>
						<div className={styles.nameAndUsername}>
							<p>Name of Poster</p>
							<p>@username</p>
						</div>
						<div className={styles.dateAndMore}>
							<p className={`${fonts.lightText} ${styles.datePosted}`}>Yesterday</p>
							<MdOutlineMoreHoriz size={'25px'} color="gray" />
						</div>
					</div>
					<div className={styles.postCaption}>
						<div className={styles.description}>{description}</div>
						<div>
							{isSubscriber ? (
								<button
									disabled={!isConnected || purchased}
									className="font-semibold mb-2 text-sm text-white py-2 px-3 rounded-sm transition-colors bg-indigo-600 dark:bg-indigo-800 hover:bg-black dark:hover:bg-gray-50 dark:hover:text-gray-900 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-25"
									onClick={() => unlockSecret()}
								>
									{purchased ? 'Purchased' : isConnected ? 'Access Post' : 'Connect your wallet'}
								</button>
							) : (
								<Link href={`user-profile/${creatorAddress.toString()}`}>
									<a
										className="font-semibold mb-2 text-sm text-white py-2 px-3 rounded-sm transition-colors bg-indigo-600 dark:bg-indigo-800 hover:bg-black dark:hover:bg-gray-50 dark:hover:text-gray-900 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-25
"
									>
										Subscribe
									</a>
								</Link>
							)}
						</div>
					</div>
				</div>
				<div className={styles.imageContainer}>
					{/* I think the name should be the image? not too sure  */}
					<div>
						<img src={uri} alt="" className={styles.image} />
					</div>

					<div className={styles.ipfs}>
						<a
							href={ipfsGatewayLink(uri)}
							target="_blank"
							className="inline-flex items-center text-blue-600 hover:underline"
							rel="noreferrer"
						>
							View on IPFS
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
					</div>
					<div className={styles.iconsContainer}>
						<div className={styles.left}>
							<div className={styles.top}>
								<AiOutlineHeart size={'25px'} color="gray" />
								<TbMessageCircle2 size={'25px'} color="gray" />
								<div className={styles.tip}>
									<CiDollar size={'25px'} color="gray" />
									<p className={`${fonts.lightText} ${styles.tipText}`}>SEND TIP</p>
								</div>
							</div>
							<div className={styles.postLikeCount}>
								<p>139 Likes</p>
							</div>
						</div>
						<div className={styles.right}>
							<BsBookmark size={'25px'} color="gray" />
						</div>
					</div>
				</div>
			</div>

			{/* <div className="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
				<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
					{name}
				</h5>
				<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{description}</p>

				{isSubscriber ? (
					<button
						disabled={!isConnected || purchased}
						className="font-semibold mb-2 text-sm text-white py-2 px-3 rounded-sm transition-colors bg-indigo-600 dark:bg-indigo-800 hover:bg-black dark:hover:bg-gray-50 dark:hover:text-gray-900 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-25"
						onClick={() => unlockSecret()}
					>
						{purchased ? 'Purchased' : isConnected ? 'Access Post' : 'Connect your wallet'}
					</button>
				) : (
					<Link href={`user-profile/${creatorAddress.toString()}`}>
						<a
							className="font-semibold mb-2 text-sm text-white py-2 px-3 rounded-sm transition-colors bg-indigo-600 dark:bg-indigo-800 hover:bg-black dark:hover:bg-gray-50 dark:hover:text-gray-900 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-25
"
						>
							Subscribe
						</a>
					</Link>
				)}

				<div>
					<a
						href={ipfsGatewayLink(uri)}
						target="_blank"
						className="inline-flex items-center text-blue-600 hover:underline"
						rel="noreferrer"
					>
						View on IPFS
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
				</div>
			</div> */}
		</>
	)
}

export default PostListing
