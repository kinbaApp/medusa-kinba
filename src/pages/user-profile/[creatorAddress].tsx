import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

const UserProfile = () => {
	const router = useRouter()
	const { address } = useAccount()
	const { creatorAddress } = router.query
	console.log('address 1 is', address)
	return <div>User address: {creatorAddress}</div>
}

export default UserProfile
