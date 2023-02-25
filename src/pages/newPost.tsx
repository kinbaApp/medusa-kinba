import React from 'react'
import PostForm from '@/components/PostForm'
import { Sidebar, Header } from '@/components'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import { APP_NAME, DONLYFANS_ABI, CONTRACT_ADDRESS, ORACLE_ADDRESS } from '@/lib/consts'

const newPost = () => {
	return (
		<>
			<Head>
				<title>{`${APP_NAME}`}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Toaster position="top-center" reverseOrder={true} />
			<Header />
			<div className=" flex md:flex-row bg-gray-100 dark:bg-gray-800 flex-col h-screen transition-height duration-75 ease-out">
				<Sidebar />
				<div className="flex relative items-center  m-auto px-5 ">
					<PostForm />
				</div>
			</div>
		</>
	)
}

export default newPost
