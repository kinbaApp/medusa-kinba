import { DONLYFANS_ABI, CONTRACT_ADDRESS } from '@/lib/consts'
import { ipfsGatewayLink } from '@/lib/utils'
import useGlobalStore, { Post, Subscribe, Creator } from '@/stores/globalStore'
import { BigNumber } from 'ethers'
import { formatEther, parseEther } from 'ethers/lib/utils'
import { FC, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'
import {
	useAccount,
	useProvider,
	useContract,
	useContractWrite,
	usePrepareContractWrite,
	useWaitForTransaction,
	useContractEvent,
} from 'wagmi'
import { arbitrumGoerli } from 'wagmi/chains'
import { useSigner } from 'wagmi'
import styles from '../../styles/SubscribersList.module.scss'
import fonts from '../../styles/Fonts.module.scss'

const CreatorsSubscribedTo: FC<Creator> = ({ creatorAddress }) => {
	const { isConnected, address } = useAccount()
	const provider = useProvider()
	const [price, setPrice] = useState('')
	//const [creatorAddress, setCreatorAddress] = useState('')

	const addSubscriber = useGlobalStore(state => state.addSubscriber)
	const updateSubscribe = useGlobalStore(state => state.updateSubscribe)
	useContractEvent({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		eventName: 'NewSubscriber',
		listener(creator, subscriber, price) {
			if (subscriber == address) {
				addSubscriber({ creator, subscriber, price })
			}
		},
	})
	const donlyFans = useContract({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		signerOrProvider: provider,
	})
	useEffect(() => {
		const getEvents = async () => {
			const iface = new ethers.utils.Interface(DONLYFANS_ABI)

			const newPostFilter = donlyFans.filters.NewSubscriber(address)

			const newSubscribers = await donlyFans.queryFilter(newSubscriber)

			if (iface && newSubscribers) {
				const subscribers = newSubscribers.reverse().map((filterTopic: any) => {
					const result = iface.parseLog(filterTopic)
					const { subscriber, creator, price } = result.args
					return { subscriber, creator, price } as Post
				})
				updateSubscribe(subscribers)
			}
		}
		getEvents()
	}, [address])

	const subscribers = useGlobalStore(state => state.subscribers)

	const creatorsSubscribedTo = subscribers.filter(subscribe => subscribe.subscriber === address)
	console.log(creatorsSubscribedTo)
	const listCreators = creatorsSubscribedTo.map(subscribe => (
		//<CreatorsSubscribedTo key={creator.toString()} {...creator} />

		<li key={subscribe.creator}>{subscribe.creator.toString()}</li>
	))
	return (
		<div className={styles.followersContainer}>
			{creatorsSubscribedTo &&
				creatorsSubscribedTo?.map(subscribe => (
					<div className={styles.listItem} key={subscribe.creator.toString()}>
						{subscribe.creator}
					</div>
				))}
		</div>
	)
}

export default CreatorsSubscribedTo
