import ProfileSummery from "./ProfileSummery";
import AboutUser from "./AboutUser";
import Cart from "./Cart";
import WishList from "./WishList";
import { useContext, useEffect, useState } from "react";
import { addItemToUser, addOrderAction, getPaymentSession, getUserOrdersAction } from "../../../context/store/StoreActions";
import StoreContext from "../../../context/store/StoreContext";
import Spinner from "../../shared/Spinner";
import { useNavigate } from "react-router-dom";

const Profile = ({ paymentStatus }) => {

  const [loading, setLoading] = useState(false)
  const [orderID, setOrderID] = useState(false)

  const { store, showModal, deleteFromLocation, showToast } = useContext(StoreContext)

  const navigate = useNavigate()

  const addOrderCredit = async (session) => {
    setLoading(true)

    const data = {
      userID: store.auth.user._id,
      paymentMethod: 'credit',
      transactionID: session.payment_intent,
      coupon: session.metadata.coupon,
      status: 'processing',
      products: JSON.parse(session.metadata.products),
      totalValue: session.amount_subtotal / 100
    }

    await addOrderAction(store.auth.token, data).then(async (res) => {
      if (res.error) {
        showToast(res.error)
        setLoading(false)
        return
      }

      setOrderID(res._id)
      await addItemToUser(store.auth.token, data.userID, 'orders', res._id)
      data.products.map(product => {
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
              <div className="text-center p-5 text-green-600 bg-slate-100 rounded-md mt-4">
                <h1>Your test payment of {data.session.amount_subtotal / 100}$ has succeeded</h1>
                <h1>Your order is submitted with the ID {orderID}</h1>
              </div>
            )
          }

          const orders = await getUserOrdersAction(store.auth.token, store.auth.user._id)
          if (orders.map(order => data.session.payment_intent === order.transactionID).length > 0) return navigate(`/profile/${store.auth.user._id}`)

          if (data.session.payment_status === "paid") {
            await addOrderCredit(data.session)
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
