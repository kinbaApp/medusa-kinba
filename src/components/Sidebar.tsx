import React from 'react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import styles from '../../styles/Sidebar.module.scss'
import { VscHome } from 'react-icons/vsc'
import { BsBell } from 'react-icons/bs'
import { BiMessageSquareDetail } from 'react-icons/bi'
import { FiBookmark } from 'react-icons/fi'
import { MdFormatListBulleted } from 'react-icons/md'
import { BsPersonHeart } from 'react-icons/bs'
import { IoPersonCircleSharp } from 'react-icons/io5'
import { CiCircleMore } from 'react-icons/ci'
import Image from 'next/image'

const Sidebar = () => {
	const { address, isConnected } = useAccount()
	return (
		<div className={styles.outerContainer}>
			<div className={styles.logo}>
				<Image src="/Login/logo.png" alt="" height={70} width={130} />
			</div>
			<div className={styles.container}>
				<div className={styles.feed}>
					<Link href="/feed">
						<a>
							<VscHome size="20px" />
						</a>
					</Link>
				</div>
				<div className={styles.feed}>
					<Link href="/">
						<a>
							<BsBell size="20px" />
						</a>
					</Link>
				</div>
				<div className={styles.feed}>
					<Link href="/">
						<a>
							<BiMessageSquareDetail size="20px" />
						</a>
					</Link>
				</div>
				<div className={styles.feed}>
					<Link href="/newPost">
						<a>
							<FiBookmark size="20px" />
						</a>
					</Link>
				</div>
				<div className={styles.feed}>
					<Link href="/discover">
						<a>
							<MdFormatListBulleted size="20px" />
						</a>
					</Link>
				</div>
				<div className={styles.feed}>
					<Link href="/">
						<a>
							<BsPersonHeart size="20px" />
						</a>
					</Link>
				</div>
				<div className={styles.feed}>
					<Link href="/profile">
						<a>
							<IoPersonCircleSharp size="20px" />
						</a>
					</Link>
				</div>
				<div className={styles.feed}>
					<Link href="/">
						<a>
							<CiCircleMore size="20px" />
						</a>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Sidebar
