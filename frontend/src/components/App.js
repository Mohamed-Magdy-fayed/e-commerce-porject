import { Routes, Route } from "react-router";
import { useProtect } from "../hooks/useProtect";
import Modal from "./shared/Modal";
import Toast from "./shared/Toast";
import AdminDashboard from "./views/authorization/AdminDashboard";
import LoginPage from "./views/authorization/LoginPage";
import RegisterPage from "./views/authorization/RegisterPage";
import Help from "./views/main/Help";
import Home from "./views/main/Home";
import { Shop } from "./views/main/Shop";
import ProductPage from "./views/product/ProductPage";
import { useContext } from "react";
import StoreContext from "../context/store/StoreContext";
import NotFound from "./shared/NotFound";
import ProfilePage from "./views/profile/ProfilePage";
import Spinner from "./shared/Spinner";

const App = () => {
  const { store } = useContext(StoreContext);
  useProtect()

  if (store.loading) return <Spinner />

  return (
    <div className="relative" id="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
        <Route path="/shop/*" element={<Shop />} />
        <Route path="/help" element={<Help />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/profile/:userId/*" element={<ProfilePage />} />
        <Route
          path="*"
          element={<NotFound code={404} msg={`Page not found!`} />}
        />
      </Routes>
      <div
        className={`container toast-container grid place-items-center z-50 ${store.toast.isToast ? "" : "pointer-events-none"
          }`}
      >
        <Toast />
      </div>
      <Modal />
    </div>
  );
};

export default App;
