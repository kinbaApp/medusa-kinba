import { FC } from 'react'
import { useAccount, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import useGlobalStore from '@/stores/globalStore'
import { CONTRACT_ADDRESS, DONLYFANS_ABI, CREATOR_ABI } from '@/lib/consts'
import { arbitrumGoerli } from 'wagmi/chains'
import toast from 'react-hot-toast'

//type Visibility = 'always' | 'connected' | 'not_connected'

const WithdrawFund: FC = () => {
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

	const { config } = usePrepareContractWrite({
		address: creatorAddress,
		abi: CREATOR_ABI,
		functionName: 'withdrawFunds',
		//args: ['0x${creatorAddress}'],
		//args: [],
		//enabled: Boolean(evmPoint),
		//overrides: { value: parseEther(price || '0.0') },
		chainId: arbitrumGoerli.id,
	})

	const { data, write: withdraw } = useContractWrite(config)

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

	const withdrawYourFund = async () => {
		toast.loading('Withdrawing funds..')
		withdraw?.()
		console.log(config)
	}

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
			<button
				disabled={!isConnected}
				className="font-semibold mb-2 text-sm text-white py-2 px-3 rounded-sm transition-colors bg-indigo-600 dark:bg-indigo-800 hover:bg-black dark:hover:bg-gray-50 dark:hover:text-gray-900 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-25"
				onClick={() => withdrawYourFund()}
			>
				Withdraw Funds
			</button>
		</div>
	)
}

export default WithdrawFund
