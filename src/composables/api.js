import { api } from 'boot/axios'

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
    getStates,
    getCitiesByState,
    getCityFromCoords
  }
}
