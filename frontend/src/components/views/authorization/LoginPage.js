import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import StoreContext from "../../../context/store/StoreContext";
import { loginUserAction } from "../../../context/store/StoreActions";
import useResetPassword from "../../../hooks/useResetPassword";
import { useProtect } from "../../../hooks/useProtect";

const LoginPage = () => {
  useProtect()

  // Connect to context
  const { store, setLoading, loginUser, showToast, hideModal } = useContext(StoreContext);

  const url = useLocation().pathname
  const navigate = useNavigate()
  const resetPassword = useResetPassword()

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

    await loginUserAction(credentials).then(res => {
      if (res.error) {
        setLoading(false)
        return showToast(res.error, false)
      }

      // Dispatch the action to the state
      const data = {
        user: res.user,
        token: res.token,
      }
      loginUser(data)

      // Save token to local storage
      const storage = {
        id: res.user._id,
        token: res.token,
      };
      localStorage.setItem("token", JSON.stringify(storage));
      setLoading(false)

      if (url.includes('login')) {
        navigate("/")
      } else {
        hideModal()
      }
    })
  };

  // Form on forgot password
  const forgetPassword = () => {
    resetPassword(true)
  };

  // demo admin login
  const handleDemoLogin = async () => {
    setLoading(true);

    const credentials = {
      email: 'admin_test@email.com',
      password: '1234',
    };

    await loginUserAction(credentials).then(res => {
      if (res.error) {
        setLoading(false)
        return showToast(res.error, false)
      }

      // Dispatch the action to the state
      const data = {
        user: res.user,
        token: res.token,
      }
      loginUser(data)

      // Save token to local storage
      const storage = {
        id: res.user._id,
        token: res.token,
      };
      localStorage.setItem("token", JSON.stringify(storage));
      setLoading(false)

      if (url.includes('login')) {
        navigate("/")
      } else {
        hideModal()
      }
    })
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            {/* Logo */}
            <div className="ml-4 flex lg:ml-0 justify-center">
              <Link to="/">
                <span className="sr-only">Workflow</span>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
                  alt=""
                />
              </Link>
            </div>
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
              {store.loading ? (
                <button
                  disabled
                  type="button"
                  className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                >
                  Logging in...
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleDemoLogin()}
                  className="group relative w-1/2 flex justify-center py-2 px-4 mt-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                >
                  Demo the app as an admin
                </button>
              )}
              <div className="flex flex-row space-x-5 p-4">
                <div className="text-sm">
                  <button
                    onClick={() => forgetPassword()}
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
