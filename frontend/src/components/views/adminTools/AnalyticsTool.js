import { useContext, useEffect, useState } from 'react'
import { getAdminDataAction } from '../../../context/store/StoreActions'
import StoreContext from '../../../context/store/StoreContext'
import Spinner from '../../shared/Spinner'

export const AnalyticsTool = () => {

  const { store, showToast, setData } = useContext(StoreContext)

  const [loading, setLoading] = useState([])

  const calcOrdersValue = (orders, isPending) => {
    let total = 0
    if (isPending) {
      orders.forEach(order => {
        total += order.status === 'pending' ? parseFloat(order.totalValue) : 0
      })
      return total.toFixed(2)
    }
    orders.forEach(order => {
      total += parseFloat(order.totalValue)
    })
    return total.toFixed(2)
  }

  useEffect(() => {
    setLoading(true)
    getAdminDataAction().then((res) => {
      if (res.error) {
        showToast(res.error, false)
        setData('products', [])
        setData('users', [])
        setData('orders', [])
        setLoading(false)
      } else {
        setData('products', res.products)
        setData('users', res.users)
        setData('orders', res.orders)
        setLoading(false)
      }
    })
  }, [])

  return (
    <>
      {loading
        ? (
          <Spinner />
        )
        : (
          <div className='grid place-items-center mb-3'>
            <h1 className='text-left text-xl font-medium p-6 text-gray-700'>Analytics Data</h1>
            <div className='max-w-[90%] px-6'>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Data
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        Users
                      </th>
                      <td className="px-6 py-4">
                        <p>
                          {store.appData.users.filter(user => user.status !== 'Active').length} Inacticve
                        </p>
                      </td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        Products
                      </th>
                      <td className="px-6 py-4">
                        <p>
                          {store.appData.products.length} Products
                        </p>
                      </td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        Orders
                      </th>
                      <td className="px-6 py-4">
                        <p>
                          {store.appData.orders.length} Orders
                        </p>
                      </td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        Orders Total Value
                      </th>
                      <td className="px-6 py-4">
                        <p>
                          {calcOrdersValue(store.appData.orders)}$
                        </p>
                      </td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        Pending Orders Value
                      </th>
                      <td className="px-6 py-4">
                        <p>
                          {calcOrdersValue(store.appData.orders, true)}$
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        )}
    </>
  )
}
