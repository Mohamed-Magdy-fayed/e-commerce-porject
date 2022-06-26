import { useContext, useState } from "react"
import StoreContext from "../context/store/StoreContext"
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase/config";
import { MdOutlineClose, MdUpload } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';

const storage = getStorage();
/**
 * advanced we can have firebase delete the unwanted files
 * advanced we can have firebase check if the filename exists and warn the user
 */

const ImageInput = ({ id, setImages, init }) => {

    const { showToast, store, setLoading } = useContext(StoreContext)

    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(init ? init : '');
    const [task, setTask] = useState({});

    const handleUpload = async (file) => {
        setLoading(true)
        id !== 'image' ? setImages({ string: '', isRunning: true }) : setImages('')
        setImage('')
        const folder = store.productForm.id === '' ? 'carousel' : `products/${store.productForm.id}/`
        // Upload files to the object 'images/fileName.jpeg'
        const storageRef = ref(storage, `images/${folder}/${init ? id : file.name + uuidv4()}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        setTask(uploadTask)

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                setProgress(
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                );
                switch (snapshot.state) {
                    case "paused":
                        setIsRunning(false);
                        return;
                    case "running":
                        setIsRunning(true);
                        return;
                    default:
                        return;
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case "storage/unauthorized":
                        // User doesn't have permission to access the object
                        showToast(
                            `User doesn't have permission to access the object`,
                            false
                        );
                        return;
                    case "storage/canceled":
                        // User canceled the upload
                        showToast(`User canceled the upload`, false);
                        setIsRunning(false)
                        setProgress(0)
                        setLoading(false)
                        id !== 'image' ? setImages({ string: '', isRunning: false }) : setImages('')
                        return;
                    case "storage/unknown":
                        // Unknown error occurred, inspect error.serverResponse
                        showToast(
                            `Unknown error occurred, inspect error.serverResponse`,
                            false
                        );
                        return;
                    default:
                        return;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImage(downloadURL.toString())
                    id !== 'image' ? setImages({ string: downloadURL.toString(), isRunning: false }) : setImages(downloadURL.toString())
                    setIsRunning(false);
                    setLoading(false)
                });
            }
        );
    };

    return (
        <div className="flex flex-wrap justify-center items-center p-3 gap-3">
            <div className="grid place-items-center relative">
                <button type="button" onClick={() => {
                    setImage('')
                    task.cancel && task.cancel()
                    id !== 'image' ? setImages({ string: '', isRunning: false }) : setImages('')
                }} className="text-white absolute top-1 right-1">
                    <MdOutlineClose />
                </button>
                <label
                    htmlFor={id}
                    className={`text-white border w-[5rem] h-[5rem] grid place-items-center rounded-md bg-indigo-600 hover:bg-indigo-700`}
                >
                    <span>{isRunning ? progress + '%' : ''}</span>
                    {!isRunning ? (
                        <MdUpload />
                    ) : (
                        <svg role="status" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                    )}
                    {image !== '' ? (
                        <img className=" absolute w-[95%] bottom-[15%]" src={image} alt={id}></img>
                    ) : null}
                </label>
                <input
                    id={id}
                    name={id}
                    type="file"
                    disabled={isRunning}
                    className="hidden"
                    onChange={(e) => handleUpload(e.target.files[0])}
                />
            </div>
        </div>
    )
}

export default ImageInput