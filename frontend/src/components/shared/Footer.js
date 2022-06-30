import {Link} from "react-router-dom";
import {
  BsFacebook,
  BsTwitter,
  BsGoogle,
  BsInstagram,
  BsFillTelephoneFill,
} from "react-icons/bs";
import { AiFillHome, AiOutlineMail, AiFillPrinter } from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="mt-4 text-center lg:text-left bg-indigo-600 text-white-600">
      <div className="flex justify-center items-center lg:justify-between p-8 border-b border-white bg-indigo-700">
        <div className="mr-12 hidden lg:block text-white">
          <span>Get connected with us on social networks:</span>
        </div>
        <div className="flex justify-center">
          <a href="https://www.facebook.com/" target="_Blank" className="mr-6 text-white hover:text-blue-600" rel="noreferrer">
            <BsFacebook />
          </a>
          <a href="https://twitter.com/" target="_Blank" className="mr-6 text-white hover:text-cyan-600" rel="noreferrer">
            <BsTwitter />
          </a>
          <a href="https://www.google.com/" target="_Blank" className="mr-6 text-white hover:text-black" rel="noreferrer">
            <BsGoogle />
          </a>
          <a href="https://www.instagram.com/" target="_Blank" className="mr-6 text-white hover:text-red-600" rel="noreferrer">
            <BsInstagram />
          </a>
        </div>
      </div>
      <div className="mx-6 py-10 text-center md:text-left">
        <div className="grid grid-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-white">
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
            <p className="mb-4">
              <Link
                to="/"
                className="underline underline-offset-2 hover:text-black"
              >
                Products
              </Link>
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
      <div className="text-center p-6 border-t border-white bg-indigo-700 text-white">
        <span>© 2022 Copyright </span>
        <Link className="font-semibold" to="/">
          T3 Toys
        </Link>
      </div>
    </footer>
  );
}

export default Footer
