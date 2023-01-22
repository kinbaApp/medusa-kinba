import { FC } from 'react'
import useGlobalStore from '@/stores/globalStore'
import Post from './Post'
import { useAccount } from 'wagmi'

const Posts: FC = () => {
	const { address } = useAccount()
	const requests = useGlobalStore(state => state.requests)
	const posts = useGlobalStore(state => state.posts).map(post => {
		return {
			...post,
			purchased: requests.some(request => request.subscriber === address && request.cipherId.eq(post.cipherId)),
		}
	})

	return (
		<>
			<h1 className="text-2xl font-mono font-light dark:text-white mt-10 mb-6">
				Access Content (Susbscriber only){' '}
			</h1>
			<div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 w-full transition-all">
				{posts.map(post => (
					<Post key={post.cipherId.toNumber()} {...post} />
				))}
			</div>
		</>
	)
}

export default Posts
