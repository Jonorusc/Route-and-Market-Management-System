import { defineStore } from 'pinia'
import useApi from 'src/composables/api'

const { getAllPromoters, createPromoter, updatePromoter } = useApi()

export const usePromoterStore = defineStore('promoterStore', {
  state: () => {
    return {
      promoters: [],
      promoter_id: null
    }
  },
  actions: {
    async fetchPromoters() {
      try {
        const promoters = await getAllPromoters()
        this.promoters = promoters.data
        return promoters.data
      } catch (error) {
        throw error.response ? error.response.data : error
      }
    },
    async addPromoter(promoter) {
      try {
        const newPromoter = await createPromoter(promoter)
        this.promoters.push(newPromoter)
        return newPromoter
      } catch (error) {
        throw error.response ? error.response.data : error
      }
    },
    async updatePromoter(id, promoter) {
      try {
        const updatedPromoter = await updatePromoter(id, promoter)
        const index = this.promoters.findIndex((p) => p.id === id)
        this.promoters[index] = updatedPromoter
        return updatedPromoter
      } catch (error) {
        throw error.response ? error.response.data : error
      }
    },
    setPromoter(promoter_id) {
      this.promoter_id = promoter_id
    }
  },
  getters: {
    getPromoters() {
      return this.promoters
    },
    getPromoter() {
      return this.promoter_id
    }
  },
  persist: true
})
