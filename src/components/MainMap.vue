<script>
import 'leaflet/dist/leaflet.css'

import {
  LMap,
  LTileLayer,
  LControlLayers,
  LControlZoom,
  LMarker,
  LIcon,
  LPolyline
} from '@vue-leaflet/vue-leaflet'
// import { latLng, icon } from "leaflet";
import { ref, nextTick, computed, onMounted, watch } from 'vue'
import { useMarketStore } from 'src/stores/market-store'
import { tiles } from 'app/lib/map/tile-providers'
import { useRouteStore } from 'src/stores/route-store'
import { useUser } from 'app/hooks/use-user'

export default {
  name: 'MainMap',
  props: {
    filter: {
      type: Number,
      required: false
    }
  },
  components: {
    LMap,
    LTileLayer,
    LControlLayers,
    LControlZoom,
    LMarker,
    LIcon,
    LPolyline
  },
  emits: ['clicked_market', 'editing', 'putonroute', 'clicked_map'],
  setup(props, ctx) {
    const marketStore = useMarketStore()
    const routeStore = useRouteStore()
    const user = useUser()
    const markets = computed(() => marketStore.getMarkets)
    const market = ref({})
    const filteredBy = computed(() => props.filter)
    const center = ref([0, 0])
    const timeout = ref(null)
    const tileProviders = ref(tiles)

    const polyline = computed(() => {
      return {
        latlngs: routeStore.getLatLngs || [],
        color: '#0e044a'
      }
    })

    function handleClickOnMap(event) {
      ctx.emit('clicked_map', event)
    }

    function handleMarkerClick(_market) {
      ctx.emit('clicked_market', _market)
      market.value = _market
      center.value = [_market.latitude, _market.longitude]
      clearTimeout(timeout.value)
      // close market details after 25 seconds
      const seconds = 25 * 1000
      timeout.value = setTimeout(() => {
        market.value = {}
        ctx.emit('clicked_market', {})
      }, seconds)
    }

    if (markets.value.length > 0) {
      center.value = [markets.value[0].latitude, markets.value[0].longitude]
    }

    // watches
    watch(filteredBy, (val) => {
      nextTick(() => {
        if (val === 0) return

        // set market as empty in order to reset the state every time the filter changes
        market.value = {}

        // set market according to filter(market id)
        const new_market = markets.value.find((m) => m.id === filteredBy.value)
        handleMarkerClick(new_market)
      })
    })
    return {
      market,
      markets,
      routeStore,
      polyline,
      center,
      user,
      timeout,
      handleClickOnMap,
      zoom: 8,
      tileProviders,
      handleMarkerClick
    }
  }
}
</script>

<template>
  <section ref="map" id="map">
    <l-map
      :useGlobalLeaflet="false"
      :options="{ zoomControl: false }"
      :zoom="zoom"
      :center="[center[0], center[1]]"
      @click="handleClickOnMap"
      class="map"
    >
      <!-- gives option to choose layers and zoom -->
      <l-control-layers position="topright" />
      <l-control-zoom position="topright" />

      <l-tile-layer
        v-for="tileProvider in tileProviders"
        :key="tileProvider.name"
        :name="tileProvider.name"
        :visible="tileProvider.visible"
        :url="tileProvider.url"
        :attribution="tileProvider.attribution"
        layer-type="base"
      />
      <template v-if="markets.length > 0">
        <l-marker
          v-for="_market in markets"
          :lat-lng="[_market.latitude, _market.longitude]"
          :key="_market.id"
          @click="handleMarkerClick(_market)"
        >
          <l-icon
            :icon-size="[24, 24]"
            :icon-anchor="[12, 24]"
            :icon-url="
              market.id === _market.id
                ? '/icons/marker-secondary.png'
                : routeStore?.markets_id.includes(_market.id)
                ? '/icons/marker-secondary.png'
                : '/icons/marker-primary.png'
            "
          />
        </l-marker>
      </template>
      <template v-if="polyline?.latlngs?.length > 0">
        <l-polyline
          :lat-lngs="polyline.latlngs"
          :color="polyline.color"
        ></l-polyline>
      </template>
    </l-map>
    <div
      v-if="market.id && user?.currentUser?.role === 'admin'"
      :class="`market-details ${market.id ? 'active' : 'hidden'}`"
    >
      <div class="details-head">
        <div class="market-managers">
          <h4 class="name">{{ market.name }}</h4>
          <h5 class="rep">{{ market.person_responsible }}</h5>
        </div>
      </div>
      <div class="market-content">
        <ul class="content-list">
          <li class="list-item">
            <div class="item-name">
              <!-- I dont know why the whatsapp one is not working -->
              <!-- <i class="fi fi-brands-whatsapp"></i> -->
              <i class="fi fi-rr-circle-phone-flip"></i>
              <span>Whatsapp</span>
            </div>
            <div class="item-value">
              <span>{{
                String(market.whatsapp_phone).replace(
                  /^(\d{2})(\d{1})(\d{4})(\d{4})$/,
                  '($1) $2 $3-$4'
                )
              }}</span>
            </div>
          </li>
          <li class="list-item">
            <div class="item-name">
              <i class="fi fi-rr-marker"></i>
              <span>Localizaçao</span>
            </div>
            <div class="item-value">
              <span>{{ market.city.title }} - {{ market.state.letter }}</span>
            </div>
          </li>
          <li class="flex gap-6">
            <button
              class="focus:ring focus:ring-[#7f43ff80] bg-transparent text-secondary font-semibold py-2 md:w-[18rem] w-[10rem] border-[0.2rem] border-secondary rounded-[0.5rem] transition-all duration-300 ease-in-out"
              @click="$emit('editing', market.id)"
            >
              Editar
            </button>
            <button
              class="focus:ring focus:ring-[#7f43ff80] bg-secondary text-background font-semibold py-2 w-[18rem] border-[0.2rem] border-secondary rounded-[0.5rem] transition-all duration-300 ease-in-out"
              @click="$emit('putonroute', market)"
            >
              Adicionar à Rota
            </button>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
