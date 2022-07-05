import { useContext, useEffect, useState } from 'react'
import { MdAdd, MdArrowDropDown, MdDelete, MdEdit } from 'react-icons/md'
import { addProductAction, deleteProductAction, editProductAction, getProductsAction } from '../../../context/store/StoreActions'
import StoreContext from '../../../context/store/StoreContext'
import useConfirm from '../../../hooks/useConfirm'
import ProductsForm from '../../shared/forms/ProductsForm'
import Spinner from '../../shared/Spinner'

const ProductsTool = () => {

  const { store, showModal, hideModal, setData, setProductForm, showToast } = useContext(StoreContext)

  const [filter, setFilter] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState([])
  const [addButtonLoading, setAddButtonLoading] = useState(false)
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
      setSearchResults(sorter(store.appData.products.filter(product => product[filter].toLowerCase().includes(query.toLowerCase()))))
    } else {
      setSearchResults(sorter(store.appData.products))
    }
  }

  useEffect(() => {
    setLoading(true)
    getProductsAction(store.auth.token).then((data) => {
      if (data.error) {
        showToast(data.error, false)
        setData('products', [])
        setSearchResults([])
        setLoading(false)
        return
      }

      setData('products', data)
      setSearchResults(data)
      setLoading(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.productForm, reload])

  // submit the add form
  const handleAddSubmit = async (formStates) => {

    const productData = {
      id: formStates.id,
      name: formStates.name,
      details: formStates.details,
      images: formStates.images,
      price: formStates.price,
      brand: formStates.brand,
      category: formStates.category,
      isFeatured: formStates.isFeatured,
      age: formStates.age,
      pieces: formStates.pieces,
      features: formStates.features,
    }

    /* Send data to API to add a new product */
    await editProductAction(store.auth.token, productData).then(data => {
      if (data.error) return showToast(data.error, false)

      hideModal()
      setReload(!reload)
    })
  }

  // open the modal and fill it's content 
  const modalAdd = async () => {
    setAddButtonLoading(true)
    const initStates = {
      name: ' ',
      details: ' ',
      images: [],
      price: 0,
      brand: ' ',
      category: ' ',
      isFeatured: false,
      age: ' ',
      pieces: ' ',
      features: ' ',
      highlights: [],
      tags: [],
    }

    await addProductAction(store.auth.token, initStates).then(data => {
      if (data.error) {
        showToast(data.error, false)
        setAddButtonLoading(false)
        return
      }
      setAddButtonLoading(false)
      setProductForm(data._id, false)

      const Content = () => {
        return (
          <div className="px-6 pb-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add Product</h3>
            <ProductsForm onSubmit={handleAddSubmit} id={data._id} />
          </div>
        )
      }

      showModal(Content)
    })

  }

  // submit the edit form
  const handleEditSubmit = async (formStates) => {
    const productData = {
      id: formStates.id,
      name: formStates.name,
      details: formStates.details,
      images: formStates.images,
      price: formStates.price,
      brand: formStates.brand,
      category: formStates.category,
      isFeatured: formStates.isFeatured,
      age: formStates.age,
      pieces: formStates.pieces,
      features: formStates.features,
    }
    setProductForm(productData.id, true)

    /* Send data to API to edit the product */
    await editProductAction(store.auth.token, productData).then(data => {
      if (data.error) return showToast(data.error, false)

      setProductForm('', false)
      hideModal()
      setReload(!reload)
    })
  }

  // opens edit modal
  const modalEdit = (index) => {
    const initStates = {
      id: store.appData.products[index]._id,
      name: store.appData.products[index].name,
      details: store.appData.products[index].details,
      images: store.appData.products[index].images,
      price: store.appData.products[index].price,
      brand: store.appData.products[index].brand,
      category: store.appData.products[index].category,
      isFeatured: store.appData.products[index].isFeatured,
      age: store.appData.products[index].age,
      pieces: store.appData.products[index].pieces,
      features: store.appData.products[index].features,
      highlights: store.appData.products[index].highlights,
      tags: store.appData.products[index].tags,
    }

    setProductForm(initStates.id, true)

    const Content = () => {
      return (
        <div className="px-6 pb-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edit Product</h3>
          <ProductsForm onSubmit={handleEditSubmit} initStates={initStates} />
        </div>
      )
    }

    showModal(Content)
  }

  const handleDelete = async (id) => {
    const productID = store.appData.products[id]._id

    const isConfirmed = await confirmAction(`Please confirm to cancel order ${store.appData.products[id].name}`)
    if (!isConfirmed) return

    /* Send data to API to delete the product */
    await deleteProductAction(store.auth.token, productID).then(data => {
      if (data.error) return showToast(data.error, false)

      setReload(!reload)
      setProductForm('', false)
    })
  }

  return (
    <>
      {loading
        ? (
          <Spinner />
        )
        : (
          <div className='grid place-items-center pb-3'>
            <h1 className='text-left text-xl font-medium p-6 text-gray-700'>Products Data</h1>
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
                  <button onClick={() => modalAdd()} type="button" disabled={addButtonLoading} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="authentication-modal">
                    <MdAdd size={30}></MdAdd> Add
                  </button>
                </div>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Product Name <button onClick={() => setFilter('name')}><MdArrowDropDown /></button>
                      </th>
                      <th scope="col" className="px-6 py-3 hidden sm:table-cell">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 hidden md:table-cell">
                        Featured
                      </th>
                      <th scope="col" className="px-6 py-3 hidden lg:table-cell">
                        Intro Date
                      </th>
                      <th scope="col" className="px-6 py-3 hidden xl:table-cell">
                        Brand <button onClick={() => setFilter('brand')}><MdArrowDropDown /></button>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <span>Edit or Delete</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((product, i) => (
                      <tr key={i} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          {product.name}
                        </th>
                        <th scope="row" className="px-6 py-4 hidden sm:table-cell font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          {product.price}$
                        </th>
                        <th scope="row" className="px-6 py-4 hidden md:table-cell font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          {product.isFeatured ? "Yes" : "No"}
                        </th>
                        <th scope="row" className="px-6 py-4 hidden lg:table-cell font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          {product.createdAt.split('T')[0]}
                        </th>
                        <th scope="row" className="px-6 py-4 hidden xl:table-cell font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          {product.brand}
                        </th>
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

export default ProductsTool