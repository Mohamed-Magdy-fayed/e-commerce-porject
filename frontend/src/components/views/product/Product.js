import { useContext, useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/solid";
import { classNames } from "./className";
import { Swiper, SwiperSlide } from "swiper/react";
//Ripples is lib. for ripples effects while clicking items
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
// import required modules
import { Navigation } from "swiper";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useLocation } from "react-router";
import axios from "axios";
import StoreContext from "../../../context/store/StoreContext";
import Spinner from "../../shared/Spinner";
import { Link } from "react-router-dom";
import LoginPage from "../authorization/LoginPage";
import { addItemToUser, deleteItemFromUser, getProductAction } from "../../../context/store/StoreActions";

const Product = () => {

  const { store, showToast, showModal, addToLocation, deleteFromLocation } = useContext(StoreContext)

  const id = useLocation().pathname.split('product/')[1]

  const [pageLoading, setPageLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState()

  useEffect(() => {
    setPageLoading(true)
    getProductAction(id).then((data) => {
      if (data.error) {
        showToast(data.error, false)
        setPageLoading(false)
        return
      }

      setProduct(data)
      setPageLoading(false)
    })
  }, [])

  const handleAddToLocation = async (location) => {
    setLoading(true)

    if (!store.auth.authed) {
      showToast(`please login first to begin shopping!`, false)
      setLoading(false)
      showModal(LoginPage)
      return
    }

    const isAdded = store.auth.user[location].filter(p => p === product._id).length > 0 ? true : false
    if (isAdded) {
      deleteFromLocation(product._id, location)
      await deleteItemFromUser(store.auth.token, store.auth.user._id, location, product._id)
      setLoading(false)
      showToast(`${product.name} has been removed from your ${location === 'wishlistItems' ? 'wishlist' : 'cart'}`, true)
      return
    }

    addToLocation(product._id, location)
    await addItemToUser(store.auth.token, store.auth.user._id, location, product._id)
    setLoading(false)
    showToast(`${product.name} has been added to your ${location === 'wishlistItems' ? 'wishlist' : 'cart'}`, true)
  }

  if (pageLoading) {
    return <Spinner />
  }

  return (
    <div className="mt-5">
      <div className="pt-6">
        {/* Image gallery */}
        <Swiper
          navigation={true}
          modules={[Navigation]}
          className="mt-20 max-h-[600px] max-w-[750px]"
        >
          {product.images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                className="object-cover object-center w-full h-auto"
                src={image}
                alt={image}
                key={index}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Product info */}
        <div className="max-w-2xl mx-auto pt-10 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 ">
          <div className="lg:col-span-2 lg:border-r lg:border-indigo-600 lg:pr-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {product.name}
            </h1>
          </div>
          <div className="mt-4 lg:mt-0 lg:row-span-3 self-center">
            <h2 className="sr-only">Product information</h2>
            <div className="w-full flex justify-between items-center">
              {/*product badge*/}
              <span className={`font-medium text-sm bg-indigo-400 py-1 px-2 my-4 ${!product.isFeatured && 'hidden'}`}>
                Featured
              </span>
              {/*add to wish list*/}
              <button disabled={loading} onClick={() => handleAddToLocation('wishlistItems')} className="flex items-center z-10">
                {store.auth.user.wishlistItems.filter(id => id === product._id).length > 0 ? (
                  <AiFillHeart className="text-[25px] bg-[rgba(0,0,0,.05)] text-[rgb(44,44,44)] p-1 rounded-full" />
                ) : (
                  <AiOutlineHeart className="text-[25px] bg-[rgba(0,0,0,.05)] text-[rgb(44,44,44)] p-1 rounded-full" />
                )}
                <span className="hidden text-sm font-medium sm:inline-block">
                  Add to wish card{" "}
                </span>
              </button>
            </div>
            <p className="text-3xl text-gray-900 my-5">{product.price}$</p>
            <div className="flex w-full justify-center my-20">
              {/* Age */}
              <div className="basis-1/2 flex flex-col items-center justify-center border-r-2 border-indigo-600">
                <p className="text-2xl font-bold">{product.age}</p>
                <h3 className="text-gray-900 font-medium">Age </h3>
              </div>

              {/* pieces */}

              <div className="basis-1/2 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">{product.pieces}</p>
                <h3 className="text-gray-900 font-medium">pieces</h3>
              </div>
            </div>
            {/*add to cart*/}
            <div className="w-full flex justify-center">
              <button disabled={loading} onClick={() => handleAddToLocation('cartItems')} className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-slate-500' : store.auth.user.cartItems.includes(product._id) ? 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}>
                {store.auth.user.cartItems.includes(product._id) ? 'Remove From Cart' : 'Add To Cart'}
              </button>
            </div>
          </div>

          <div className="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-indigo-400 lg:pr-8">
            {/* Description and details */}
            <div>
              <h3 className="text-sm font-medium text-gray-900">Features</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900 mt-4 space-y-6">{product.features}</p>
              </div>
            </div>
            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>

              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{product.details}</p>
              </div>
            </div>
          </div>
        </div>
      </div >
    </div >
  )
}

export default Product
