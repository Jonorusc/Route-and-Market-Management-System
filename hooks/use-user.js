// if you wanna use swrv (I didn't like it very much. I prefer to use the real SWR in React/Next)
// import useSWRV from 'swrv'
// import { ref } from 'vue'

// import { options, getFetcher } from 'app/lib/utils/use-user'

// export default function useUser() {
//   const user = ref(null)
//   const { data, error, mutate, isValidating } = useSWRV(
//     '/auth/me',
//     getFetcher,
//     options
//   )

//   return { user, error, mutate, isValidating }
// }

import { defineStore } from 'pinia'
import useApi from 'src/composables/api'
import axios from 'axios'
export const useUser = defineStore('userStore', {
  state: () => {
    return {
      currentUser: null
    }
  },
  actions: {
    async login(user) {
      const { login } = useApi()
      try {
        const response = await login(user)
        this.currentUser = response.user_logged
        return response
      } catch (error) {
        throw error.response ? error.response.data : error
      }
    },
    async getUserInfo(token) {
      const { getCurrentUser } = useApi()
      try {
        const user = await getCurrentUser()
        this.currentUser = { ...this.currentUser, ...user }
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
    }
  },
  persist: true
})
