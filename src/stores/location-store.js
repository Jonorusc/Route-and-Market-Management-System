import { defineStore } from 'pinia'
import useApi from 'src/composables/api'

const { getStates, getCitiesByState } = useApi()

export const useLocationStore = defineStore('locationStore', {
  state: () => {
    return {
      states: [],
      cities: []
    }
  },
  actions: {
    async fetchStates() {
      try {
        const response = await getStates()
        this.states = response
        return response
      } catch (error) {
        throw error.response ? error.response.data : error
      }
    },
    async fetchCity(state_id) {
      try {
        const cities = await getCitiesByState(state_id)
        this.cities = cities
        return cities
      } catch (error) {
        return []
      }
    }
  },
  persist: true
})
