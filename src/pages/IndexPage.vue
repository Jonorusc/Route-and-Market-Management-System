<template>
  <div class="h-[100dvh]">
    <Topbar @open="handleModal" @filter="handleTopbarFilter" />
    <MainMap :filter="filterId" @editing="handleEditMode" />
    <AddMarket
      @close="handleModal"
      @success="onSuccess"
      :open="openModal"
      :initial_market_id="marketToEdit ? marketToEdit : null"
    />
  </div>
</template>

<script>
import { nextTick, ref, onMounted, computed, reactive } from 'vue'

// componentes
import Topbar from 'components/TopBar.vue'
import MainMap from 'components/MainMap.vue'
import AddMarket from 'components/AddMarket.vue'
//
import { useMarketStore } from 'src/stores/market-store'

export default {
  name: 'IndexPage',
  components: {
    Topbar,
    MainMap,
    AddMarket
  },
  setup() {
    const marketStore = useMarketStore()

    const openModal = ref(false)
    const marketToEdit = ref(null)
    const markets = reactive(marketStore.markets)
    const filterId = ref(0)

    function onSuccess(market) {
      // marketStore.fetchMarkets()
    }
    function handleModal(value) {
      marketToEdit.value = null
      openModal.value = value
    }
    function handleTopbarFilter(market) {
      filterId.value = market.id
    }
    function handleEditMode(market_id) {
      marketToEdit.value = market_id
      openModal.value = true
    }

    onMounted(() => {
      nextTick(() => {
        marketStore.fetchMarkets()
      })
    })

    return {
      openModal,
      marketToEdit,
      markets,
      filterId,
      onSuccess,
      handleModal,
      handleTopbarFilter,
      handleEditMode
    }
  }
}
</script>
