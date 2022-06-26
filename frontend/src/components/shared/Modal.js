import React, { useContext } from 'react'
import { useLocation } from 'react-router'
import { deleteProductAction } from '../../context/store/StoreActions'
import StoreContext from '../../context/store/StoreContext'

/**
 * to use a modal you just call showModal(Content) giving it the content to be displayed inside as a functional component
 * then the state of the app is updated to show the modal and the state.content shows your component
 */

const Modal = () => {

    // to manage the state of the app for modals
    const { store, hideModal, setProductForm } = useContext(StoreContext)

    const url = useLocation().pathname

    // hide it in case we close it
    if (!store.modal.isModal) {
        return
    }

    return (
        <div className='h-full w-full bg-slate-400 bg-opacity-50 absolute inset-0 z-10'>
            {/* Main modal */}
            <div className="static z-10 w-full inset-0 h-modal md:h-full grid place-items-center">
                <div className="p-4 w-full max-w-md h-full md:h-auto">
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex justify-end p-2">
                            <button onClick={() => {
                                if (!store.productForm.isEdit && url === '/admin/dashboard/products') {
                                    hideModal()
                                    deleteProductAction(store.productForm.id)
                                    setProductForm('', false)
                                } else {
                                    hideModal()
                                }
                            }} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="authentication-modal">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </button>
                        </div>
                        {/* gets the content you put at the app state */}
                        {<store.modal.content />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal