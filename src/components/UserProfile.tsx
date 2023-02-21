import React from 'react'
import useGlobalStore from '@/stores/globalStore'
import { CONTRACT_ADDRESS, DONLYFANS_ABI, CREATOR_ABI } from '@/lib/consts'
import { useAccount, useContractRead } from 'wagmi'
import PostListing from './PostListing'
import { formatEther } from 'ethers/lib/utils'
import { BigNumber } from 'ethers'
import Unlocked from './Unlocked'
import { arbitrumGoerli } from 'wagmi/chains'

const UserProfile = ({ creatorAddress }) => {
	const { isConnected, address } = useAccount()
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

	return (
		<div>
			<p className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
				Creator Address: {creatorAddress}
			</p>
			<p className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
				Price: {price ? (BigNumber.from(0).eq(price) ? 'Free' : `${formatEther(price)} ETH`) : 'no price'} ,
				Period: {formatEther(period)} days
			</p>
			{!isSubscriber && (
				<p className="text-base font-mono font-light dark:text-gray-300 ml-2">Subscribe to see the content!</p>
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
