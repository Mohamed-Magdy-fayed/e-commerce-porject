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
    getAdminDataAction(store.auth.token).then((res) => {
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
            <div className='max-w-7xl px-6'>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Data
                      </th>
                      <th scope="col" className="px-6 py-3 hidden sm:table-cell">
                        Details
                      </th>
                      <th scope="col" className="px-6 py-3 hidden md:table-cell">
                        Details
                      </th>
                      <th scope="col" className="px-6 py-3 hidden lg:table-cell">
                        Details
                      </th>
                      <th scope="col" className="px-6 py-3 hidden xl:table-cell">
                        Details
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Count
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        Users
                      </th>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        {store.appData.users.filter(user => user.status !== 'Active').length} Inacticve
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        {store.appData.users.filter(u => u.type === 'Admin').length} Admins
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        {store.appData.users.filter(u => u.type === 'User').length} Users
                      </td>
                      <td className="px-6 py-4 hidden xl:table-cell">
                        {store.appData.users.filter(u => u.status === 'suspended').length} Suspended
                      </td>
                      <td className="px-6 py-4">
                        <p>
                          {store.appData.users.length}
                        </p>
                      </td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        Products
                      </th>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <p>
                          {store.appData.products.filter(p => p.isFeatured).length} Featured
                        </p>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <p>
                          {store.appData.products.filter(p => Date.now() - Date.parse(p.createdAt) < 2592000000).length} New
                        </p>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <p>
                          {store.appData.products.filter(p => p.brand === 'LEGO').length} Lego
                        </p>
                      </td>
                      <td className="px-6 py-4 hidden xl:table-cell">
                        <p>
                          {console.log(store.appData.products)}
                          {store.appData.products.filter(p => p.images.filter(i => i.length > 0) === 0).length} With no image
                        </p>
                      </td>
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
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <p>
                          {store.appData.orders.filter(order => order.status === 'pending').length} Pending
                        </p>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <p>
                          {store.appData.orders.filter(order => order.status === 'processing').length} Processing
                        </p>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <p>
                          {store.appData.orders.filter(order => order.status === 'canceled').length} Canceled
                        </p>
                      </td>
                      <td className="px-6 py-4 hidden xl:table-cell">
                        <p>
                          {store.appData.orders.filter(order => order.status === 'delivered').length} Delivered
                        </p>
                      </td>
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
