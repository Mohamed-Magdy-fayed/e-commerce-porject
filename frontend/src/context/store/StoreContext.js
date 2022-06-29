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

  const addToLocation = (productID, location) => {
    dispatch({
      type: 'ADD_TO_LOCATION',
      payload: productID,
      location,
    })
  }
  
  const deleteFromLocation = (productID, location) => {
    dispatch({
      type: 'DELETE_FROM_LOCATION',
      payload: productID,
      location,
    })
  }

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
        addToLocation,
        deleteFromLocation,
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
