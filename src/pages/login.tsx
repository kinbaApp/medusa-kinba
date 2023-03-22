import React, { useState } from 'react'
import styles from '../../styles/Login.module.scss'
import Image from 'next/image'
import Head from 'next/head'
import VisibilityIcon from '@mui/icons-material/Visibility'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import Input from '@material-ui/core/Input'
// import ConnectWallet from '@/components/ConnectWallet'
import { ConnectKitButton } from 'connectkit'
import styled from 'styled-components'
import Link from 'next/link'

const Login = () => {
	const [values, setValues] = React.useState({
		password: '',
		showPassword: false,
	})

	const handleClickShowPassword = () => {
		setValues({ ...values, showPassword: !values.showPassword })
	}

	const handleMouseDownPassword = event => {
		event.preventDefault()
	}

	const handlePasswordChange = prop => event => {
		setValues({ ...values, [prop]: event.target.value })
	}

	const StyledButton = styled.button`
		width: 300px;
	`

	return (
		<div>
			{/* <Head></Head> */}

			<div className={styles.container}>
				<div className={styles.main}>
					<div className={styles.videoContainer}>
						<div className={styles.videoText}>
							<div className={styles.logo}>
								<Image src="/Login/logo.png" alt="" height={120} width={250} />
							</div>
							<div className={styles.title}>Own your content,</div>
							<div className={styles.title}>own your funds.</div>
							<div className={styles.subtext}>
								<p>
									Kinba is a decentralized content <br />
									subscription website that provides <br />
									censorship resistance. At Kinba, everything <br />
									is stored and handled in a decentralized <br />
									way, we cannot delete your content, ban <br />
									your profile or withhold your funds.
								</p>
							</div>
						</div>
						<video loop autoPlay muted id="video" className={styles.intro}>
							<source src="/Login/kinbaSquare.mp4" type="video/mp4" />
						</video>
					</div>

					<div className={styles.loginContainer}>
						<h3>Login</h3>
						{/* These are dummy inputs for now  */}

						<Input
							disableUnderline={true}
							className={styles.username}
							type="text"
							name="email"
							placeholder="Email"
						/>
						<Input
							disableUnderline={true}
							type={values.showPassword ? 'text' : 'password'}
							name="password"
							placeholder="Password"
							onChange={handlePasswordChange('password')}
							value={values.password}
							className={styles.input}
							endAdornment={
								<InputAdornment position="end">
									<IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
										{values.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
									</IconButton>
								</InputAdornment>
							}
						/>

						<div className={styles.loginButton}>
							<ConnectKitButton.Custom>
								{({ isConnected, show, truncatedAddress, ensName }) => {
									return (
										<StyledButton onClick={show}>
											{isConnected ? ensName ?? truncatedAddress : 'LOGIN'}
										</StyledButton>
									)
								}}
							</ConnectKitButton.Custom>
						</div>

						{/* This needs to be changed to redirect to a forgor password/create account screen */}
						<div className={styles.redirectText}>
							<Link href="/login">
								<a>Forgot Password?</a>
							</Link>{' '}
							·{' '}
							<Link href="/login">
								<a>Sign up for Kinba</a>
							</Link>
						</div>

						<div className={styles.twitterButton}>
							<div className={styles.iconContainer}>
								<Image src="/Login/twitter.svg" alt="" height={30} width={28} />
							</div>
							<p>SIGN IN WITH TWITTER</p>
						</div>

						<div className={styles.googleButton}>
							<div className={styles.whitebox}>
								<Image src="/Login/google.svg" alt="" height={45} width={40} />
							</div>
							<p>SIGN IN WITH GOOGLE</p>
						</div>
					</div>
				</div>
				<div className={styles.featuredPosts}>
					<h2 className={styles.featuredTitle}>Latest featured posts</h2>
				</div>
			</div>
		</div>
	)
}

export default Login
