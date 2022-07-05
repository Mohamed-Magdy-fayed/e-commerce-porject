import React, { useContext } from "react";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import Profile from "./Profile";
import { Route, Routes } from "react-router-dom";
import StoreContext from "../../../context/store/StoreContext";
import NotFound from "../../shared/NotFound";

const ProfilePage = () => {

  const { store } = useContext(StoreContext)

  if (!store.auth.authed) return <NotFound code={401} msg="Unauthorized" />
  
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Profile paymentStatus={null} />} />
        <Route path="/success" element={<Profile paymentStatus={'success'} />} />
        <Route path="/cancel" element={<Profile paymentStatus={'cancel'} />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default ProfilePage
