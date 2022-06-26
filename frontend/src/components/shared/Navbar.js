import { Fragment, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import {
  MenuIcon,
  SearchIcon,
  ShoppingBagIcon,
  XIcon,
  HeartIcon,
} from "@heroicons/react/outline";
import StoreContext from "../../context/store/StoreContext";
import useDebounce from "../../hooks/useDebounce";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchShow, setSearchShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const { store, logoutUser } = useContext(StoreContext);

  const navigate = useNavigate();
  useDebounce(() => handleChange(searchQuery), 500, [searchQuery])

  const handleChange = (query) => {
    setSearchResults(() => {
      if (query.length === 0) {
        return store.appData.products.slice(0, 5)
      } else {
        return store.appData.products.filter(p => p.name.toLowerCase().includes(query)).slice(0, 5)
      }
    })
  }

  const toggleSearch = () => {
    setSearchShow(!searchShow);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    // updates the app state
    logoutUser();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-40 lg:hidden"
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative max-w-xs w-full bg-white shadow-xl pb-12 flex flex-col overflow-y-auto">
              <div className="px-4 pt-5 pb-2 flex">
                <button
                  type="button"
                  className="-m-2 p-2 rounded-md inline-flex items-center justify-center text-gray-400"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="border-t border-gray-200 py-6 px-4 space-y-6">
                <div>
                  {/* User controls */}
                  <span className="sr-only">Open user menu</span>
                  <span className="font-medium">
                    Welcome{" "}
                    {store.auth.authed ? store.auth.user.firstName : "Gamer"}
                  </span>
                </div>

                <div className="flex flex-col w-[5px]">
                  <Link
                    to="/shop"
                    className="p-2 block font-medium text-gray-900 hover:bg-gray-100"
                  >
                    Shop
                  </Link>
                  <Link
                    to="/discover"
                    className="p-2 block font-medium text-gray-900 hover:bg-gray-100"
                  >
                    Discover
                  </Link>
                  <Link
                    to="/help"
                    className="p-2 block font-medium text-gray-900 hover:bg-gray-100"
                  >
                    Help
                  </Link>
                  <Link
                    to="/special"
                    className="p-2 block font-medium text-gray-900 hover:bg-gray-100"
                  >
                    Special Offers
                  </Link>
                </div>

                {store.auth.authed ? (
                  <>
                    <div className="flow-root">
                      {store.auth.user.type === "Admin" ? (
                        <Link
                          to="/admin/dashboard"
                          className="p-2 block font-medium text-gray-900 hover:bg-gray-100"
                        >
                          Admin Dashboard
                        </Link>
                      ) : null}
                      <button
                        onClick={() => handleLogout()}
                        className="p-2 w-full text-left block font-medium text-red-900 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flow-root">
                      <Link
                        to="/login"
                        className="-m-2 p-2 block font-medium text-gray-900"
                      >
                        Log in
                      </Link>
                    </div>
                    <div className="flow-root">
                      <Link
                        to="/register"
                        className="-m-2 p-2 block font-medium text-gray-900"
                      >
                        Create account
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      <header className="relative bg-white">
        <nav
          aria-label="Top"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="h-16 flex items-center">
              <button
                type="button"
                className="bg-white p-2 rounded-md text-gray-400 lg:hidden"
                onClick={() => setOpen(true)}
              >
                <span className="sr-only">Open menu</span>
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link to="/">
                  <span className="sr-only">Workflow</span>
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
                    alt=""
                  />
                </Link>
              </div>

              <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-between ml-6">
                <div className="lg:space-x-6">
                  <Link
                    to="/shop"
                    className="text-lg font-medium text-gray-700 hover:text-gray-900"
                  >
                    Shop
                  </Link>
                  <Link
                    to="/discover"
                    className="text-lg font-medium text-gray-700 hover:text-gray-900"
                  >
                    Discover
                  </Link>
                  <Link
                    to="/help"
                    className="text-lg font-medium text-gray-700 hover:text-gray-900"
                  >
                    Help
                  </Link>
                  <Link
                    to="/special"
                    className="text-lg font-medium text-gray-700 hover:text-gray-900"
                  >
                    Special Offers
                  </Link>
                </div>
                {store.auth.authed ? (
                  <div className="flex w-fit">
                    {store.auth.user.type === "Admin" ? (
                      <Link
                        to="/admin/dashboard"
                        className=" whitespace-nowrap p-2 block font-medium text-gray-900 hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </Link>
                    ) : null}
                    <button
                      onClick={() => handleLogout()}
                      className="p-2 w-full text-left block font-medium text-red-900 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex w-fit">
                    <div className="flow-root">
                      <Link
                        to="/login"
                        className="m-2 p-2 block font-medium text-gray-900"
                      >
                        Log in
                      </Link>
                    </div>
                    <div className="flow-root">
                      <Link
                        to="/register"
                        className="m-2 p-2 block font-medium text-gray-900"
                      >
                        Create account
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="ml-auto flex items-center">
                {/* Search */}
                {searchShow ? (
                  <div className="flex lg:ml-6">
                    <div className="ml-6 relative">
                      <label htmlFor="searchQuery" className="sr-only">Search Input</label>
                      <input
                        id="searchQuery"
                        name="searchQuery"
                        type='text'
                        autoFocus={searchShow}
                        className={`appearance-none w-full relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${searchQuery.length > 0 ? 'rounded-t-md' : 'rounded-md'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <div className="z-10 absolute border rounded-b-md w-full bg-white flex flex-col">
                        {searchResults.slice(0, 5).map(product => (
                          <Link key={product._id} to={`/product/${product._id}`} className="block px-3 py-2 hover:bg-slate-50">{product.name}</Link>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSearch()}
                      className="p-2 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Search</span>
                      <XIcon className="w-6 h-6" aria-hidden="true" />
                    </button>
                    {/* Todo add search functionality */}
                  </div>
                ) : (
                  <div className="flex lg:ml-6">
                    <button
                      onClick={() => toggleSearch()}
                      className="p-2 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Search</span>
                      <SearchIcon className="w-6 h-6" aria-hidden="true" />
                    </button>
                    {/* Todo add search functionality */}
                  </div>
                )}

                {/* Wish List */}
                <div className="ml-4 flow-root lg:ml-6">
                  <Link
                    to="/profile/:userId#wish-list"
                    className="group -m-2 p-2 flex items-center"
                  >
                    <HeartIcon
                      className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      0
                    </span>
                    <span className="sr-only">items in wishlist, view it</span>
                  </Link>
                </div>

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <Link
                    to="/profile/:userId#cart"
                    className="group -m-2 p-2 flex items-center"
                  >
                    <ShoppingBagIcon
                      className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      {store.auth.authed ? store.auth.user.cartItems.length : 0}
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
