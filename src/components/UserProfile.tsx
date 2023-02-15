import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

const UserProfile = () => {
	const { address } = useAccount()
	return <div>User Profile</div>
}

export default UserProfile
