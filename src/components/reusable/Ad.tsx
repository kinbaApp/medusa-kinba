import React, { useState } from 'react'
import styles from '../../../styles/reusable/Ad.module.scss'
import PinkButton from './PinkButton'
import fonts from '../../../styles/Fonts.module.scss'
import Modal from 'react-modal'
import SubscribeToCreatorPopUp from '../SubscribeToCreatorPopUp'

const Ad = ({ image, price, period }) => {
	// This entire component can be turned into a reusable
	// component that each user can have displayed on their page.
	// Made it veryyy minimal for now
	const [isOpen, setIsOpen] = useState(false)
	const customStyles = {
		overlay: {
			backgroundColor: 'rgba(0, 0, 0, 0.6)',
		},
		content: {
			top: '50%',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-50%',
			transform: 'translate(-50%, -50%)',
		},
	}

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

			<button onClick={() => setIsOpen(true)}>
				<PinkButton text={'SUBSCRIBE'} />
			</button>
			<Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} style={customStyles}>
				<SubscribeToCreatorPopUp />
			</Modal>

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
