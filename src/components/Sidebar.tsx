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
import { AiOutlinePlus } from 'react-icons/ai'
import Image from 'next/image'
import fonts from '../../styles/Fonts.module.scss'

const Sidebar = ({ resolvedTheme }) => {
	const { address, isConnected } = useAccount()
	return (
		<div className={styles.outerContainer}>
			<div className={styles.logo}>
				<Image src="/Login/logo.png" alt="" height={85} width={150} />
			</div>
			<div className={styles.container}>
				<div className={styles.feed}>
					<Link href="/feed">
						<a>
							<VscHome size="25px" color={resolvedTheme === 'light' ? 'black' : 'white'} />
						</a>
					</Link>
					<Link href="/feed">
						<a>
							<p className={`${styles.navText} ${fonts.lightText}`}>Home</p>
						</a>
					</Link>
				</div>
				<div className={styles.feed}>
					<Link href="/">
						<a>
							<BsBell size="25px" color={resolvedTheme === 'light' ? 'black' : 'white'} />
						</a>
					</Link>
					<Link href="/">
						<a>
							<p className={`${styles.navText} ${fonts.lightText}`}>Notifications</p>
						</a>
					</Link>
				</div>
				<div className={styles.feed}>
					<Link href="/">
						<a>
							<BiMessageSquareDetail size="25px" color={resolvedTheme === 'light' ? 'black' : 'white'} />
						</a>
					</Link>
					<Link href="/">
						<a>
							<p className={`${styles.navText} ${fonts.lightText}`}>Messages</p>
						</a>
					</Link>
				</div>

				<div className={styles.feed}>
					<Link href="/newPost">
						<a>
							<AiOutlinePlus size="25px" color={resolvedTheme === 'light' ? 'black' : 'white'} />
						</a>
					</Link>
					<Link href="/newPost">
						<a>
							<p className={`${styles.navText} ${fonts.lightText}`}>New Post</p>
						</a>
					</Link>
				</div>

				<div className={styles.feed}>
					<Link href="/">
						<a>
							<FiBookmark size="25px" color={resolvedTheme === 'light' ? 'black' : 'white'} />
						</a>
					</Link>
					<Link href="/">
						<a>
							<p className={`${styles.navText} ${fonts.lightText}`}>Bookmarks</p>
						</a>
					</Link>
				</div>
				<div className={styles.feed}>
					<Link href="/discover">
						<a>
							<MdFormatListBulleted size="25px" color={resolvedTheme === 'light' ? 'black' : 'white'} />
						</a>
					</Link>
					<Link href="/discover">
						<a>
							<p className={`${styles.navText} ${fonts.lightText}`}>Discover</p>
						</a>
					</Link>
				</div>
				<div className={styles.feed}>
					<Link href="/">
						<a>
							<BsPersonHeart size="25px" color={resolvedTheme === 'light' ? 'black' : 'white'} />
						</a>
					</Link>
					<Link href="/">
						<a>
							<p className={`${styles.navText} ${fonts.lightText}`}>Subscriptions</p>
						</a>
					</Link>
				</div>
				<div className={styles.feed}>
					<Link href="/profile">
						<a>
							<IoPersonCircleSharp size="25px" color={resolvedTheme === 'light' ? 'black' : 'white'} />
						</a>
					</Link>
					<Link href="/profile">
						<a>
							<p className={`${styles.navText} ${fonts.lightText}`}>My Profile</p>
						</a>
					</Link>
				</div>
				<div className={styles.feed}>
					<Link href="/">
						<a>
							<CiCircleMore size="25px" color={resolvedTheme === 'light' ? 'black' : 'white'} />
						</a>
					</Link>
					<Link href="/">
						<a>
							<p className={`${styles.navText} ${fonts.lightText}`}>More</p>
						</a>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Sidebar
