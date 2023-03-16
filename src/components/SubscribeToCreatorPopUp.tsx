import React from 'react'

const SubscribeToCreatorPopUp = ({ subscriptionPrice, isConnected, subscribeToCreator, setSubscriptionPrice }) => {
	return (
		<div className="p-6 max-w-sm bg-white rounded-lg border border-purple-200 shadow-md ">
			<div className="pt-4 text-center">
				<label className="block">
					<span className="text-lg font-mono font-light  my-4 text-purple-600">
						Subscribe to see content!
					</span>

					<input
						required
						type="number"
						placeholder="ETH"
						className="form-input my-5 block w-full "
						value={subscriptionPrice}
						onChange={e => setSubscriptionPrice(e.target.value)}
					/>
				</label>
			</div>
			<button
				disabled={!isConnected}
				className="font-semibold mb-2 text-sm text-white py-2 px-3 rounded-sm transition-colors bg-indigo-600 dark:bg-indigo-800 hover:bg-black dark:hover:bg-gray-50 dark:hover:text-gray-900 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-25"
				onClick={() => subscribeToCreator()}
			>
				Subscribe
			</button>
		</div>
	)
}

export default SubscribeToCreatorPopUp
