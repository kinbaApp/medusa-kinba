import React, { useEffect } from 'react'
import { ethers } from 'ethers'
import Link from 'next/link'
import { useAccount, useContractRead, useContract, useContractEvent, useProvider } from 'wagmi'
import { APP_NAME, DONLYFANS_ABI, CONTRACT_ADDRESS, ORACLE_ADDRESS } from '@/lib/consts'
import styles from '../../styles/Sidebar.module.scss'
import { VscHome } from 'react-icons/vsc'
import { BsBell } from 'react-icons/bs'
import { BiMessageSquareDetail } from 'react-icons/bi'
import { FiBookmark } from 'react-icons/fi'
import { MdFormatListBulleted } from 'react-icons/md'
import { BsPersonHeart } from 'react-icons/bs'
import { IoPersonCircleSharp } from 'react-icons/io5'
import { CiCircleMore } from 'react-icons/ci'
import { AiOutlinePlus } from 'react-icons/ai'
import Image from 'next/image'
import fonts from '../../styles/Fonts.module.scss'
import { arbitrumGoerli } from 'wagmi/chains'
import { constants } from 'ethers'
import useGlobalStore from '@/stores/globalStore'

const Sidebar = () => {
	const provider = useProvider()
	const { address, isConnected } = useAccount()
	// const {
	// 	data: creatorContractAddress,
	// 	isError,
	// 	isLoading,
	// } = useContractRead({
	// 	address: CONTRACT_ADDRESS,
	// 	abi: DONLYFANS_ABI,
	// 	functionName: 'getCreatorContractAddress',
	// 	args: [address],
	// 	chainId: arbitrumGoerli.id,
	// 	onSuccess(data) {
	// 		console.log('Success', creatorContractAddress)
	// 	},
	// })

	//const isCreator = creatorContractAddress !== constants.AddressZero

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
	const isCreator = creators.some(item => address === item.creatorAddress)

	return (
		<div className={styles.outerContainer}>
			<div className={styles.logo}>
				<Image src="/Login/logo.png" alt="" height={85} width={150} />
			</div>
			<div className={styles.container}>
				<div className={styles.feed}>
					<Link href="/feed">
						<a>
							<VscHome size="25px" color={'white'} />
						</a>
					</Link>
					<Link href="/feed">
						<a>
							<p className={`${styles.navText} ${fonts.bodyText}`}>Home</p>
						</a>
					</Link>
				</div>
				<div className={styles.feed}>
					<Link href="/">
						<a>
							<BsBell size="25px" color={'white'} />
						</a>
					</Link>
					<Link href="/">
						<a>
							<p className={`${styles.navText} ${fonts.bodyText}`}>Notifications</p>
						</a>
					</Link>
				</div>
				<div className={styles.feed}>
					<Link href="/">
						<a>
							<BiMessageSquareDetail size="25px" color={'white'} />
						</a>
					</Link>
					<Link href="/">
						<a>
							<p className={`${styles.navText} ${fonts.bodyText}`}>Messages</p>
						</a>
					</Link>
				</div>

				<div className={styles.feed}>
					<Link href="/newPost">
						<a>
							<AiOutlinePlus size="25px" color={'white'} />
						</a>
					</Link>
					<Link href="/newPost">
						<a>
							<p className={`${styles.navText} ${fonts.bodyText}`}>New Post</p>
						</a>
					</Link>
				</div>

				<div className={styles.feed}>
					<Link href="/">
						<a>
							<FiBookmark size="25px" color={'white'} />
						</a>
					</Link>
					<Link href="/">
						<a>
							<p className={`${styles.navText} ${fonts.bodyText}`}>Bookmarks</p>
						</a>
					</Link>
				</div>
				<div className={styles.feed}>
					<Link href="/discover">
						<a>
							<MdFormatListBulleted size="25px" color={'white'} />
						</a>
					</Link>
					<Link href="/discover">
						<a>
							<p className={`${styles.navText} ${fonts.bodyText}`}>Discover</p>
						</a>
					</Link>
				</div>
				<div className={styles.feed}>
					<Link href="/">
						<a>
							<BsPersonHeart size="25px" color={'white'} />
						</a>
					</Link>
					<Link href="/listOfSubscriptions">
						<a>
							<p className={`${styles.navText} ${fonts.bodyText}`}>Subscriptions</p>
						</a>
					</Link>
				</div>
				<div className={styles.feed}>
					{isCreator && address ? (
						<>
							<Link href={`/user-profile/${address.toString()}`}>
								<a>
									<IoPersonCircleSharp size="25px" color={'white'} />
								</a>
							</Link>
							<Link href={`/user-profile/${address.toString()}`}>
								<a>
									<p className={`${styles.navText} ${fonts.bodyText}`}>My Profile</p>
								</a>
							</Link>
						</>
					) : (
						<>
							{' '}
							<Link href="/newProfile">
								<a>
									<IoPersonCircleSharp size="25px" color={'white'} />
								</a>
							</Link>
							<Link href="/newProfile">
								<a>
									<p className={`${styles.navText} ${fonts.bodyText}`}>My Profile</p>
								</a>
							</Link>
						</>
					)}
				</div>
				<div className={styles.feed}>
					<Link href="/">
						<a>
							<CiCircleMore size="25px" color={'white'} />
						</a>
					</Link>
					<Link href="/">
						<a>
							<p className={`${styles.navText} ${fonts.bodyText}`}>More</p>
						</a>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Sidebar
