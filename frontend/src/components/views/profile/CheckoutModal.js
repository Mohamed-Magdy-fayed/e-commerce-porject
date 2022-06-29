import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useContext, useState } from "react"
import { BsInfoCircle } from "react-icons/bs"
import { addItemToUser, addOrderAction } from "../../../context/store/StoreActions"
import StoreContext from "../../../context/store/StoreContext"
import { getPublicStripeKey } from "../../../paymentsAPI"
import CheckoutForm from "../../shared/forms/CheckoutForm"

const CheckoutModal = ({ productsTotal, coupon, orderDetails }) => {

    const [paymentMethod, setPaymentMethod] = useState('credit')
    const [success, setSuccess] = useState(false)
    const [orderID, setOrderID] = useState('')

    const { store, deleteFromLocation, showToast } = useContext(StoreContext)

    const stripePromise = getPublicStripeKey(store.auth.token)
        .then(key => loadStripe(key))
        .catch(e => console.log(e))

    const products = Object.keys(productsTotal).map(id => {
        const amount = productsTotal[id]
        return {
            productID: id,
            amount,
        }
    })

    const sendData = () => {
        const data = {
            userID: store.auth.user._id,
            paymentMethod: 'cash',
            transactionID: null,
            coupon: coupon && coupon._id,
            status: 'processing',
            products,
            totalValue: orderDetails.orderTotal
        }

        addOrderAction(data).then((res) => {
            if (res) {
                setSuccess(true)
                setOrderID(res._id)
                addItemToUser(data.userID, 'orders', res._id)
                products.forEach(product => {
                    deleteFromLocation(product.productID, 'cartItems')
                })
                showToast(`thanks for your purchase your order status is currently ${res.status}`, true)
            } else {
                setSuccess(false)
                showToast(`an error occured please try again later`)
            }
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
                    <Elements stripe={stripePromise}>
                        <CheckoutForm total={orderDetails.orderTotal} curr={'EUR'} coupon={coupon} products={products} orderTotal={orderDetails.orderTotal} />
                    </Elements>
                ) : (
                    <>
                        {success && (
                            <div className="text-center p-5 text-green-600 bg-slate-100 rounded-md mt-4">
                                <h1>Your order submitted with the ID of {orderID}</h1>
                            </div>
                        )}
                        <button disabled={success} onClick={() => sendData()} className={`flex justify-center items-center w-full px-10 py-3 mt-5 font-medium text-white bg-[rgb(253,128,36)] border-2 border-[rgb(253,128,36)] rounded-full outline-none transition-all duration-[350ms] ease-in-out hover:bg-white hover:text-black focus:bg-white focus:text-black uppercase  shadow item-center focus:outline-none ${success && 'bg-slate-300 border-0 hover:bg-slate-300 hover:text-white'}`}>
                            Confirm Order
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default CheckoutModal
