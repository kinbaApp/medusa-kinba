import { DONLYFANS_ABI, CONTRACT_ADDRESS } from '@/lib/consts'
import { ipfsGatewayLink } from '@/lib/utils'
import useGlobalStore, { Post, Subscribe } from '@/stores/globalStore'
import { BigNumber, ethers } from 'ethers'
import { formatEther, getAddress, parseEther } from 'ethers/lib/utils'
import { FC, useState } from 'react'
import toast from 'react-hot-toast'
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { arbitrumGoerli } from 'wagmi/chains'
import styles from '../../styles/NewPost.module.scss'
import fonts from '../../styles/Fonts.module.scss'

const Subscription: FC = () => {
	const { isConnected } = useAccount()
	const [price, setPrice] = useState('')
	const [creatorAddress, setCreatorAddress] = useState('')
	const [subscribed, setSubscribed] = useState(false)

	const medusa = useGlobalStore(state => state.medusa)
	//let evmPoint = null
	// if (medusa?.keypair) {
	// 	const { x, y } = medusa.keypair.pubkey.toEvm()
	// 	evmPoint = { x, y }
	// }

	const { config } = usePrepareContractWrite({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		functionName: 'subscribe',
		//args: ['0x${creatorAddress}'],
		args: [getAddress(creatorAddress || ethers.constants.AddressZero)],
		//enabled: Boolean(evmPoint),
		overrides: { value: parseEther(price || '0.0') },
		chainId: arbitrumGoerli.id,
	})

	const { data, write: subscribe } = useContractWrite(config)

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

	const subscribeToCreator = async () => {
		toast.loading('Subscribing..')
		subscribe?.()
		console.log(config)
	}

	return (
		<div className="lg:w lg:mx-auto pt-8">
			<h5 className={`${styles.NewPost} ${fonts.bold}`}>{'Subscribe to creator: '}</h5>

			<div className="pt-4 text-center">
				<label className="block">
					<span className={`${styles.caption} ${fonts.bold}`}>Creator Address</span>
					<input
						required
						type="string"
						placeholder="0x00..."
						className={styles.titletextArea}
						value={creatorAddress}
						onChange={e => setCreatorAddress(e.target.value)}
					/>
				</label>
			</div>
			<div className="pt-4 text-center">
				<label className="block">
					<span className={`${styles.caption} ${fonts.bold}`}>Price</span>
					<input
						required
						type="number"
						placeholder="ETH"
						className={styles.titletextArea}
						value={price}
						onChange={e => setPrice(e.target.value)}
					/>
				</label>
			</div>
			<div className="text-center w-full pt-4">
				<button
					disabled={!isConnected || subscribed}
					className={styles.submitButton}
					onClick={() => subscribeToCreator()}
				>
					{subscribed ? 'Subscribed' : isConnected ? 'Subscribe to unlock content' : 'Connect your wallet'}
				</button>
			</div>
			{/* <div>
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
			</div> */}
		</div>
	)
}

export default Subscription
