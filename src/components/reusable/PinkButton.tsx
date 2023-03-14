import React from 'react'
import styles from '../../../styles/reusable/PinkButton.module.scss'
import fonts from '../../../styles/Fonts.module.scss'

const PinkButton = ({ text }) => {
	return (
		<div className={styles.container}>
			<div className={`${styles.text} ${fonts.bodyText}`}>{text}</div>
		</div>
	)
}

export default PinkButton
