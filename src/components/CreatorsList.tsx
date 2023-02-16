import { FC, useEffect } from 'react'
import useGlobalStore from '@/stores/globalStore'
import Post from './PostListing'
import { ethers } from 'ethers'
import { useAccount, useContractEvent, useContract, useProvider } from 'wagmi'
import Subscription from './Subscribe'
import CreateNewProfile from './CreateNewProfile'
import CreatorsSubscribedTo from './CreatorsSubscribedTo'
import Link from 'next/link'
import { APP_NAME, DONLYFANS_ABI, CONTRACT_ADDRESS, ORACLE_ADDRESS } from '@/lib/consts'

const CreatorsList: FC = () => {
	const { address } = useAccount()
	const provider = useProvider()
	const updateCreators = useGlobalStore(state => state.updateCreators)
	const addCreator = useGlobalStore(state => state.addCreator)

	const donlyFans = useContract({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		signerOrProvider: provider,
	})

	useContractEvent({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		eventName: 'NewCreatorProfileCreated',
		listener(creatorAddress, creatorContractAddress, price, period) {
			if (creatorAddress == address) {
				addCreator({ creatorAddress, price, period })
			}
		},
	})
	useEffect(() => {
		const getEvents = async () => {
			const iface = new ethers.utils.Interface(DONLYFANS_ABI)
			const creatorsListFilter = donlyFans.filters.NewCreatorProfileCreated()
			const newCreatorsProfile = await donlyFans.queryFilter(creatorsListFilter)

			if (iface && newCreatorsProfile) {
				const creators = newCreatorsProfile.reverse().map((filterTopic: any) => {
					const result = iface.parseLog(filterTopic)
					const { creatorAddress, price, period } = result.args
					return { creatorAddress, price, period } as Creator
				})
				updateCreators(creators)
			}
		}
		getEvents()
	}, [address])

	const creators = useGlobalStore(state => state.creators)
	//const listOfCreators = creators.filter(creator => creator.)
	const uniqueCreators = Array.from(new Set(creators))
	const listCreators = uniqueCreators.map(creator => (
		//<CreatorsSubscribedTo key={creator.toString()} {...creator} />

		<li key={creator.creatorAddress}>{creator.creatorAddress.toString()}</li>
	))

	return (
		<>
			<h1 className="text-2xl font-mono font-light dark:text-white mt-10 mb-6">List of creators</h1>

			{creators.map(creator => (
				<li key={creator.creatorAddress}>
					<Link href={`user-profile/${creator?.creatorAddress.toString()}`}>
						{creator.creatorAddress.toString()}
					</Link>
				</li>
			))}
		</>
	)
}

export default CreatorsList
