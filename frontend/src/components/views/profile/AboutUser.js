import React, { useContext, useState } from "react";
import { AiOutlineEdit, AiOutlineUser } from "react-icons/ai";
import { editUserAction, getUserAction, resetPasswordAction } from "../../../context/store/StoreActions";
import StoreContext from "../../../context/store/StoreContext";
import RegisterForm from "../../shared/forms/RegisterForm";

const AboutUser = () => {

  const { store, showModal, setLoading, hideModal, loginUser, showToast } = useContext(StoreContext)

  const [togglePassword, setTogglePassword] = useState(false)

  const handleEditSubmit = async (formStates) => {
    setLoading(true)
    const userData = {
      id: formStates.id,
      firstName: formStates.firstName,
      lastName: formStates.lastName,
      email: formStates.email,
      address: formStates.address,
      phone: formStates.phone,
    }

    console.log(userData)

    /* Send data to API to register a new user */
    const newUser = await editUserAction(userData)
    hideModal()
    getUserAction().then((res) => {
      loginUser(res)
      setLoading(false)
    })

    console.log(newUser);
    return newUser
  }

  const handleEditUser = () => {
    const initStates = {
      id: store.auth.user._id,
      firstName: store.auth.user.firstName,
      lastName: store.auth.user.lastName,
      email: store.auth.user.email,
      phone: store.auth.user.phone,
      address: store.auth.user.address,
    }
    console.log(initStates)

    const Content = () => {
      return (
        <div className="px-6 pb-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8">
          <div className="flex justify-between">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edit your profile</h3>
          </div>
          <RegisterForm onSubmit={handleEditSubmit} withPW={false} initStates={initStates} admin={false} />
        </div>
      )
    }
    showModal(Content)
  }

  const handleResetPassword = () => {
    const initStates = {
      id: store.auth.user._id,
    }
    console.log(initStates)

    const Content = () => {
      const [oldPassword, setOldPassword] = useState('')
      const [newPassword, setNewPassword] = useState('')
      const [newPasswordConf, setNewPasswordConf] = useState('')

      const handleSubmit = (e) => {
        e.preventDefault()

        if (newPassword === newPasswordConf) {
          setLoading(true)
          resetPasswordAction(initStates.id, oldPassword, newPassword).then((data) => {
            if (data.error) {
              showToast(`incorrect old password`, false)
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

  return (
    <div className="bg-white px-3 py-10 shadow rounded border-t-4 border-yellow-400">
      <div className="flex items-center justify-between  text-gray-900 mb-4 text-2xl">
        <div className="flex">
          <span className="text-green-800">
            <AiOutlineUser className="mr-1" size={30} />
          </span>
          <span className="tracking-wide">About</span>
        </div>
        <button
          type="button"
          onClick={() => handleResetPassword()}
          className="group relative w-fit flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Reset Password
        </button>
        <button
          className="mr-3"
          onClick={() => handleEditUser()}>
          <AiOutlineEdit size={30} />
        </button>
      </div>
      <div className="text-gray-700">
        <div className="grid md:grid-cols-2 text-sm">
          <div className="grid grid-cols-2">
            <div className="px-4 py-2 font-semibold">First Name</div>
            <div className="px-4 py-2">{store.auth.user.firstName}</div>
          </div>
          <div className="grid grid-cols-2">
            <div className="px-4 py-2 font-semibold">Last Name</div>
            <div className="px-4 py-2">{store.auth.user.lastName}</div>
          </div>

          <div className="grid grid-cols-2">
            <div className="px-4 py-2 font-semibold">Address</div>
            <div className="px-4 py-2">{store.auth.user.address}</div>
          </div>
          <div className="grid grid-cols-2">
            <div className="px-4 py-2 font-semibold">Email.</div>
            <div className="px-4 py-2 ">
              <span className="hover:text-yellow-700">{store.auth.user.email}</span>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="px-4 py-2 font-semibold">Phone Number</div>
            <div className="px-4 py-2">{store.auth.user.phone}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUser
