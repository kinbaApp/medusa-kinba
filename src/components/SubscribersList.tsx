import { FC } from 'react'
import { useAccount, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import useGlobalStore from '@/stores/globalStore'
import { CONTRACT_ADDRESS, DONLYFANS_ABI, CREATOR_ABI } from '@/lib/consts'
import { arbitrumGoerli } from 'wagmi/chains'
import toast from 'react-hot-toast'

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

	//if ((show == 'connected' && !isConnected) || (show == 'not_connected' && isConnected)) return null

	return (
		<div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-800 sm:items-center py-4 sm:pt-0">
			{/* <button
				disabled={!isConnected}
				className="font-semibold mb-2 text-sm text-white py-2 px-3 rounded-sm transition-colors bg-indigo-600 dark:bg-indigo-800 hover:bg-black dark:hover:bg-gray-50 dark:hover:text-gray-900 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-25"
				onClick={() => subscribeToCreator()}
			>
				{subscribed ? 'Subscribed' : isConnected ? 'Subscribe to unlock content' : 'Connect your wallet'}
			</button> */}
			<div>{listOfFollowers}</div>
		</div>
	)
}

export default SubscribersList
