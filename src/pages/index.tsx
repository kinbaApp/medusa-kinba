import React, { FC, useEffect, useRef, useState } from 'react'
import styles from '../../styles/Login.module.scss'
import Input from '@material-ui/core/Input'
import Image from 'next/image'
import Head from 'next/head'
import { useAccount, useContract, useContractEvent, useProvider, useSigner } from 'wagmi'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { APP_NAME, DONLYFANS_ABI, CONTRACT_ADDRESS, ORACLE_ADDRESS } from '@/lib/consts'
import PostForm from '@/components/PostForm'
import Posts from '@/components/Posts'
import Subscription from '@/components/Subscribe'
import CreateNewProfile from '@/components/CreateNewProfile'
import { Post, Request, Decryption, Subscribe, Creator, default as useGlobalStore } from '@/stores/globalStore'
import { ethers } from 'ethers'
import PurchasedSecrets from '@/components/PurchasedSecrets'
import Header from '@/components/Header'
import { Toaster } from 'react-hot-toast'
import CreatorsList from '@/components/CreatorsList'
import { UserProfile, Sidebar } from '@/components'
import App from './_app'
import { useTheme } from 'next-themes'
import Content from './Feed'
import Login from './Login'

const Home: FC = () => {
	const provider = useProvider()
	const { address, isConnected } = useAccount()
	const scrollRef = useRef(null)

	// const [mounted, setMounted] = useState(false)

	// We can reimpliment this if you want!
	// const { resolvedTheme, setTheme } = useTheme()

	const updatePosts = useGlobalStore(state => state.updatePosts)
	const updateRequests = useGlobalStore(state => state.updateRequests)
	const updateDecryptions = useGlobalStore(state => state.updateDecryptions)
	const addPost = useGlobalStore(state => state.addPost)
	const addRequest = useGlobalStore(state => state.addRequest)
	const addDecryption = useGlobalStore(state => state.addDecryption)
	const addSubscriber = useGlobalStore(state => state.addSubscriber)
	useContractEvent({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		eventName: 'NewSubscriber',
		listener(creator, subscriber, price) {
			if (subscriber == address) {
				addSubscriber({ creator, subscriber, price })
			}
		},
	})
	useContractEvent({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		eventName: 'NewPost',
		listener(creator, cipherId, name, description, uri) {
			addPost({ creator, cipherId, name, description, uri })
		},
	})

	useContractEvent({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		eventName: 'NewPostRequest',
		listener(subscriber, creator, requestId, cipherId) {
			if (subscriber === address) {
				addRequest({ subscriber, creator, requestId, cipherId })
			}
		},
	})

	useContractEvent({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		eventName: 'PostDecryption',
		listener(requestId, ciphertext) {
			addDecryption({ requestId, ciphertext })
		},
	})

	const donlyFans = useContract({
		address: CONTRACT_ADDRESS,
		abi: DONLYFANS_ABI,
		signerOrProvider: provider,
	})

	useEffect(() => {
		const getEvents = async () => {
			const iface = new ethers.utils.Interface(DONLYFANS_ABI)

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

	return <>{isConnected ? <Content /> : <Login />}</>
}

export default Home
