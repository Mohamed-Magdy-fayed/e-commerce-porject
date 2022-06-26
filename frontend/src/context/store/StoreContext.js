import { createContext, useReducer } from "react";
import storeReducer from "./StoreReducer";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const initialState = {
    auth: {
      user: {
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        address: "",
        phone: "",
        type: "",
        status: "",
        cartItems: [],
        wishlistItems: [],
        orders: [],
      },
      token: "",
      authed: false,
    },
    toast: {
      isToast: false,
      text: "",
      isSuccess: true,
    },
    modal: {
      isModal: false,
    },
    appData: {
      users: [],
      branches: [],
      brands: [],
      products: [],
      categories: [],
      coupons: [],
      orders: [],
      carousel: [],
    },
    loading: true,
    productForm: {
      id: '',
      isEdit: false,
    },
  };

  const [store, dispatch] = useReducer(storeReducer, initialState);

  const loginUser = (userData) => {
    dispatch({
      type: "LOGIN_USER",
      payload: {
        ...userData,
        authed: true,
      },
    });
  };

  const logoutUser = () => {
    dispatch({
      type: "LOGOUT_USER",
      payload: initialState.auth,
    });
  };

  const showToast = (text, isSuccess) => {
    dispatch({
      type: "SHOW_TOAST",
      payload: {
        isToast: true,
        text,
        isSuccess,
      },
    });
  };

  const hideToast = () => {
    dispatch({
      type: "HIDE_TOAST",
      payload: {
        isToast: false,
      },
    });
  };

  const showModal = (content) => {
    dispatch({
      type: "SHOW_MODAL",
      payload: {
        isModal: true,
        content,
      },
    });
  };

  const hideModal = () => {
    dispatch({
      type: "HIDE_MODAL",
      payload: {
        isModal: false,
      },
    });
  };

  const setLoading = (value) => {
    dispatch({
      type: "SET_LOADING",
      payload: value,
    });
  };

  const setData = (collection, res) => {
    dispatch({
      type: "SET_DATA",
      payload: res,
      collection,
    });
  }

  const setProductForm = (productID, isEdit) => {
    dispatch({
      type: "SET_PRODUCT_FORM",
      payload: {
        id: productID,
        isEdit: isEdit ? isEdit : false,
      }
    })
  }

  const addToCart = (productID) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: productID
    })
  }

  const deleteFromCart = (productID) => {
    dispatch({
      type: 'DELETE_FROM_CART',
      payload: productID
    })
  }

  // const setAppData = async (collection) => {
  //   const config = {
  //     method: "get",
  //     url: `https://mina-jpp1.herokuapp.com/api/${collection}`,
  //   };
  //   const res = await (await axios(config)).data;

  //   dispatch({
  //     type: "SET_DATA",
  //     payload: res,
  //     collection,
  //   });

  //   return res
  // };

  return (
    <StoreContext.Provider
      value={{
        store,
        logoutUser,
        loginUser,
        showToast,
        hideToast,
        showModal,
        hideModal,
        addToCart,
        deleteFromCart,
        // setAppData,
        setData,
        setLoading,
        setProductForm,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContext;
