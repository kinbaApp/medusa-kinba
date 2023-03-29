import { FC, useState, useEffect } from 'react'
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useAccount } from 'wagmi'
import { arbitrumGoerli } from 'wagmi/chains'
import { HGamalEVMCipher } from '@medusa-network/medusa-sdk'
import { useRouter } from 'next/router'
import { DONLYFANS_ABI, CONTRACT_ADDRESS } from '@/lib/consts'
import { parseEther } from 'ethers/lib/utils'
import storeCiphertext from '@/lib/storeCiphertext'
import toast from 'react-hot-toast'
import { creatorDetailId, ipfsGatewayLink } from '@/lib/utils'
import useGlobalStore from '@/stores/globalStore'
import { Base64 } from 'js-base64'
import styles from '../../styles/PostForm.module.scss'
import fonts from '../../styles/Fonts.module.scss'
import { client } from '../lib/sanityClient'
import { creatorIdQuery } from '@/lib/utils'

const PostForm: FC = () => {
	const { address } = useAccount()
	const medusa = useGlobalStore(state => state.medusa)
	const [fields, setFields] = useState(false)
	const [title, setTitle] = useState('title')
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [imageAsset, setImageAsset] = useState(null)
	//const [price, setPrice] = useState('')
	const [wrongImageType, setWrongImageType] = useState(false)
	const [plaintext, setPlaintext] = useState('')
	const [ciphertextKey, setCiphertextKey] = useState<HGamalEVMCipher>()
	const [cid, setCid] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const [creatorId, setCreatorId] = useState('')
	const [creatorDoc, setCreatorDoc] = useState(null)
	const router = useRouter()

	const {
		config,
		error: prepareError,
		isError: isPrepareError,
		isSuccess: readyToSendTransaction,
	} = usePrepareContractWrite({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		functionName: 'CreatePost',
		//args: [ciphertextKey, name, description, parseEther(price || '0.00'), `ipfs://${cid}/${name}`],
		args: [ciphertextKey, name, description, `ipfs://${cid}/${name}`],
		enabled: Boolean(cid),
		chainId: arbitrumGoerli.id,
	})

	const { data, error, isError, write: CreatePost } = useContractWrite(config)

	useEffect(() => {
		if (readyToSendTransaction) {
			toast.loading('Submitting secret to Medusa...')
			CreatePost?.()
			setCid('')
		}
	}, [readyToSendTransaction])

	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash,
		onSuccess: txData => {
			toast.dismiss()
			toast.success(
				<a
					href={`https://goerli.arbiscan.io/tx/${txData.transactionHash}`}
					className="inline-flex items-center text-blue-600 hover:underline"
					target="_blank"
					rel="noreferrer"
				>
					Secret successfully submitted to Medusa! View on Etherscan
					<svg
						className="ml-2 w-5 h-5"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
						<path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
					</svg>
				</a>
			)
		},
		onError: e => {
			toast.dismiss()
			toast.error(`Failed to submit secret to Medusa: ${e.message}`)
		},
	})

	const handleSubmit = async (event: any) => {
		event.preventDefault()
		setSubmitting(true)
		console.log('Submitting new post')

		const buff = new TextEncoder().encode(plaintext)
		try {
			await medusa.fetchPublicKey()
		} catch (error) {
			console.log('Try signing in with metamask first')
		}

		try {
			const { encryptedData, encryptedKey } = await medusa.encrypt(buff, CONTRACT_ADDRESS)
			const b64EncryptedData = Base64.fromUint8Array(encryptedData)
			console.log('Encrypted KEY: ', encryptedKey)
			setCiphertextKey(encryptedKey)
			console.log('input to storeCiphertext', name, b64EncryptedData)

			toast.promise(storeCiphertext(name, b64EncryptedData), {
				loading: 'Uploading encrypted secret to IPFS...',
				success: cid => {
					setCid(cid)
					return (
						<a
							href={ipfsGatewayLink(cid)}
							className="inline-flex items-center text-blue-600 hover:underline"
							target="_blank"
							rel="noreferrer"
						>
							View secret on IPFS
							<svg
								className="ml-2 w-5 h-5"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
								<path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
							</svg>
						</a>
					)
				},
				error: error => `Error uploading to IPFS: ${error.message}`,
			})
		} catch (e) {
			console.log('Encryption or storeCiphertext API call Failed: ', e)
		}
		setSubmitting(false)
	}
	const handleFileChange = (event: any) => {
		toast.success('File uploaded successfully!')
		const file = event.target.files[0]
		setName(file.name)
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = event => {
			const plaintext = event.target?.result as string
			setPlaintext(plaintext)
		}
		reader.onerror = error => {
			console.log('File Input Error: ', error)
		}
	}
	const uploadImage = (event: any) => {
		console.log(event.target)
		const { type, name } = event.target.files[0]
		const selectedFile = event.target.files[0]
		console.log('type', type)
		if (
			type === 'image/png' ||
			type == 'image/svg' ||
			type === 'image/gif' ||
			type === 'image/jpg' ||
			type === 'image/jpeg'
		) {
			console.log('right type')
			setWrongImageType(false)
			client.assets
				.upload('image', event.target.files[0], {
					contentType: type,
					filename: name,
				})
				.then(document => {
					setImageAsset(document)
					const id = document._id
					console.log('image asset doc', document)
				})
				.then(() => {
					console.log('Done!')
				})
				.catch(error => {
					console.log('Image upload error', error)
				})
			console.log('uploading to sanity')
			console.log('image asset', imageAsset)
		} else {
			console.log('wrong type')
			setWrongImageType(true)
		}
	}

	const getCreator = () => {
		//get the creator
		const creatorQuery = creatorIdQuery(address)

		client.fetch(creatorQuery).then(data => {
			setCreatorId(data[0]._id)
			client.getDocument(data[0]._id).then(data2 => {
				setCreatorDoc(data2)
			})
		})
	}
	const savePost = () => {
		getCreator()

		if (imageAsset?._id) {
			console.log('save post', imageAsset)
			const data3 = {
				_type: 'post',
				title: 'success',
				image: {
					_type: 'image',
					asset: {
						_type: 'reference',
						_ref: imageAsset?._id,
					},
				},
				postedBy: address,
				caption: description,
				poster: creatorDoc,
			}
			client
				.create(data3)
				.then(response => console.log('Post created:', response))
				.catch(error => console.error('Error creating post:', error))
			console.log('doc created')
			console.log(imageAsset)
		} else {
			const data3 = {
				_type: 'post',
				title: 'text post',
				postedBy: address,
				caption: description,
			}
			client
				.create(data3)
				.then(response => console.log('Post created:', response))
				.catch(error => console.error('Error creating post:', error))
			console.log('no post')
			setFields(true)
			setTimeout(() => setFields(false), 2000)
		}
	}

	const submitPost = (event: any) => {
		savePost()
		handleSubmit(event)
	}

	const upload = (event: any) => {
		uploadImage(event)
		handleFileChange(event)
	}
	return (
		<>
			<form className="lg:w lg:mx-auto">
				<h1 className={`${styles.NewPost} ${fonts.bold}`}>New Post</h1>

				<div className="flex items-center justify-center">
					{!imageAsset ? (
						<label className="w-64 flex flex-col items-center px-4 py-6 rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-purple-800 hover:text-white dark:hover:text-blue-400">
							<svg
								className="w-8 h-8"
								fill="currentColor"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
							>
								<path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
							</svg>
							<span className="mt-2 text-base leading-normal">{name ?? 'SELECT A FILE'}</span>
							<input type="file" name="upload-image" onChange={upload} className="hidden" />
						</label>
					) : (
						<div className="relative h-full">
							<img src={imageAsset?.url} alt="uploaded_image" className="h-full w-full" />
							<button
								type="submit"
								className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
								onClick={() => setImageAsset(null)}
							>
								Delete
							</button>
						</div>
					)}

					{wrongImageType && <p>Wrong type of image</p>}
				</div>
				<div className="pt-4 text-center">
					<span className={`${styles.caption} ${fonts.bold}`}>Caption</span>
					<label className="py-3 block">
						<textarea
							required
							className={styles.textArea}
							// className="form-textarea mt-1 block w-full h-24 dark:bg-gray-800 dark:text-white"
							rows={3}
							placeholder="Write your caption"
							value={description}
							onChange={e => setDescription(e.target.value)}
						></textarea>
					</label>
				</div>
				<div className="text-center w-full">
					<button
						type="button"
						onClick={submitPost}
						className={styles.submitButton}
						disabled={isLoading || submitting}
					>
						{isLoading || submitting
							? 'Submitting...'
							: medusa?.keypair
							? 'Post your content'
							: 'Please Sign in'}
					</button>
				</div>
			</form>
		</>
		// 	<>
		// 		<form className="lg:w lg:mx-auto" onSubmit={savePost}>
		// 			<h1 className={`${styles.NewPost} ${fonts.bold}`}>New Post</h1>
		// 			{!imageAsset ? (
		// 				<div className="flex items-center justify-center">
		// 					<label className="w-64 flex flex-col items-center px-4 py-6 rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-purple-800 hover:text-white dark:hover:text-blue-400">
		// 						<svg
		// 							className="w-8 h-8"
		// 							fill="currentColor"
		// 							xmlns="http://www.w3.org/2000/svg"
		// 							viewBox="0 0 20 20"
		// 						>
		// 							<path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
		// 						</svg>
		// 						<span className="mt-2 text-base leading-normal">{name ?? 'SELECT A FILE'}</span>
		// 						<input type="file" className="hidden" onChange={uploadImage} />
		// 					</label>
		// 				</div>
		// 			) : (
		// 				<div className="relative h-full ">
		// 					<img src={imageAsset?.url} alt="uploaded-pic" className="h-full w-full" />
		// 					<button
		// 						type="button"
		// 						className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
		// 						onClick={() => setImageAsset(null)}
		// 					>
		// 						Remove
		// 					</button>
		// 				</div>
		// 			)}

		// 			<div className="pt-8 text-center">
		// 				<label className="block">
		// 					<span className={`${styles.postTitle} ${fonts.bold}`}>Post Title</span>
		// 					<input
		// 						required
		// 						type="text"
		// 						placeholder="dEaD-creds.txt"
		// 						className={styles.titletextArea}
		// 						// className="form-input my-5 block w-full dark:bg-gray-800 dark:text-white"
		// 						value={name}
		// 						onChange={e => setName(e.target.value)}
		// 					/>
		// 				</label>
		// 			</div>

		// 			{/* <div className="pt-4 text-center">
		// 				<label className="block">
		// 					<span className="text-lg font-mono font-light dark:text-white my-4">Price</span>
		// 					<input
		// 						required
		// 						type="number"
		// 						placeholder="ETH"
		// 						className="form-input my-5 block w-full dark:bg-gray-800 dark:text-white"
		// 						value={price}
		// 						onChange={e => setPrice(e.target.value)}
		// 					/>
		// 				</label>
		// 			</div> */}

		// 			<div className="pt-4 text-center">
		// 				<span className={`${styles.caption} ${fonts.bold}`}>Caption</span>
		// 				<label className="py-3 block">
		// 					<textarea
		// 						required
		// 						className={styles.textArea}
		// 						// className="form-textarea mt-1 block w-full h-24 dark:bg-gray-800 dark:text-white"
		// 						rows={3}
		// 						placeholder="Buy access to the private key for the 0xdEaD address"
		// 						value={description}
		// 						onChange={e => setDescription(e.target.value)}
		// 					></textarea>
		// 				</label>
		// 			</div>
		// 			<div className="text-center w-full">
		// 				<button
		// 					type="submit"
		// 					className={styles.submitButton}
		// 					// className="font-mono font-semibold mt-5 text-xl text-white py-4 px-4 rounded-sm transition-colors bg-indigo-600 dark:bg-indigo-800 hover:bg-black dark:hover:bg-gray-50 dark:hover:text-gray-900 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-25"
		// 				>
		// 					here
		// 				</button>
		// 			</div>
		// 			{/* {(isPrepareError || isError) && <div>Error: {(prepareError || error)?.message}</div>} */}
		// 		</form>
		// 	</>
	)
}

export default PostForm
