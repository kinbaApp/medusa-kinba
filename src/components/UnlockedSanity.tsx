/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useState } from 'react'
import Image from 'next/image'
import useGlobalStore, { Request } from '@/stores/globalStore'
import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { Base64 } from 'js-base64'
import { ipfsGatewayLink } from '@/lib/utils'
import { useSigner } from 'wagmi'
import { MdOutlineMoreHoriz } from 'react-icons/md'
import styles from '../../styles/Unlocked.module.scss'
import fonts from '../../styles/Fonts.module.scss'
import { AiOutlineHeart } from 'react-icons/ai'
import { TbMessageCircle2 } from 'react-icons/tb'
import { CiDollar } from 'react-icons/ci'
import { BsBookmark } from 'react-icons/bs'
import { client, urlFor } from '@/lib/sanityClient'
import { postDetailQuery } from '@/lib/utils'
const UnlockedSanity = ({ post }) => {
	const postId = post._id
	const [downloadLink, setDownloadLink] = useState('')
	const [postDetail, setPostDetail] = useState(null)

	const isFile = (data: string) => {
		return data.startsWith('data:')
	}

	const isImage = (data: string): Boolean => {
		return data.startsWith('data:image')
	}
	const fetchPinDetails = () => {
		const query = postDetailQuery(postId)

		if (query) {
			client.fetch(`${query}`).then(data => {
				setPostDetail(data[0])
				console.log('data', data[1])
			})
		}
	}

	useEffect(() => {
		fetchPinDetails()
	}, [postId])

	return (
		<div className={styles.container}>
			<div className={styles.postHeader}>
				<img src="/Profile/girl.png" alt="" className={styles.pfp} />
				<div className={styles.nameAndDate}>
					<div className={styles.nameAndUsername}>
						<p>Name of Poster</p>
						<p>@username</p>
					</div>
					<div className={styles.dateAndMore}>
						<p className={`${fonts.lightText} ${styles.datePosted}`}>Yesterday</p>
						<MdOutlineMoreHoriz size={'25px'} color="gray" />
					</div>
				</div>
				<div className={styles.postCaption}>
					<div className={styles.description}>{postDetail.caption}</div>
					<div className={postDetail?.image ? styles.imageContainer : styles.captionContainer}>
						{/* <p className="mb-3">{BigNumber.from(0).eq(post.price) ? 'Free' : `${formatEther(post.price)} ETH`} </p> */}

						<div className={styles.imgBorder}>
							{postDetail?.image ? (
								<img
									src={postDetail?.image && urlFor(postDetail.image).url()}
									className={styles.image}
									alt="Decrypted image"
								/>
							) : (
								<span></span>
							)}
						</div>

						{/* <div className={styles.downloadLinks}>
							<a
								href={downloadLink}
								download={post.name}
								className="inline-flex items-center text-blue-600 hover:underline"
							>
								Download
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

							<a
								href={ipfsGatewayLink(post.uri)}
								target="_blank"
								className="inline-flex items-center text-blue-600 hover:underline"
								rel="noreferrer"
							>
								View Encrypted on IPFS
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
				</div>
				<div className={styles.iconsContainer}>
					<div className={styles.left}>
						<div className={styles.top}>
							<AiOutlineHeart size={'25px'} color="gray" />
							<TbMessageCircle2 size={'25px'} color="gray" />
							<div className={styles.tip}>
								<CiDollar size={'25px'} color="gray" />
								<p className={`${fonts.lightText} ${styles.tipText}`}>SEND TIP</p>
							</div>
						</div>
						<div className={styles.postLikeCount}>
							<p>139 Likes</p>
						</div>
					</div>
					<div className={styles.right}>
						<BsBookmark size={'25px'} color="gray" />
					</div>
				</div>
			</div>
		</div>
	)
}

export default UnlockedSanity
