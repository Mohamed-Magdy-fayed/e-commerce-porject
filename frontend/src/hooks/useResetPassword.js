import { useContext, useState } from "react"
import { resetPasswordAction } from "../context/store/StoreActions"
import StoreContext from "../context/store/StoreContext"

const useResetPassword = () => {

    const { store, showModal, setLoading, hideModal, showToast } = useContext(StoreContext)

    const resetPassword = (withEmail) => {
        const initStates = {
            email: store.auth.user.email,
        }

        const Content = () => {
            const [email, setEmail] = useState('')
            const [oldPassword, setOldPassword] = useState('')
            const [newPassword, setNewPassword] = useState('')
            const [newPasswordConf, setNewPasswordConf] = useState('')


            const handleSubmit = (e) => {
                e.preventDefault()

                if (newPassword === newPasswordConf) {
                    setLoading(true)
                    resetPasswordAction(withEmail ? email : initStates.email, oldPassword, newPassword).then((res) => {
                        if (res.error) {
                            showToast(res.error, false)
                            setLoading(false)
                            return
                        }
                        showToast(`password updated successfully`, true)
                        hideModal()
                        setLoading(false)
                    })
                    return
                }

                showToast(`new password dosen't match`, false)
            }

            return (
                <div className="px-6 pb-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8">
                    <div className="flex justify-between">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Reset your password</h3>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={(e) => handleSubmit(e)} >
                        <div>
                            {withEmail && (
                                <div className="py-4">
                                    <label htmlFor="email" className="sr-only">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className={`appearance-none relative block w-full px-3 py-2 border rounded-md border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            )}
                            <div>
                                <label htmlFor="oldPassword" className="sr-only">
                                    Old Password
                                </label>
                                <input
                                    id="oldPassword"
                                    name="oldPassword"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className={`appearance-none relative block w-full px-3 py-2 border rounded-t-md border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                    placeholder="Old Password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="newPassword" className="sr-only">
                                    New Password
                                </label>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-none -my-px focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="newPasswordConf" className="sr-only">
                                    New Password Confirmation
                                </label>
                                <input
                                    id="newPasswordConf"
                                    name="newPasswordConf"
                                    type="password"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Confirm Password"
                                    value={newPasswordConf}
                                    onChange={(e) => setNewPasswordConf(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='flex justify-center'>
                            {store.loading
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
                </div >
            )
        }
        showModal(Content)
    }

    return resetPassword
}

export default useResetPassword