import { useContext, useState } from "react"
import { BsArrowBarRight, BsInfoCircle } from "react-icons/bs"
import { addItemToUser, addOrderAction, getPaymentLink } from "../../../context/store/StoreActions"
import StoreContext from "../../../context/store/StoreContext"

const CheckoutModal = ({ productsTotal, coupon, orderDetails }) => {

    const [paymentMethod, setPaymentMethod] = useState('cash')
    const [success, setSuccess] = useState(false)
    const [orderID, setOrderID] = useState('')
    const [loading, setLoading] = useState(false)

    const { store, deleteFromLocation, showToast, addToLocation, hideModal } = useContext(StoreContext)

    const products = productsTotal.map(item => {
        return {
            productID: item.productID,
            amount: item.amount,
        }
    })

    const handleCardPayment = async () => {
        setLoading(true)
        const orderData = {
            userID: store.auth.user._id,
            paymentMethod: 'credit',
            transactionID: null,
            coupon: coupon ? coupon._id : null,
            status: 'pending',
            products: productsTotal,
        }

        await addOrderAction(store.auth.token, orderData)
            .then(data => {
                if (data.error) return showToast(data.error, false)

                addItemToUser(store.auth.token, data.userID, 'orders', data._id)
                addToLocation(data._id, 'orders')

                getPaymentLink(store.auth.token, data)
                    .then(data => {
                        if (data.error) return showToast(data.error, false)
                        localStorage.setItem('payment', JSON.stringify(data.session.id))
                        setLoading(false)
                        window.location = data.session.url
                    })
            })
    }

    const sendData = () => {
        const data = {
            userID: store.auth.user._id,
            paymentMethod: 'cash',
            transactionID: null,
            coupon: coupon && coupon._id,
            status: 'processing',
            products,
            totalValue: orderDetails.subTotal
        }

        addOrderAction(store.auth.token, data).then((res) => {

            if (res.error) return showToast(res.error, false)

            setSuccess(true)
            setOrderID(res._id)
            addItemToUser(store.auth.token, data.userID, 'orders', res._id)
            products.forEach(product => {
                deleteFromLocation(product.productID, 'cartItems')
            })
            showToast(`thanks for your purchase your order status is currently ${res.status}`, true)
        })
    }
    return (
        <div className="px-6 pb-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Checkout</h3>
            <div>
                <div className="flex items-center  text-gray-900 mb-4 text-2xl">
                    <span clas="text-green-500">
                        <BsInfoCircle className="mr-1" size={30} />
                    </span>
                    <span className="tracking-wide">Shipping info</span>
                </div>
                <div className="text-gray-700">
                    <div className="grid md:grid-cols-2 text-sm">
                        <div className="grid grid-cols-2">
                            <div className="px-4 py-2 font-semibold">Address</div>
                            <div className="px-4 py-2">{store.auth.user.address}</div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="px-4 py-2 font-semibold">Email.</div>
                            <div className="px-4 py-2 ">
                                <span className="hover:text-indigo-700 truncate block">{store.auth.user.email}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="px-4 py-2 font-semibold">Phone Number</div>
                            <div className="px-4 py-2">{store.auth.user.phone}</div>
                        </div>
                    </div>
                </div>
                <select
                    disabled={success}
                    className="!ring-0 rounded-md border-2 border-slate-400 w-full p-3 focus:border-slate-400"
                    id="paymentMethod"
                    name="paymentMethod"
                    value={paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
                    onChange={(e) => setPaymentMethod(e.target.value.toLowerCase())}
                >
                    <option>Cash</option>
                    <option>Credit</option>
                </select>
                {paymentMethod === 'credit' ? (
                    <div className="w-full flex items-center justify-around py-4">
                        {loading
                            ? (<button
                                disabled
                                type="button"
                                className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                </svg>
                                Please wait...
                            </button>)
                            : (<button
                                type="button"
                                onClick={() => handleCardPayment()}
                                className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Go to payment
                            </button>)}
                    </div>
                ) : (
                    <>
                        {success && (
                            <div className="text-center p-5 text-green-600 bg-slate-100 rounded-md mt-4">
                                <h1>Your order submitted with the ID of {orderID}</h1>
                            </div>
                        )}
                        <div className="w-full flex items-center justify-around py-4">
                            {success ? (
                                <button onClick={() => hideModal()} className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <span>Continue</span><BsArrowBarRight size={20}></BsArrowBarRight>
                                </button>
                            ) : (
                                <button disabled={success} onClick={() => sendData()} className='group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                                    Confirm Order
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default CheckoutModal
