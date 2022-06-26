import { logger } from "../middleware/logger"

const storeReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_USER':
            logger(state, action)
            return {
                ...state,
                auth: action.payload,
            }
        case 'LOGOUT_USER':
            logger(state, action)
            return {
                ...state,
                auth: action.payload,
            }
        case 'SHOW_TOAST':
            logger(state, action)
            return {
                ...state,
                toast: action.payload,
            }
        case 'HIDE_TOAST':
            logger(state, action)
            return {
                ...state,
                toast: {
                    ...state.toast,
                    isToast: action.payload.isToast,
                }
            }
        case 'SHOW_MODAL':
            logger(state, action)
            return {
                ...state,
                modal: action.payload,
            }
        case 'HIDE_MODAL':
            logger(state, action)
            return {
                ...state,
                modal: action.payload,
            }
        case 'SET_DATA':
            logger(state, action)
            return {
                ...state,
                appData: {
                    ...state.appData,
                    [action.collection]: action.payload,
                }
            }
        case 'SET_LOADING':
            logger(state, action)
            return {
                ...state,
                loading: action.payload,
            }
        case 'SET_PRODUCT_FORM':
            logger(state, action)
            return {
                ...state,
                productForm: action.payload,
            }
        case 'ADD_TO_CART':
            logger(state, action)
            return {
                ...state,
                auth: {
                    ...state.auth,
                    user: {
                        ...state.auth.user,
                        cartItems: [...state.auth.user.cartItems, action.payload]
                    }
                },
            }
        case 'DELETE_FROM_CART':
            logger(state, action)
            return {
                ...state,
                auth: {
                    ...state.auth,
                    user: {
                        ...state.auth.user,
                        cartItems: state.auth.user.cartItems.filter(i => i !== action.payload)
                    }
                },
            }
        default:
            return state
    }
}

export default storeReducer