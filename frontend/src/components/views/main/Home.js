import Navbar from "../../shared/Navbar";
import Carousel from "../main/Carousel";
import ProductsCarousel from "./ProductsCarousel";
import Footer from "../../shared/Footer";
import { useContext, useEffect, useState } from "react";
import StoreContext from "../../../context/store/StoreContext";
import Spinner from "../../shared/Spinner";
import axios from "axios";

const Home = () => {
  const { store, setData } = useContext(StoreContext);

  const [products, setProducts] = useState([])
  const [newProducts, setNewProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])

  const getData = async () => {
    const config = {
      method: "get",
      url: `/api/products`,
    };
    const res = await (await axios(config)).data;

    return res
  };

  useEffect(() => {
    getData().then(res => {
      setData('products', res)
      setProducts(res)
      setNewProducts(res.filter(product => Date.now() - Date.parse(product.createdAt) < 10000000))
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
