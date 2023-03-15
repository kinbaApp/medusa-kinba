import React from 'react'
import styles from '../../../styles/reusable/Suggestion.module.scss'
import PinkButton from './PinkButton'
import fonts from '../../../styles/Fonts.module.scss'
import { IoMdMore } from 'react-icons/io'

const Suggestion = ({ pfp, username, banner, name }) => {
	// This entire component can be turned into a reusable
	// component that each user can have displayed on their page.
	// Made it veryyy minimal for now

	return (
		<div className={styles.container}>
			<div className={styles.bgImage}>
				<img src={banner} alt="" />
				<div className={styles.moreIcon}>
					<IoMdMore size="25px" color="white" />
				</div>
				<div className={styles.pfpContainer}>
					<div className={styles.whiteBorder}>
						<img src={pfp} alt="" className={styles.profilePicture} />
					</div>
					<div className={styles.text}>
						<div className={styles.nameAndCheckmark}>
							<p className={`${styles.name}`}>{name}</p>
							<img src="/Profile/verified.png" alt="verified" className={styles.verifiedIcon} />
						</div>
						<div className={styles.username}>{username}</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Suggestion
