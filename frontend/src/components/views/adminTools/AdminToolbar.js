import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'

const AdminToolbar = () => {

    const [active, setActive] = useState('')

    const url = useLocation().pathname

    useEffect(() => {
        setActive(url)
    }, [url])

    const taps = [
        {
            name: "Users Tool",
            to: '/admin/dashboard/users'
        },
        {
            name: "Coupons Tool",
            to: '/admin/dashboard/coupons'
        },
        {
            name: "Images Tool",
            to: '/admin/dashboard/images'
        },
        {
            name: "Orders Tool",
            to: '/admin/dashboard/orders'
        },
        {
            name: "Products Tool",
            to: '/admin/dashboard/products'
        },
        {
            name: "Analytics Tool",
            to: '/admin/dashboard'
        },
    ]

    return (
        <div className="flex flex-wrap justify-evenly w-full mt-6">
            {taps.map((tap, i) => (
                <Link to={tap.to} key={i} className={`group relative flex-grow flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none ${active === tap.to ? 'bg-indigo-700' : 'bg-indigo-600'}`}>
                    {tap.name}
                </Link>
            ))}
        </div>
    )
}

export default AdminToolbar