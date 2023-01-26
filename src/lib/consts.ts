export const APP_NAME = 'dOnlyFans' as const
export const CONTRACT_ADDRESS = '0xF3c97CD465dca84972D022A2dE54Ae12DAcB98d8' as const
export const ORACLE_ADDRESS = '0xf1d5A4481F44fe0818b6E7Ef4A60c0c9b29E3118' as const

// The <const> assertion enables wagmi to infer the correct types when using the ABI in hooks
export const DONLYFANS_ABI = <const>[
	{
		inputs: [
			{
				internalType: 'contract BN254EncryptionOracle',
				name: '_oracle',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [],
		name: 'CallbackNotAuthorized',
		type: 'error',
	},
	{
		inputs: [],
		name: 'CreatorDoesNotExist',
		type: 'error',
	},
	{
		inputs: [],
		name: 'NotSubscriber',
		type: 'error',
	},
	{
		inputs: [],
		name: 'PostDoesNotExist',
		type: 'error',
	},
	{
		inputs: [],
		name: 'dOnlyFans__CreatorAlreadyExists',
		type: 'error',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'creatorAddress',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'creatorContractAddress',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'price',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'period',
				type: 'uint256',
			},
		],
		name: 'NewCreatorProfileCreated',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'creator',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'cipherId',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'string',
				name: 'name',
				type: 'string',
			},
			{
				indexed: false,
				internalType: 'string',
				name: 'description',
				type: 'string',
			},
			{
				indexed: false,
				internalType: 'string',
				name: 'uri',
				type: 'string',
			},
		],
		name: 'NewPost',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'subscriber',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'creator',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'requestId',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'cipherId',
				type: 'uint256',
			},
		],
		name: 'NewPostRequest',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'creator',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'subscriber',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'price',
				type: 'uint256',
			},
		],
		name: 'NewSubscriber',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint256',
				name: 'requestId',
				type: 'uint256',
			},
			{
				components: [
					{
						components: [
							{
								internalType: 'uint256',
								name: 'x',
								type: 'uint256',
							},
							{
								internalType: 'uint256',
								name: 'y',
								type: 'uint256',
							},
						],
						internalType: 'struct G1Point',
						name: 'random',
						type: 'tuple',
					},
					{
						internalType: 'uint256',
						name: 'cipher',
						type: 'uint256',
					},
					{
						components: [
							{
								internalType: 'uint256',
								name: 'x',
								type: 'uint256',
							},
							{
								internalType: 'uint256',
								name: 'y',
								type: 'uint256',
							},
						],
						internalType: 'struct G1Point',
						name: 'random2',
						type: 'tuple',
					},
					{
						components: [
							{
								internalType: 'uint256',
								name: 'f',
								type: 'uint256',
							},
							{
								internalType: 'uint256',
								name: 'e',
								type: 'uint256',
							},
						],
						internalType: 'struct DleqProof',
						name: 'dleq',
						type: 'tuple',
					},
				],
				indexed: false,
				internalType: 'struct Ciphertext',
				name: 'ciphertext',
				type: 'tuple',
			},
		],
		name: 'PostDecryption',
		type: 'event',
	},
	{
		inputs: [
			{
				components: [
					{
						components: [
							{
								internalType: 'uint256',
								name: 'x',
								type: 'uint256',
							},
							{
								internalType: 'uint256',
								name: 'y',
								type: 'uint256',
							},
						],
						internalType: 'struct G1Point',
						name: 'random',
						type: 'tuple',
					},
					{
						internalType: 'uint256',
						name: 'cipher',
						type: 'uint256',
					},
					{
						components: [
							{
								internalType: 'uint256',
								name: 'x',
								type: 'uint256',
							},
							{
								internalType: 'uint256',
								name: 'y',
								type: 'uint256',
							},
						],
						internalType: 'struct G1Point',
						name: 'random2',
						type: 'tuple',
					},
					{
						components: [
							{
								internalType: 'uint256',
								name: 'f',
								type: 'uint256',
							},
							{
								internalType: 'uint256',
								name: 'e',
								type: 'uint256',
							},
						],
						internalType: 'struct DleqProof',
						name: 'dleq',
						type: 'tuple',
					},
				],
				internalType: 'struct Ciphertext',
				name: 'cipher',
				type: 'tuple',
			},
			{
				internalType: 'string',
				name: 'name',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'description',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'uri',
				type: 'string',
			},
		],
		name: 'CreatePost',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'price',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'period',
				type: 'uint256',
			},
		],
		name: 'createProfile',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'creatorsContract',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'creatorAddress',
				type: 'address',
			},
		],
		name: 'getCreatorContractAddress',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'cipherId',
				type: 'uint256',
			},
		],
		name: 'getPostSeller',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'creatorAddress',
				type: 'address',
			},
		],
		name: 'getSubscribers',
		outputs: [
			{
				internalType: 'address[]',
				name: '',
				type: 'address[]',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'oracle',
		outputs: [
			{
				internalType: 'contract BN254EncryptionOracle',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'requestId',
				type: 'uint256',
			},
			{
				components: [
					{
						components: [
							{
								internalType: 'uint256',
								name: 'x',
								type: 'uint256',
							},
							{
								internalType: 'uint256',
								name: 'y',
								type: 'uint256',
							},
						],
						internalType: 'struct G1Point',
						name: 'random',
						type: 'tuple',
					},
					{
						internalType: 'uint256',
						name: 'cipher',
						type: 'uint256',
					},
					{
						components: [
							{
								internalType: 'uint256',
								name: 'x',
								type: 'uint256',
							},
							{
								internalType: 'uint256',
								name: 'y',
								type: 'uint256',
							},
						],
						internalType: 'struct G1Point',
						name: 'random2',
						type: 'tuple',
					},
					{
						components: [
							{
								internalType: 'uint256',
								name: 'f',
								type: 'uint256',
							},
							{
								internalType: 'uint256',
								name: 'e',
								type: 'uint256',
							},
						],
						internalType: 'struct DleqProof',
						name: 'dleq',
						type: 'tuple',
					},
				],
				internalType: 'struct Ciphertext',
				name: 'cipher',
				type: 'tuple',
			},
		],
		name: 'oracleResult',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		name: 'posts',
		outputs: [
			{
				internalType: 'address',
				name: 'seller',
				type: 'address',
			},
			{
				internalType: 'string',
				name: 'uri',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'cipherId',
				type: 'uint256',
			},
			{
				components: [
					{
						internalType: 'uint256',
						name: 'x',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'y',
						type: 'uint256',
					},
				],
				internalType: 'struct G1Point',
				name: 'subscriberPublicKey',
				type: 'tuple',
			},
		],
		name: 'requestPost',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'creatorAddress',
				type: 'address',
			},
		],
		name: 'subscribe',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'creatorAddress',
				type: 'address',
			},
		],
		name: 'unsubscribe',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
]
