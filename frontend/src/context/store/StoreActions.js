import axios from 'axios'

// Get all admin data from the DB
export const getAdminDataAction = async (token) => {
    /* Send data to API to add the product */
    const config = {
        method: "get",
        url: `/api/users/admin`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Get products from the DB
export const searchProductsAction = async (query) => {
    /* Send data to API to add the product */
    const config = {
        method: "get",
        url: `/api/products/search/${query}`,
    }
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Get products from the DB
export const getProductsAction = async (token) => {
    /* Send data to API to add the product */
    const config = {
        method: "get",
        url: `/api/products`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Get products from the DB
export const getProductAction = async (id) => {
    /* Send data to API to add the product */
    const config = {
        method: "get",
        url: `/api/products/one/${id}`,
    };
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Add a product to the DB
export const addProductAction = async (token, productData) => {
    /* Send data to API to add the product */
    const config = {
        method: 'post',
        url: '/api/products',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: productData
    }
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// edit a product on the DB
export const editProductAction = async (token, productData) => {
    /* Send data to API to add the product */
    const config = {
        method: 'put',
        url: `/api/products/${productData.id}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: productData
    }
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Delete a product from the DB
export const deleteProductAction = async (token, productID) => {
    const config = {
        method: 'delete',
        url: `/api/products/${productID}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
    }
    /* Send data to API to delete the product */
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Get images from the DB
export const getImagesAction = async () => {
    /* Send data to API to add the product */
    const config = {
        method: "get",
        url: `/api/carousel`,
    };
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Add an image to the DB
export const addImageAction = async (token, imageData) => {
    /* Send data to API to add the product */
    const config = {
        method: 'post',
        url: '/api/carousel',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: imageData
    }
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// edit an image on the DB
export const editImageAction = async (token, imageData) => {
    /* Send data to API to add the product */
    const config = {
        method: 'put',
        url: `/api/carousel/${imageData.id}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: imageData
    }
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Delete an image from the DB
export const deleteImageAction = async (token, imageID) => {
    const config = {
        method: 'delete',
        url: `/api/carousel/${imageID}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
    }
    /* Send data to API to delete the product */
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Get order from the DB
export const getUserOrdersAction = async (token, id) => {
    /* Send data to API to get the orders */
    const config = {
        method: "get",
        url: `/api/orders/${id}`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Get orders from the DB
export const getOrdersAction = async (token) => {
    /* Send data to API to get the orders */
    const config = {
        method: "get",
        url: `/api/orders`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Add a order to the DB
export const addOrderAction = async (token, orderData) => {
    /* Send data to API to add the order */
    const config = {
        method: 'post',
        url: '/api/orders',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: orderData
    }
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// edit a order on the DB
export const editOrderAction = async (token, orderData) => {
    /* Send data to API to edit the order */
    const config = {
        method: 'put',
        url: `/api/orders/${orderData.id}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: orderData
    }
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Delete a order from the DB
export const deleteOrderAction = async (token, orderID) => {
    const config = {
        method: 'delete',
        url: `/api/orders/${orderID}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
    }
    /* Send data to API to delete the order */
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Get coupons from the DB
export const getCouponsAction = async (token) => {
    /* Send data to API to get the coupons */
    const config = {
        method: "get",
        url: `/api/coupons`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Get one coupon from the DB
export const getCouponAction = async (token, name) => {
    if (!name) return [{}]
    /* Send data to API to get the coupons */
    const config = {
        method: "get",
        url: `/api/coupons/${name}`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Add a coupon to the DB
export const addCouponsAction = async (token, couponData) => {
    /* Send data to API to add the coupon */
    const config = {
        method: 'post',
        url: '/api/coupons',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: couponData
    }
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// edit a coupon on the DB
export const editCouponsAction = async (token, couponData) => {
    /* Send data to API to edit the coupon */
    const config = {
        method: 'put',
        url: `/api/coupons/${couponData.id}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: couponData
    }
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Delete a coupon from the DB
export const deleteCouponsAction = async (token, couponID) => {
    const config = {
        method: 'delete',
        url: `/api/coupons/${couponID}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
    }
    /* Send data to API to delete the coupon */
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Get users from the DB
export const getUsersAction = async (token) => {
    /* Send data to API to get the users */
    const config = {
        method: "get",
        url: `/api/users`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response.data)
    return res.data
}

// Get a user from the DB
export const getUserAction = async (token, id) => {
    /* Send data to API to get the users */
    const config = {
        method: "get",
        url: `/api/users/userid${id}`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// auth the user
export const loginUserAction = async (credentials) => {
    /* Send data to API to login */
    const config = {
        method: 'post',
        url: '/api/users/login',
        headers: {
            'Content-Type': 'application/json'
        },
        data: credentials
    };
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Add a user to the DB
export const addUserAction = async (userData) => {
    /* Send data to API to add the user */
    const config = {
        method: 'post',
        url: '/api/users/register',
        headers: {
            'Content-Type': 'application/json',
        },
        data: userData
    }
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// edit a user on the DB
export const editUserAction = async (token, userData) => {
    /* Send data to API to add the user */
    const config = {
        method: 'put',
        url: `/api/users/${userData.id}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: userData
    }
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Delete a user from the DB
export const deleteUserAction = async (token, userID) => {
    const config = {
        method: 'delete',
        url: `/api/users/${userID}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
    }
    /* Send data to API to delete the user */
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Add an item to the user [cart, wishlist, orders]
export const addItemToUser = async (token, userID, location, itemID) => {
    const config = {
        method: 'put',
        url: `/api/users/${userID}/${location}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: { itemID }
    }

    /* Send data to API to edit the user */
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Delete an item from the user [cart, wishlist, orders]
export const deleteItemFromUser = async (token, userID, location, itemID) => {
    const config = {
        method: 'delete',
        url: `/api/users/${userID}/${location}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: { itemID }
    }
    /* Send data to API to delete the user */
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// Resets the user password
export const resetPasswordAction = async (token, userID, oldPassword, newPassword) => {
    const config = {
        method: 'post',
        url: `/api/users/userid${userID}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: {
            oldPassword,
            newPassword
        }
    }
    /* Send data to API to reset the password */
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    return res.data
}

// get a payment link
export const getPaymentLink = async (token, products, coupon) => {
    const config = {
        method: 'post',
        url: `/api/payment/create`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: { products: products, coupon }
    }
    console.log(config);
    /* Send data to API to reset the password */
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    console.log(res.data);
    return res.data
}

// get a payment link
export const getPaymentSession = async (token, id) => {
    const config = {
        method: 'get',
        url: `/api/payment/retrieve/${id}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    console.log(config);
    /* Send data to API to reset the password */
    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)
    console.log(res.data)
    return res.data
}
