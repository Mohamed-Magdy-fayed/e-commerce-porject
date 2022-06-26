import axios from "axios";
import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import StoreContext from "../context/store/StoreContext";

export const useProtect = () => {
    const navigate = useNavigate();
    const { loginUser, logoutUser, setLoading } = useContext(StoreContext);
    const url = useLocation().pathname;

    const checkAuth = () => {
        setLoading(true)
        const checkToken = localStorage.getItem('token')
        if (checkToken) {
            const { id, token } = JSON.parse(checkToken)
            let config = {
                method: 'get',
                url: `/api/users/userid${id}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            axios(config).then(res => {
                const userData = {
                    user: res.data,
                    token,
                }
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
