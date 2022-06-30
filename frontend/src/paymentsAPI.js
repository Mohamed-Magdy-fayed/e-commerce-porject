import axios from 'axios'

export const createPaymentIntent = async (options, token) => {

    if (!token) {
        return
    }
    const config = {
        method: 'post',
        url: `/payments/create-payment-intent`,
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(options)
        // make sure to add amount and currency
    }

    const res = await axios(config)
        .then(res => res)
        .catch(e => e.response)

    return res.data
}

export const getPublicStripeKey = async () => {

    const token = JSON.parse(localStorage.getItem('token'))?.token

    if (!token) {
        return
    }

    const config = {
        method: 'get',
        url: `/payments/public-key`,
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
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
}
