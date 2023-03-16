import React, { useState } from 'react'
import styles from '../../../styles/reusable/Ad.module.scss'
import PinkButton from './PinkButton'
import fonts from '../../../styles/Fonts.module.scss'
import Modal from 'react-modal'

const Ad = ({ image, price, period }) => {
	// This entire component can be turned into a reusable
	// component that each user can have displayed on their page.
	// Made it veryyy minimal for now
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div className={styles.container}>
			<div className={`${styles.title} ${fonts.bold}`}>SUBSCRIPTION</div>
			<div className={`${styles.offer} ${fonts.bold}`}>Limited time offer: -80% for the first month!</div>
			<div className={styles.imageandoffer}>
				<div className={styles.smallpinkring}>
					<div className={styles.smallpurplering}>
						<img src={image} alt="" className={styles.smallpfp} />
					</div>
				</div>
				<div className={`${styles.offerDetails} ${fonts.lightText}`}>
					Only {price} ETH - Limited Time Only - <br />
					Exclusive Content
				</div>
			</div>

			<PinkButton text={'SUBSCRIBE'} />

			<div className={styles.bottomDetails}>
				<p className={`${styles.bottomPrice} ${fonts.lightText}`}>
					{price} ETH for {period} days
				</p>
				<p className={`${styles.date} ${fonts.lightText}`}>February 24th 2023</p>
			</div>
		</div>
	)
}

export default Ad
