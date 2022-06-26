import React, { useContext } from "react";
import { BiUserCircle } from "react-icons/bi";
import StoreContext from '../../../context/store/StoreContext'

const ProfileSummery = () => {

  const { store } = useContext(StoreContext)
  return (
    <div
      id="profile-summery"
      className="bg-white shadow rounded p-3 py-10 border-t-4 border-yellow-400 "
    >
      <h2 className="text-gray-900 flex items-center text-2xl mb-4">
        <BiUserCircle size={30} className="mr-1" />
        {store.auth.user.firstName} {store.auth.user.lastName}
      </h2>

      <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm w-full max-w-[550px]">
        <li className="flex items-center py-3">
          <span>Status</span>
          <span className="ml-auto">
            <span className="bg-yellow-500 py-1 px-2 rounded text-white text-sm">
              {store.auth.user.status}
            </span>
          </span>
        </li>
        <li className="flex items-center py-3">
          <span>Member since</span>
          <span className="ml-auto">{new Date(Date.parse(store.auth.user.createdAt)).toDateString()}</span>
        </li>
      </ul>
    </div>
  );
}

export default ProfileSummery
