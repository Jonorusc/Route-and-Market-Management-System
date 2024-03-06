import { defineStore } from 'pinia'
import useApi from 'src/composables/api'

const { getAllMarkets, createMarket, updateMarket } = useApi()

export const useMarketStore = defineStore('marketStore', {
  state: () => {
    return {
      markets: []
    }
  },
  actions: {
    async fetchMarkets() {
      try {
        const response = await getAllMarkets()
        this.markets = [...response.data]
        return response
      } catch (error) {
        throw error.response ? error.response.data : error
      }
    },
    async addMarket(market) {
      try {
        const new_market = await createMarket(market)
        // similar to an OPTMISTIC UPDATE
        this.markets = [new_market, ...this.markets]
        return new_market
      } catch (error) {
        throw error.response ? error.response.data : error
      }
    },
    async updateMarket(id, market) {
      try {
        const new_market = await updateMarket(id, market)
        this.markets = this.markets.map((m) => {
          if (m.id === new_market.id) {
            return new_market
          }
          return m
        })
        return new_market
      } catch (error) {
        throw error.response ? error.response.data : error
      }
    }
  },
  persist: true
})
