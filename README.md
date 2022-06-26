# E-Commerce App Project

This project was created with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm run server`

Runs the backend server.\
Open [http://localhost:5000](http://localhost:5000) to view it in your browser.

The page will reload when you make changes.\

### `npm run client`

Runs the client side app.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run dev`

Use this command to run both the backend and the frontend servers with one command.\

### `Server Routes`

**notes:** <br>
-routes tagged with **Protected** will need a token to be accessed<br>
-user type inputs **Admin** and **User** with the capital letters<br>
-user status inputs **Active**, **Inactive** and **Suspended** with the capital letters<br> -[^1]: location inputs **cartItems**, **wishlistItems** and **orders**<br>

#### Protected `api/users` GET

gets all users from DB

```
const axios = require('axios');

let config = {
  method: 'get',
  url: 'http://localhost:8080/api/users',
  headers: {
    'Authorization': `Bearer ${token}`
  }
};
axios(config)
```

#### `api/users` POST

```
const axios = require('axios');
let data = JSON.stringify({
  "firstName": "firstName",
  "lastName": "lastName",
  "email": "email@email.com",
  "password": "password",
  "address": "address",
  "phone": "phone",
  "type": "type",
  "status": "status"
});

let config = {
  method: 'post',
  url: 'http://localhost:8080/api/users',
  headers: {
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
```

#### `api/users/login` POST

```
const axios = require('axios');
let data = JSON.stringify({
  "email": "email@email.com",
  "password": "password"
});

let config = {
  method: 'post',
  url: 'http://localhost:8080/api/users/login',
  headers: {
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
```

#### Protected `api/users/:id` PUT

```
const axios = require('axios');
let data = JSON.stringify({
  "firstName": "firstName",
  "lastName": "lastName",
  "email": "email@email.com",
  "password": "password",
  "address": "address",
  "phone": "phone",
  "type": "type",
  "status": "status"
});

let config = {
  method: 'put',
  url: `http://localhost:8080/api/users/${userID}`,
  headers: {
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
```

#### Protected `api/users/:id` DELETE

```
const axios = require('axios');

let config = {
  method: 'delete',
  url: `http://localhost:8080/api/users/${userID}`,
};

axios(config)
```

#### Protected `api/users/:id/:location` PUT

```
const axios = require('axios');
let data = JSON.stringify({
  "itemID": "item._id"
});

let config = {
  method: 'put',
  url: `http://localhost:8080/api/users/${userID}/${location}`,[^1]
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
```

#### Protected `api/users/:id/:location` DELETE

```
const axios = require('axios');
let data = JSON.stringify({
  "itemID": "6266285eb39dea1f1bf0c434"
});

let config = {
  method: 'delete',
  url: `http://localhost:8080/api/users/${userID}/${location}`,
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
```

#### Protected `api/orders` GET

```
const axios = require('axios');

let config = {
  method: 'get',
  url: `http://localhost:8080/api/orders`,
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

axios(config)
```

#### Protected `api/orders/:id` GET

```
const axios = require('axios');

let config = {
  method: 'get',
  url: `http://localhost:8080/api/orders/{orderID}`,
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

axios(config)
```

#### Protected `api/orders` POST

```
const axios = require('axios');

let data = JSON.stringify({
  "userID": String,
  "paymentMethod": String,
  "coupon": String,
  "status": String {pending, proccessing, shipped, delvired, canceled },
  "products": [String],
  "totalValue": String
});

let config = {
  method: 'post',
  url: 'http://localhost:8080/api/orders',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
```

#### Protected `api/orders/:id` PUT

```
const axios = require('axios');

let data = JSON.stringify({
  "paymentMethod": String,
  "coupon": String,
  "status": String {pending, proccessing, shipped, delivered, canceled },
  "products": [String],
  "totalValue": String
});

let config = {
  method: 'put',
  url: 'http://localhost:8080/api/orders/{orderID}',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
```

#### Protected `api/orders/:id` DELETE

```
const axios = require('axios');

let config = {
  method: 'delete',
  url: 'http://localhost:8080/api/orders/{orderID}',
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

axios(config)
```

#### `api/products` GET

```
const axios = require('axios');

let config = {
  method: 'get',
  url: `http://localhost:8080/api/products`,
};

axios(config)
```

#### `api/products/:id` GET

```
const axios = require('axios');

let config = {
  method: 'get',
  url: `http://localhost:8080/api/products/{productID}`
};

axios(config)
```

#### Protected `api/products` POST

```
const axios = require('axios');

let data = JSON.stringify({
  "category": "String",
  "images": ["String"],
  "age": "String",
  "pieces": "String",
  "isFeatured": Boolean,
  "features": "String",
  "highlights": ["String"],
  "details": "String",
  "name": "String",
  "price": Number,
  "brand": "String",
  "tags": ["String"]
});

let config = {
  method: 'post',
  url: 'http://localhost:8080/api/products',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
```

#### Protected `api/products/:id` PUT

```
const axios = require('axios');

let data = JSON.stringify({
  "category": "String",
  "images": ["String"],
  "age": "String",
  "pieces": "String",
  "isFeatured": Boolean,
  "features": "String",
  "highlights": ["String"],
  "details": "String",
  "name": "String",
  "price": Number,
  "brand": "String",
  "tags": ["String"]
});

let config = {
  method: 'put',
  url: 'http://localhost:8080/api/products/{productID}',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
```

#### Protected `api/products/:id` DELETE

```
const axios = require('axios');

let config = {
  method: 'delete',
  url: 'http://localhost:8080/api/products/{prodcutID}',
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

axios(config)
```
