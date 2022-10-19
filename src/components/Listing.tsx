import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/consts'
import useGlobalStore, { Listing } from '@/stores/globalStore'
import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { FC } from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { arbitrumGoerli } from 'wagmi/chains'

const Listing: FC<Listing> = ({ cipherId, uri, name, description, price }) => {
  const keypair = useGlobalStore((state) => state.keypair)
  let evmPoint = null;
  if (keypair) {
    const { x, y } = keypair.pubkey.toEvm()
    evmPoint = { x, y }
  }

  const { config, error: prepareError, isError: isPrepareError, isSuccess: readyToSendTransaction } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'buyListing',
    args: [cipherId, evmPoint],
    enabled: Boolean(evmPoint),
    overrides: { value: price },
    chainId: arbitrumGoerli.id
  })

  const { data, error, isError, write: buyListing } = useContractWrite(config)

  const unlockSecret = async () => {
    console.log('unlocking secret')
    buyListing?.()
  }

  return (
    <div className="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{name}</h5>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{description}</p>
      <p className="mb-3">{BigNumber.from(0).eq(price) ? "Free" : `${formatEther(price)} ETH`} </p>
      <button onClick={() => unlockSecret()} className="mb-2 inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Unlock Secret
      </button>
      <a href={uri} target="_blank" className="inline-flex items-center text-blue-600 hover:underline" rel="noreferrer">
        View on IPFS
        <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
      </a>
    </div>
  )
}

export default Listing
