import { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { searchProductsAction } from '../../../context/store/StoreActions'
import StoreContext from '../../../context/store/StoreContext'
import useDebounce from '../../../hooks/useDebounce'
import Footer from '../../shared/Footer'
import Navbar from '../../shared/Navbar'
import ProductCard from './ProductCard'

export const Shop = () => {

  const { showToast, setData } = useContext(StoreContext)

  const [searchQuery, setSearchQuery] = useState(useLocation().pathname.split('shop/')[1])
  const [searchResults, setSearchResults] = useState([]);

  useDebounce(() => handleChange(searchQuery), 500, [searchQuery])

  const handleChange = async (query) => {
    await searchProductsAction(query ? query : undefined).then(data => {
      if (data.error) return showToast(data.error, false)

      setSearchResults(data)
    })
  }

  useEffect(() => {
    searchProductsAction(searchQuery ? searchQuery : undefined).then(data => {
      if (data.error) return showToast(data.error, false)

      setSearchResults(data)
      setData('products', data)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Navbar />
      {/* Search */}
      <div className='p-4 lg:px-12 xl:px-16 flex flex-col items-center gap-4'>
        <div className="flex lg:ml-6">
          <div className="ml-6 relative">
            <label htmlFor="searchQuery" className="sr-only">Search Input</label>
            <input
              id="searchQuery"
              name="searchQuery"
              type='text'
              className={`appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className='flex flex-wrap justify-around gap-4 min-w-[90vw]'>
          {searchResults.map(product => (
            <ProductCard key={product._id} productData={product} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
