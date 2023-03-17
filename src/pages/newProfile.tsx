import React from 'react'
import PostForm from '@/components/PostForm'
import { Sidebar, Header, CreateNewProfile } from '@/components'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import { APP_NAME, DONLYFANS_ABI, CONTRACT_ADDRESS, ORACLE_ADDRESS } from '@/lib/consts'
import Connect from '@/components/reusable/Connect'
import styles from '../../styles/NewPost.module.scss'
import fonts from '../../styles/Fonts.module.scss'
import Suggestion from '@/components/reusable/Suggestion'
import { TfiReload } from 'react-icons/tfi'
import { AiOutlineLeft } from 'react-icons/ai'
import { AiOutlineRight } from 'react-icons/ai'
import { TbFreeRights } from 'react-icons/tb'

const newProfile = () => {
	return (
		<>
			<Head>
				<title>{`${APP_NAME}`}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Toaster position="top-center" reverseOrder={true} />
			{/* <Header /> */}

			<div className={styles.container}>
				<div className={styles.video}>
					{/* This is the Profile BG - You can comment out the img and use the video if you like */}

					{/* <video loop autoPlay muted id="video" className={styles.intro}>
						<source src="/Login/kinba.mp4" type="video/mp4" />
					</video> */}
					<img src="/Profile/kinbaBGv2.png" alt="" className={styles.intro} />
				</div>
				<div className={styles.main}>
					<div className={styles.sidebar}>
						<Sidebar />
					</div>
					<div className={styles.content}>
						<CreateNewProfile />
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
		</>
	)
}

export default newProfile
