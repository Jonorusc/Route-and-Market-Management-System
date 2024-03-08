<script>
import { getCurrentInstance, onMounted, computed, watch, ref } from 'vue'

import useClickOutside from 'app/hooks/use-click-outside'
import useApi from 'src/composables/api'

import { usePromoterStore } from 'src/stores/promoter-store'
import { useProductStore } from 'src/stores/product-store'

import Topbar from 'components/TopBar.vue'

const { createSale } = useApi()

export default {
  name: 'MakeSale',
  components: {
    Topbar
  },
  emits: ['close', 'success'],
  props: {
    open: {
      type: Boolean,
      default: false
    },
    sale: {
      type: Object,
      default: null
    }
  },
  setup(props, ctx) {
    const globals = ref(getCurrentInstance().appContext.config.globalProperties)
    const onOpen = computed(() => props.open)
    const promoterStore = usePromoterStore()
    const productStore = useProductStore()
    const wrapper = ref(null)
    const data = computed(() => productStore.getProducts)
    const products = ref([])
    const market = computed(() => props.sale)
    // useClickOutside(wrapper, () => {
    //   ctx.emit('close', false)
    // })

    const total_price = computed(() => {
      return products.value.reduce((acc, product) => {
        const { price } = productStore.getProducts.find(
          (p) => p.id === product.id
        )
        return acc + price * product.quantity
      }, 0)
    })

    // methods

    function onReset() {
      products.value = []

      ctx.emit('close', false)
    }
    async function onSubmit() {
      if (
        market.value.market.id !== null &&
        market.value.route_id &&
        products.value.length > 0
      ) {
        globals.value.$q.loading.show({
          message: `Finalizando a venda, aguarde...`,
          spinnerSize: 100,
          spinnerColor: 'grey'
        })
        create()
      } else {
        globals.value.$q.notify({
          type: 'negative',
          message:
            'Preencha todos os campos obrigatórios. Informe pelo menos um produto',
          position: 'top-right',
          timeout: 4000
        })
      }
    }
    async function create() {
      await createSale({
        route_id: market.value.route_id,
        market_id: market.value.market.id,
        products: products.value
      })
        .then((res) => {
          globals.value.$q.notify({
            type: 'positive',
            message: `Venda finalizada com sucesso!`,
            position: 'top',
            timeout: 4000
          })
          ctx.emit('success', res)
          ctx.emit('close', false)
        })
        .catch((err) => {
          const { errors, message } = err

          if (!errors) {
            globals.value.$q.notify({
              type: 'warning',
              message: message,
              position: 'top-right',
              timeout: 7000,
              progress: true
            })
            return
          }

          Object.keys(errors).forEach((key) => {
            globals.value.$q.notify({
              type: 'warning',
              message: errors[key][0],
              position: 'top-right',
              timeout: 7000,
              progress: true
            })
          })
        })
        .finally(() => {
          globals.value.$q.loading.hide()
        })
    }

    function handleFilter(result) {
      if (result.length === 0) {
        return
      }
      // Here I need to check if the product alreadye exists in the array, is it so...
      // I need to increment the quantity of the product
      // if not, I need to push the product to the array

      const product = products.value.find((p) => p.id === result.id)

      if (product) {
        product.quantity++
      } else {
        products.value.push({
          id: result.id,
          name: result.name,
          quantity: 1
        })
      }
    }
    return {
      onOpen,
      products,
      total_price,
      data,
      wrapper,
      market,
      onReset,
      onSubmit,
      productStore,
      handleFilter,
      promoterStore
    }
  }
}
</script>

