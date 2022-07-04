import React, { useContext, useEffect, useState } from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { getCouponsAction, getProductAction } from '../../../context/store/StoreActions'
import StoreContext from '../../../context/store/StoreContext'
import Spinner from '../Spinner'

const OrdersForm = ({ initStates, onSubmit }) => {
    const { store, showToast } = useContext(StoreContext)
    console.log(initStates);

    const [paymentMethod, setPaymentMethod] = useState(initStates ? initStates.paymentMethod : 'cash')
    const [coupons, setCoupons] = useState([])
    const [coupon, setCoupon] = useState(initStates ? initStates.coupon : {})
    const [status, setStatus] = useState(initStates ? initStates.status : 'pending')
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [productsTotal, setProductsTotal] = useState(initStates ? initStates.products : [])

    // runs the onSubmit func provided as a prope giving it all the state so you can use it
    const handleSubmit = (e) => {
        e.preventDefault()
        const amountsAreZero = productsTotal.filter(p => p.amount <= 0).length
        if (productsTotal.length === 0 || amountsAreZero > 0) return showToast(`can't remove all products, set to canceled instead!`, false)

        setLoading(true)

        const getTotal = () => {
            let total = 0
            products.forEach(p => {
                for (let index = 0; index < productsTotal.length; index++) {
                    if (p._id !== productsTotal[index].productID) continue
                    const amount = productsTotal[index].amount
                    total += amount * p.price
                }
            })
            if (!coupon) return total.toFixed(2)

            if (coupon[0].validTill < Date.now()) return showToast(`Coupon expired`)

            if (parseFloat(coupon[0].minValue) > parseFloat(total)) return showToast(`Order value is low`)

            const value = parseFloat(coupon[0].value)
            const discountValue = coupon[0].isPercentage ? parseFloat(total) * value / 100 : value
            total = parseFloat(total - discountValue)
            
            return total.toFixed(2)
        }

        const formStates = {
            id: initStates ? initStates.id : 0,
            paymentMethod,
            coupon: coupon ? coupon[0]._id : null,
            status, //{ pending, proccessing, shipped, delvired, canceled }
            products: productsTotal,
            totalValue: getTotal(),
        }
        onSubmit(formStates)
        setLoading(false)
    }

    const getData = async () => {
        const coupon = await getCouponsAction(store.auth.token)
        setCoupons(coupon)

        let products = []

        for (let index = 0; index < initStates.products.length; index++) {
            const id = initStates.products[index].productID
            const product = await getProductAction(id)
            products.push(product)
        }

        const data = {
            coupon,
            products
        }
        return data
    }

    const handleRemoveItem = (id) => {
        setProducts(prev => {
            console.log(prev.filter(p => p._id !== id))
            return prev.filter(p => p._id !== id)
        })
        setProductsTotal(prev => {
            console.log(prev.filter(p => p.productID !== id))
            return prev.filter(p => p.productID !== id)
        })
    }

    useEffect(() => {
        setLoading(true)
        getData().then(res => {
            setProducts(res.products)
            setLoading(false)
        })
    }, [])

    if (loading) return <Spinner />

    return (
        <div>
            <form className="mt-8 space-y-6" onSubmit={(e) => handleSubmit(e)} >
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="m-2">
                    <label htmlFor="status" className='m-2'>
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        className="relative px-3 py-2 rounded-md sm:text-sm border border-gray-300 focus:border-indigo-600"
                        placeholder="Status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option id='pending'>pending</option>
                        <option id='processing'>processing</option>
                        <option id='shipped'>shipped</option>
                        <option id='delivered'>delivered</option>
                        <option id='canceled'>canceled</option>
                    </select>
                </div>
                <div className='flex justify-between items-end gap-6'>
                    <div className='w-full'>
                        <label htmlFor="coupon" className="">
                            Coupon
                        </label>
                        <select
                            id="coupon"
                            name="coupon"
                            className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            value={coupon ? coupon.name : 'none'}
                            onChange={(e) => setCoupon(coupons.filter(c => c.name === e.target.value))}
                        >
                            <option>none</option>
                            {coupons.map(c => (
                                <option key={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='w-full'>
                        <label htmlFor="paymentMethod" className="sr-only">
                            Payment Method
                        </label>
                        <select
                            id="paymentMethod"
                            name="paymentMethod"
                            required
                            className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Payment Method"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option>cash</option>
                            <option>credit</option>
                        </select>
                    </div>
                </div>
                <div>
                    <h3 className='text-center font-medium text-xl'>Products</h3>
                    {products.map((product, i) => (
                        <div key={product._id} className='flex items-center justify-between py-4'>
                            <div className='relative'>
                                <button onClick={() => handleRemoveItem(product._id)} className="absolute text-gray-700 md:ml-4">
                                    <AiFillDelete color='red' />
                                </button>
                                <img src={product.images[0]} alt='product' className='w-20 rounded m-4' />
                            </div>
                            <div className='w-1/2'>
                                <p className='font-bold'>{product.name}</p>
                                <p>{product.price}</p>
                                <input
                                    type="number"
                                    className="w-1/2 p-2 font-semibold text-center text-gray-700 bg-indigo-200 outline-none rounded-lg focus:outline-none hover:text-black focus:text-black"
                                    onChange={(e) => {
                                        setProductsTotal((prev) => {
                                            const update = prev.map(p => {
                                                if (p.productID === product._id) return { ...p, amount: parseInt(e.target.value) }
                                                return p
                                            })
                                            return update
                                        })
                                    }}
                                    value={productsTotal[i].amount}
                                    required
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex justify-center'>
                    {loading
                        ? (<button
                            disabled
                            type="submit"
                            className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                            </svg>
                            Please wait...
                        </button>)
                        : (<button
                            type="submit"
                            className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Save
                        </button>)}
                </div>
            </form>
        </div>
    )
}

export default OrdersForm