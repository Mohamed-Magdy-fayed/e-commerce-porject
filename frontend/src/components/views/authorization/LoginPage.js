import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import StoreContext from "../../../context/store/StoreContext";
import { loginUserAction } from "../../../context/store/StoreActions";

const LoginPage = () => {
  // Connect to context

  const { store, setLoading, loginUser, showToast, hideModal } = useContext(StoreContext);

  const url = useLocation().pathname
  const navigate = useNavigate();

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Form On Submit
  const login = async (e) => {
    e.preventDefault();

    setLoading(true);

    const credentials = {
      email,
      password,
    };

    const res = await loginUserAction(credentials)

    // Check if wrong password
    if (!res) {
      showToast(`Incorrect Password!`, false);
      setLoading(false);
      return;
    }

    // Dispatch the action to the state
    const data = {
      user: res.data.user,
      token: res.data.token,
    };
    loginUser(data);

    // Save token to local storage
    const storage = {
      id: res.data.user._id,
      token: res.data.token,
    };
    localStorage.setItem("token", JSON.stringify(storage));
    setLoading(false);
    if (url.includes('login')) {
      navigate("/")
    } else {
      hideModal()
    }
  };

  // Form on forgot username
  const forgetUsername = () => { };

  // Form on forgot password
  const forgetPassword = () => {
    /* To Do hit password reset API */
  };

  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-center text-1xl">Logo</h2>
            {/* ToDo add logo*/}
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Log in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={(e) => login(e)}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col items-start justify-between">
              <div className="container p-4">
                <p className="text-center text-xs text-gray-500">
                  Remember to log out afterwards if you’re using a shared
                  computer, for example in a library or school.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center">
              {store.loading ? (
                <button
                  disabled
                  type="submit"
                  className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Logging in...
                </button>
              ) : (
                <button
                  type="submit"
                  className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Log in
                </button>
              )}
              <div className="flex flex-row space-x-5 p-4">
                <div className="text-sm">
                  <button
                    onClick={() => forgetUsername()}
                    type="button"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot Username?
                  </button>
                </div>
                <div>
                  <span className="text-gray-400">|</span>
                </div>
                <div className="text-sm">
                  <button
                    onClick={() => forgetPassword()}
                    type="button"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-0">
                <span>Don't have an account?</span>
                <Link
                  to="/register"
                  type="button"
                  className="mt-5 font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Create one
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
