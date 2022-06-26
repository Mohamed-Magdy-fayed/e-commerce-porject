import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteItemFromUser } from '../../../context/store/StoreActions'
import StoreContext from '../../../context/store/StoreContext'

const CartItemRow = ({ product, setProductsTotal }) => {

    const { store, deleteFromCart } = useContext(StoreContext)

    const [amount, setAmount] = useState(1)

    const handleRemoveItem = (productID) => {
        deleteFromCart(productID)
        deleteItemFromUser(store.auth.user._id, 'cartItems', productID)
        setProductsTotal((prev) => {
            const { [productID]: removedProperty, ...prevRest } = prev
            return { ...prevRest }
        })
    }

    useEffect(() => {
        setProductsTotal((prev) => {
            return { ...prev, [product._id]: amount }
        })
    }, [amount])

    return (
        <tr>
            <td className="hidden pb-4 md:table-cell">
                <Link to={`/product/${product._id}`} className="relative">
                    <img
                        src={product.images[0]}
                        className="w-20 rounded"
                        alt="Thumbnail"
                    ></img>
                </Link>
            </td>
            <td>
                <Link to={`/product/${product._id}`} className="relative">
                    <p className="mb-2 md:ml-4">{product.name}</p>
                </Link>
                <button onClick={() => handleRemoveItem(product._id)} className="text-gray-700 md:ml-4">
                    <small>(Remove item)</small>
                </button>
            </td>
            <td className="justify-center md:justify-end md:flex mt-6">
                <div className="w-20 h-10">
                    <div className="relative flex flex-row w-full h-8">
                        <input
                            type="number"
                            className="w-full p-2 font-semibold text-center text-gray-700 bg-yellow-200 outline-none rounded-lg focus:outline-none hover:text-black focus:text-black"
                            onChange={(e) => {
                                setProductsTotal((prev) => {
                                    return { ...prev, [product._id]: e.target.value }
                                })
                                setAmount(parseInt(e.target.value))
                            }}
                            value={amount}
                            required
                        />
                    </div>
                </div>
            </td>
            <td className="hidden text-right md:table-cell">
                <span className="text-sm lg:text-base font-medium">
                    {product.price}€
                </span>
            </td>
            <td className="text-right">
                <span className="text-sm lg:text-base font-medium">
                    {product.price * amount}€
                </span>
            </td>
        </tr>
    )
}

export default CartItemRow