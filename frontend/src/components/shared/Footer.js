import React from "react";
import {
  BsFacebook,
  BsTwitter,
  BsGoogle,
  BsInstagram,
  BsFillTelephoneFill,
} from "react-icons/bs";
import { AiFillHome, AiOutlineMail, AiFillPrinter } from "react-icons/ai";

export default function Footer() {
  return (
    <footer className="text-center lg:text-left bg-[rgb(253,128,36)]/[.5] text-black-600">
      <div className="flex justify-center items-center lg:justify-between p-8 border-b border-black">
        <div className="mr-12 hidden lg:block">
          <span>Get connected with us on social networks:</span>
        </div>
        <div className="flex justify-center">
          <a href="#!" className="mr-6 text-gray-600 hover:text-red-600">
            <BsFacebook />
          </a>
          <a href="#!" className="mr-6 text-gray-600 hover:text-red-600">
            <BsTwitter />
          </a>
          <a href="#!" className="mr-6 text-gray-600 hover:text-red-600">
            <BsGoogle />
          </a>
          <a href="#!" className="mr-6 text-gray-600 hover:text-red-600">
            <BsInstagram />
          </a>
        </div>
      </div>
      <div className="mx-6 py-10 text-center md:text-left">
        <div className="grid grid-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="">
            <h6
              className="
            uppercase
            font-semibold
            mb-4
            flex
            items-center
            justify-center
            md:justify-start
          "
            >
              {/*TodO add log*/}
              T3 Toys
            </h6>
          </div>
          <div className="">
            <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start">
              Products
            </h6>
            <p className="mb-4">
              <a
                href="#!"
                className="text-gray-600 underline underline-offset-2 hover:text-red-600"
              >
                BrickHeadz
              </a>
            </p>
            <p className="mb-4">
              <a
                href="#!"
                className="text-gray-600 underline underline-offset-2 hover:text-red-600"
              >
                DUPLO®
              </a>
            </p>
            <p className="mb-4">
              <a
                href="#!"
                className="text-gray-600 underline underline-offset-2 hover:text-red-600"
              >
                Star Wars™
              </a>
            </p>
            <p>
              <a
                href="#!"
                className="text-gray-600 underline underline-offset-2 hover:text-red-600"
              >
                Technic™
              </a>
            </p>
          </div>
          <div className="">
            <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start">
              Useful links
            </h6>
            <p className="mb-4">
              <a
                href="#!"
                className="text-gray-600 underline underline-offset-2 hover:text-red-600"
              >
                Pricing
              </a>
            </p>
            <p className="mb-4">
              <a
                href="#!"
                className="text-gray-600 underline underline-offset-2 hover:text-red-600"
              >
                Settings
              </a>
            </p>
            <p className="mb-4">
              <a
                href="#!"
                className="text-gray-600 underline underline-offset-2 hover:text-red-600"
              >
                Orders
              </a>
            </p>
            <p>
              <a
                href="#!"
                className="text-gray-600 underline underline-offset-2 hover:text-red-600"
              >
                Help
              </a>
            </p>
          </div>
          <div className="">
            <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start">
              Contact
            </h6>
            <p className="flex items-center justify-center md:justify-start mb-4">
              <AiFillHome className="mr-2" />
              New York, NY 10012, US
            </p>
            <p className="flex items-center justify-center md:justify-start mb-4">
              <AiOutlineMail className="mr-2" />
              info@example.com
            </p>
            <p className="flex items-center justify-center md:justify-start mb-4">
              <BsFillTelephoneFill className="mr-2" />+ 01 234 567 88
            </p>
            <p className="flex items-center justify-center md:justify-start">
              <AiFillPrinter className="mr-2" />+ 01 234 567 89
            </p>
          </div>
        </div>
      </div>
      <div className="text-center p-6 bg-[rgb(253,128,36)]">
        <span>© 2022 Copyright </span>
        <a className="text-black font-semibold" href="#">
          T3 Toys
        </a>
      </div>
    </footer>
  );
}
