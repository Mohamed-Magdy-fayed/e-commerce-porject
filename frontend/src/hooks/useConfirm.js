import { useContext } from "react";
import StoreContext from "../context/store/StoreContext";

const useConfirm = () => {
    const { hideModal, showModal } = useContext(StoreContext)

    let resolveCallback;


    const confirm = async () => {
        return new Promise((res, rej) => {
            resolveCallback = res;
        });
    };

    const confirmAction = async (text) => {
        const res = (isConfirmed) => {
            resolveCallback(isConfirmed)
            hideModal()
        }

        const ConfirmModal = () => {
            return (
                <div className='flex flex-col gap-4 justify-around items-center w-full p-4'>
                    <div>
                        {text}
                    </div>
                    <div className='flex items-center justify-center gap-4 w-full'>
                        <button className='group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700' onClick={() => res(true)}>Confirm</button>
                        <button className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:bg-rose-700" onClick={() => res(false)}>Cancel</button>
                    </div>
                </div>
            )
        }
        showModal(ConfirmModal)

        const isConfirmed = await confirm()
        return isConfirmed
    }

    return { confirmAction }
}

export default useConfirm