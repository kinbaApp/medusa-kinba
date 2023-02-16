import React from 'react'
import useGlobalStore from '@/stores/globalStore'
import { useAccount } from 'wagmi'
import PostListing from './PostListing'

const UserProfile = ({ creatorAddress }) => {
	const { address } = useAccount()
	const requests = useGlobalStore(state => state.requests)
	const [creator] = useGlobalStore(state => state.creators).filter(
		creator => creator.creatorAddress === creatorAddress
	)
	// const price = creator?.price
	// console.log(price)
	// console.log('price is', price?.toNumber())
	//const price = parseInt(creator.price, 16)
	const userPosts = useGlobalStore(state => state.posts).filter(post => post.creator === creatorAddress)
	const posts = userPosts.map(post => {
		return {
			...post,
			purchased: requests.some(request => request.subscriber === address && request.cipherId.eq(post.cipherId)),
		}
	})

	//const userPost = posts.some(post => post.creator === creatorAddress)

	return (
		<div>
			<h1>Creator Address: {creatorAddress}, price:</h1>

			{posts.map(post => (
				<PostListing key={post.cipherId.toNumber()} {...post} />
			))}
		</div>
	)
}

export default UserProfile
