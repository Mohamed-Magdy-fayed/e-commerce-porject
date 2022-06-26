import { BsArrowBarLeft } from 'react-icons/bs'
import { Link } from 'react-router-dom'

const NotFound = ({ code, msg }) => {

    return (
        <div className='grid place-items-center h-screen'>
            <div className='text-left p-6 flex flex-col gap-3 md:flex-row md:gap-6'>
                <p className='text-5xl font-bold text-indigo-600 px-6'>{code}</p>
                <div className='flex flex-col gap-3 px-6 md:border-l-2'>
                    <p className='text-5xl font-bold'>{msg}</p>
                    <p className="text-2xl text-gray-500">Please check the URL in the address bar and try again.</p>
                    <Link
                        to='/'
                        className="flex items-center py-2 px-4 mt-12 w-fit border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <BsArrowBarLeft size={20}></BsArrowBarLeft>
                        <span className='mx-3'>Go back home</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default NotFound