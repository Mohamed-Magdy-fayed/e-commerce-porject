import { LockClosedIcon } from '@heroicons/react/outline'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import StoreContext from '../../context/store/StoreContext'

const LoginPrompt = () => {

    const { store } = useContext(StoreContext)
    const [isCart, setIsCart] = useState()
    const url = useLocation().pathname

    useEffect(() => {
        if (url.includes('cart')) {
            setIsCart(true)
        } else {
            setIsCart(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            {store.authed
                ? (
                    <div>User authed, show the {isCart ? 'cart' : 'wishlist'} items</div>
                )
                : (
                    <div className='flex flex-col items-center mt-6'>
                        <div className='w-96'>
                            <h1 className='text-lg font-medium text-center'>Hi, you need to login first to view your {isCart ? 'cart' : 'wishlist'}</h1>
                            <Link
                                to='/login'
                                className="group relative w-full flex justify-center mt-6 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                                </span>
                                Log in
                            </Link>
                        </div>
                        <div className='flex flex-col items-center space-y-0'>
                            <span>Don't have an account?</span>
                            <Link to='/register' type='button' className="mt-5 font-medium text-indigo-600 hover:text-indigo-500">
                                Create one
                            </Link>
                        </div>
                    </div>
                )}
        </>
    )
}

export default LoginPrompt