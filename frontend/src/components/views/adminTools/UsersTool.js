import { useContext, useEffect, useState } from 'react'
import { MdAdd, MdArrowDropDown, MdDelete, MdEdit } from 'react-icons/md'
import { adminAddUserAction, deleteUserAction, editUserAction, getUsersAction } from '../../../context/store/StoreActions'
import StoreContext from '../../../context/store/StoreContext'
import useConfirm from '../../../hooks/useConfirm'
import RegisterForm from '../../shared/forms/RegisterForm'
import Spinner from '../../shared/Spinner'

const UsersTool = () => {

    const { store, showModal, hideModal, showToast, setData } = useContext(StoreContext)
    const [filter, setFilter] = useState('firstName')
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState([])
    const [reload, setReload] = useState(false)

    const { confirmAction } = useConfirm()

    const sorter = (array) => {
        return array.sort(((a, b) => {
            let x = a[filter].toLowerCase()
            let y = b[filter].toLowerCase()
            return x === y ? 0 : x > y ? 1 : -1;
        }))
    }

    const handleSearch = (query) => {
        if (query.length > 0) {
            setSearchResults(sorter(store.appData.users.filter(user => user[filter].toLowerCase().includes(query.toLowerCase()))))
        } else {
            setSearchResults(sorter(store.appData.users))
        }
    }

    useEffect(() => {
        setLoading(true)
        getUsersAction(store.auth.token).then((data) => {
            console.log(data);
            if (data.error) {
                showToast(data.error, false)
                setData('users', [])
                setSearchResults([])
                setLoading(false)
            } else {
                setData('users', data)
                setSearchResults(sorter(data))
                setLoading(false)
            }
        })
    }, [store.productForm, reload])


    // submit the add form
    const handleAddSubmit = async (formStates) => {

        if (formStates.password !== formStates.passwordConfirm) {
            showToast(`Passwords don't match!`, false)
            return
        }

        const userData = {
            firstName: formStates.firstName,
            lastName: formStates.lastName,
            email: formStates.email,
            password: formStates.password,
            address: formStates.address,
            phone: formStates.phone,
            type: formStates.type,
            status: formStates.status,
        }

        /* Send data to API to register a new user */
        await adminAddUserAction(store.auth.token, userData)
            .then(data => {
                if (data.error) return showToast(data.error, false)

                setReload(!reload)
                hideModal()
            })
    }

    // open the modal and fill it's content 
    const modalAdd = () => {
        const Content = () => {
            return (
                <div className="px-6 pb-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add User</h3>
                    <RegisterForm onSubmit={handleAddSubmit} withPW={true} admin={true} />
                </div>
            )
        }

        showModal(Content)
    }

    // submit the edit form
    const handleEditSubmit = async (formStates) => {
        const userData = {
            id: formStates.id,
            firstName: formStates.firstName,
            lastName: formStates.lastName,
            email: formStates.email,
            password: formStates.password,
            address: formStates.address,
            phone: formStates.phone,
            type: formStates.type,
            status: formStates.status,
        }

        /* Send data to API to edit the user */
        await editUserAction(store.auth.token, userData)
            .then(data => {
                if (data.error) return showToast(data.error, false)

                setReload(!reload)
                hideModal()
            })
    }

    // opens edit modal
    const modalEdit = async (id) => {
        const initStates = {
            id: store.appData.users[id]._id,
            firstName: store.appData.users[id].firstName,
            lastName: store.appData.users[id].lastName,
            email: store.appData.users[id].email,
            phone: store.appData.users[id].phone,
            address: store.appData.users[id].address,
            type: store.appData.users[id].type,
            status: store.appData.users[id].status,
        }

        const Content = () => {
            return (
                <div className="px-6 pb-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edit User</h3>
                    <RegisterForm onSubmit={handleEditSubmit} withPW={false} initStates={initStates} admin={true} />
                </div>
            )
        }
        showModal(Content)
    }

    const handleDelete = async (index) => {
        const userName = store.appData.users[index].firstName

        const isConfirmed = await confirmAction(`Please confirm to delete user ${userName}`)
        if (!isConfirmed) return setLoading(false)

        const userID = store.appData.users[index]._id
        /* Send data to API to delete the user */
        await deleteUserAction(store.auth.token, userID).then(data => {
            if (data.error) return showToast(data.error, false)

            setReload(!reload)
        })
    }

    return (
        <>
            {loading
                ? (
                    <Spinner />
                )
                : (
                    <div className='grid place-items-center mb-3'>
                        <h1 className='text-left text-xl font-medium p-6 text-gray-700'>Users Data</h1>
                        <div className='max-w-7xl px-6'>
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <div className="p-4 flex">
                                    <label htmlFor="table-search" className="sr-only">Search</label>
                                    <div className="relative mt-1">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                                        </div>
                                        <input
                                            onChange={(e) => handleSearch(e.target.value)}
                                            type="text"
                                            id="table-search"
                                            placeholder="select search filter from the table"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                    </div>
                                    <button onClick={() => modalAdd()} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="authentication-modal">
                                        <MdAdd size={30}></MdAdd> Add User
                                    </button>
                                </div>
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                First Name <button onClick={() => setFilter('firstName')}><MdArrowDropDown /></button>
                                            </th>
                                            <th scope="col" className="px-6 py-3 hidden sm:table-cell">
                                                Last Name <button onClick={() => setFilter('lastName')}><MdArrowDropDown /></button>
                                            </th>
                                            <th scope="col" className="px-6 py-3 hidden md:table-cell">
                                                Email <button onClick={() => setFilter('email')}><MdArrowDropDown /></button>
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Access Type <button onClick={() => setFilter('type')}><MdArrowDropDown /></button>
                                            </th>
                                            <th scope="col" className="px-6 py-3 hidden lg:table-cell">
                                                User Status <button onClick={() => setFilter('status')}><MdArrowDropDown /></button>
                                            </th>
                                            <th scope="col" className="px-6 py-3 hidden xl:table-cell">
                                                Phone <button onClick={() => setFilter('phone')}><MdArrowDropDown /></button>
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                <span>Edit or Delete</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchResults.map((user, i) => (
                                            <tr key={i} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                    {user.firstName}
                                                </th>
                                                <td className="px-6 py-4 hidden sm:table-cell">
                                                    {user.lastName}
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {user.type}
                                                </td>
                                                <td className="px-6 py-4 hidden lg:table-cell">
                                                    {user.status}
                                                </td>
                                                <td className="px-6 py-4 hidden xl:table-cell">
                                                    {user.phone}
                                                </td>
                                                <td className="px-6 py-4 flex max-w-fit">
                                                    <button id={i} onClick={(e) => modalEdit(e.currentTarget.id)} className="group relative flex-grow flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">
                                                        <MdEdit />
                                                    </button>
                                                    <button id={i} onClick={(e) => handleDelete(e.currentTarget.id)} className="group relative flex-grow flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:bg-rose-700">
                                                        <MdDelete />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                )}
        </>
    )
}

export default UsersTool