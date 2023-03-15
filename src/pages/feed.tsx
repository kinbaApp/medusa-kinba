import type { NextPage } from 'next'
import { FC, useEffect, useRef } from 'react'
import 'tailwindcss/tailwind.css'
import { ThemeProvider } from 'next-themes'
import Head from 'next/head'
import { APP_NAME, DONLYFANS_ABI, CONTRACT_ADDRESS, ORACLE_ADDRESS } from '@/lib/consts'
import { Toaster } from 'react-hot-toast'
import PurchasedSecrets from '@/components/PurchasedSecrets'
import Header from '@/components/Header'
import Posts from '@/components/Posts'
import { Sidebar } from '@/components'
import styles from '../../styles/Feed.module.scss'
import fonts from '../../styles/Fonts.module.scss'
import PinkButton from '@/components/reusable/PinkButton'
import Ad from '@/components/reusable/Ad'
import Suggestion from '@/components/reusable/Suggestion'
import { TfiReload } from 'react-icons/tfi'
import { AiOutlineLeft } from 'react-icons/ai'
import { AiOutlineRight } from 'react-icons/ai'
import { TbFreeRights } from 'react-icons/tb'
import Link from 'next/link'

const Content: FC = (resolvedTheme, setTheme) => {
	const scrollRef = useRef(null)

	return (
		<div>
			<Head>
				<title>{`${APP_NAME}`}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Toaster position="top-center" reverseOrder={true} />
			<Header resolvedTheme={resolvedTheme} setTheme={setTheme} />

			{/* <div className=" flex md:flex-row bg-gray-100 dark:bg-gray-800 flex-col h-screen transition-height duration-75 ease-out">
				<Sidebar resolvedTheme={resolvedTheme} />
				<div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
					<div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-800 sm:items-center py-4 sm:pt-0">
						<div className="relative flex  justify-center  bg-gray-100 dark:bg-gray-800 sm:items-center py-4 sm:pt-0">
							<div className="max-w-5xl mx-auto px-6 lg:px-8">
								<PurchasedSecrets />

								<Posts />
							</div>
						</div>
					</div>
				</div>
			</div> */}
			<div className={styles.container}>
				<div className={styles.bg}>
					<img src="/Profile/kinbaBGv2.png" alt="" className={styles.intro} />
				</div>
				{/* <div className={styles.header}>HEADER GOES HERE</div> */}
				<div className={styles.main}>
					<div className={styles.sidebar}>
						<Sidebar resolvedTheme={resolvedTheme} />
					</div>
					<div className={styles.content}>
						<div className={styles.homeContainer}>
							<div className={`${styles.homeTitle} ${fonts.bodyText}`}>HOME</div>
							<div className={styles.createButton}>
								<Link href="/newPost">
									<a>
										<PinkButton text={'PUBLISH NEW+'} />
									</a>
								</Link>
							</div>
						</div>
						<div className={styles.postContainer}>
							<Posts />
						</div>
					</div>
					<div className={styles.suggested}>
						<div className={styles.top}>
							<div className={styles.searchBar}>
								<form>
									<input type="search" placeholder="" className={styles.search} />
									{/* <img src="/Profile/searchicon.png" alt="" className={styles.searchIcon} /> */}
								</form>
							</div>
							<div className={styles.mainAdvertisment}>
								{/* <Ad image={'/Profile/girl.png'} price={'$2.25'} /> */}
								<div className={styles.topBox}>
									<h3 className={`${fonts.bodyText} ${styles.suggestionsTitle}`}>SUGGESTIONS</h3>
									<div className={styles.iconContainer}>
										<TbFreeRights size="25px" />
										<TfiReload size="20px" />
										<AiOutlineLeft size="20px" />
										<AiOutlineRight size="20px" />
									</div>
								</div>
								<Suggestion
									pfp={'/Profile/girl.png'}
									username={'@Prettyprincess'}
									banner="Profile/layingdown.png"
									name={'LovelyLayla'}
								/>
								<Suggestion
									pfp={'/Profile/girl2.png'}
									username={'@poleQueen'}
									banner="Profile/sitting.png"
									name={'ThePolePrincess'}
								/>
								<Suggestion
									pfp={'/Profile/girl3.png'}
									username={'@hereForAGoodtime'}
									banner="Profile/sitting2.png"
									name={'YourFavoriteGirl'}
								/>
							</div>
							<div className={styles.termsOfService}>
								<p className={` ${fonts.lightText}`}>Privacy · Cookie Notice · Terms of Service</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Content
