import ProfileSummery from "./ProfileSummery";
import AboutUser from "./AboutUser";
import Cart from "./Cart";
import WishList from "./WishList";
import { useContext, useEffect, useState } from "react";
import { addItemToUser, addOrderAction, editOrderAction, getPaymentSession, getUserOrdersAction } from "../../../context/store/StoreActions";
import StoreContext from "../../../context/store/StoreContext";
import Spinner from "../../shared/Spinner";
import { useNavigate } from "react-router-dom";
import { BsArrowBarRight } from "react-icons/bs";

const Profile = ({ paymentStatus }) => {

  const [loading, setLoading] = useState(false)
  const [orderID, setOrderID] = useState(false)

  const { store, showModal, deleteFromLocation, showToast, setUserData, hideModal } = useContext(StoreContext)

  const navigate = useNavigate()

  const confirmOrderCredit = async (session, order) => {
    setLoading(true)
    setOrderID(order._id)

    const data = {
      id: order._id,
      transactionID: session.payment_intent,
      status: 'processing',
    }
    console.log(data)

    await editOrderAction(store.auth.token, data).then(async (res) => {
      console.log(res)
      if (res.error) {
        showToast(res.error)
        setLoading(false)
        return
      }

      order.products.map(product => {
        deleteFromLocation(product.productID, 'cartItems')
      })
      setLoading(false)
    })
  }

  useEffect(() => {
    if (paymentStatus === 'success' && store.auth.token.length > 0) {
      const sessionID = JSON.parse(localStorage.getItem('payment'))
      getPaymentSession(store.auth.token, sessionID)
        .then(async data => {
          const RenderSuccess = () => {
            return (
              <div className="w-full flex flex-col items-center justify-around py-4">
                <div className="text-center p-5 text-green-600 bg-slate-100 rounded-md mt-4">
                  <h1>Your test payment of {data.session.amount_subtotal / 100}$ has succeeded</h1>
                  <h1>Your order is submitted with the ID {data.session.metadata.orderID}</h1>
                </div>
                <button onClick={() => hideModal()} className="my-4 group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span>Continue</span><BsArrowBarRight size={20}></BsArrowBarRight>
                </button>
              </div>
            )
          }

          const orders = await getUserOrdersAction(store.auth.token, store.auth.user._id)
          setUserData('orders', orders)
          console.log(orders, data.session.payment_intent)
          if (orders.filter(order => data.session.payment_intent === order.transactionID).length > 0) return navigate(`/profile/${store.auth.user._id}`)

          if (data.session.payment_status === "paid") {
            const order = orders.filter(order => data.session.metadata.orderID === order._id)[0]
            console.log(order)
            setOrderID(order._id)
            await confirmOrderCredit(data.session, order)
            showModal(RenderSuccess)
            navigate(`/profile/${store.auth.user._id}`)
          }
        })
    }
  }, [paymentStatus, store.auth.token])

  if (loading) return <Spinner />

  return (
    <div className="bg-gray-200 mx-auto py-10 px-5">
      <div className="md:flex no-wrap md:-mx-2 ">
        <div className="w-full max-w-[992px] mx-auto">
          <div className="md:flex gap-4 justify-between">
            {/*profile summery */}
            <ProfileSummery />

            <div className="my-10"></div>
            {/* about section */}
            <AboutUser />
          </div>

          <div className="my-10"></div>

          {/* Cart section */}
          <Cart />

          <div className="my-10"></div>

          {/* whish list section */}
          <WishList />
        </div>
      </div>
    </div>
  );
}

export default Profile
