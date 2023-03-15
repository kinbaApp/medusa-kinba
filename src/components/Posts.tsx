import { FC } from 'react'
import useGlobalStore from '@/stores/globalStore'
import PostListing from './PostListing'
// import { useAccount } from 'wagmi'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { DONLYFANS_ABI, CONTRACT_ADDRESS, CREATOR_ABI } from '@/lib/consts'
import { BigNumber, ethers } from 'ethers'
import { arbitrumGoerli } from 'wagmi/chains'
import { getAddress } from 'ethers/lib/utils'

const Posts: FC = creator => {
	const { address } = useAccount()
	const requests = useGlobalStore(state => state.requests)
	const posts = useGlobalStore(state => state.posts).map(post => {
		return {
			...post,
			purchased: requests.some(request => request.subscriber === address && request.cipherId.eq(post.cipherId)),
		}
	})
	console.log('posts', posts)
	//get all the creators and fetch the price
	const [creator_fetched] = useGlobalStore(state => state.creators).filter(
		creator => creator.creatorAddress === creatorAddress
	)
	const creatorAddress = creator
	const price_fetched = creator_fetched?.price

	const {
		data: creatorContractAddress,
		isError,
		isLoading,
	} = useContractRead({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		functionName: 'getCreatorContractAddress',
		args: [ethers.constants.AddressZero],
		// args: [getAddress(creatorAddress) || ethers.constants.AddressZero],
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

	const { config: configSubscribe } = usePrepareContractWrite({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		functionName: 'subscribe',
		//args: ['0x${creatorAddress}'],
		// args: [getAddress(creatorAddress || ethers.constants.AddressZero)],
		args: [getAddress(ethers.constants.AddressZero)],
		//enabled: Boolean(evmPoint),
		overrides: { value: price_fetched },
		chainId: arbitrumGoerli.id,
	})

	return (
		<>
			{/* <h1 className="text-2xl font-mono font-light dark:text-white mt-10 mb-6">
				Access Content (Susbscriber only){' '}
			</h1> */}
			{/* <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 w-full transition-all"> */}
			<div>
				<div>
					{posts.map(post => (
						<PostListing key={post.cipherId.toNumber()} {...post} />
					))}
				</div>
			</div>
		</>
	)
}

export default Posts
