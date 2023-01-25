import { DONLYFANS_ABI, CONTRACT_ADDRESS } from '@/lib/consts'
import { ipfsGatewayLink } from '@/lib/utils'
import useGlobalStore, { Post, Subscribe } from '@/stores/globalStore'
import { BigNumber } from 'ethers'
import { formatEther, parseEther } from 'ethers/lib/utils'
import { FC, useState } from 'react'
import toast from 'react-hot-toast'
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { arbitrumGoerli } from 'wagmi/chains'

const CreateNewProfile: FC = () => {
	const { isConnected } = useAccount()
	const [price, setPrice] = useState('')
	const [period, setPeriod] = useState('')
	const [submitting, setSubmitting] = useState(false)

	const medusa = useGlobalStore(state => state.medusa)
	//let evmPoint = null
	// if (medusa?.keypair) {
	// 	const { x, y } = medusa.keypair.pubkey.toEvm()
	// 	evmPoint = { x, y }
	// }

	const {
		config,
		error: prepareError,
		isError: isPrepareError,
		isSuccess: readyToSendTransaction,
	} = usePrepareContractWrite({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		functionName: 'createProfile',
		args: [parseEther(price || '0.00'), parseEther(period || '0.00')],
		//args: [parseEther(price || '0.00'), BigNumber.from(period || '0.00')],
		//enabled: Boolean(evmPoint),
		// overrides: { value: parseEther(price || '0.00') },
		chainId: arbitrumGoerli.id,
	})

	const { data, write: creator } = useContractWrite(config)

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash,
		onSettled(data, error) {
			const response = data ? data.logs[0] : []
			console.log('Settled', response)
		},
		onSuccess: txData => {
			setSubmitting(true)
			toast.dismiss()
			toast.success(
				<a
					href={`https://goerli.arbiscan.io/tx/${txData.transactionHash}`}
					className="inline-flex items-center text-blue-600 hover:underline"
					target="_blank"
					rel="noreferrer"
				>
					Content creator profile successfully created! View on Etherscan
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
			toast.error(`Failed to create a new profile: ${e.message}`)
		},
	})

	const createNewProfile = async () => {
		toast.loading('Creating new profile...')
		creator?.()
		console.log(data)
		console.log(creator)
	}

	return (
		<div className="p-6  max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
			<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
				{'Click here to create a new profile '}
			</h5>
			{/* <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{description}</p> */}

			<div className="pt-4 text-center">
				<label className="block">
					<span className="text-lg font-mono font-light dark:text-white my-4">Price</span>
					<input
						required
						type="number"
						placeholder="ETH"
						className="form-input my-5 block w-full dark:bg-gray-800 dark:text-white"
						value={price}
						onChange={e => setPrice(e.target.value)}
					/>
				</label>
			</div>
			<div className="pt-4 text-center">
				<label className="block">
					<span className="text-lg font-mono font-light dark:text-white my-4">Subscription Period</span>
					<input
						required
						type="number"
						placeholder="days"
						className="form-input my-5 block w-full dark:bg-gray-800 dark:text-white"
						value={period}
						onChange={e => setPeriod(e.target.value)}
					/>
				</label>
			</div>

			<button
				disabled={!isConnected || submitting} //|| profileCreated}
				className="font-semibold mb-2 text-sm text-white py-2 px-3 rounded-sm transition-colors bg-indigo-600 dark:bg-indigo-800 hover:bg-black dark:hover:bg-gray-50 dark:hover:text-gray-900 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-25"
				onClick={() => createNewProfile()}
			>
				{submitting
					? 'Profile Created'
					: isConnected
					? 'Create a profile to post original content'
					: 'Connect your wallet'}
			</button>
		</div>
	)
}

export default CreateNewProfile
