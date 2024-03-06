import { defineStore } from 'pinia'
import useApi from 'src/composables/api'

const { getAllMarkets, createMarket } = useApi()

export const useRoutesStore = defineStore('routeStore', {
  state: () => {
    return {
      markets_id: []
    }
  },
  actions: {
    async addMarketId(market_id) {
      try {
        this.markets.push(market_id)
        return markets_id
      } catch {
        return false
      }
    },
    async createRoute(body) {
      try {
      } catch {}
    }
  }
})
