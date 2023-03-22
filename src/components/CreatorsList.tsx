import { FC, useEffect, useRef } from 'react'
import useGlobalStore from '@/stores/globalStore'
import Post from './PostListing'
import { ethers } from 'ethers'
import { useAccount, useContractEvent, useContract, useProvider } from 'wagmi'
import Subscription from './Subscribe'
import CreateNewProfile from './CreateNewProfile'
import CreatorsSubscribedTo from './CreatorsSubscribedTo'
import Link from 'next/link'
import { APP_NAME, DONLYFANS_ABI, CONTRACT_ADDRESS, ORACLE_ADDRESS } from '@/lib/consts'
import styles from '../../styles/NewPost.module.scss'
import fonts from '../../styles/Fonts.module.scss'
import Suggestion from './reusable/Suggestion'

const CreatorsList: FC = () => {
	const { address } = useAccount()
	const provider = useProvider()
	const myRef = useRef(null)
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
			//if (creatorAddress == address) {
			console.log('creator found', creatorAddress)
			addCreator({ creatorAddress, price, period })
			//}
		},
	})
	useEffect(() => {
		const getEvents = async () => {
			const iface = new ethers.utils.Interface(DONLYFANS_ABI)
			const creatorsListFilter = donlyFans.filters.NewCreatorProfileCreated()
			const newCreatorsProfile = await donlyFans.queryFilter(creatorsListFilter)
			console.log(newCreatorsProfile)

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
			<h1 className={`${styles.NewPost} ${fonts.bold}`}>List of creators</h1>
			<div style={{ overflow: 'auto' }}>
				{creators.map(creator => (
					<ul className="list-none hover:list-inside">
						<li key={creator.creatorAddress}>
							<Link href={`user-profile/${creator?.creatorAddress.toString()}`}>
								{/* {creator.creatorAddress.toString()} */}

								<a className=" px-1">
									<Suggestion
										pfp={'/Profile/girl.png'}
										username={creator.creatorAddress.toString()}
										banner="Profile/layingdown.png"
										name={'LovelyLayla'}
									/>
								</a>
							</Link>
						</li>
					</ul>
				))}
			</div>
		</>
	)
}

export default CreatorsList
