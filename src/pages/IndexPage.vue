<script>
import { ref, computed, getCurrentInstance, defineAsyncComponent } from 'vue'

// componentes
const AddRoute = defineAsyncComponent(() => import('components/AddRoute.vue'))
const AddMarket = defineAsyncComponent(() => import('components/AddMarket.vue'))

// load first the topbar and mainmap
import Topbar from 'components/TopBar.vue'
import MainMap from 'components/MainMap.vue'

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
          timeout: 4000
        })
      }
    }

    marketStore.fetchMarkets()

    return {
      openAddMarket,
      openAddRoute,
      marketToEdit,
      routeStore,
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
  <div class="h-[100dvh] !overflow-hidden">
    <Topbar @filter="handleTopbarFilter" filter-key="name" :data="markets">
      <template #result="{ entity }">
        <h3 class="text-[1.6rem] font-weight-[600] text-labels m-0">
          {{ entity.name }}
        </h3>
        <h4 class="text-[1.4rem] font-weight-[400] text-labels mt-[-1rem]">
          {{ entity.representantive_user || entity.person_responsible }}
        </h4>
      </template>
      <template #buttons>
        <button class="topbar-button" @click="handleMarketModal(true)">
          <span class="title">adicionar mercado</span>
          <i class="fi fi-rr-plus"></i>
        </button>
        <button
          v-if="routeStore.markets_id.length > 0"
          class="bg-secondary w-[17rem] rounded-[0.8rem] flex justify-between items-center px-8"
          @click="handleOpenRoute(true)"
        >
          <div class="flex flex-col items-center">
            <span class="!text-background text-[1.6rem] font-semibold"
              >Nova rota</span
            >
            <span class="!text-background text-[1.4rem]">
              {{ routeStore.markets_id.length }} mercados
            </span>
          </div>
          <div
            class="grid place-items-center justify-center w-[3rem] h-[3rem] bg-background rounded-[50%]"
          >
            <i
              class="fi fi-rr-angle-small-right !text-secondary mt-1 text-3xl"
            ></i>
          </div>
        </button>
      </template>
    </Topbar>
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
