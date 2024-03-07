<script>
import { ref, computed, getCurrentInstance, defineAsyncComponent } from 'vue'

// componentes
const AddRoute = defineAsyncComponent(() => import('components/AddRoute.vue'))
const AddMarket = defineAsyncComponent(() => import('components/AddMarket.vue'))

// load first the topbar and mainmap
import Topbar from 'components/TopBar.vue'
import MainMap from 'components/MainMap.vue'

//
import { useMarketStore } from 'src/stores/market-store'
import { useRouteStore } from 'src/stores/route-store'

export default {
  name: 'IndexPage',
  components: {
    Topbar,
    MainMap,
    AddRoute,
    AddMarket
  },
  setup() {
    const globals = ref(getCurrentInstance().appContext.config.globalProperties)
    const marketStore = useMarketStore()
    const routeStore = useRouteStore()
    const openAddMarket = ref(false)
    const openAddRoute = ref(false)
    const marketToEdit = ref(null)
    const markets = computed(() => marketStore.getMarkets)
    const filterId = ref(0)

    function onSuccess(market) {
      // marketStore.fetchMarkets()
    }
    function handleMarketModal(value) {
      marketToEdit.value = null
      openAddMarket.value = value
    }
    function handleTopbarFilter(market) {
      filterId.value = market.id
    }
    function handleOpenRoute(value) {
      if (!value) {
        routeStore.clearRoute()
      }
      openAddRoute.value = value
    }
    function handleEditMode(market_id) {
      marketToEdit.value = market_id
      openAddMarket.value = true
    }
    function handlePutOnRoute(market) {
      try {
        routeStore.addMarketToRoute(market.id)
        // Here I need to gather the latlngs from the market and put it on the route, like, I'll be able to create polylines synchronously. Amazing, isn't it?
        const currentLatLngs = routeStore.getLatLngs
        const latlngs = [market.latitude, market.longitude]
        routeStore.setLatLngs([...currentLatLngs, latlngs])
        // Everytime the user remove or add a new market to the routeStore I'll be able to update the polyline, so they can see the routes at the map component
      } catch (error) {
        globals.value.$q.notify({
          color: 'negative',
          message: error.message,
          position: 'bottom',
          timeout: 2000
        })
      }
    }

    marketStore.fetchMarkets()

    return {
      openAddMarket,
      openAddRoute,
      marketToEdit,
      markets,
      filterId,
      onSuccess,
      handleMarketModal,
      handleTopbarFilter,
      handleOpenRoute,
      handleEditMode,
      handlePutOnRoute
    }
  }
}
</script>

<template>
  <div class="h-[100dvh]">
    <Topbar
      @open="handleMarketModal"
      @filter="handleTopbarFilter"
      @openroute="handleOpenRoute"
    />
    <MainMap
      :filter="filterId"
      @editing="handleEditMode"
      @putonroute="handlePutOnRoute"
    />
    <AddMarket
      @close="handleMarketModal"
      @success="onSuccess"
      :open="openAddMarket"
      :initial_market_id="marketToEdit ? marketToEdit : null"
    />
    <AddRoute
      @close="handleOpenRoute"
      @success="onSuccess"
      :open="openAddRoute"
    />
  </div>
</template>
