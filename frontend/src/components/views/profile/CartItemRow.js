import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteItemFromUser } from '../../../context/store/StoreActions'
import StoreContext from '../../../context/store/StoreContext'

const CartItemRow = ({ product, setProductsTotal }) => {
    const { store, deleteFromLocation } = useContext(StoreContext)

    const [amount, setAmount] = useState(1)

    const handleRemoveItem = async (productID) => {
        deleteFromLocation(productID, 'cartItems')
        await deleteItemFromUser(store.auth.token, store.auth.user._id, 'cartItems', productID)
        setProductsTotal((prev) => prev.filter(product => productID !== product.productID))
    }

    useEffect(() => {
        setProductsTotal((prev) => {
            return prev.map(item => {
                if (item.productID === product._id) return { ...item, amount: isNaN(amount) ? 0 : amount }
                return item
            })
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
                            min={0}
                            className="w-full p-2 font-semibold text-center text-gray-700 bg-indigo-200 outline-none rounded-lg focus:outline-none hover:text-black focus:text-black"
                            onChange={(e) => {
                                setAmount(parseInt(e.target.value))
                            }}
                            value={amount ? amount : 0}
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