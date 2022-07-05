import { useContext, useEffect, useState } from "react"
import { MdArrowDropDown, MdCancel, MdEdit } from "react-icons/md"
import { editOrderAction, getOrdersAction } from "../../../context/store/StoreActions"
import StoreContext from "../../../context/store/StoreContext"
import useConfirm from "../../../hooks/useConfirm"
import OrdersForm from "../../shared/forms/OrdersForm"
import Spinner from "../../shared/Spinner"

const OrdersTool = () => {
  const { store, showModal, hideModal, showToast, setData } = useContext(StoreContext)

  const [filter, setFilter] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState([])
  const [reload, setReload] = useState(false)

  const { confirmAction } = useConfirm()

  const sorter = (array) => {
    return array.sort(((a, b) => {
      let x = a[filter].toLowerCase()
      let y = b[filter].toLowerCase()
      return x === y ? 0 : x > y ? 1 : -1;
    }))
  }

  const handleSearch = (query) => {
    if (query.length > 0) {
      setSearchResults(sorter(store.appData.orders.filter(order => order[filter].toLowerCase().includes(query.toLowerCase()))))
    } else {
      setSearchResults(sorter(store.appData.orders))
    }
  }

  useEffect(() => {
    setLoading(true)
    getOrdersAction(store.auth.token).then((data) => {
      if (data.error) {
        showToast(data.error, false)
        setData('orders', [])
        setSearchResults([])
        setLoading(false)
        return
      }
      setData('orders', data)
      setSearchResults(data)
      setLoading(false)
    })
  }, [reload])

  // submit the edit form
  const handleEditSubmit = async (formStates) => {
    const orderData = {
      id: formStates.id,
      paymentMethod: formStates.paymentMethod,
      coupon: formStates.coupon,
      status: formStates.status,
      products: formStates.products,
      totalValue: formStates.totalValue,
    }

    /* Send data to API to edit the order */
    await editOrderAction(store.auth.token, orderData).then(data => {
      if (data.error) return showToast(data.error, false)

      hideModal()
      setReload(!reload)
    })
  }

  // opens edit modal
  const modalEdit = (index) => {
    const order = store.appData.orders[index]
    const initStates = {
      id: order._id,
      userID: order.userID,
      paymentMethod: order.paymentMethod,
      coupon: order.coupon,
      status: order.status,
      products: order.products,
      totalValue: order.totalValue,
    }

    // fills the content for the edit modal
    const Content = () => {
      return (
        <div className="px-6 pb-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edit Coupon</h3>
          <OrdersForm onSubmit={handleEditSubmit} initStates={initStates} />
        </div>
      )
    }
    showModal(Content)
  }

  const handleCancel = async (index) => {
    if (store.appData.orders[index].status === 'canceled') return showToast('order status is already canceled', false)

    const data = {
      id: store.appData.orders[index]._id,
      status: 'canceled'
    }

    const isConfirmed = await confirmAction(`Please confirm to cancel order ${data.id}`)
    if (!isConfirmed) return

    /* Send data to API to cancel the order */
    await editOrderAction(store.auth.token, data).then(data => {
      if (data.error) return showToast(data.error, false)

      setReload(!reload)
    })
  }

  return (
    <>
      {loading
        ? (
          <Spinner />
        )
        : (
          <div className='grid place-items-center'>
            <h1 className='text-left text-xl font-medium p-6 text-gray-700'>Orders Data</h1>
            <div className='max-w-7xl px-6'>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="p-4 flex">
                  <label htmlFor="table-search" className="sr-only">Search</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                    </div>
                    <input
                      onChange={(e) => handleSearch(e.target.value)}
                      type="text"
                      id="table-search"
                      placeholder="select search filter from the table"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                  </div>
                </div>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Status <button onClick={() => setFilter('status')}><MdArrowDropDown /></button>
                      </th>
                      <th scope="col" className="px-6 py-3 hidden sm:table-cell">
                        Order ID <button onClick={() => setFilter('_id')}><MdArrowDropDown /></button>
                      </th>
                      <th scope="col" className="px-6 py-3 hidden md:table-cell">
                        Coupon Applied
                      </th>
                      <th scope="col" className="px-6 py-3 hidden lg:table-cell">
                        Payment Method <button onClick={() => setFilter('paymentMethod')}><MdArrowDropDown /></button>
                      </th>
                      <th scope="col" className="px-6 py-3 hidden xl:table-cell">
                        Total Value
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <span>Edit or Delete</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((order, i) => (
                      <tr key={i} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          <p className="truncate">{order.status}</p>
                        </th>
                        <th scope="row" className="px-6 py-4 hidden sm:table-cell font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          <p className="truncate">{order._id}</p>
                        </th>
                        <th scope="row" className="px-6 py-4 hidden md:table-cell font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          <p className="truncate">{order.coupon ? "Applied" : "None"}</p>
                        </th>
                        <th scope="row" className="px-6 py-4 hidden lg:table-cell font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          <p className="truncate">{order.paymentMethod}</p>
                        </th>
                        <th scope="row" className="px-6 py-4 hidden xl:table-cell font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          <p className="truncate">{parseFloat(order.totalValue).toFixed(2)}</p>
                        </th>
                        <td className="px-6 py-4 flex max-w-fit">
                          <button data-toggle='tooltip' title="edit" id={i} onClick={(e) => modalEdit(e.currentTarget.id)} className="group relative flex-grow flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">
                            <MdEdit />
                          </button>
                          <button data-toggle='tooltip' title="cancel" id={i} onClick={(e) => handleCancel(e.currentTarget.id)} className="group relative flex-grow flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:bg-rose-700">
                            <MdCancel />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        )}
    </>
  )
}

export default OrdersTool