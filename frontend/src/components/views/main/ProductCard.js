import { useContext, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import StoreContext from "../../../context/store/StoreContext";
import LoginPage from "../authorization/LoginPage";
import { addItemToUser, deleteItemFromUser } from "../../../context/store/StoreActions";

const ProductCard = ({ productData }) => {

  const { store, showToast, showModal, addToLocation, deleteFromLocation } = useContext(StoreContext)

  const [loading, setLoading] = useState(false)

  const handleAddToLocation = async (location) => {
    setLoading(true)

    if (!store.auth.authed) {
      showToast(`please login first to begin shopping!`, false)
      setLoading(false)
      showModal(LoginPage)
      return
    }

    const isAdded = store.auth.user[location].filter(p => p === productData._id).length > 0 ? true : false
    if (isAdded) {
      deleteFromLocation(productData._id, location)
      await deleteItemFromUser(store.auth.token, store.auth.user._id, location, productData._id)
      setLoading(false)
      showToast(`${productData.name} has been removed from your ${location === 'wishlistItems' ? 'wishlist' : 'cart'}`, true)
      return
    }

    addToLocation(productData._id, location)
    await addItemToUser(store.auth.token, store.auth.user._id, location, productData._id)
    setLoading(false)
    showToast(`${productData.name} has been added to your ${location === 'wishlistItems' ? 'wishlist' : 'cart'}`, true)
  }

  return (
    <div className="flex flex-col justify-between w-60 shadow-md p-4 rounded-md text-left text-dark font-bold snap-start select-none">
      {/*product image and link*/}
      <div>
        <button disabled={loading} onClick={() => handleAddToLocation('wishlistItems')} className="flex items-center z-10">
          {store.auth.user.wishlistItems.filter(id => id === productData._id).length > 0 ? (
            <AiFillHeart className="text-[25px] bg-[rgba(0,0,0,0.05)] text-[rgb(44,44,44)] p-1 rounded-full" />
          ) : (
            <AiOutlineHeart className="text-[25px] bg-[rgba(0,0,0,0.05)] text-[rgb(44,44,44)] p-1 rounded-full" />
          )}
          <span className="hidden text-sm font-medium sm:inline-block">
            Add to wish card{" "}
          </span>
        </button>
        <Link to={`/product/${productData._id}`} className="relative">
          <img
            className="w-full aspect-square rounded-t-lg object-center object-contain transition-all duration-500 ease-in-out hover:scale-105"
            alt="product"
            src={productData.images[0]}
          />
          {/*show badge only if a new/featured product*/}
        </Link>
        {(Date.now() - Date.parse(productData.createdAt) < 2592000000) && (
          <span className="z-10 font-medium text-sm bg-indigo-600 py-1 px-2 text-white">
            New
          </span>
        )}
      </div>
      {/*product details*/}
      <div className="flex flex-col justify-between gap-4 w-full flex-grow">
        <Link
          to={`/product/${productData._id}`}
          className="text-lg mb-5 underline"
        >
          {productData.name}
        </Link>
        {/*product price*/}
        <div>
          <p className="text-base mb-2">${productData.price}</p>
          {/*add to cart*/}
          <button disabled={loading} onClick={() => handleAddToLocation('cartItems')} className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-slate-500' : store.auth.user.cartItems.includes(productData._id) ? 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}>
            {store.auth.user.cartItems.includes(productData._id) ? 'Remove From Cart' : 'Add To Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard
