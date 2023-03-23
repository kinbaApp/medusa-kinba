import type { NextPage } from 'next'
import 'tailwindcss/tailwind.css'
import PostForm from '@/components/PostForm'
import { ThemeProvider } from 'next-themes'
import Head from 'next/head'
import { APP_NAME, DONLYFANS_ABI, CONTRACT_ADDRESS, ORACLE_ADDRESS } from '@/lib/consts'
import { Toaster } from 'react-hot-toast'
import PurchasedSecrets from '@/components/PurchasedSecrets'
import Header from '@/components/Header'
import Posts from '@/components/Posts'
import CreatorsList from '@/components/CreatorsList'
import SubscribersList from '@/components/SubscribersList'
import { Sidebar } from '@/components'
import styles from '../../styles/ListOfSubscribers.module.scss'
import Suggestion from '@/components/reusable/Suggestion'
import { TfiReload } from 'react-icons/tfi'
import { AiOutlineLeft } from 'react-icons/ai'
import { AiOutlineRight } from 'react-icons/ai'
import { TbFreeRights } from 'react-icons/tb'
import fonts from '../../styles/Fonts.module.scss'
import Connect from '@/components/reusable/Connect'
import CreatorsSubscribedTo from '@/components/CreatorsSubscribedTo'

const ListOfSubs: NextPage = () => {
	return (
		<div>
			<Head>
				<title>{`${APP_NAME}`}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Toaster position="top-center" reverseOrder={true} />
			{/* <Header /> */}
			{/* <div className=" flex md:flex-row bg-gray-100 dark:bg-gray-800 flex-col h-screen transition-height duration-75 ease-out">
				<Sidebar />

				<div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-800 sm:items-center py-4 sm:pt-0">
					<div className="max-w-6xl mx-auto px-6 lg:px-8">
						<SubscribersList />
					</div>
				</div>
			</div> */}
			<div className={styles.container}>
				<div className={styles.bg}>
					<img src="/Profile/kinbaBGv2.png" alt="" className={styles.intro} />
				</div>
				<div className={styles.main}>
					<div className={styles.sidebar}>
						<Sidebar />
					</div>
					<div className={styles.content}>
						<CreatorsSubscribedTo />
					</div>
					<div className={styles.suggested}>
						<Connect />
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
									<p className={`${fonts.bodyText} ${styles.suggestionsTitle}`}>SUGGESTIONS</p>
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
									banner="/Profile/layingdown.png"
									name={'LovelyLayla'}
								/>
								<Suggestion
									pfp={'/Profile/girl2.png'}
									username={'@poleQueen'}
									banner="/Profile/sitting2.png"
									name={'ThePolePrincess'}
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

export default ListOfSubs
