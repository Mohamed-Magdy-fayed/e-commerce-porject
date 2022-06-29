import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addItemToUser, deleteItemFromUser, getProductAction } from "../../../context/store/StoreActions";
import StoreContext from "../../../context/store/StoreContext";
import Spinner from "../../shared/Spinner";

const WishlistItem = ({ id }) => {

    const [show, setShow] = useState(true);
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);

    const { store, deleteFromLocation, showToast, addToLocation } = useContext(StoreContext)

    const removeFromWishlist = async (id) => {
        deleteFromLocation(id, 'wishlistItems')
        await deleteItemFromUser(store.auth.user._id, 'wishlistItems', id)
        setLoading(false)
        showToast(`${product.name} has been removed from your wishlist`, true)
        return
    }

    const handleAddToLocation = async (location) => {
        setLoading(true)

        const isAdded = store.auth.user[location].filter(p => p === product._id).length > 0 ? true : false
        if (isAdded) {
            deleteFromLocation(product._id, location)
            await deleteItemFromUser(store.auth.user._id, location, product._id)
            setLoading(false)
            showToast(`${product.name} has been removed from your ${location === 'wishlistItems' ? 'wishlist' : 'cart'}`, true)
            return
        }

        addToLocation(product._id, location)
        await addItemToUser(store.auth.user._id, location, product._id)
        setLoading(false)
        showToast(`${product.name} has been added to your ${location === 'wishlistItems' ? 'wishlist' : 'cart'}`, true)
    }

    useEffect(() => {
        getProductAction(id).then(res => {
            setProduct(res)
            setLoading(false)
        })
    }, [])

    if (loading) {
        return <Spinner />
    }

    return (
        <div className="flex flex-col">
            <div className="relative">
                <img
                    src={product.images[0]}
                    alt="product"
                />
                <button
                    onClick={() => removeFromWishlist(product._id)}
                    aria-label="close"
                    className="top-4 right-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 absolute  p-1.5 bg-gray-800 text-white hover:text-gray-400"
                >
                    <svg
                        className="fil-current"
                        width={14}
                        height={14}
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M13 1L1 13"
                            stroke="currentColor"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M1 1L13 13"
                            stroke="currentColor"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
            <div className="mt-6 flex justify-between items-center">
                <div className="flex justify-center items-center">
                    <p className="tracking-tight text-2xl font-semibold leading-6 text-gray-800">
                        {product.name}
                    </p>
                </div>
                <div className="flex justify-center items-center">
                    <button
                        aria-label="show menu"
                        onClick={() => setShow(!show)}
                        className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 py-2.5 px-2 bg-indigo-500 text-white hover:text-black"
                    >
                        <svg
                            className={`fill-stroke ${show ? "block" : "hidden"}`}
                            width={10}
                            height={6}
                            viewBox="0 0 10 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M9 5L5 1L1 5"
                                stroke="currentColor"
                                strokeWidth="1.25"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <svg
                            className={`fill-stroke ${show ? "hidden" : "block"}`}
                            width={10}
                            height={6}
                            viewBox="0 0 10 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1 1L5 5L9 1"
                                stroke="currentColor"
                                strokeWidth="1.25"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <div
                id="menu1"
                className={` flex-col jusitfy-start items-start mt-12 ${show ? "flex" : "hidden"
                    }`}
            >
                <div className="mt-2">
                    <p className="tracking-tight text-base font-medium leading-4 text-gray-800">
                        {product.category}
                    </p>
                </div>
                <div className="mt-6">
                    <p className="tracking-tight text-base font-medium leading-4 text-gray-800">
                        {product.pieces} Pieces
                    </p>
                </div>
                <div className="mt-6">
                    <p className="tracking-tight text-base font-medium leading-4 text-gray-800">
                        {product.price}
                    </p>
                </div>
                <div className="flex jusitfy-between flex-col lg:flex-row items-center mt-10 w-full  space-y-4 lg:space-y-0 lg:space-x-4 xl:space-x-8">
                    <Link to={`/product/${product._id}`} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        More info
                    </Link>
                    <button disabled={loading} onClick={() => handleAddToLocation('cartItems')} className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-slate-500' : store.auth.user.cartItems.includes(product._id) ? 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}>
                        {store.auth.user.cartItems.includes(product._id) ? 'Remove From Cart' : 'Add To Cart'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default WishlistItem