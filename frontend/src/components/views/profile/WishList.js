import React, { useContext, useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { getProductAction } from "../../../context/store/StoreActions";
import StoreContext from "../../../context/store/StoreContext";
import Spinner from "../../shared/Spinner";
import ProductCard from "../main/ProductCard";

const WishList = () => {

  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(false)

  const { store } = useContext(StoreContext)

  useEffect(() => {
    setLoading(true)
    setWishlist([])
    store.auth.user.wishlistItems.forEach(id => {
      getProductAction(id).then(res => {
        setWishlist(prev => {
          if (prev.includes(res)) return
          return [...prev, res]
        })
      })
    })
    setLoading(false)

  }, [store.auth.user.wishlistItems])

  if (loading) return <Spinner />

  return (
    <div
      id="wish-list"
      className="bg-white rounded shadow mx-auto px-6 py-10 flex flex-col justify-center items-center border-t-4 border-indigo-400"
    >
      <div className="mt-3 self-start">
        <h2 className="flex text-2xl items-center text-gray-800">
          <AiFillHeart size={25} className="mr-1" />
          WishList
          <span className="ml-1 hover:underline hover:underline-offset-[5px] hover:decoration-2 hover:decoration-indigo-400">
            {store.auth.user.wishlistItems.length}
          </span>
        </h2>
      </div>

      <div className="flex flex-col jusitfy-start items-start">
        <div className=" mt-10 lg:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-10 lg:gap-y-0">
          {wishlist.length === 0 ? (
            <p>no products in your wishlist</p>
          ) : (
            wishlist.map(product => (
              <ProductCard key={product._id} productData={product} />
            ))
          )}
        </div>
      </div>
    </div >
  );
}

export default WishList
