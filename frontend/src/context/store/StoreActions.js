import axios from 'axios'

let token = `Bearer ${JSON.parse(localStorage.getItem('token')) && JSON.parse(localStorage.getItem('token')).token}`

// Get all admin data from the DB
export const getAdminDataAction = async () => {
    /* Send data to API to add the product */
    const config = {
        method: "get",
        url: `/api/users/admin`,
        headers: {
            'Authorization': token
        }
    };
    const res = await axios(config).then(res => res).catch(e => e.response)
    console.log(res)
    return res.data
}

// Get products from the DB
export const searchProductsAction = async (query) => {
    /* Send data to API to add the product */
    const config = {
        method: "get",
        url: `/api/products/search/${query}`,
    }
    const res = await axios(config).then(res => res).catch(e => e)
    console.log(res)
    return res.data
}

// Get products from the DB
export const getProductsAction = async (limit) => {
    /* Send data to API to add the product */
    const config = {
        method: "get",
        url: `/api/products/${limit}`,
    };
    const res = await axios(config).then(res => res).catch(e => e.response)
    return res.data
}

// Get products from the DB
export const getProductAction = async (id) => {
    /* Send data to API to add the product */
    const config = {
        method: "get",
        url: `/api/products/${id}`,
    };
    const res = await axios(config)
    return res.status === 200 ? res.data : res.data.message
}

// Add a product to the DB
export const addProductAction = async (productData) => {
    /* Send data to API to add the product */
    const config = {
        method: 'post',
        url: '/api/products',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        data: productData
    }
    const res = await axios(config)
    return res.status === 201 ? res.data : null
}

// edit a product on the DB
export const editProductAction = async (productData) => {
    /* Send data to API to add the product */
    const config = {
        method: 'put',
        url: `/api/products/${productData.id}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        data: productData
    }
    const res = await axios(config)
    return res.status === 200 ? res.data : null
}

// Delete a product from the DB
export const deleteProductAction = async (productID) => {
    const config = {
        method: 'delete',
        url: `/api/products/${productID}`,
        headers: {
            'Authorization': token
        },
    }
    /* Send data to API to delete the product */
    const res = await axios(config)
    return res.status === 200 ? res.data : null
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
    console.log(res)
    return res.data
}

// Add an image to the DB
export const addImageAction = async (imageData) => {
    /* Send data to API to add the product */
    const config = {
        method: 'post',
        url: '/api/carousel',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        data: imageData
    }
    const res = await axios(config)
    return res.status === 201 ? res.data : null
}

// edit an image on the DB
export const editImageAction = async (imageData) => {
    /* Send data to API to add the product */
    const config = {
        method: 'put',
        url: `/api/carousel/${imageData.id}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        data: imageData
    }
    const res = await axios(config)
    return res.status === 200 ? res.data : null
}

// Delete an image from the DB
export const deleteImageAction = async (imageID) => {
    const config = {
        method: 'delete',
        url: `/api/carousel/${imageID}`,
        headers: {
            'Authorization': token
        },
    }
    /* Send data to API to delete the product */
    const res = await axios(config)
    return res.status === 200 ? res.data : null
}

// Get order from the DB
export const getOrderAction = async (id) => {
    /* Send data to API to get the orders */
    const config = {
        method: "get",
        url: `/api/orders/${id}`,
        headers: {
            'Authorization': token
        }
    };
    const res = await axios(config)
    return res.status === 200 ? res.data : res.data.message
}

// Get orders from the DB
export const getOrdersAction = async () => {
    /* Send data to API to get the orders */
    const config = {
        method: "get",
        url: `/api/orders`,
        headers: {
            'Authorization': token
        }
    };
    const res = await axios(config)
    return res.status === 200 ? res.data : null
}

// Add a order to the DB
export const addOrderAction = async (orderData) => {
    /* Send data to API to add the order */
    const config = {
        method: 'post',
        url: '/api/orders',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        data: orderData
    }
    const res = await axios(config)
    return res.status === 201 ? res.data : null
}

