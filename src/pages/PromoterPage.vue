<script>
import {
  nextTick,
  ref,
  onMounted,
  reactive,
  computed,
  getCurrentInstance,
  defineAsyncComponent
} from 'vue'
import { storeToRefs } from 'pinia'

const AddPromoter = defineAsyncComponent(() =>
  import('components/AddPromoter.vue')
)

// componentes
import Topbar from 'components/TopBar.vue'
import CustomTable from 'components/CustomTable.vue'
//
import { usePromoterStore } from 'src/stores/promoter-store'

export default {
  name: 'ProductsPage',
  components: {
    CustomTable,
    Topbar,
    AddPromoter
  },
  setup() {
    const globals = ref(getCurrentInstance().appContext.config.globalProperties)
    const promoterStore = usePromoterStore()
    const active_row = ref(null)
    const promoterToEdit = ref(null)
    const openAddPromoter = ref(false)

    const data = ref(promoterStore.getPromoters)

    // methods
    function handleRowClick({ product_id }) {
      promoterToEdit.value = product_id
      openAddPromoter.value = true
    }

    function handleCloseModal(value) {
      promoterToEdit.value = null
      openAddPromoter.value = value
    }

    async function handleSuccess() {
      data.value = promoterStore.getPromoters
    }

    function handleAddPromoter() {
      openAddPromoter.value = true
    }

    function handleFilterTable(results) {
      if (results.length === 0) {
        data.value = promoterStore.getPromoters
        return
      }
      data.value = results
    }

    promoterStore.fetchPromoters()

    return {
      active_row,
      promoterToEdit,
      headers: ['Nome', 'Cpf', 'Telefone', 'Código', 'actions'],
      data,
      colspans: { 1: 2 },
      handleRowClick,
      handleAddPromoter,
      handleFilterTable,
      openAddPromoter,
      handleCloseModal,
      handleSuccess
    }
  }
}
</script>

<template>
  <div class="h-[100dvh]">
    <Topbar
      @results="handleFilterTable($event)"
      :data="data"
      filter-key="name"
      entity="promotor(a)"
      :show-results="false"
    >
      <template #buttons>
        <button class="topbar-button" @click="handleAddPromoter()">
          <span class="title">adicionar promotor</span>
          <i class="fi fi-rr-plus"></i>
        </button>
      </template>
    </Topbar>
    <div class="px-[2rem] overflow-y-auto h-[calc(100vh-14rem)]">
      <CustomTable :headers="headers" :data="data" :colspans="colspans">
        <template #column0="{ entity }">
          {{ entity.data.name }}
        </template>
        <template #column1="{ entity }">
          {{
            entity.data.cpf.replace(
              /(\d{3})(\d{3})(\d{3})(\d{2})/,
              '$1.$2.$3-$4'
            )
          }}
        </template>
        <template #column2="{ entity }">
          {{
            entity.data.phonenumber.replace(
              /(\d{2})(\d{5})(\d{4})/,
              '($1) $2-$3'
            )
          }}
        </template>
        <template #column3="{ entity }">
          {{ String(entity.data.id).padStart(6, '0') }}
        </template>
        <template #column4="{ entity }">
          <button
            @click="
              handleRowClick({
                product_id: entity.data.id
              })
            "
            class="bg-[#dee6f8] p-[0.5rem] rounded-[0.5rem] w-[4rem] h-[4rem] grid place-content-center"
          >
            <i
              class="fi fi-rr-file-edit text-[2rem] block mt-3 !text-[#7272ff]"
            ></i>
          </button>
        </template>
      </CustomTable>
    </div>
    <AddPromoter
      @close="handleCloseModal"
      @success="handleSuccess"
      :open="openAddPromoter"
      :initial_promoter_id="promoterToEdit ? promoterToEdit : null"
    />
  </div>
</template>

<style lang="scss" scoped></style>
