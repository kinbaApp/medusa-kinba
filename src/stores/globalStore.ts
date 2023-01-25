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

export interface Subscribe {
	subscriber: string
	creator: string
	//price: BigNumber
}

export interface Following {
	subscriber: string
	creator: string
	price: BigNumber
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

export interface Creator {
	creatorAddress: string
	//price: BigNumber
}

interface GlobalState {
	medusa: Medusa<SecretKey, PublicKey<SecretKey>> | null
	posts: Post[]
	requests: Request[]
	decryptions: Decryption[]
	subscribers: Subscribe[]
	creators: Creator[]
	followings: Following[]

	updateMedusa: (medusa: Medusa<SecretKey, PublicKey<SecretKey>> | null) => void
	updatePosts: (posts: Post[]) => void
	updateRequests: (requests: Request[]) => void
	updateDecryptions: (decryptions: Decryption[]) => void
	updateSubscribe: (subscribers: Subscribe[]) => void
	updateCreators: (creators: Creator[]) => void

	addPost: (post: Post) => void
	addRequest: (request: Request) => void
	addDecryption: (decryption: Decryption) => void
	addSubscriber: (subscribe: Subscribe) => void
	addCreator: (creator: Creator) => void
}

const useGlobalStore = create<GlobalState>()(set => ({
	medusa: null,
	posts: [],
	requests: [],
	decryptions: [],
	subscribers: [],
	creators: [],

	updateMedusa: (medusa: Medusa<SecretKey, PublicKey<SecretKey>> | null) => set(state => ({ medusa })),
	updatePosts: (posts: Post[]) => set(state => ({ posts })),
	updateRequests: (requests: []) => set(state => ({ requests })),
	updateDecryptions: (decryptions: []) => set(state => ({ decryptions })),
	updateSubscribe: (subscribers: Subscribe[]) => set(state => ({ subscribers })),
	updateCreators: (creators: Creator[]) => set(state => ({ creators })),

	addPost: (post: Post) => set(state => ({ posts: [post, ...state.posts] })),
	addRequest: (request: Request) => set(state => ({ requests: [request, ...state.requests] })),
	addDecryption: (decryption: Decryption) => set(state => ({ decryptions: [decryption, ...state.decryptions] })),
	addSubscriber: (subscribe: Subscribe) => set(state => ({ subscribers: [subscribe, ...state.subscribers] })),
	addCreator: (creator: Creator) => set(state => ({ creators: [creator, ...state.creators] })),
}))

export default useGlobalStore
