import React from "react";
import ProfileSummery from "./ProfileSummery";
import AboutUser from "./AboutUser";
import Cart from "./Cart";
import WishList from "./WishList";

export default function Profile() {
  return (
    <div className="bg-gray-200 mx-auto py-10 px-5">
      <div className="md:flex no-wrap md:-mx-2 ">
        <div className="w-full max-w-[992px] mx-auto">
          {/*profile summery */}
          <ProfileSummery />

          <div className="my-10"></div>

          {/* about section */}
          <AboutUser />

          <div className="my-10"></div>

          {/* Cart section */}
          <Cart />

          <div className="my-10"></div>

          {/* whish list section */}
          <WishList />
        </div>
      </div>
    </div>
  );
}
