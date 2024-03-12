<script>
import { ref, computed, getCurrentInstance, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'

// componentes
const MakeSale = defineAsyncComponent(() => import('components/MakeSale.vue'))
import TimeLine from 'components/TimeLine.vue'
import MainMap from 'components/MainMap.vue'
//
import { useRouteStore } from 'src/stores/route-store'
import { usePromoterStore } from 'src/stores/promoter-store'
import { useUser } from 'app/hooks/use-user'

export default {
  name: 'PromoterRoutes',
  components: {
    TimeLine,
    MainMap,
    MakeSale
  },
  setup() {
    const globals = ref(getCurrentInstance().appContext.config.globalProperties)
    const routeStore = useRouteStore()
    const promoterStore = usePromoterStore()
    const user = useUser()
    const openMakeSaleModal = ref(false)
    const filterId = ref(0)
    const active_route = ref({})
    const clicked_market = ref({})
    const { getRoutes, getLoading } = storeToRefs(routeStore)

    const data = computed(() => {
      try {
        return getRoutes.value.filter(
          ({ promoter }) => promoter.name === user?.currentUser?.name
        )
      } catch {
        return []
      }
    })

    // there's an error in the backend (it's not returning the routes when the user is a promoter, it's doing so only when the user is an admin), so I'm fetching all the routes for now
    // routeStore.fetchRoutesByPromoter(user.currentUser.name)

    promoterStore.fetchPromoters()
    routeStore.fetchRoutes()
    const currentPromoter = computed(() =>
      promoterStore.getPromoters.find(
        (promoter) => promoter.name === user.currentUser.name
      )
    )

    if (currentPromoter.value?.id)
      promoterStore.setPromoter(currentPromoter.value.id)

    // methods
    function handleTimeLineFilter({ market, route }) {
      filterId.value = market.id
      clicked_market.value = market
      active_route.value = route
    }

    function handleSuccess(res) {
      routeStore.fetchRoutes()
    }

    function handleMapClick(market) {}

    function handleRowClick(route) {
      const latlngs = route.markets.map((market) => [
        market.latitude,
        market.longitude
      ])
      routeStore.setLatLngs(latlngs)
    }

    function openMakeSale(value) {
      openMakeSaleModal.value = value
    }

    return {
      clicked_market,
      active_route,
      routeStore,
      promoterStore,
      getLoading,
      filterId,
      handleTimeLineFilter,
      handleMapClick,
      handleRowClick,
      openMakeSaleModal,
      openMakeSale,
      handleSuccess,
      data,
      user
    }
  }
}
</script>

<template>
  <section class="flex w-full h-[100dvh] promoter_view">
    <TimeLine
      :data="getLoading ? [] : data"
      @filter="handleTimeLineFilter"
      @row-click="handleRowClick"
      :active-row="active_route"
    />
    <MainMap :filter="filterId" @clicked_market="handleMapClick" />
    <div
      v-if="clicked_market?.id && active_route?.id"
      class="map_modal bg-white p-[2rem] flex flex-col rounded-[1rem] min-w-[30rem] shadow-md"
    >
      <h4 class="leading-[1.4] text-[1.6rem] font-bold truncate">
        {{ clicked_market?.name }}
      </h4>
      <div class="">
        <i class="fi fi-rr-user text-primary"></i>
        <span class="text-primary ml-1 truncate">{{
          clicked_market?.person_responsible
        }}</span>
      </div>
      <button
        class="mt-2 bg-secondary text-white p-[0.5rem] capitalize rounded-[0.5rem] hover:!bg-backgroundLight hover:!text-[grey]"
        @click="openMakeSale(true)"
      >
        realizar venda
      </button>
    </div>
    <MakeSale
      :open="openMakeSaleModal"
      @success="handleSuccess"
      :sale="{
        market: clicked_market,
        route_id: active_route.id
      }"
      :route="active_route"
      @close="openMakeSale"
    />
  </section>
</template>

<style lang="scss">
.promoter_view {
  .map_modal {
    position: fixed;
    left: 70rem;
    z-index: 30;
    bottom: 2rem;

    @media screen and (max-width: 1054px) {
      left: 2rem;

      &.show {
        left: 45rem;
        bottom: 2rem;
      }
    }

    @media screen and (max-width: 768px) {
      left: 2rem !important;
      bottom: 10rem !important;
    }
  }
  #map {
    position: fixed;
    height: 100%;
    top: 0;
    right: 0;
    left: 0;
    z-index: 0;
    padding: 0 !important;
    width: 100dvw;

    @media screen and (max-width: 1498px) {
    }

    @media screen and (max-width: 1054px) {
      /* margin-left: 0; */
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      padding: 0;
      border-radius: unset;
      .map {
        border-radius: unset;
      }
    }
  }
}
</style>
