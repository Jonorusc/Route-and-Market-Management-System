<script>
import { ref, computed, getCurrentInstance, watch } from 'vue'

import Topbar from 'components/TopBar.vue'

import useClickOutside from 'app/hooks/use-click-outside'
import useResize from 'app/lib/utils/use-resize'

export default {
  components: {
    Topbar
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    activeRow: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['filter', 'row-click'],
  setup(props, ctx) {
    const globals = ref(getCurrentInstance().appContext.config.globalProperties)
    const { width } = useResize()
    const showTimeLine = ref(true)
    const timelineRef = ref(null)
    const routes = ref(props.data)

    // methods
    function handleRowClick(market, route) {
      ctx.emit('filter', { route, market })
    }
    function handleFilter(data) {
      if (!data.length) {
        routes.value = props.data
        return
      }

      routes.value = data
    }

    watch(width, () => {
      if (width.value > 1054) {
        showTimeLine.value = true
      } else {
        showTimeLine.value = false
      }
    })

    useClickOutside(timelineRef, () => {
      if (width.value <= 1054) {
        showTimeLine.value = false
      }
    })

    return {
      showTimeLine,
      routes,
      handleRowClick,
      handleFilter,
      timelineRef
    }
  }
}
</script>

<template>
  <div
    :class="`toggler ${showTimeLine ? 'show ' : 'hide'} text-primary`"
    @click="showTimeLine = !showTimeLine"
  >
    <i v-if="showTimeLine" class="fi fi-rr-cross-small"></i>
    <i v-else class="fi fi-rr-route"></i>
  </div>
  <div
    :class="`timeline_component ${showTimeLine ? 'show' : 'hide'}`"
    ref="timelineRef"
  >
    <Topbar
      @results="handleFilter($event)"
      :data="routes"
      filter-key="number"
      entity="rota"
      :show-results="false"
    />

    <div
      class="rows px-[2rem] h-[calc(100dvh-12rem)] overflow-y-auto pt-[0.5rem]"
    >
      <h4 class="text-primary text-bold text-[2rem] mb-[1rem]">Rotas</h4>
      <div
        v-for="(route, i) in routes"
        :key="`route-${i}-${route.number}`"
        :class="`rows_item hover:ring-[0.3rem] hover:!ring-secondary rounded-[0.5rem] shadow-md ring-[0.1rem]  mb-[1rem]${
          activeRow.id === route.id
            ? ' ring-secondary ring-[0.3rem]'
            : ' ring-backgroundLight'
        } `"
        @click="$emit('row-click', route)"
      >
        <div
          class="item_header px-[2rem] pt-[2rem] pb-[1rem] flex flex-col border-b-[0.1rem] !border-backgroundLight"
        >
          <span class="text-grey">Numero da Rota</span>
          <h4 class="mt-0 leading-[1.2] text-primary text-[1.8rem] uppercase">
            {{ route.number }}
          </h4>
        </div>
        <div class="item_content p-[2rem]">
          <ul>
            <li
              v-for="(market, market_index) in route.markets"
              :key="`market-${market_index}`"
              title="Clique para realizar uma venda"
              class="flex gap-4 justify-start items-center cursor-pointer"
              @click.stop="handleRowClick(market, route)"
            >
              <div
                :class="`icon grid place-items-center !w-[3.5rem] !h-[3.5rem] rounded-[50%]
                ${
                  route.market_routes[market_index].sale
                    ? 'bg-[#b2f4df]'
                    : 'bg-[#d7d6f3]'
                }
                `"
              >
                <i
                  :class="`mt-[0.5rem] 
                  ${
                    route.market_routes[market_index].sale
                      ? 'text-[#5ab394] fi fi-rr-check'
                      : 'text-[#8045ff] fi fi-rr-map-pin'
                  }
                `"
                ></i>
              </div>
              <div class="flex flex-col">
                <span
                  class="leading-[1.2] text-primary text-[1.7rem] font-medium truncate capitalize"
                  >{{ market.name }}</span
                >

                <span
                  :class="`${
                    route.market_routes[market_index].sale
                      ? 'text-green'
                      : 'text-[#bfa1ff]'
                  }`"
                  >{{
                    `${
                      route.market_routes[market_index].sale
                        ? 'Concluído'
                        : 'Pendente'
                    }`
                  }}</span
                >
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toggler {
  position: fixed;
  bottom: -1rem;
  left: 7rem;
  z-index: 10;
  justify-content: flex-end;
  align-items: center;
  column-gap: 1rem;
  margin-bottom: 4rem;
  transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
  cursor: pointer;
  i {
    font-size: 2.5rem;
  }

  &.show {
    left: 35rem;
  }
}
.timeline_component {
  background-color: white;
  height: 100dvh;
  width: 34rem;
  z-index: 10;
  transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);

  &.hide {
    transform: translateX(-100%);
    opacity: 0;
    pointer-events: none;
    display: none;
  }

  &.show {
    transform: translateX(0);
    opacity: 1;
    pointer-events: all;
  }
}
#topbar {
  .search {
    width: 30rem !important;
  }
}
</style>
