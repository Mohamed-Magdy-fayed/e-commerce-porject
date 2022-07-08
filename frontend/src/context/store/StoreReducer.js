import { logger } from '../middleware/logger'

const storeReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_USER':
            return {
                ...state,
                auth: action.payload,
            }
        case 'LOGOUT_USER':
            return {
                ...state,
                auth: action.payload,
            }
        case 'SHOW_TOAST':
            return {
                ...state,
                toast: action.payload,
            }
        case 'HIDE_TOAST':
            return {
                ...state,
                toast: {
                    ...state.toast,
                    isToast: action.payload.isToast,
                }
            }
        case 'SHOW_MODAL':
            return {
                ...state,
                modal: action.payload,
            }
        case 'HIDE_MODAL':
            return {
                ...state,
                modal: action.payload,
            }
        case 'SET_DATA':
            return {
                ...state,
                appData: {
                    ...state.appData,
                    [action.collection]: action.payload,
                }
            }
        case 'SET_USER_DATA':
            return {
                ...state,
                userData: {
                    ...state.userData,
                    [action.collection]: action.payload,
                }
            }
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload,
            }
        case 'SET_PRODUCT_FORM':
            return {
                ...state,
                productForm: action.payload,
            }
        case 'ADD_TO_LOCATION':
            return {
                ...state,
                auth: {
                    ...state.auth,
                    user: {
                        ...state.auth.user,
                        [action.location]: [...state.auth.user[action.location], action.payload]
                    }
                },
            }
        case 'DELETE_FROM_LOCATION':
            return {
                ...state,
                auth: {
                    ...state.auth,
                    user: {
                        ...state.auth.user,
                        [action.location]: state.auth.user[action.location].filter(i => i !== action.payload)
                    }
                },
            }
        case 'CART_ADD_PRODUCT':
            return {
                ...state,
                cartData: [...state.cartData, action.payload],
            }
        case 'CART_REMOVE_PRODUCT':
            return {
                ...state,
                cartData: state.cartData.filter(item => item.productID !== action.payload),
            }
        case 'CART_SET_AMOUNT':
            return {
                ...state,
                cartData: state.cartData.map(item => {
                    if (item.productID !== action.payload.productID) return item
                    item.amount = action.payload.amount
                    return item
                }),
            }
        default:
            return state
    }
}

export default storeReducer