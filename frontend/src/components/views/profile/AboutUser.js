import React, { useContext, useState } from "react";
import { AiOutlineEdit, AiOutlineUser } from "react-icons/ai";
import { editUserAction, getUserAction, resetPasswordAction } from "../../../context/store/StoreActions";
import StoreContext from "../../../context/store/StoreContext";
import useResetPassword from "../../../hooks/useResetPassword";
import RegisterForm from "../../shared/forms/RegisterForm";

const AboutUser = () => {

  const { store, showModal, setLoading, hideModal, loginUser, showToast } = useContext(StoreContext)

  const resetPassword = useResetPassword()

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

    /* Send data to API to register a new user */
    await editUserAction(store.auth.token, userData)
      .then(res => {
        if (res.error) return showToast(res.error, false)

        getUserAction(store.auth.token, userData.id).then((res) => {
          loginUser({ user: res, token: store.auth.token })
          hideModal()
          setLoading(false)
        })
      })
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

  return (
    <div className="bg-white px-3 py-10 shadow rounded border-t-4 border-indigo-400">
      <div className="flex items-center justify-between  text-gray-900 mb-4 text-2xl">
        <div className="flex">
          <span className="text-indigo-800">
            <AiOutlineUser className="mr-1" size={30} />
          </span>
          <span className="tracking-wide">About</span>
        </div>
        <button
          type="button"
          onClick={() => resetPassword()}
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
        <div className="flex flex-col text-sm">
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
              <span className="hover:text-indigo-700 truncate block">{store.auth.user.email}</span>
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
