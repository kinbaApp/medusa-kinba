import { FC, useEffect } from 'react'
import Head from 'next/head'
import { useAccount, useContract, useContractEvent, useProvider, useSigner } from 'wagmi'

import { APP_NAME, CONTRACT_ABI, CONTRACT_ADDRESS, ORACLE_ADDRESS } from '@/lib/consts'
import PostForm from '@/components/PostForm'
import Posts from '@/components/Posts'
import Subscribe from '@/components/Subscribe'
import { Post, Request, Decryption, default as useGlobalStore } from '@/stores/globalStore'
import { ethers } from 'ethers'
import PurchasedSecrets from '@/components/PurchasedSecrets'
import Header from '@/components/Header'
import { Toaster } from 'react-hot-toast'

const Home: FC = () => {
	const provider = useProvider()
	const { address } = useAccount()

	const updatePosts = useGlobalStore(state => state.updatePosts)
	const updateRequests = useGlobalStore(state => state.updateRequests)
	const updateDecryptions = useGlobalStore(state => state.updateDecryptions)
	const addPost = useGlobalStore(state => state.addPost)
	const addRequest = useGlobalStore(state => state.addRequest)
	const addDecryption = useGlobalStore(state => state.addDecryption)
	const addSubscriber = useGlobalStore(state => state.addSubscriber)

	useContractEvent({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		eventName: 'NewPost',
		listener(creator, cipherId, name, description, uri) {
			addPost({ creator, cipherId, name, description, uri })
		},
	})

	// add event for each new subscriber on contract
	// useContractEvent({
	// 	address: CONTRACT_ADDRESS,
	// 	abi: CONTRACT_ABI,
	// 	eventName: 'NewSubscriber',
	// 	listener(creator, cipherId, name, description, uri) {
	// 		addSubscriber({ creator, cipherId, name, description, uri })
	// 	},
	// })

	useContractEvent({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		eventName: 'NewPostRequest',
		listener(subscriber, creator, requestId, cipherId) {
			if (subscriber === address) {
				addRequest({ subscriber, creator, requestId, cipherId })
			}
		},
	})

	useContractEvent({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		eventName: 'PostDecryption',
		listener(requestId, ciphertext) {
			addDecryption({ requestId, ciphertext })
		},
	})

	const donlyFans = useContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		signerOrProvider: provider,
	})

	useEffect(() => {
		const getEvents = async () => {
			const iface = new ethers.utils.Interface(CONTRACT_ABI)

			const newPostFilter = donlyFans.filters.NewPost()
			console.log(newPostFilter)
			const newPosts = await donlyFans.queryFilter(newPostFilter)

			if (iface && newPosts) {
				const posts = newPosts.reverse().map((filterTopic: any) => {
					const result = iface.parseLog(filterTopic)
					const { creator, cipherId, name, description, uri } = result.args
					return { creator, cipherId, name, description, uri } as Post
				})
				updatePosts(posts)
			}

			const newRequestFilter = donlyFans.filters.NewPostRequest(address)
			const newRequests = await donlyFans.queryFilter(newRequestFilter)

			if (iface && newRequests) {
				const requests = newRequests.reverse().map((filterTopic: any) => {
					const result = iface.parseLog(filterTopic)
					const { subscriber, creator, requestId, cipherId } = result.args
					return { subscriber, creator, requestId, cipherId } as Request
				})
				updateRequests(requests)
			}

			const postDecryptionFilter = donlyFans.filters.PostDecryption()
			const postDecryptions = await donlyFans.queryFilter(postDecryptionFilter)

			if (iface && postDecryptions) {
				const decryptions = postDecryptions.reverse().map((filterTopic: any) => {
					const result = iface.parseLog(filterTopic)
					const { requestId, ciphertext } = result.args
					return { requestId, ciphertext } as Decryption
				})
				updateDecryptions(decryptions)
			}
		}
		getEvents()
	}, [address])

	return (
		<>
			<Head>
				<title>{`${APP_NAME}`}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>

			<Toaster position="top-center" reverseOrder={true} />

			<Header />

			<div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-800 sm:items-center py-4 sm:pt-0">
				<div className="max-w-6xl mx-auto px-6 lg:px-8">
					<div className="flex pt-8 justify-center sm:pt-0 my-7">
						<h1 className="text-6xl font-mono font-light dark:text-white">{APP_NAME}</h1>
					</div>
					<div className="flex justify-center sm:pt-0 my-7">
						<p className="text-lg font-mono font-light dark:text-white ml-2">
							Creator: post your original content! <br></br>
							(There is only a single creator for now, associated with address
							0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, only that creator can post content.)
						</p>
					</div>

					<PostForm />

					<Subscribe />

					<PurchasedSecrets />

					<Posts />
				</div>
			</div>
		</>
	)
}

export default Home
