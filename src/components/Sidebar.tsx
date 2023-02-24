import React from 'react'
import Link from 'next/link'
import { useAccount } from 'wagmi'

const sidebarStyle = 'flex my-5 mb-3 gap-2 items-center mx-3 '
const Sidebar = () => {
	const { address, isConnected } = useAccount()
	return (
		<div className="hidden md:flex h-screen flex-initial  ">
			<div className="  flex flex-col justify-between h-full overflow-y-scrikk min-w-210  bg-gray-100 dark:bg-gray-800">
				<div className="border-r-2 px-5 h-full border-black dark:border-gray-100 flex flex-col gap-5">
					<Link href="/feed">
						<a className={sidebarStyle}>Feed</a>
					</Link>
					<Link href="/feed">
						<a className={sidebarStyle}>Profile</a>
					</Link>
					<Link href="/feed">
						<a className={sidebarStyle}>Notifications</a>
					</Link>
					<Link href="/feed">
						<a className={sidebarStyle}>Messages</a>
					</Link>
					<Link href="/feed">
						<a className={sidebarStyle}>New Post</a>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Sidebar
