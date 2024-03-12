import { defineStore } from 'pinia'
import useApi from 'src/composables/api'
import axios from 'axios'
const { login, getCurrentUser } = useApi()

export const userStore = defineStore('userStore', {
  state: () => {
    return {
      currentUser: null
    }
  },
  actions: {
    async login(user) {
      try {
        const response = await login(user)
        this.currentUser = response.user_logged
        return response
      } catch (error) {
        throw error.response ? error.response.data : error
      }
    },
    async getUserInfo() {
      try {
        const user = await getCurrentUser()
        this.currentUser = user
        return true
      } catch (error) {
        return false
      }
    }
  },
  getters: {
    getToken: (state) => {
      return localStorage.getItem('token')
    },
    isLoggedIn: (state) => {
      return !state.currentUser
    },
    getUser() {
      return this.currentUser
    }
  },
  persist: true
})
