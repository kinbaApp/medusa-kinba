import { DONLYFANS_ABI, CONTRACT_ADDRESS } from '@/lib/consts'
import { ipfsGatewayLink } from '@/lib/utils'
import useGlobalStore, { Post, Subscribe, Creator } from '@/stores/globalStore'
import { BigNumber } from 'ethers'
import { formatEther, parseEther } from 'ethers/lib/utils'
import { FC, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { arbitrumGoerli } from 'wagmi/chains'
import { useSigner } from 'wagmi'

const CreatorsSubscribedTo: FC<Creator> = ({ creatorAddress }) => {
	const { isConnected } = useAccount()
	const [price, setPrice] = useState('')
	//const [creatorAddress, setCreatorAddress] = useState('')

	const medusa = useGlobalStore(state => state.medusa)
	const { data: signer, isSuccess: isSignerLoaded } = useSigner()
	//let evmPoint = null
	// if (medusa?.keypair) {
	// 	const { x, y } = medusa.keypair.pubkey.toEvm()
	// 	evmPoint = { x, y }
	// }

	const creators = useGlobalStore(state => state.creators)
	const following = useGlobalStore(state => state.followings)

	const creator = creators.find(creator => creator.creatorAddress == creatorAddress)
	//const decryption = decryptions.find(d => d.requestId.eq(requestId))
	const [plaintext, setPlaintext] = useState('Sign in to subscribe')
	const [downloadLink, setDownloadLink] = useState('')

	useEffect(() => {
		const subscribeToCreator = async () => {
			if (!following || !signer || !medusa?.keypair) return

			// const { ciphertext } = decryption

			// console.log('Downloading encrypted content from ipfs')
			// const ipfsDownload = ipfsGatewayLink(post.uri)
			// const response = await fetch(ipfsDownload)
			// const encryptedContents = Base64.toUint8Array(await response.text())

			// try {
			// 	const decryptedBytes = await medusa.decrypt(ciphertext, encryptedContents)
			// 	const msg = new TextDecoder().decode(decryptedBytes)
			// 	setPlaintext(msg)
			// 	if (isFile(msg)) {
			// 		const fileData = msg.split(',')[1]
			// 		setDownloadLink(window.URL.createObjectURL(new Blob([Base64.toUint8Array(fileData)])))
			// 	} else {
			// 		setDownloadLink(window.URL.createObjectURL(new Blob([msg])))
			// 	}
			// } catch (e) {
			// 	setPlaintext('Decryption failed')
			// }
		}
		subscribeToCreator()
	}, [following, isSignerLoaded, medusa?.keypair])

	return (
		<div className="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
			<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
				{creator.creatorAddress}
			</h5>
		</div>
	)
}

export default CreatorsSubscribedTo