// edit a order on the DB
export const editOrderAction = async (orderData) => {
    console.log(orderData)
    /* Send data to API to edit the order */
    const config = {
        method: 'put',
        url: `/api/orders/${orderData.id}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        data: orderData
    }
    const res = await axios(config)
    return res.status === 200 ? res.data : null
}

// Delete a order from the DB
export const deleteOrderAction = async (orderID) => {
    const config = {
        method: 'delete',
        url: `/api/orders/${orderID}`,
        headers: {
            'Authorization': token
        },
    }
    /* Send data to API to delete the order */
    const res = await axios(config)
    return res.status === 200 ? res.data : null
}

// Get coupons from the DB
export const getCouponsAction = async () => {
    /* Send data to API to get the coupons */
    const config = {
        method: "get",
        url: `/api/coupons`,
        headers: {
            'Authorization': token
        }
    };
    const res = await axios(config)
    return res.status === 200 ? res.data : null
}

// Get one coupon from the DB
export const getCouponAction = async (name) => {
    if (!name) return [{}]
    /* Send data to API to get the coupons */
    const config = {
        method: "get",
        url: `/api/coupons/${name}`,
        headers: {
            'Authorization': token
        }
    };
    const res = await axios(config)
    return res.status === 200 ? res.data : null
}

// Add a coupon to the DB
export const addCouponsAction = async (couponData) => {
    /* Send data to API to add the coupon */
    const config = {
        method: 'post',
        url: '/api/coupons',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        data: couponData
    }
    const res = await axios(config)
    return res.status === 201 ? res.data : null
}

// edit a coupon on the DB
export const editCouponsAction = async (couponData) => {
    /* Send data to API to edit the coupon */
    const config = {
        method: 'put',
        url: `/api/coupons/${couponData.id}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        data: couponData
    }
    const res = await axios(config)
    return res.status === 200 ? res.data : null
}

// Delete a coupon from the DB
export const deleteCouponsAction = async (couponID) => {
    const config = {
        method: 'delete',
        url: `/api/coupons/${couponID}`,
        headers: {
            'Authorization': token
        },
    }
    /* Send data to API to delete the coupon */
    const res = await axios(config)
    return res.status === 200 ? res.data : null
}

// Get users from the DB
export const getUsersAction = async () => {
    /* Send data to API to get the users */
    const config = {
        method: "get",
        url: `/api/users`,
        headers: {
            'Authorization': token
        }
    };
    const res = await axios(config).then(res => res).catch(e => e.response.data)
    return res.status === 200 ? res.data : res
}

// Get a user from the DB
export const getUserAction = async (id) => {
    /* Send data to API to get the users */
    const config = {
        method: "get",
        url: `/api/users/userid${id}`,
        headers: {
            'Authorization': token
        }
    };
    const res = await axios(config)
    return res.status === 200 ? res.data : null
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
    const res = await axios(config).then(res => {
        token = `Bearer ${res.data.token}`
        return res
    }).catch(e => e)

    return res.status === 200 ? res : null
}

// Add a user to the DB
export const addUserAction = async (userData) => {
    /* Send data to API to add the user */
    const config = {
        method: 'post',
        url: '/api/users/register',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        data: userData
    }
    const res = await axios(config)
    return res.status === 201 ? res.data : null
}

// edit a user on the DB
export const editUserAction = async (userData) => {
    /* Send data to API to add the user */
    const config = {
        method: 'put',
        url: `/api/users/${userData.id}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        data: userData
    }
    const res = await axios(config)
    return res.status === 200 ? res.data : null
}

// Delete a user from the DB
export const deleteUserAction = async (userID) => {
    const config = {
        method: 'delete',
        url: `/api/users/${userID}`,
        headers: {
            'Authorization': token
        },
    }
    /* Send data to API to delete the user */
    const res = await axios(config)
    return res.status === 200 ? res.data : null
}

// Add an item to the user [cart, wishlist, orders]
export const addItemToUser = async (userID, location, itemID) => {
    const config = {
        method: 'put',
        url: `/api/users/${userID}/${location}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        data: { itemID }
    }

    /* Send data to API to edit the user */
    const res = await axios(config)
    return res.status === 200 ? res.data : null
}

// Delete an item from the user [cart, wishlist, orders]
export const deleteItemFromUser = async (userID, location, itemID) => {
    const config = {
        method: 'delete',
        url: `/api/users/${userID}/${location}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        data: { itemID }
    }
    /* Send data to API to delete the user */
    const res = await axios(config)
    return res.status === 200 ? res.data : null
}

// Resets the user password
export const resetPasswordAction = async (userID, oldPassword, newPassword) => {
    const config = {
        method: 'post',
        url: `/api/users/userid${userID}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        data: {
            oldPassword,
            newPassword
        }
    }
    /* Send data to API to reset the password */
    const res = await axios(config)
    return res.data
}

// // Get user and repos
// export const getUserAndRepos = async (login) => {
//     const [user, repos] = await Promise.all([
//         api.get(`/users/${login}`),
//         api.get(`/users/${login}/repos`),
//     ])

//     return { user: user.data, repos: repos.data }
// }
