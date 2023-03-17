import React, { useState } from 'react'
import { APP_NAME, CONTRACT_ADDRESS, DONLYFANS_ABI, CREATOR_ABI } from '@/lib/consts'
import styles from '../../../styles/reusable/Ad.module.scss'
import PinkButton from './PinkButton'
import fonts from '../../../styles/Fonts.module.scss'
import Modal from 'react-modal'
import SubscribeToCreatorPopUp from '../SubscribeToCreatorPopUp'
import { useAccount, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { BigNumber, ethers } from 'ethers'
import { formatEther, getAddress, parseEther } from 'ethers/lib/utils'
import { arbitrumGoerli } from 'wagmi/chains'
import toast from 'react-hot-toast'

const Ad = ({ creatorAddress, image, price, period }) => {
	// This entire component can be turned into a reusable
	// component that each user can have displayed on their page.
	// Made it veryyy minimal for now
	const [isOpen, setIsOpen] = useState(false)
	const [subscriptionPrice, setSubscriptionPrice] = useState('')

	const { isConnected } = useAccount()
	const customStyles = {
		overlay: {
			backgroundColor: 'rgba(0, 0, 0, 0.6)',
		},
		content: {
			top: '50%',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-50%',
			transform: 'translate(-50%, -50%)',
		},
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
		if (parseEther(subscriptionPrice) < price) {
			console.log('not enough eth')
			toast.dismiss()
			toast.error(`Subscription price is ${formatEther(price)} ETH`)
		} else {
			toast.loading('Subscribing..')
			subscribe?.()
			console.log(configSubscribe)
		}
	}

	return (
		<div className={styles.container}>
			<div className={`${styles.title} ${fonts.bold}`}>SUBSCRIPTION</div>
			<div className={`${styles.offer} ${fonts.bold}`}>Limited time offer: -80% for the first month!</div>
			<div className={styles.imageandoffer}>
				<div className={styles.smallpinkring}>
					<div className={styles.smallpurplering}>
						<img src={image} alt="" className={styles.smallpfp} />
					</div>
				</div>
				<div className={`${styles.offerDetails} ${fonts.lightText}`}>
					Only {price} ETH - Limited Time Only - <br />
					Exclusive Content
				</div>
			</div>

			<button onClick={() => setIsOpen(true)}>
				<PinkButton text={'SUBSCRIBE'} />
			</button>
			<Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} style={customStyles}>
				<div className="p-6 max-w-sm bg-white rounded-lg border border-purple-200 shadow-md ">
					<div className="pt-4 text-center">
						<label className="block">
							<span className="text-lg font-mono font-light  my-4 text-purple-600">
								Subscribe to see content!
							</span>

							<input
								required
								type="number"
								placeholder="ETH"
								className="form-input my-5 block w-full "
								value={subscriptionPrice}
								onChange={e => setSubscriptionPrice(e.target.value)}
							/>
						</label>
					</div>
					<button
						disabled={!isConnected}
						className="font-semibold mb-2 text-sm text-white py-2 px-3 rounded-sm transition-colors bg-indigo-600 dark:bg-indigo-800 hover:bg-black dark:hover:bg-gray-50 dark:hover:text-gray-900 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-25"
						onClick={() => subscribeToCreator()}
					>
						Subscribe
					</button>
				</div>
			</Modal>

			<div className={styles.bottomDetails}>
				<p className={`${styles.bottomPrice} ${fonts.lightText}`}>
					{price} ETH for {period} days
				</p>
				<p className={`${styles.date} ${fonts.lightText}`}>February 24th 2023</p>
			</div>
		</div>
	)
}

export default Ad
