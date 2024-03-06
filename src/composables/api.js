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

  const getCompanies = async (id = '') => {
    try {
      const response = await api.get(`/companies${id ? '/' + id : ''}`)
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }

  const addCompany = async (company) => {
    try {
      const response = await api.post('/companies', company)
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }

  const getCategories = async () => {
    try {
      const response = await api.get(`/categories`)
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }

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

  const getCity = async (latitude, longitude) => {
    try {
      const response = await api.get(
        `/state-cities/city?latitude=${latitude}&longitude=${longitude}`
      )
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }

  return {
    login,
    getCurrentUser,
    getCompanies,
    addCompany,
    getCategories,
    getStates,
    getCitiesByState,
    getCity
  }
}
