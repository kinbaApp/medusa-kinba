import { SecretKey, PublicKey, HGamalEVMCipher as Ciphertext, Medusa } from '@medusa-network/medusa-sdk'
import { BigNumber } from 'ethers'
import create from 'zustand'
import shallow from 'zustand/shallow'

export interface Post {
	creator: string
	cipherId: BigNumber
	name: string
	description: string
	uri: string
}

export interface Request {
	subscriber: string
	creator: string
	requestId: BigNumber
	cipherId: BigNumber
}

export interface Decryption {
	requestId: BigNumber
	ciphertext: Ciphertext
}

interface GlobalState {
	medusa: Medusa<SecretKey, PublicKey<SecretKey>> | null
	posts: Post[]
	requests: Request[]
	decryptions: Decryption[]

	updateMedusa: (medusa: Medusa<SecretKey, PublicKey<SecretKey>> | null) => void
	updatePosts: (posts: Post[]) => void
	updateRequests: (requests: Request[]) => void
	updateDecryptions: (decryptions: Decryption[]) => void

	addPost: (post: Post) => void
	addRequest: (request: Request) => void
	addDecryption: (decryption: Decryption) => void
}

const useGlobalStore = create<GlobalState>()(set => ({
	medusa: null,
	posts: [],
	requests: [],
	decryptions: [],

	updateMedusa: (medusa: Medusa<SecretKey, PublicKey<SecretKey>> | null) => set(state => ({ medusa })),
	updatePosts: (posts: Post[]) => set(state => ({ posts })),
	updateRequests: (requests: []) => set(state => ({ requests })),
	updateDecryptions: (decryptions: []) => set(state => ({ decryptions })),

	addPost: (post: Post) => set(state => ({ posts: [post, ...state.posts] })),
	addRequest: (request: Request) => set(state => ({ requests: [request, ...state.requests] })),
	addDecryption: (decryption: Decryption) => set(state => ({ decryptions: [decryption, ...state.decryptions] })),
}))

export default useGlobalStore
