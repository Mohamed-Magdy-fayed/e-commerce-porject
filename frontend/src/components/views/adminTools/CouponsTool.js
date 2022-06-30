import { useContext, useEffect, useState } from "react"
import { MdAdd, MdDelete, MdEdit } from "react-icons/md"
import { addCouponsAction, deleteCouponsAction, editCouponsAction, getCouponsAction } from "../../../context/store/StoreActions"
import StoreContext from "../../../context/store/StoreContext"
import CouponsForm from "../../shared/forms/CouponsForm"
import Spinner from "../../shared/Spinner"

const CouponsTool = () => {
  const { store, showModal, hideModal, setData, showToast, setLoading } = useContext(StoreContext)

  const [searchResults, setSearchResults] = useState([])
  const [reload, setReload] = useState(false)

  useEffect(() => {
    setLoading(true)
    getCouponsAction(store.auth.token).then((data) => {
      if (!data) {
        showToast('an error occurred, please try again', false)
        setData('coupons', [])
        setSearchResults([])
        setLoading(false)
      } else {
        setData('coupons', data)
        setSearchResults(data)
        setLoading(false)
      }
    })
  }, [reload])

  // submit the add form
  const handleAddSubmit = async (formStates) => {

    setLoading(true)

    const couponData = {
      name: formStates.name,
      applyOnCash: formStates.applyOnCash,
      isPercentage: formStates.isPercentage,
      value: formStates.value,
      isActive: formStates.isActive,
      minValue: formStates.minValue,
      validTill: formStates.validTill,
    }

    /* Send data to API to register a new user */
    const newCoupon = await addCouponsAction(store.auth.token, couponData)
    hideModal()
    getCouponsAction(store.auth.token).then(() => {
      setReload(!reload)
      setLoading(false)
    })

    return newCoupon
  }

  // open the modal and fill it's content 
  const modalAdd = () => {
    // modal content
    const Content = () => {
      return (
        <div className="px-6 pb-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add Coupon</h3>
          <CouponsForm onSubmit={handleAddSubmit} />
        </div>
      )
    }
    showModal(Content)
  }

  // submit the edit form
  const handleEditSubmit = async (formStates) => {
    setLoading(true)
    const couponData = {
      id: formStates.id,
      name: formStates.name,
      applyOnCash: formStates.applyOnCash,
      isPercentage: formStates.isPercentage,
      value: formStates.value,
      isActive: formStates.isActive,
      minValue: formStates.minValue,
      validTill: formStates.validTill
    }

    /* Send data to API to register a new user */
    const newCoupon = await editCouponsAction(store.auth.token, couponData)
    hideModal()
    getCouponsAction(store.auth.token).then(() => {
      setReload(!reload)
      setLoading(false)
    })

    console.log(newCoupon);
    return newCoupon
  }

  // opens edit modal
  const modalEdit = (index) => {
    const initStates = {
      id: store.appData.coupons[index]._id,
      name: store.appData.coupons[index].name,
      applyOnCash: store.appData.coupons[index].applyOnCash,
      isPercentage: store.appData.coupons[index].isPercentage,
      value: store.appData.coupons[index].value,
      isActive: store.appData.coupons[index].isActive,
      minValue: store.appData.coupons[index].minValue,
      validTill: new Date(store.appData.coupons[index].validTill).toISOString().split('T')[0],
    }

    // fills the content for the edit modal
    const Content = () => {
      return (
        <div className="px-6 pb-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edit Coupon</h3>
          <CouponsForm onSubmit={handleEditSubmit} initStates={initStates} />
        </div>
      )
    }

    showModal(Content)
  }

  const handleDelete = async (index) => {
    setLoading(true)
    const cid = store.appData.coupons[index]._id
    /* Send data to API to register a new user */
    await deleteCouponsAction(store.auth.token, cid)
      .then(() => {
        setReload(!reload)
      })
  }

  return (
    <>
      {store.loading
        ? (
          <Spinner />
        )
        : (
          <div className='grid place-items-center'>
            <h1 className='text-left text-xl font-medium p-6 text-gray-700'>Coupons Data</h1>
            <div className='max-w-2xl px-6'>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="p-4 flex">
                  <label htmlFor="table-search" className="sr-only">Search</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                    </div>
                    <input
                      onChange={(e) => {
                        if (e.target.value !== '') {
                          setSearchResults(store.appData.coupons.filter(coupon => coupon.name.toLowerCase().includes(e.target.value)))
                        } else {
                          setSearchResults(store.appData.coupons)
                        }
                      }}
                      type="text"
                      id="table-search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items" />
                  </div>
                  <button onClick={() => modalAdd()} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="authentication-modal">
                    <MdAdd size={30}></MdAdd> Add
                  </button>
                </div>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Coupon Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Valid Till
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <span>Edit or Delete</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((coupon, i) => (
                      <tr key={i} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          {coupon.name}
                        </th>
                        <td className={`px-6 py-4 ${coupon && coupon.validTill < Date.now() ? 'text-red-500' : ''}`}>
                          {new Date(coupon.validTill).toISOString().split('T')[0]}
                        </td>
                        <td className="px-6 py-4 flex max-w-fit">
                          <button id={i} onClick={(e) => modalEdit(e.currentTarget.id)} className="group relative flex-grow flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">
                            <MdEdit />
                          </button>
                          <button id={i} onClick={(e) => handleDelete(e.currentTarget.id)} className="group relative flex-grow flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:bg-rose-700">
                            <MdDelete />
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

export default CouponsTool