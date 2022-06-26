import { useContext, useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/solid";
import { classNames } from "./className";
import { Swiper, SwiperSlide } from "swiper/react";
//Ripples is lib. for ripples effects while clicking items
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
// import required modules
import { Navigation } from "swiper";
import { AiOutlineHeart } from "react-icons/ai";
import { useLocation } from "react-router";
import axios from "axios";
import StoreContext from "../../../context/store/StoreContext";
import Spinner from "../../shared/Spinner";
import { Link } from "react-router-dom";
import LoginPage from "../authorization/LoginPage";
import { addItemToUser } from "../../../context/store/StoreActions";

const usersReviews = [
  {
    name: "Jese Leos",
    pic: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
    productRating: 3,
    reviewTitle: "Thinking to buy another one!",
    reviewComment:
      "This is my third Invicta Pro Diver. They are just fantastic value for money. This one arrived yesterday and the first thing I did was set the time, popped on an identical strap from another Invicta and went in the shower with it to test the waterproofing.... No problems.",
    foundHelpful: 20,
  },
  {
    name: "Jese Leos",
    pic: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
    productRating: 3,
    reviewTitle: "Thinking to buy another one!",
    reviewComment:
      "This is my third Invicta Pro Diver. They are just fantastic value for money. This one arrived yesterday and the first thing I did was set the time, popped on an identical strap from another Invicta and went in the shower with it to test the waterproofing.... No problems.",
    foundHelpful: 20,
  },
  {
    name: "Jese Leos",
    pic: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
    productRating: 3,
    reviewTitle: "Thinking to buy another one!",
    reviewComment:
      "This is my third Invicta Pro Diver. They are just fantastic value for money. This one arrived yesterday and the first thing I did was set the time, popped on an identical strap from another Invicta and went in the shower with it to test the waterproofing.... No problems.",
    foundHelpful: 20,
  },
  {
    name: "Jese Leos",
    pic: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
    productRating: 3,
    reviewTitle: "Thinking to buy another one!",
    reviewComment:
      "This is my third Invicta Pro Diver. They are just fantastic value for money. This one arrived yesterday and the first thing I did was set the time, popped on an identical strap from another Invicta and went in the shower with it to test the waterproofing.... No problems.",
    foundHelpful: 20,
  },
];

const Product = () => {

  const { store, showToast, showModal, addToCart } = useContext(StoreContext)

  const id = useLocation().pathname.split('t/')[1]

  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState()
  const [reviews, setReviews] = useState()

  const getData = async () => {
    const config = {
      method: "get",
      url: `/api/products/${id}`,
    };
    const res = await (await axios(config)).data;

    return res
  };

  const calcReviews = (product) => {
    console.log(product.reviews);
  }

  useEffect(() => {
    setLoading(true)


    getData().then((res) => {
      console.log(res);
      if (res) {
        setProduct(res)
        calcReviews(res)
        setReviews({ href: "#", average: 4, totalCount: 117 })
        setLoading(false)
      } else {
        console.log(res.message)
        setLoading(false)
      }
    })
  }, [])

  const handleAddToCart = () => {

    if (!store.auth.authed) {
      showToast(`please login first to begin shopping!`, false)
      showModal(LoginPage)
      return
    }

    const isInCart = store.auth.user.cartItems.filter(p => p === product._id).length > 0 ? true : false
    if (isInCart) {
      showToast(`You've already added this product to your cart!`, false)
      return
    }

    addToCart(product._id)
    addItemToUser(store.auth.user._id, 'cartItems', product._id)
    showToast(`${product.name} has been added to your cart`, true)
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="mt-5">
      {/* Bread crumb */}
      <div className="pt-6">
        <nav>
          <ol className="max-w-2xl mx-auto px-4 flex items-center space-x-2 sm:px-6 lg:max-w-7xl lg:px-8">
            {product.tags.map((tag, i) => (
              <li key={i}>
                <div className="flex items-center">
                  <a
                    href={tag}
                    className="mr-2 text-sm font-medium text-gray-900"
                  >
                    {tag}
                  </a>
                  <svg
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="w-4 h-5 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))}
            <li className="text-sm">
              <Link
                to=''
                aria-current="page"
                className="font-medium text-gray-500 hover:text-gray-600"
              >
                {product.name}
              </Link>
            </li>
          </ol>
        </nav>
        {/* Image gallery */}
        <Swiper
          navigation={true}
          modules={[Navigation]}
          className="mt-20 max-h-[600px] max-w-[750px]"
        >
          {product.images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                className="object-cover object-center w-full h-auto"
                src={image}
                alt={image}
                key={index}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Product info */}
        <div className="max-w-2xl mx-auto pt-10 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 ">
          <div className="lg:col-span-2 lg:border-r lg:border-yellow-400 lg:pr-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {product.name}
            </h1>
          </div>
          <div className="mt-4 lg:mt-0 lg:row-span-3 self-center">
            <h2 className="sr-only">Product information</h2>
            <div className="w-full flex justify-between items-center">
              {/*product badge*/}
              <span className="font-medium text-sm bg-yellow-400 py-1 px-2 my-4">
                {product.isFeatured ? 'Featured' : ''}
              </span>
              {/*add to wish list*/}
              <button className="flex items-center">
                <AiOutlineHeart className="text-[25px] bg-[rgba(0,0,0,.05)] text-[rgb(44,44,44)] p-1 rounded-full" />
                <span className="text-sm font-medium sm:inline-block">
                  Add to wish card{" "}
                </span>
              </button>
            </div>
            <p className="text-3xl text-gray-900 my-5">{product.price}$</p>
            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        reviews.average > rating
                          ? "text-yellow-400"
                          : "text-gray-200",
                        "h-5 w-5 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{reviews.average} out of 5 stars</p>
                <a
                  href={reviews.href}
                  className="ml-3 text-sm font-bold text-yellow-400 hover:text-yellow-500"
                >
                  {reviews.totalCount} reviews
                </a>
              </div>
            </div>
            <div className="flex w-full justify-center my-20">
              {/* Age */}
              <div className="basis-1/2 flex flex-col items-center justify-center border-r-2 border-yellow-400">
                <p className="text-2xl font-bold">{product.age}</p>
                <h3 className="text-gray-900 font-medium">Age </h3>
              </div>

              {/* pieces */}

              <div className="basis-1/2 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">{product.pieces}</p>
                <h3 className="text-gray-900 font-medium">pieces</h3>
              </div>
            </div>
            {/*add to cart*/}
            <button onClick={() => handleAddToCart()} className="block w-full p-3 bg-[rgb(253,128,36)] font-bold text-sm uppercase  border-2 border-[rgb(253,128,36)] rounded hover:bg-white focus:bg-white focus:outline-none transition-all duration-500 ease-in-out">
              Add To Cart
            </button>
          </div>

          <div className="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-yellow-400 lg:pr-8">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Features</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900">{product.features}</p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>

              <div className="mt-4">
                <ul className="pl-4 list-disc text-sm space-y-2">
                  {product.highlights.map((highlight, i) => (
                    <li key={i} className="text-gray-400">
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>

              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{product.details}</p>
              </div>
            </div>
          </div>
        </div>
      </div >
    </div >
  )
}

export default Product
