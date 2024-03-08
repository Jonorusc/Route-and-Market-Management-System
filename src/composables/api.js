import { api } from 'boot/axios'

/*
HOW IT WORS:

This composable is a wrapper for the axios instance. 
It has all the functions to make requests to the API. 
You can use it in any component or store.

```javascript
import useApi from 'src/composables/api'

const { login, getCurrentUser, getAllMarkets } = useApi()

const user = {
  email: '
  password
}

const user = await login(user)

const currentUser = await getCurrentUser()

const markets = await getAllMarkets()
```
*/

export default function useApi() {
  const login = async (user) => {
    try {
      const response = await api.post('/auth/login', user, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }

  const getCurrentUser = async () => {
    try {
      const response = await api.get(`/auth/me`)
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }

  // I'm going to put every function in this file to save time and space. But you can create a file for each entity

  /* 
    MARKETS 
  
    @param {string} id - The id of the market
    @returns {array} - The list of markets

    @example

    ```javascript
    const markets: { data: MARKET[] } = await getAllMarkets()
    ```
  */
  const getAllMarkets = async () => {
    try {
      const response = await api.get(`/markets`)
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }

  /* 
    MARKETS 
  
    @param {string} id - The id of the market
    @returns {object} - The current market

    @example

    ```javascript
    const id = 'this is an Id of a market'
    const markets: MARKET = await getMarket(id)
    ```
  */
  const getMarket = async (id) => {
    try {
      const response = await api.get(`/markets/${id}`)
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }

  /*
  MARKETS

  @params {object} market - The market object
  @returns {object} - The market object created

  @example

  ```javascript
  const market = {
    "name":  "Market C",
    "cnpj": "98765432000104",
    "city_id": 333,
    "state_id": "22",
    "latitude": 45,
    "longitude": 50,
    "whatsapp_phone": "44999999971",
    "person_responsible": "Francisco Mariano"
  }

  const newMarket: MARKET = await createMarket(market)
  ```
  */

  const createMarket = async (market) => {
    try {
      const response = await api.post(`/markets`, market)
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }

  /*
  MARKETS

  @params {id} market - The id of the market
  @returns {object} - The market object updated
  @returns {object} - The market object updated

  @example

  ```javascript
  const market = {
    "name": "Mercado A",
    "cnpj": "74780797000123",
    "whatsapp_phone": "44999999999",
    "person_responsible": "Jonas Silva",
    "city_id": 4119,
    "state_id": 18,
    "latitude": "-23.42228000",
    "longitude": "-51.93988187",
    "notes": ""
  }

  const newMarket: MARKET = await updateMarket(market)
  ```
  */

  const updateMarket = async (id, market) => {
    try {
      const response = await api.put(`/markets/${id}`, market)
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }

  /* 
  ROUTES
  @return {array} - The list of routes

  @example

  ```javascript
  const routes: { data: ROUTE[] } = await getAllRoutes()
  ```
  */

  const getAllRoutes = async () => {
    try {
      const response = await api.get(`/routes`)
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }

  /* 
  ROUTES
  @params {body}} - The body of the route

  @example

  ```javascript
  const route = {
    "promoter_id": 2,
    "markets": [1, 3]
  }

  const new_route: ROURTE = await createRoute(route)
  ```
  */

  const createRoute = async (route) => {
    try {
      const response = await api.post(`/routes`, route)
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }

  /*
    PROMOTERS 
    @return {array} id - list of promoters

    @example

      ```javascript
      const promoters: { data: PROMOTER[] } = await getAllPromoters()
      ```
  */

  const getAllPromoters = async () => {
    try {
      const response = await api.get(`/promoters`)
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }

  /*
    PROMOTERS

    @param {body} id - body of the promoter
    @return {object} - The promoter object created

    @example
      
      ```javascript
      const promoter = {
      "name": "Bruno Tales",
      "email": "bruno@tales.com",
      "cpf": "99888876762",
      "phonenumber": "44988887777"
      }

      const newPromoter: PROMOTER = await createPromoter(promoter)
      ```

  */

  const createPromoter = async (promoter) => {
    try {
      const response = await api.post(`/promoters`, promoter)
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }

  /*
    PROMOTERS

    @param {id} id - id of the promoter
    @param {body} id - body of the promoter
    @return {object} - The promoter object created

    @example
      
      ```javascript
      const promoter = {
      "name": "Bruno Tales",
      "email": "bruno@tales.com",
      "cpf": "99888876762",
      "phonenumber": "44988887777"
      }

      const newPromoter: {data:PROMOTER} = await updatePromoter(1,promoter)
      ```

  */

  const updatePromoter = async (id, promoter) => {
    try {
      const response = await api.post(`/promoters/${id}`, promoter)
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }

  /*
    PRODUCTS

    @return {array} - The list of products

    @example
      
      ```javascript
      const products: { data: PRODUCT[] } = await getAllProducts()
      ```
  */

  const getAllProducts = async () => {
    try {
      const response = await api.get(`/products`)
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }

  /*
    PRODUCTS

    @param {body} id - The body of the product
    @return {object} - The product object created

    @example
        
        ```javascript
        const product = {
        "name": "Coca-Cola",
        "price": 5.5,
        }
  
        const newProduct: PRODUCT = await createProduct(product)
        ```
  */

  const createProduct = async (product) => {
    try {
      const response = await api.post(`/products`, product)
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }

  /* 
    PRODUCTS

    @param {id} id - The id of the product
    @param {body} id - The body of the product

    @example
      
      ```javascript
      const product = {
      "name": "Coca-Cola",
      "price": 5.5,
      }

      const newProduct: PRODUCT = await updateProduct(1,product)
      ```
  */

  const updateProduct = async (id, product) => {
    try {
      const response = await api.put(`/products/${id}`, product)
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }

  /*
    THESE FUNCTIONS ARE FOR THE STATE AND CITIES ENTITY
  */
  const getStates = async () => {
    try {
      const response = await api.get(`/state-cities/states`)
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }

  const getCitiesByState = async (state_id) => {
    try {
      const response = await api.get(
        `/state-cities/cities?state_id=${state_id}`
      )
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }

  const getCityFromCoords = async (lat, lng) => {
    try {
      const response = await api.get(
        `/state-cities/city?latitude=${lat}&longitude=${lng}`
      )
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }

  return {
    login,
    getCurrentUser,
    getAllMarkets,
    getMarket,
    createMarket,
    updateMarket,
    getAllRoutes,
    createRoute,
    getAllPromoters,
    createPromoter,
    updatePromoter,
    getAllProducts,
    createProduct,
    updateProduct,
    getStates,
    getCitiesByState,
    getCityFromCoords
  }
}
