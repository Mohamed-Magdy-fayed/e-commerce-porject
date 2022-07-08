import { useContext, useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi";
import { BsEnvelopeOpenFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { editOrderAction, getUserOrdersAction } from "../../../context/store/StoreActions";
import StoreContext from '../../../context/store/StoreContext'
import useConfirm from '../../../hooks/useConfirm'
import Spinner from "../../shared/Spinner";

const ProfileSummery = () => {

  const { store, showModal, showToast } = useContext(StoreContext)
  const { confirmAction } = useConfirm()

  const [reload, setReload] = useState(false)

  const showOrders = () => {

    const Component = () => {
      const [loading, setLoading] = useState(false)
      const [orders, setOrders] = useState([])

      const handleCancelOrder = async (id) => {
        setLoading(true)

        const isConfirmed = await confirmAction(`Please confirm to cancel the order ${id}`)
        if (!isConfirmed) return setLoading(false)

        await editOrderAction(store.auth.token, { id, status: 'canceled' }).then(res => {
          if (res.error) return showToast(res.error, false)
          setReload(!reload)
          setLoading(false)
        })
      }

      useEffect(() => {
        setLoading(true)
        if (!store.auth.token || !store.auth.user._id) return
        getUserOrdersAction(store.auth.token, store.auth.user._id).then(res => {
          if (res.error) return showToast(res.error, false)

          setOrders(res)
          setLoading(false)
        })
      }, [reload, store.auth])

      if (loading) return (
        <div className="grid place-items-center w-full h-40">
          <Spinner />
        </div>
      )

      return (
        <div className="relative grid place-items-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">Your orders</h3>
          <div className="flex flex-col gap-4 p-4">
            {orders.length === 0 ? <p>You don't have any orders yet</p> : orders.map(order => (
              <div key={order._id} className="w-full border rounded-md px-4 py-2 shadow-sm flex items-center justify-around flex-wrap">
                <div className="w-full">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white text-center m-4">Order details</h4>
                  <p className="flex justify-between text-indigo-800">Order ID: <span className="text-black">{order._id}</span></p>
                  <p className="flex justify-between text-indigo-800">value: <span className="text-black">$ {parseFloat(order.totalValue).toFixed(2)}</span></p>
                  <p className="flex justify-between text-indigo-800">status: <span className="text-black">{order.status}</span></p>
                  <p className="flex justify-between text-indigo-800">Payment method: <span className="text-black">{order.paymentMethod}</span></p>
                </div>
                <div className="flex justify-between w-full my-4">
                  <Link
                    to={`/cs/create/${order._id}`}
                    className="group relative flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <BsEnvelopeOpenFill />
                    <span className="mx-4">Complain</span>
                  </Link>
                  {loading
                    ? (<button
                      disabled
                      type="button"
                      className="group relative flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                      </svg>
                      Please wait...
                    </button>)
                    : (<button
                      type="button"
                      onClick={() => handleCancelOrder(order._id)}
                      className="group relative flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <AiFillDelete />
                      <span className="mx-4">Cancel</span>
                    </button>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    showModal(Component)
  }

  return (
    <div
      id="profile-summery"
      className=" w-full grid place-items-center bg-white shadow rounded p-3 py-10 border-t-4 border-indigo-400 "
    >
      <h2 className="text-gray-900 flex items-center text-2xl mb-4">
        <BiUserCircle size={30} className="mr-1" />
        {store.auth.user.firstName} {store.auth.user.lastName}
      </h2>

      <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm w-full max-w-[550px]">
        <li className="flex items-center py-3">
          <span>Status</span>
          <span className="ml-auto">
            <span className="bg-indigo-500 py-1 px-2 rounded text-white text-sm">
              {store.auth.user.status}
            </span>
          </span>
        </li>
        <li className="flex items-center py-3">
          <span>Member since</span>
          <span className="ml-auto">{new Date(Date.parse(store.auth.user.createdAt)).toDateString()}</span>
        </li>
        <li className="flex items-center justify-between py-3">
          <span>Your orders</span>
          <button
            type="button"
            onClick={() => showOrders()}
            className="group relative w-fit flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Show orders
          </button>
        </li>
      </ul>
    </div>
  );
}

export default ProfileSummery
