import { client } from './sanityClient'

export function ipfsGatewayLink(cidOrUri: string): string {
	const cid = cidOrUri.split('//').pop()
	return `https://w3s.link/ipfs/${cid}`
}

export const postDetailQuery = postId => {
	const query = `*[_type == "post" && _id == '${postId}']{
    image{
      asset->{
        url
      }
    },
    _id,
    title, 
    caption,
  }`
	return query
}

export const userCreatedPostsQuery = userId => {
	const query = `*[ _type == 'post' && userId == '${userId}'] | order(_createdAt desc){
    image{
      asset->{
        url
      }
    },
    _id,
    title,
    caption,
  }`
	return query
}
