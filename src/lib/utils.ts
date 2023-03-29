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
    poster,
    postedBy,
  }`
	return query
}

export const userCreatedPostsQuery = userId => {
	const query = `*[ _type == 'post' && postedBy == '${userId}'] | order(_createdAt desc){
    image{
      asset->{
        url
      }
    },
    _id,
    title,
    caption,
    poster,
    postedBy,
  }`
	return query
}

export const allPostsQuery = () => {
	const query = `*[_type == "post" ]{
    image{
      asset->{
        url
      }
    },
    _id,
    title, 
    caption,
    postedBy,
    poster
  }`
	return query
}

export const creatorIdQuery = address => {
	const query = `*[_type == "creator" && address == '${address}']{
    _id,
    image,
  }`
	return query
}
