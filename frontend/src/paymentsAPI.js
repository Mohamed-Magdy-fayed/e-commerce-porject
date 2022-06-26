import axios from 'axios'

const token = `Bearer ${JSON.parse(localStorage.getItem('token')) && JSON.parse(localStorage.getItem('token')).token}`

const createPaymentIntent = async options => {

    if (!token) {
        return
    }
    const config = {
        method: 'post',
        url: `/payments/create-payment-intent`,
        headers: {
            "Content-Type": "application/json",
            'Authorization': token
        },
        data: JSON.stringify(options)
        // make sure to add amount and currency
    }

    const res = await axios(config)
    if (res.status === 200) {
        const data = await res.data

        if (!data || data.error) {
            console.log("API error:", { data });
            throw new Error("PaymentIntent API Error");
        } else {
            console.log(data.client_secret);
            return data.client_secret;
        }
    } else {
        return null;
    }
};

const getPublicStripeKey = async () => {

    if (!token) {
        return
    }

    const config = {
        method: 'get',
        url: `/payments/public-key`,
        headers: {
            "Content-Type": "application/json",
            'Authorization': token
        },
    }
    const res = await axios(config)
    if (res.status === 200) {
        if (!res.data || res.data.error) {
            console.log("API error:", { data: res.data });
            throw Error("API Error");
        } else {
            return res.data.publishableKey;
        }
    } else {
        return null;
    }
};

const api = {
    createPaymentIntent,
    getPublicStripeKey: getPublicStripeKey,
};

export default api;
