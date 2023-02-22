import React, { useState } from 'react'
import useGlobalStore from '@/stores/globalStore'
import { CONTRACT_ADDRESS, DONLYFANS_ABI, CREATOR_ABI } from '@/lib/consts'
import { useAccount, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import PostListing from './PostListing'
import { BigNumber, ethers } from 'ethers'
import { formatEther, getAddress, parseEther } from 'ethers/lib/utils'
import Unlocked from './Unlocked'
import { arbitrumGoerli } from 'wagmi/chains'
import toast from 'react-hot-toast'

const UserProfile = ({ creatorAddress }) => {
	const { isConnected, address } = useAccount()
	const [subscriptionPrice, setSubscriptionPrice] = useState('')
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

	const requests = useGlobalStore(state => state.requests)
	const [creator] = useGlobalStore(state => state.creators).filter(
		creator => creator.creatorAddress === creatorAddress
	)
	const price = creator?.price
	const period = creator?.period
	// console.log(price)
	// console.log('price is', price?.toNumber())
	//const price = parseInt(creator.price, 16)
	const userPosts = useGlobalStore(state => state.posts).filter(post => post.creator === creatorAddress)
	const posts = userPosts.map(post => {
		return {
			...post,
			purchased: requests.some(request => request.subscriber === address && request.cipherId.eq(post.cipherId)),
		}
	})
	const myUnlockedPosts = requests.filter(
		request => request.subscriber == address && request.creator === creatorAddress
	)

	//const userPost = posts.some(post => post.creator === creatorAddress)
	if (!isConnected) {
		return <div>Please connect your wallet</div>
	}

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
		<div>
			<p className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
				Creator Address: {creatorAddress}
			</p>
			<p className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
				Price: {price ? (BigNumber.from(0).eq(price) ? 'Free' : `${formatEther(price)} ETH`) : 'no price'} ,
				Period: {period ? formatEther(period) : 'undefined'} days
			</p>
			{!isSubscriber && (
				<>
					<div className="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
						<div className="pt-4 text-center">
							<label className="block">
								<span className="text-lg font-mono font-light dark:text-white my-4">
									Subscribe to see content!
								</span>

								<input
									required
									type="number"
									placeholder="ETH"
									className="form-input my-5 block w-full dark:bg-gray-800 dark:text-white"
									value={subscriptionPrice}
									onChange={e => setSubscriptionPrice(e.target.value)}
								/>
							</label>
						</div>
						<button
							disabled={!isConnected}
							className="font-semibold mb-2 text-sm text-white py-2 px-3 rounded-sm transition-colors bg-indigo-600 dark:bg-indigo-800 hover:bg-black dark:hover:bg-gray-50 dark:hover:text-gray-900 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-25"
							onClick={() => subscribeToCreator}
						>
							Subscribe
						</button>
					</div>
					{/* <p className="text-base font-mono font-light dark:text-gray-300 ml-2">
						Subscribe to see the content!
					</p> */}
					<div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 w-full transition-all">
						{posts.map(post => (
							<PostListing key={post.cipherId.toNumber()} {...post} />
						))}
					</div>
				</>
			)}
			{myUnlockedPosts.length > 0 ? (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 w-full transition-all">
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
	)
}

export default UserProfile
