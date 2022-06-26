import { useContext, useEffect, useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { GiPresent } from "react-icons/gi";
import { BsInfoCircle, BsTrashFill } from "react-icons/bs";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";
import StoreContext from "../../../context/store/StoreContext";
import CartItemRow from "./CartItemRow";
import { addItemToUser, addOrderAction, deleteItemFromUser, getCouponAction, getProductsAction } from "../../../context/store/StoreActions";
import Spinner from "../../shared/Spinner";
import api from "../../../paymentsAPI";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../shared/forms/CheckoutForm";

export default function Cart() {
  const stripePromise = api.getPublicStripeKey()
    .then(key => loadStripe(key))
    .catch(e => console.log(e))

  const { store, setData, showToast, showModal, setLoading, hideModal, deleteFromCart } = useContext(StoreContext)

  const [total, setTotal] = useState(0)
  const [coupon, setCoupon] = useState(null)
  const [couponName, setCouponName] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [productsTotal, setProductsTotal] = useState({})
  const [orderDetails, setOrderDetails] = useState({})

  const applyCoupon = async () => {
    setCouponLoading(true)
    getCouponAction(couponName).then(res => {
      if (res.length === 0) {
        showToast(`not a valid coupon, codes are case sensitive`)
        setCouponLoading(false)
        return
      }
      setCoupon(res[0])
      setCouponLoading(false)
    })
  }

  const handleCheckout = () => {
    const Component = () => {

      const [paymentMethod, setPaymentMethod] = useState('credit')
      const [success, setSuccess] = useState(false)
      const [orderID, setOrderID] = useState('')

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
          paymentMethod,
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
              deleteFromCart(product.productID)
            })
            showToast(`thanks for your purchase your order status is currently ${res.status}`, true)
            hideModal()
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
                    <span className="hover:text-yellow-700">{store.auth.user.email}</span>
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
              onChange={(e) => setPaymentMethod(e.target.value)}
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
                <button disabled={success} onClick={() => sendData()} className={`flex justify-center items-center w-full px-10 py-3 mt-5 font-medium text-white bg-[rgb(253,128,36)] border-2 border-[rgb(253,128,36)] rounded-full outline-none transition-all duration-[350ms] ease-in-out hover:bg-white hover:text-black  
              focus:bg-white focus:text-black uppercase  shadow item-center focus:outline-none ${success && 'bg-slate-300 border-0 hover:bg-slate-300 hover:text-white'}`}>
                  Confirm Order
                </button>
              </>
            )}
          </div>
        </div>
      )
    }
    showModal(Component)
  }

  useEffect(() => {
    setLoading(true)
    getProductsAction().then(res => {
      setData('products', res)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const sum = store.auth.user.cartItems.map(productID => {
      const id = store.appData.products.find(e => e._id === productID)._id
      const price = store.appData.products.find(e => e._id === productID).price
      return productsTotal !== {} ? productsTotal[id] * price : 0
    })

    setTotal(sum.length > 0 && sum.reduce((a, b) => a + b).toFixed(2))
  }, [productsTotal, couponName])

  useEffect(() => {

    const id = !coupon ? null : coupon._id
    const value = !coupon ? null : parseFloat(coupon.value)
    const discountValue = !coupon ? 0 : coupon.isPercentage ? parseFloat(total) * value / 100 : value
    const newSubtotal = parseFloat(total) - (discountValue)
    const tax = newSubtotal * 0.1
    const orderTotal = newSubtotal + tax + 5
    setOrderDetails({
      id,
      total,
      discountValue,
      newSubtotal,
      tax,
      orderTotal
    })
  }, [coupon, total])

  if (store.loading) {
    return <Spinner />
  }

  return (
    <div
      id="cart"
      className="bg-white px-3 py-10 shadow rounded border-t-4 border-yellow-400"
    >
      <div className="flex items-center text-2xl text-gray-900 mb-4">
        <span clas="text-yellow-500">
          <AiOutlineShoppingCart className="mr-2" size={30} />
        </span>
        <span className="tracking-wide">My shopping Cart</span>
        <span className="ml-1 hover:underline hover:underline-offset-[5px] hover:decoration-2 hover:decoration-yellow-400">
          ({store.auth.user.cartItems.length})
        </span>
      </div>

      {/* products in cart deatils */}

      <div className="flex justify-center my-2 px-2">
        <div className="flex flex-col w-full text-gray-800  pin-r pin-y">
          <div className="flex-1">
            <table className="w-full text-sm lg:text-base" cellSpacing="0">
              <thead>
                <tr className="h-12 uppercase">
                  <th className="hidden md:table-cell"></th>
                  <th className="text-left">Product</th>
                  <th className="lg:text-right text-left pl-5 lg:pl-0">
                    <span className="lg:hidden" title="Quantity">
                      Qtd
                    </span>
                    <span className="hidden lg:inline">Quantity</span>
                  </th>
                  <th className="hidden text-right md:table-cell">
                    Unit price
                  </th>
                  <th className="text-right">Total price</th>
                </tr>
              </thead>
              <tbody>
                {store.appData.products.length > 0 && store.auth.user.cartItems.length > 0 && store.auth.user.cartItems.map(item => {
                  const product = store.appData.products.filter(p => p._id === item)[0]
                  return <CartItemRow key={product._id} product={product} setProductsTotal={setProductsTotal} />
                })}
              </tbody>
            </table>

            <hr className="pb-6 mt-6"></hr>
            {/* coupon deatils */}

            <div className="my-4 mt-6 -mx-2 lg:flex">
              <div className="lg:px-2 lg:w-1/2">
                <div className="p-4 bg-yellow-100 rounded-full">
                  <h1 className="ml-2 font-bold uppercase">Coupon Code</h1>
                </div>
                <div className="p-4">
                  <p className="mb-4 italic">
                    If you have a coupon code, please enter it in the box below
                  </p>
                  <div className="justify-center md:flex">
                    <div className="flex items-center w-full h-13 pl-3 bg-gray-100 border rounded-full">
                      <input
                        type="coupon"
                        name="code"
                        id="coupon"
                        placeholder="Apply coupon"
                        className="w-full bg-gray-100 outline-none appearance-none focus:outline-none active:outline-none"
                        value={couponName}
                        onChange={(e) => setCouponName(e.target.value)}
                      />
                      <button
                        disabled={couponLoading}
                        onClick={() => applyCoupon()}
                        type="submit"
                        className="text-sm flex items-center px-3 py-1 text-white bg-[rgb(253,128,36)] border-2 border-[rgb(253,128,36)] rounded-r-full outline-none md:px-4   transition-all duration-[350ms] ease-in-out hover:bg-white hover:text-black  
                          focus:bg-white focus:text-black   focus:outline-none active:outline-none"
                      >
                        <GiPresent size={50} />
                        <span className="font-medium">Apply coupon</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* order deatils */}
              <div className="lg:px-2 lg:w-1/2">
                <div className="p-4 bg-yellow-100 rounded-full">
                  <h1 className="ml-2 font-bold uppercase">Order Details</h1>
                </div>
                <div className="p-4">
                  <p className="mb-6 italic">
                    Shipping and additionnal costs are calculated based on
                    values you have entered
                  </p>
                  <div className="flex justify-between border-b">
                    <div className="lg:px-4 lg:py-2 m-2 text-lg lg:text-xl font-bold text-center text-gray-800">
                      Total
                    </div>
                    <div className="lg:px-4 lg:py-2 m-2 lg:text-lg font-bold text-center text-gray-900">
                      {total}€
                    </div>
                  </div>
                  <div className="flex justify-between pt-4 border-b">
                    <div className="flex lg:px-4 lg:py-2 m-2 text-lg lg:text-xl font-bold text-gray-800">
                      <button onClick={() => setCoupon({})} className="mr-2 mt-1 lg:mt-2">
                        <BsTrashFill
                          size={20}
                          className="text-red-600 hover:text-red-800"
                        />
                      </button>
                      Coupon "{coupon && coupon.name}"
                    </div>
                    <div className="lg:px-4 lg:py-2 m-2 lg:text-lg font-bold text-center text-green-700">
                      -{orderDetails.discountValue ? orderDetails.discountValue.toFixed(2) : (0).toFixed(2)}€
                    </div>
                  </div>
                  <div className="flex justify-between pt-4 border-b">
                    <div className="lg:px-4 lg:py-2 m-2 text-lg lg:text-xl font-bold text-center text-gray-800">
                      New Subtotal
                    </div>
                    <div className="lg:px-4 lg:py-2 m-2 lg:text-lg font-bold text-center text-gray-900">
                      {orderDetails.newSubtotal ? orderDetails.newSubtotal.toFixed(2) : (0).toFixed(2)}€
                    </div>
                  </div>
                  <div className="flex justify-between pt-4 border-b">
                    <div className="lg:px-4 lg:py-2 m-2 text-lg lg:text-xl font-bold text-center text-gray-800">
                      Tax
                    </div>
                    <div className="lg:px-4 lg:py-2 m-2 lg:text-lg font-bold text-center text-gray-900">
                      {orderDetails.tax ? orderDetails.tax.toFixed(2) : (0).toFixed(2)}€
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-b">
                    <div className="lg:px-4 lg:py-2 m-2 text-lg lg:text-xl font-bold text-center text-gray-800">
                      Shipping Cost
                    </div>
                    <div className="lg:px-4 lg:py-2 m-2 lg:text-lg font-bold text-center text-gray-900">
                      {(5).toFixed(2)}€
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-b">
                    <div className="lg:px-4 lg:py-2 m-2 text-lg lg:text-xl font-bold text-center text-gray-800">
                      Total
                    </div>
                    <div className="lg:px-4 lg:py-2 m-2 lg:text-lg font-bold text-center text-gray-900">
                      {orderDetails.orderTotal ? orderDetails.orderTotal.toFixed(2) : (0).toFixed(2)}€
                    </div>
                  </div>
                  <button
                    onClick={() => handleCheckout()}
                    className="flex justify-center items-center w-full px-10 py-3  font-medium text-white bg-[rgb(253,128,36)] border-2 border-[rgb(253,128,36)] rounded-full outline-none transition-all duration-[350ms] ease-in-out hover:bg-white hover:text-black  
                          focus:bg-white focus:text-black uppercase  shadow item-center  focus:outline-none"
                  >
                    <BsFillCreditCard2FrontFill size={30} />
                    <span className="ml-2 mt-5px">Procceed to checkout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
