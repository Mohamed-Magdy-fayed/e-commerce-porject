import { logger } from "../middleware/logger"

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
        case 'SET_LOADING':
            logger(state, action)
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
        default:
            return state
    }
}

export default storeReducer