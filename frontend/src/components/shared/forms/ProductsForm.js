import { useState } from 'react'
import Upload from '../../../firebase/upload'

/** 
*   to use the form you must provide an onSubmit func to run once the form is submitted
*   and if you want the form to have pre filled data provide it as initStates prope
*/

const ProductsForm = ({ onSubmit, initStates, id }) => {

    // Form States
    const [loading, setLoading] = useState(initStates ? initStates.name : '')
    const [name, setName] = useState(initStates ? initStates.name : '')
    const [details, setDetails] = useState(initStates ? initStates.details : '')
    const [images, setImages] = useState(initStates ? initStates.images : [])
    const [price, setPrice] = useState(initStates ? initStates.price : 0)
    const [brand, setBrand] = useState(initStates ? initStates.brand : '')
    const [category, setCategory] = useState(initStates ? initStates.category : '')
    const [isFeatured, setIsFeatured] = useState(initStates ? initStates.isFeatured : false)
    const [age, setAge] = useState(initStates ? initStates.age : '')
    const [pieces, setPieces] = useState(initStates ? initStates.pieces : '')
    const [features, setFeatures] = useState(initStates ? initStates.features : '')

    // runs the onSubmit func provided as a prope giving it all the state so you can use it
    const handleSubmit = (e) => {
        e.preventDefault()

        const formStates = {
            id: initStates ? initStates.id : id,
            name,
            details,
            images,
            price,
            brand,
            category,
            isFeatured,
            age,
            pieces,
            features,
        }
        onSubmit(formStates)
    }

    return (
        <div>
            <form className="mt-8 space-y-6" onSubmit={(e) => handleSubmit(e)} >
                <div>
                    <label htmlFor="name" className="sr-only">
                        Product Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Product Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="details" className="sr-only">
                        Product details
                    </label>
                    <textarea
                        id="details"
                        name="details"
                        type="text"
                        required
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Product details"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="features" className="sr-only">
                        Product Features
                    </label>
                    <textarea
                        id="features"
                        name="features"
                        type="text"
                        required
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Product Features"
                        value={features}
                        onChange={(e) => setFeatures(e.target.value)}
                    />
                </div>
                <div className=''>
                    <h3 className='text-center'>Product Images</h3>
                    <Upload initStates={initStates} setLoading={setLoading} setImages={setImages} isEdit={initStates ? true : false} />
                </div>
                <div className='flex justify-between'>
                    <div className='w-2/5'>
                        <label htmlFor="brand">
                            Brand
                        </label>
                        <input
                            id="brand"
                            name="brand"
                            type="text"
                            required
                            value={brand}
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Brand"
                            onChange={(e) => setBrand(e.target.value)}
                        />
                    </div>
                    <div className='w-2/5'>
                        <label htmlFor="category">
                            Category
                        </label>
                        <input
                            id="category"
                            name="category"
                            type="text"
                            required
                            value={category}
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Category"
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </div>
                </div>
                <div className='flex justify-between'>
                    <div className='w-2/5'>
                        <label htmlFor="age">
                            Age
                        </label>
                        <input
                            id="age"
                            name="age"
                            type="text"
                            required
                            value={age}
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Age"
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </div>
                    <div className='w-2/5'>
                        <label htmlFor="pieces">
                            Pieces
                        </label>
                        <input
                            id="pieces"
                            name="pieces"
                            type="text"
                            required
                            value={pieces}
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="pieces"
                            onChange={(e) => setPieces(e.target.value)}
                        />
                    </div>
                </div>
                <div className='flex flex-row justify-between items-center'>
                    <div className='flex justify-between items-center w-2/5'>
                        <label htmlFor="isFeatured">
                            Featured
                        </label>
                        <input
                            id="isFeatured"
                            name="isFeatured"
                            type="checkbox"
                            checked={isFeatured}
                            className="appearance-none border-2 checked:bg-indigo-600 relative block px-2 py-2 placeholder-gray-500 text-gray-900 rounded-full focus:outline-none sm:text-sm"
                            onChange={(e) => setIsFeatured(e.target.checked ? true : false)}
                        >
                        </input>
                    </div>
                    <div className='w-1/2 grid place-items-center'>
                        <label htmlFor="price" className="justify-self-end">
                            Product Price
                        </label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
                            required
                            className="appearance-none relative block w-1/2 px-3 py-2 justify-self-end border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                        />
                    </div>
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
                            {!initStates ? 'Create Product' : 'Save'}
                        </button>)}


                </div>
            </form>
        </div>
    )
}

export default ProductsForm