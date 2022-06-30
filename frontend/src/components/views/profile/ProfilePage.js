import React from "react";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import Profile from "./Profile";
import { Route, Routes } from "react-router-dom";

const ProfilePage = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Profile paymentStatus={null}/>} />
        <Route path="/success" element={<Profile paymentStatus={'success'}/>} />
        <Route path="/cancel" element={<Profile paymentStatus={'cancel'}/>} />
      </Routes>

      <Footer />
    </div>
  );
}

export default ProfilePage
