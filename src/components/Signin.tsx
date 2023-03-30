import { FC } from 'react'
import useGlobalStore from '@/stores/globalStore'
import { Medusa } from '@medusa-network/medusa-sdk'
import { ORACLE_ADDRESS } from '@/lib/consts'
import { useSigner } from 'wagmi'
import shallow from 'zustand/shallow'
import styles from '../../styles/reusable/Signin.module.scss'

const Signin: FC = () => {
	const medusa = useGlobalStore(state => state.medusa)
	const updateMedusa = useGlobalStore(state => state.updateMedusa)
	const { data: signer } = useSigner()
	//console.log(medusa)

	const signMessage = async () => {
		if (!signer) return
		const medusa = await Medusa.init(ORACLE_ADDRESS, signer)
		await medusa.signForKeypair()
		updateMedusa(medusa)
	}

	//console.log(medusa?.keypair)
	if (medusa?.keypair) {
		return (
			<button className={styles.signInButton} onClick={() => medusa.setKeypair(null)}>
				Sign out
			</button>
		)
	}

	return (
		<div className={styles.signInButton} onClick={() => signMessage()}>
			Sign in
		</div>
	)
}

export default Signin
