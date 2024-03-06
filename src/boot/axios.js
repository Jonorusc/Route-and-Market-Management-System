import { boot } from 'quasar/wrappers'
import axios from 'axios'

export const getToken = () =>
  localStorage.getItem('token') ? localStorage.getItem('token') : null

export const getAuthorizationHeader = () => `Bearer ${getToken()}`

const headers = {
  'Content-Type': 'application/json'
}

// pass the auth only if the token is present
if (getToken()) {
  headers.Authorization = getAuthorizationHeader()
}

const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3000',
  headers
  // withCredentials: true,
  // crossdomain: true,
})

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