<template>
  <section id="makeSale" :class="`${onOpen ? 'show' : 'hide'}`">
    <div class="wrapper" ref="wrapper">
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="h-full !flex !flex-col !justify-between"
      >
        <div class="form">
          <h4>Realizar Venda</h4>
          <div class="flex justify-start flex-col w-full">
            <!-- market name -->
            <div class="bg-white w-full px-[2rem] py-[1.5rem] rounded-[1rem]">
              <span class="text-grey">Mercado</span>
              <h4
                class="text-primary text-bold text-[1.4rem] !mb-0 leading-[1]"
              >
                {{ market.market?.name }}
              </h4>
            </div>
            <!-- searchbar -->
            <Topbar
              @filter="handleFilter($event)"
              :data="data"
              filter-key="name"
              entity="produto"
              ><template #result="{ entity }">
                <h3 class="text-[1.6rem] font-weight-[600] text-labels m-0">
                  {{ entity.name }}
                </h3>
                <h4
                  class="text-[1.4rem] font-weight-[400] text-labels mt-[-1rem]"
                >
                  {{
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(entity.price)
                  }}
                </h4>
              </template></Topbar
            >
            <!-- table -->
            <div class="table my-[1.5rem]">
              <div class="thead">
                <div
                  class="flex justify-between bg-[#f0f0f0] shadow-md px-[2rem] py-[1rem] rounded-t-lg"
                >
                  <span class="text-[#5f5f5f]">Produto</span>
                  <span class="text-[#5f5f5f]">Quantidade</span>
                </div>
              </div>
              <div
                class="tbody flex justify-between bg-white !divide-y divide-[#f0f0f0]"
              >
                <div
                  v-for="(product, index) in products"
                  :key="`product-${index}`"
                  class="!flex !justify-between items-center px-[2rem] py-[1rem] w-full"
                >
                  <div class="text-primay">{{ product.name }}</div>
                  <div
                    class="text-primary w-[3rem] h-[3rem] rounded-[0.4rem] grid place-items-center !ring-[grey] ring-[0.3px]"
                  >
                    {{ product.quantity }}
                  </div>
                </div>
                <div
                  v-if="products.length === 0"
                  class="flex justify-center w-full"
                >
                  <h4
                    class="font-bold !text-[1.4rem] !text-[#5f5f5f] !my-2 !mx-0"
                  >
                    Nenhum produto inserido
                  </h4>
                </div>
              </div>
              <div class="thead">
                <div
                  class="flex justify-between bg-[#f0f0f0] shadow-md px-[2rem] py-[1rem] rounded-b-lg"
                >
                  <span class="text-[#5f5f5f]">Valor Total</span>
                  <span class="text-positive">{{
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(total_price)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="buttons">
          <button type="reset" class="cancel">Cancelar</button>
          <button type="submit" class="submit">Finalizar venda</button>
        </div>
      </q-form>
    </div>
  </section>
</template>

<style lang="scss">
#makeSale {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: flex-end;
  z-index: 50;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition-delay:
    opacity 0.3s,
    transform 0.2s;

  #topbar {
    padding: 0 !important;
    margin-top: 3rem;
  }

  &.show {
    transform: translateX(0);
    opacity: 1;
    pointer-events: all;

    animation: bg 0.3s ease-in forwards;
    animation-delay: 0.2s;

    @keyframes bg {
      0% {
        background-color: rgba(0, 0, 0, 0);
      }
      100% {
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }

  &.hide {
    pointer-events: none;
    transform: translateX(50%);
    opacity: 0;
  }
  .wrapper {
    @media screen and (max-width: 425px) {
      width: 100%;
    }
    background: red;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 3rem;

    width: 30dvw;

    overflow-y: auto;
    height: 100vh;
    background: $background;

    .form {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      column-gap: 4rem;
      h4 {
        font-size: 2.2rem;
        font-weight: 700;
        text-transform: capitalize;
        color: $labels;
        margin-bottom: 1rem;
        @media screen and (max-width: 375px) {
          width: 30rem !important;
        }
      }

      @media screen and (max-width: 425px) {
        width: 100%;
      }
    }
  }
  .input {
    margin: 1rem 0;
    display: flex;
    flex-direction: column;
    label {
      font-size: 1.8rem;
      font-weight: 600;
      color: $labels;
      margin-bottom: 0.5rem;
    }

    @media screen and (max-width: 480px) {
      margin: 0.5rem 0;
    }
    input {
      text-indent: 0.6rem;
      font-size: 1.8rem;
      font-weight: 600;
      color: $labels;
      background-color: white;
      outline: none;
      border: none;
      height: 3.5rem;
      border-radius: 0.4rem;
      width: 100%;
      &::placeholder {
        color: $labels;
      }
    }
  }

  .buttons {
    margin-top: 4rem;
    display: flex;
    justify-content: center;
    column-gap: 0.8rem;
    @media screen and (max-width: 425px) {
      flex-direction: column;
      align-items: center;
      row-gap: 0.8rem;
      width: 100%;
    }
    button {
      border: none;
      outline: none;
      text-align: center;
      text-transform: capitalize;
      font-size: 1.8rem;
      font-weight: 600;
      width: 24rem;
      padding: 1.8rem 0;
      border-radius: 0.8rem;
      cursor: pointer;
      &:active {
        transform: scale(0.98);
      }
      &.cancel {
        background-color: #e0e0e0;
        color: $labels;
        box-shadow: 0 0 0.3rem rgba(0, 0, 0, 0.1);
      }
      &.submit {
        background-color: $labels;
        color: $background;
        box-shadow: 0 0 0.3rem rgba(0, 0, 0, 0.1);
      }
      @media screen and (max-width: 480px) {
        width: 20rem;
        padding: 1rem 0;
      }
    }
  }
}

.q-field--standout .q-field__control {
  width: 100% !important;
  input {
    box-shadow: none !important;
  }
}
</style>
