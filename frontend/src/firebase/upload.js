import { useContext, useEffect, useState } from "react";
import StoreContext from "../context/store/StoreContext";
import ImageInput from "./ImageInput";

const Upload = ({ setImages, setLoading, carousel, initStates, init }) => {

  const { showToast } = useContext(StoreContext)

  const [image1, setimage1] = useState({ string: initStates ? initStates.images[0] : '', isRunning: false })
  const [image2, setimage2] = useState({ string: initStates ? initStates.images[1] : '', isRunning: false })
  const [image3, setimage3] = useState({ string: initStates ? initStates.images[2] : '', isRunning: false })
  const [image4, setimage4] = useState({ string: initStates ? initStates.images[3] : '', isRunning: false })
  const [image5, setimage5] = useState({ string: initStates ? initStates.images[4] : '', isRunning: false })

  useEffect(() => {
    if (carousel) {
      return
    }
    setImages([image1.string, image2.string, image3.string, image4.string, image5.string])
    setLoading(() => {
      let running = [image1, image2, image3, image4, image5].filter(img => img.isRunning === true)
      if (running.length > 0) {
        return true
      } else {
        return false
      }
    })
  }, [image1, image2, image3, image4, image5])

  if (!carousel) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3">
        <ImageInput id='image1' setImages={setimage1} setLoading={setLoading} init={image1.string} />
        <ImageInput id='image2' setImages={setimage2} setLoading={setLoading} init={image2.string} />
        <ImageInput id='image3' setImages={setimage3} setLoading={setLoading} init={image3.string} />
        <ImageInput id='image4' setImages={setimage4} setLoading={setLoading} init={image4.string} />
        <ImageInput id='image5' setImages={setimage5} setLoading={setLoading} init={image5.string} />
      </div>
    )
  }

  return (
    <div>
      <ImageInput id='image' setImages={setImages} setLoading={setLoading} init={init && init.imageURL} />
    </div>
  );
};

export default Upload;
