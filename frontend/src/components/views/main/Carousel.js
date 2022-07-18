import { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper";
import StoreContext from "../../../context/store/StoreContext";
import Spinner from "../../shared/Spinner";
import { getImagesAction } from "../../../context/store/StoreActions";

const Carousel = () => {

  const { setData, store, showToast } = useContext(StoreContext)

  const [carouselData, setCarouselData] = useState([])
  const [loading, setLoading] = useState()

  useEffect(() => {
    setLoading(true)
    getImagesAction().then(res => {
      if (res.error) return showToast(res.error, false)
      
      let arr = []
      res.forEach(item => {
        if (item.isActive) {
          arr.push(item.imageURL)
        }
      })
      setCarouselData(arr)
      setData('carousels', res)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="select-none">
      <Swiper
        className="mySwiper 2xl:max-w-[1300px] w-full h-[350px] lg:h-[450px] overflow-hidden"
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
      >
        {carouselData.map((item, index) => (
          <SwiperSlide key={index}>
            <img
              className="w-full h-full object-cover object-center"
              src={item}
              alt="carousel element"
            ></img>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Carousel
