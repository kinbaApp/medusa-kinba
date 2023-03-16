import React from 'react'
import styles from '../../../styles/reusable/Connect.module.scss'
import ConnectWallet from '../ConnectWallet'
import Signin from '../Signin'

const Connect = () => {
	return (
		<div className={styles.container}>
			<div className={styles.connectContainer}>
				<ConnectWallet />
				<Signin />
			</div>
		</div>
	)
}

export default Connect
