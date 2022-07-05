import { useContext, useEffect, useState } from "react";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import { addImageAction, deleteImageAction, editImageAction, getImagesAction } from "../../../context/store/StoreActions";
import StoreContext from "../../../context/store/StoreContext";
import useConfirm from "../../../hooks/useConfirm";
import ImagesForm from "../../shared/forms/imagesForm";
import Spinner from "../../shared/Spinner";

const ImagesTool = () => {
  const { store, showModal, hideModal, setData, showToast } = useContext(StoreContext);

  const [loading, setLoading] = useState([])
  const [reload, setReload] = useState(false)

  const { confirmAction } = useConfirm()

  useEffect(() => {
    setLoading(true)
    getImagesAction().then((res) => {
      if (res.error) {
        showToast(res.error, false)
        setData('carousel', [])
        setLoading(false)
        return
      }
      setData('carousel', res)
      setLoading(false)
    })
  }, [reload])

  // submit the add form
  const handleAddSubmit = async (formStates) => {
    const imageData = {
      imageURL: formStates.imageURL,
      productURL: formStates.productURL,
      isActive: formStates.isActive,
    };

    /* Send data to API to add new image to the product */
    await addImageAction(store.auth.token, imageData).then(data => {
      if (data.error) return showToast(data.error, false)

      hideModal()
      setReload(!reload)
    })
  };

  // open the modal and fill it's content
  const modalAdd = () => {
    const Content = () => {
      return (
        <div className="px-6 pb-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Add Image
          </h3>
          <ImagesForm onSubmit={handleAddSubmit} />
        </div>
      );
    };

    showModal(Content);
  };

  const handleEditSubmit = async (formStates) => {
    const { imageURL, productURL, isActive, id } = formStates
    const imageData = {
      imageURL,
      productURL,
      isActive,
      id,
    }

    /* Send data to API to edit the image */
    await editImageAction(store.auth.token, imageData).then(data => {
      if (data.error) return showToast(data.error, false)

      hideModal()
      setReload(!reload)
    })
  }

  // opens edit modal
  const editModal = (index) => {
    const { imageURL, productURL, isActive, _id } = store.appData.carousel[index]
    const initStates = {
      imageURL,
      productURL,
      isActive,
      id: _id,
    }

    const Content = () => {
      return (
        <div className="px-6 pb-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edit Image</h3>
          <ImagesForm onSubmit={handleEditSubmit} initStates={initStates} />
        </div>
      )
    }
    showModal(Content)
  }

  const handleDelete = async (index) => {
    const imageID = store.appData.carousel[index]._id

    const isConfirmed = await confirmAction(`Please confirm to delete image ${imageID}`)
    if (!isConfirmed) return

    /* Send data to API to delete the image */
    await deleteImageAction(store.auth.token, imageID).then(data => {
      if (data.error) return showToast(data.error, false)

      setReload(!reload)
    })
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid place-items-center pb-3">
          <h1 className="text-left text-xl font-medium p-6 text-gray-700">
            Images Data
          </h1>
          <div className="max-w-7xl px-6">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Image
                    </th>
                    <th scope="col" className="px-6 py-3 hidden sm:table-cell">
                      Product URL
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <span>Edit or Delete</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {store.appData.carousel.map((image, i) => (
                    <tr
                      key={i}
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                      >
                        <img src={image.imageURL} alt='' width={100}></img>
                      </th>
                      <td className="px-6 py-4 hidden sm:table-cell truncate">{image.productURL}</td>
                      <td className="px-6 py-4">{image.isActive ? 'On Carousel' : 'Off Carousel'}</td>
                      <td className="px-6 py-4 flex max-w-fit">
                        <button
                          id={i}
                          onClick={(e) => editModal(e.currentTarget.id)} className="group relative flex-grow flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
                        >
                          <MdEdit />
                        </button>
                        <button
                          id={i}
                          onClick={(e) => handleDelete(e.currentTarget.id)} className="group relative flex-grow flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:bg-rose-700"
                        >
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
  );
};

export default ImagesTool;
