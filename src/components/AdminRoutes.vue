<script>
import { ref, computed, getCurrentInstance } from 'vue'

// componentes
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'
import CustomTable from 'components/CustomTable.vue'
//
import { useRouteStore } from 'src/stores/route-store'
import { usePromoterStore } from 'src/stores/promoter-store'

export default {
  name: 'AdminRoutes',
  components: {
    CustomTable,
    Carousel,
    Slide
  },
  setup() {
    const globals = ref(getCurrentInstance().appContext.config.globalProperties)
    const routeStore = useRouteStore()
    const promoterStore = usePromoterStore()
    const active_row = ref({
      route_id: null,
      row_index: null
    })
    const filter = ref({})

    promoterStore.fetchPromoters()
    routeStore.fetchRoutes()

    // populate the table ('data' is a computed property)
    const data = computed(() =>
      routeStore.getRoutes.map(
        ({ number: route_number, promoter, markets, market_routes, id }) => {
          const visits_made = markets.filter(
            (market) => market.pivot.visited > 0
          ).length
          const total_visits = market_routes.filter(
            (market) => market.visited > 0
          ).length
          return {
            route_number,
            promoter: promoter.name,
            visits_made,
            total_visits,
            id
          }
        }
      )
    )

    const marketsTimeLine = computed(() => {
      const routesById = Object.groupBy(routeStore.getRoutes, ({ id }) => id)
      let array = []

      routesById[active_row.value.route_id]?.forEach((route) => {
        const { markets, market_routes } = route

        markets.forEach((market, i) => {
          const { sale } = market_routes[i]

          array.push({
            promoter_id: route.promoter_id,
            route_id: route.id,
            market: {
              name: market.name,
              sale
            },
            active: sale
          })
        })
      })
      return array
    })

    // methods
    function handleRowClick({ route_id = null, row_index = null }) {
      if (row_index !== null && active_row.value.row_index === row_index) {
        active_row.value.row_index = null
        active_row.value.route_id = null
      } else {
        active_row.value.row_index = row_index
        active_row.value.route_id = route_id
      }
    }
    function handleFilterTable({ promoter_name = null }) {
      if (filter.value.promoter === promoter_name) {
        filter.value = {}
        return
      }
      active_row.value.row_index = null
      active_row.value.route_id = null
      filter.value = promoter_name ? { promoter: promoter_name } : {}
    }

    return {
      routeStore,
      promoterStore,
      active_row,
      marketsTimeLine,
      filter,
      headers: [
        'Rota',
        'Promotor',
        'Visitas Realizadas',
        'Total de Visitas',
        'actions'
      ],
      data,
      colspans: { 1: 3, 2: 2 },
      breakpoints: {
        640: {
          itemsToShow: 3.5,
          itemsToScroll: 2
        },
        768: {
          itemsToShow: 4.5,
          itemsToScroll: 3
        },
        1024: {
          itemsToShow: 5.5,
          itemsToScroll: 4
        },
        1280: {
          itemsToShow: 6.5,
          itemsToScroll: 5
        }
      },
      handleRowClick,
      handleFilterTable
    }
  }
}
</script>

<template>
  <div class="p-[2rem]">
    <!-- carousel -->
    <Carousel
      class="mb-4"
      :items-to-show="2.5"
      :wrap-around="false"
      snapAlign="start"
      :breakpoints="breakpoints"
    >
      <Slide
        v-for="(promoter, i) in promoterStore.getPromoters"
        :key="i"
        :class="`carousel-item ${
          filter?.promoter === promoter.name && 'active'
        }`"
        @click="handleFilterTable({ promoter_name: promoter.name })"
      >
        <div>
          {{ promoter.name }}
        </div>
      </Slide>
    </Carousel>
    <!-- table -->
    <div class="overflow-y-auto h-[calc(100vh-14rem)]">
      <CustomTable
        :headers="headers"
        :data="data"
        :colspans="colspans"
        :filter="filter"
      >
        <template #column0="{ entity }">
          {{ String(entity.data.route_number).toUpperCase() }}
        </template>
        <template #column1="{ entity }">
          {{ entity.data.promoter }}
        </template>
        <template #column2="{ entity }">
          {{ entity.data.visits_made }}
        </template>
        <template #column3="{ entity }">
          {{ entity.data.total_visits }}
        </template>
        <template #column4="{ entity }">
          <button
            @click="
              handleRowClick({
                route_id: entity.data.id,
                row_index: entity.row_id
              })
            "
            class="bg-[#dee6f8] p-[0.5rem] rounded-[0.5rem] w-[4rem] h-[4rem] grid place-content-center"
          >
            <i
              v-if="active_row.row_index === entity.row_id"
              class="fi fi-rr-angle-small-up text-[2rem] block mt-3"
            ></i>
            <i
              v-else
              class="fi fi-rr-angle-small-down text-[2rem] block mt-3"
            ></i>
          </button>
        </template>
        <template
          v-slot:[`column-${active_row.row_index}-expanded`]
          v-if="active_row.row_index !== null"
        >
          <tr class="bg-white transform: translate-y-[-1.5px]">
            <td colspan="8">
              <div class="timeline">
                <template v-for="(item, index) in marketsTimeLine" :key="index">
                  <div
                    :class="`container ${item.active !== null ? 'active' : ''}`"
                  >
                    <div class="content">
                      <h2>{{ item.market.name }}</h2>
                      <span v-if="item.market.sale">
                        {{
                          new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(item.market.sale.total_price)
                        }}
                      </span>
                    </div>
                  </div>
                </template>
              </div>
            </td>
          </tr>
        </template>
      </CustomTable>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.carousel__slide {
  justify-content: flex-start;
  width: max-content !important;
  margin-right: 1rem;
  padding: 1rem 1.3rem;
  color: $primary;
  font-size: 1.6rem;
  border: 0.1rem solid $primary;
  border-radius: 0.5rem;
  transition: background-color 175ms ease;
  user-select: none;

  &:hover {
    cursor: pointer;
    background-color: $primary;
    color: white;
  }
}

.carousel-item {
  &.active {
    background-color: $primary;
    color: white;
  }
}

.timeline {
  position: relative;
  margin: 0 auto;

  &::after {
    content: '';
    position: absolute;
    width: 0.3rem;
    background-color: #b7b7b7;
    top: 0;
    bottom: 0;
    left: 3rem;
    margin-left: -3px;
  }
}

.container {
  padding: 0 5rem;
  position: relative;
  background-color: inherit;
  width: fit-content;
  left: 0;

  &::after {
    content: '';
    position: absolute;
    width: 2.5rem;
    height: 2.5rem;
    left: 1.6rem;
    background-color: white;
    border: 0.3rem solid #b7b7b7;
    top: 0;
    border-radius: 50%;
    z-index: 1;
  }

  &::before {
    content: '';
    position: absolute;
    width: 1.5rem;
    height: 1.5rem;
    left: 2.1rem;
    background-color: #b7b7b7;
    /* border: 0.4rem solid #b7b7b7; */
    top: 0.5rem;
    border-radius: 50%;
    z-index: 2;
  }

  h2 {
    color: $primary;
    font-size: 1.6rem;
    margin: 0;
    line-height: 1.4;
  }
  margin-bottom: 1.4rem;

  span {
    color: $primary;
  }

  &.active {
    &::after {
      border-color: $positive;
    }
    &::before {
      background-color: $positive;
    }
    span {
      color: $positive;
    }
  }
}
</style>
