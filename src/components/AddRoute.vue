<script>
import {
  nextTick,
  getCurrentInstance,
  onMounted,
  computed,
  reactive,
  watch,
  ref
} from 'vue'

import useApi from 'src/composables/api'
import useClickOutside from 'app/hooks/use-click-outside'

import { useMarketStore } from 'src/stores/market-store'
import { useLocationStore } from 'src/stores/location-store'
import { useRouteStore } from 'src/stores/route-store'
import { usePromoterStore } from 'src/stores/promoter-store'

export default {
  name: 'addRoute',
  emits: ['close', 'success'],
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const globals = ref(getCurrentInstance().appContext.config.globalProperties)
    const onOpen = computed(() => props.open)
    const marketStore = useMarketStore()
    const routeStore = useRouteStore()
    const promoterStore = usePromoterStore()
    const wrapper = ref(null)
    const step = ref(1)

    promoterStore.fetchPromoters()

    async function onNext() {
      if (step.value === 1) {
        step.value = 2
      } else if (step.value === 2) {
        if (promoterStore.getPromoter === null) {
          globals.value.$q.notify({
            color: 'negative',
            message: `Selecione um promotor para continuar.`,
            position: 'bottom',
            timeout: 2000
          })
          return
        }

        const route = {
          promoter_id: promoterStore.getPromoter,
          markets: routeStore.getMarketsId
        }

        try {
          globals.value.$q.loading.show({
            message: 'Criando rota...',
            spinnerSize: 100,
            spinnerColor: 'backgorund',
            messageColor: 'background'
          })
          await routeStore.createRoute(route)
          globals.value.$q.notify({
            color: 'positive',
            message: 'Rota criada com sucesso.',
            position: 'bottom',
            timeout: 2000
          })
          ctx.emit('success', true)
        } catch (error) {
          globals.value.$q.notify({
            color: 'negative',
            message: error.message,
            position: 'bottom',
            timeout: 2000
          })
          return
        } finally {
          step.value = 1
          routeStore.clearRoute()
          globals.value.$q.loading.hide()
          promoterStore.setPromoter(null)
          ctx.emit('close', false)
        }
      }
    }
    async function onCancel() {
      if (step.value === 2) {
        step.value = 1
        promoterStore.setPromoter(null)
        return
      }
      ctx.emit('close', false)
    }

    function handleRemove(market_id) {
      routeStore.removeMarketFromRoute(market_id)

      if (routeStore.getMarketsId.length === 0) {
        step.value = 1
        ctx.emit('close', false)
      }
    }

    const highlighted_markets = computed(() => {
      const selected_ids = routeStore.getMarketsId
      if (selected_ids.length === 0) return []
      const highlights = marketStore.getMarkets
        .map((m) => {
          if (selected_ids.includes(m.id)) {
            return m
          }
        })
        .filter((m) => m !== undefined)

      // reorder the array to match the order of the latlngs
      const latlngs = highlights.map((m) => [m.latitude, m.longitude])
      routeStore.setLatLngs(latlngs)

      return highlights
    })

    return {
      step,
      onOpen,
      wrapper,
      onNext,
      onCancel,
      marketStore,
      routeStore,
      promoterStore,
      highlighted_markets,
      handleRemove
    }
  }
}
</script>

<template>
  <section id="addRoute" :class="`${onOpen ? 'show' : 'hide'}`">
    <div class="wrapper" ref="wrapper">
      <div class="content step-wrapper relative">
        <div
          :class="`step w-full p-[2rem] ${step === 1 && onOpen && 'active'}`"
        >
          <h1 class="text-primary text-[2.5rem] font-medium">
            Mercados Selecionados
          </h1>
          <div class="highlighted-markets">
            <div
              class="market cursor-pointer w-full relative bg-[#e0e0e0] hover:bg-background hover:ring ring-primary p-4 rounded-[0.5rem] mb-3"
              v-for="market in highlighted_markets"
              :key="market.id"
            >
              <div class="flex flex-col">
                <span class="name text-pimary font-normal text-[1.9rem]">
                  {{ market.name }}
                </span>
                <span class="address text-primary">
                  {{ market.person_responsible }}
                </span>
              </div>

              <i
                @click="handleRemove(market.id)"
                class="fi fi-rr-cross-small absolute right-[2.5rem] top-[50%] transform: translate-y-[-40%] text-[2rem] text-[#c1001590]"
              ></i>
            </div>
          </div>
        </div>
        <div
          :class="`step w-full p-[2rem] ${step === 2 && onOpen && 'active'}`"
        >
          <h1 class="text-primary text-[2.5rem] font-medium">
            Selecionar Promotor
          </h1>
          <div class="highlighted-markets">
            <div
              class="market cursor-pointer w-full bg-transparent mb-3"
              v-for="promoter in promoterStore.getPromoters"
              :key="promoter.id"
            >
              <div
                class="flex flex-col"
                @click="promoterStore.setPromoter(promoter.id)"
              >
                <h4
                  :class="`name ${
                    promoterStore.getPromoter === promoter.id &&
                    'bg-primary !text-background'
                  } text-primary hover:!text-background font-bold text-[1.9rem] mb-0 hover:!bg-primary ring rounded-[0.5rem] ring-primary hover:ring-0 p-4`"
                >
                  {{ promoter.name }}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="buttons">
        <button @click="onCancel" class="cancel">
          {{ `${step === 2 ? 'Voltar' : 'Cancelar'}` }}
        </button>
        <button @click="onNext" class="submit">
          {{ `${step === 1 ? 'selecionar promotor' : 'criar rota'}` }}
        </button>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
#addRoute {
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
    justify-content: space-between;
    padding: 4rem;

    @media screen and (min-width: 1440px) {
      width: 40dvw;
      overflow-y: auto;
    }

    @media screen and (max-width: 480px) {
      padding: 1rem;
    }
    width: 100%;
    overflow-y: auto;
    height: 100vh;
    background: $background;

    .content {
      display: flex;
      flex-direction: column;
      justify-content: center;
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

      @media screen and (max-width: 1370px) {
        justify-content: center;
      }

      @media screen and (max-width: 425px) {
        flex-direction: column;
        align-items: center;
        width: 100%;
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

  .step {
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    opacity: 0;
    pointer-events: none;
    scale: 0.95;

    &.active {
      opacity: 1;
      pointer-events: all;
      scale: 1;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
}
</style>
