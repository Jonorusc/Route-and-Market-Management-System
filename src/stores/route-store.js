import { defineStore } from 'pinia'
import useApi from 'src/composables/api'

const { getAllRoutes, createRoute } = useApi()

export const useRouteStore = defineStore('routeStore', {
  state: () => {
    return {
      markets_id: [],
      routes: [],
      latlngs: []
    }
  },
  actions: {
    addMarketToRoute(market_id) {
      try {
        if (!this.markets_id.includes(market_id)) {
          this.markets_id.push(market_id)
        } else {
          throw new Error('Este mercado já está na rota.')
        }
        return true
      } catch (error) {
        throw error.response ? error.response.data : error
      }
    },
    async fetchRoutes() {
      try {
        const routes = await getAllRoutes()
        this.routes = routes.data
        return routes.data
      } catch (error) {
        throw error.response ? error.response.data : error
      }
    },
    async fetchRoutesByPromoter(promoter_name) {
      try {
        const routes = await getAllRoutes()
        const filteredByPromoter = routes.data.filter(
          (route) => route.promoter.name === promoter_name
        )
        // The return from the api is not being successful when the user is a prmoter. So I wont update the state
        // this.routes = filteredByPromoter
        return filteredByPromoter
      } catch (error) {
        throw error.response ? error.response.data : error
      }
    },
    async createRoute(route) {
      if (!route.promoter_id || !route.markets.length) return false
      try {
        const newRoute = await createRoute(route)
        this.routes.push(newRoute)
        return newRoute
      } catch (error) {
        throw error.response ? error.response.data : error
      }
    },
    updateRoute(route) {
      const index = this.routes.findIndex((r) => r.id === route.id)
      this.routes[index] = route
    },
    removeMarketFromRoute(market_id) {
      this.markets_id = this.markets_id.filter((id) => id !== market_id)
      return true
    },
    setLatLngs(latlngs) {
      this.latlngs = latlngs
    },
    clearRoute() {
      this.markets_id = []
      this.latlngs = []
    }
  },
  getters: {
    getRoutes() {
      return this.routes
    },
    getMarketsId() {
      return this.markets_id
    },
    getLatLngs() {
      return this.latlngs
    }
  },
  persist: {
    paths: ['routes']
  }
})