#map {
  @media screen and (max-width: 1054px) {
    /* margin-left: 0; */
    width: 100%;
    padding: 0;
    border-radius: unset;
    .map {
      border-radius: unset;
    }
  }

  /* margin-left: 29rem; */
  /* width: calc(100% - 29rem); */
  height: calc(100dvh - 10rem);
  padding: 0 2rem 2rem 2rem;
  border-radius: 1.4rem;
  filter: drop-shadow(0 0rem 0rem rgba(0, 0, 0, 0.1));

  .map {
    height: 100%;
    width: 100%;
    position: unset;
    border-radius: inherit;
    filter: inherit;
  }

  /* market */
  .market-details {
    position: fixed;
    bottom: 4rem;
    box-shadow: 0 0.4rem 0.8rem rgba(0, 0, 0, 0.1);
    left: 6rem;
    border-radius: 1.2rem;
    z-index: 40;
    padding: 2rem;
    background-color: white;
    max-width: 50rem;

    box-sizing: border-box;
    max-height: 20.5rem;

    @media screen and (max-width: 425px) {
      left: 2rem;
      width: 100%;
      padding: 2rem 1rem;
      left: 0;
      bottom: 8rem;
      border-radius: unset;
    }

    .details-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      .market-managers {
        display: flex;
        flex-direction: column;
        row-gap: 0.2rem;
        color: $labels;
        text-transform: capitalize;
        .name {
          font-size: 2rem;
          font-weight: 600;
          margin: 0;
          line-height: 1.8rem;
        }
        .rep {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 400;
        }
      }
      i {
        font-size: 2.5rem;
        font-weight: unset;
        color: $primary;
      }
    }

    .market-content {
      .content-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        row-gap: 0.4rem;
        .list-item {
          text-align: flex-start;
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          .item-name {
            display: flex;
            align-items: center;
            width: 17rem;
            column-gap: 0.8rem;
            i {
              font-size: 1.8rem;
              line-height: 1.8rem;
              color: #bebebe;
            }
            span {
              font-size: 1.4rem;
              font-weight: 600;
              color: #bebebe;
            }
          }
          .item-value {
            display: inline-flex;
            align-items: center;
            column-gap: 0.5rem;
            text-align: start;
            span {
              font-size: 1.4rem;
              font-weight: 600;
              color: $labels;
            }
            .bg {
              background-color: $backgroundLight;
              padding: 0.6rem 3rem;
              border-radius: 3rem;
              @media screen and (max-width: 320px) {
                padding: 0.6rem 1rem;
                background-color: unset;
              }
              span {
                white-space: nowrap;
                text-align: center;
                color: $labels;
              }
            }
          }
        }
      }
    }
  }
}
</style>
