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

const AddProduct = defineAsyncComponent(() =>
  import('components/AddProduct.vue')
)

// componentes
import Topbar from 'components/TopBar.vue'
import CustomTable from 'components/CustomTable.vue'
//
import { useProductStore } from 'src/stores/product-store'

export default {
  name: 'ProductsPage',
  components: {
    CustomTable,
    Topbar,
    AddProduct
  },
  setup() {
    const globals = ref(getCurrentInstance().appContext.config.globalProperties)
    const productStore = useProductStore()
    const active_row = ref(null)
    const productToEdit = ref(null)
    const openAddProduct = ref(false)
    const data = ref(productStore.getProducts)

    // methods
    function handleRowClick({ product_id }) {
      productToEdit.value = product_id
      openAddProduct.value = true
    }

    function handleCloseModal(value) {
      productToEdit.value = null
      openAddProduct.value = value
    }

    async function handleSuccess() {
      data.value = productStore.getProducts
    }

    function handleAddProduct() {
      openAddProduct.value = true
    }

    function handleFilterTable(results) {
      if (results.length === 0) {
        data.value = productStore.getProducts
        return
      }
      data.value = results
    }

    productStore.fetchProducts()

    return {
      active_row,
      productToEdit,
      headers: ['Nome', 'Preço/Unidade', 'Código', 'actions'],
      data,
      colspans: { 0: 2, 1: 3 },
      handleRowClick,
      handleAddProduct,
      handleFilterTable,
      openAddProduct,
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
      entity="produto"
      :show-results="false"
    >
      <template #buttons>
        <button class="topbar-button" @click="handleAddProduct()">
          <span class="title">adicionar produto</span>
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
            new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(entity.data.price)
          }}
        </template>
        <template #column2="{ entity }">
          {{ String(entity.data.id).padStart(6, '0') }}
        </template>
        <template #column3="{ entity }">
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
    <AddProduct
      @close="handleCloseModal"
      @success="handleSuccess"
      :open="openAddProduct"
      :initial_product_id="productToEdit ? productToEdit : null"
    />
  </div>
</template>

<style lang="scss" scoped></style>
