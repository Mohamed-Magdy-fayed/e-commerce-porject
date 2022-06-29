import Navbar from "../../shared/Navbar";
import Carousel from "../main/Carousel";
import ProductsCarousel from "./ProductsCarousel";
import Footer from "../../shared/Footer";
import { useContext, useEffect, useState } from "react";
import StoreContext from "../../../context/store/StoreContext";
import Spinner from "../../shared/Spinner";
import { getProductsAction } from "../../../context/store/StoreActions";

const Home = () => {
  const { store, setData, showToast } = useContext(StoreContext);

  const [products, setProducts] = useState([])
  const [newProducts, setNewProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    getProductsAction().then(res => {
      if (res.error) return showToast(res.error, false)
      
      setData('products', res)
      setProducts(res)
      setNewProducts(res.filter(product => Date.now() - Date.parse(product.createdAt) < 2592000000))
      setFeaturedProducts(res.filter(product => product.isFeatured))
    })
  }, [])

  return (
    <div className="bg-white ">
      <Navbar />
      {store.loading ? (
        <Spinner />
      ) : (
        <>
          <Carousel />
          <ProductsCarousel products={products} title={"Recommended For You"} />
          <ProductsCarousel products={newProducts} title={"New"} />
          <ProductsCarousel
            products={featuredProducts}
            title={"Featured sets"}
          />
          <Footer />
        </>
      )}
    </div>
  );
};

export default Home;
