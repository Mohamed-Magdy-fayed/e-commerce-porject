import { useContext } from "react"
import { Route, Routes } from "react-router"
import StoreContext from "../../../context/store/StoreContext"
import Footer from "../../shared/Footer"
import Navbar from "../../shared/Navbar"
import NotFound from "../../shared/NotFound"
import AdminToolbar from "../adminTools/AdminToolbar"
import { AnalyticsTool } from "../adminTools/AnalyticsTool"
import CouponsTool from "../adminTools/CouponsTool"
import ImagesTool from "../adminTools/ImagesTool"
import OrdersTool from "../adminTools/OrdersTool"
import ProductsTool from "../adminTools/ProductsTool"
import UsersTool from "../adminTools/UsersTool"

const AdminDashboard = () => {

    const { store } = useContext(StoreContext)

    if (store.auth.user.type !== 'Admin' && store.auth.authed) {
        return (
            <NotFound code={401} msg={`Unauthorized!`} />
        )
    }

    return (
        <div>
            <Navbar />
            <h1 className="text-left text-3xl font-medium text-gray-700 px-6 pt-6">Admin Dashboard</h1>
            <AdminToolbar />
            <Routes>
                <Route path="/users" element={<UsersTool />} />
                {/* <Route path="/branches" element={<BranchesTool />} />
                <Route path="/brands" element={<BrandsTool />} /> */}
                <Route path="/coupons" element={<CouponsTool />} />
                <Route path="/images" element={<ImagesTool />} />
                <Route path="/orders" element={<OrdersTool />} />
                <Route path="/products" element={<ProductsTool />} />
                {/* <Route path="/categories" element={<CategoriesTool />} /> */}
                <Route path="/" element={<AnalyticsTool />} />
            </Routes>
            <Footer />
        </div>
    )
}

export default AdminDashboard