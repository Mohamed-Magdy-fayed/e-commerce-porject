import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { getUserAction } from "../context/store/StoreActions";
import StoreContext from "../context/store/StoreContext";

export const useProtect = () => {
    const navigate = useNavigate();
    const { loginUser, logoutUser, setLoading, showToast, store } = useContext(StoreContext);
    const url = useLocation().pathname;

    const checkAuth = () => {
        setLoading(true)
        const checkToken = localStorage.getItem('token')
        if (checkToken) {
            const { id, token } = JSON.parse(checkToken)
            getUserAction(token, id).then(res => {
                if (res.error) return showToast(res.error, false)
                
                const userData = {
                    user: res,
                    token,
                }
                console.log(userData);
                loginUser(userData)
                setLoading(false)
                if (url === '/login' || url === '/register') {
                    navigate('/')
                }
            })
        } else {
            logoutUser()
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAuth()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
