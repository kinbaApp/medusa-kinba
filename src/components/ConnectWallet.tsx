import { FC } from 'react'
import { useAccount } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import styled from 'styled-components'

type Visibility = 'always' | 'connected' | 'not_connected'

const StyledButton = styled.button`
	cursor: pointer;
	position: relative;
	display: inline-block;
	padding: 14px 24px;
	color: #ffffff;
	background: linear-gradient(180deg, #fd2ac4 15%, #bf23c3 49%);
	font-size: 16px;
	font-weight: 500;
	border-radius: 10rem;
	box-shadow: 0 4px 24px -6px #fd2ac4;

	transition: 200ms ease;
	&:hover {
		transform: translateY(-6px);
		box-shadow: 0 6px 40px -6px #fd2ac4;
	}
	&:active {
		transform: translateY(-3px);
		box-shadow: 0 6px 32px -6px #fd2ac4;
	}
`

const ConnectWallet: FC<{ show?: Visibility }> = ({ show = 'always' }) => {
	const { isConnected } = useAccount()

	if ((show == 'connected' && !isConnected) || (show == 'not_connected' && isConnected)) return null

	return (
		<ConnectKitButton.Custom>
			{({ isConnected, show, truncatedAddress, ensName }) => {
				return (
					<StyledButton onClick={show}>
						{isConnected ? ensName ?? truncatedAddress : 'Connect Wallet'}
					</StyledButton>
				)
			}}
		</ConnectKitButton.Custom>
	)
}

export default ConnectWallet
