<template>
  <section ref="map" id="map">
    <l-map
      :useGlobalLeaflet="false"
      :options="{ zoomControl: false }"
      :zoom="zoom"
      :center="[center[0], center[1]]"
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
      <template v-if="companies.length > 0">
        <l-marker
          v-for="$company in companies"
          :lat-lng="[$company.latitude, $company.longitude]"
          :key="$company.id"
          @click="handleMarkerClick($company)"
        >
          <l-icon
            :icon-size="[24, 24]"
            :icon-anchor="[12, 24]"
            :icon-url="
              company.id === $company.id
                ? '/icons/marker-secondary.png'
                : '/icons/marker-primary.png'
            "
          />
        </l-marker>
      </template>
    </l-map>
    <div v-if="company.id" class="company-details">
      <div class="details-head">
        <div class="company-managers">
          <h4 class="name">{{ company.name }}</h4>
          <h5 class="rep">{{ company.representantive_user }}</h5>
        </div>
        <i class="fi fi-rr-building"></i>
      </div>
      <div class="company-content">
        <ul class="content-list">
          <li class="list-item">
            <div class="item-name">
              <i class="fi fi-rr-envelope"></i>
              <span>E-mail</span>
            </div>
            <div class="item-value">
              <span>{{ company.email }}</span>
            </div>
          </li>
          <li class="list-item">
            <div class="item-name">
              <i class="fi fi-rr-marker"></i>
              <span>Localizaçao</span>
            </div>
            <div class="item-value">
              <span>{{ company.city.title }}</span>
            </div>
          </li>
          <li v-if="company.category" class="list-item">
            <div class="item-name">
              <i class="fi fi-rr-star"></i>
              <span>Categoria</span>
            </div>
            <div class="item-value">
              <div class="bg">
                <span>{{ company.category.name }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import 'leaflet/dist/leaflet.css'

import {
  LMap,
  LTileLayer,
  LControlLayers,
  LControlZoom,
  LMarker,
  LIcon
} from '@vue-leaflet/vue-leaflet'
// import { latLng, icon } from "leaflet";
import { defineComponent, ref, nextTick } from 'vue'

export default defineComponent({
  name: 'MainMap',
  props: {
    companies: {
      type: Array,
      required: true
    },
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
    LIcon
  },
  setup() {
    const company = ref({})
    const center = ref([0, 0])
    const timeout = ref(null)
    return {
      company,
      center,
      timeout,
      zoom: 8,
      tileProviders: [
        {
          name: 'OpenStreetMap',
          visible: true,
          attribution:
            '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        },
        {
          name: 'OpenTopoMap',
          visible: false,
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
          attribution:
            'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        },
        {
          name: 'Satelite',
          visible: false,
          url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution:
            'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        }
      ]
    }
  },
  computed: {
    iconUrl() {
      return `https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Google_Maps_pin.svg/274px-Google_Maps_pin.svg.png`
    }
  },
  methods: {
    handleMarkerClick(company) {
      this.company = company
      this.center = [company.latitude, company.longitude]
      clearTimeout(this.timeout)
      // close company details after 25 seconds
      this.timeout = setTimeout(() => {
        this.company = {}
      }, 25 * 1000)
    }
  },
  watch: {
    companies() {
      nextTick(() => {
        this.center = [this.companies[0].latitude, this.companies[0].longitude]
      })
    },
    filter(val) {
      nextTick(() => {
        if (val === 0) return

        // set company as empty in order to reset the state every time the filter changes
        this.company = {}

        // set company according to filter(company id)
        const company = this.companies.find(
          (company) => company.id === this.filter
        )
        this.handleMarkerClick(company)
      })
    }
  }
})
</script>
<style lang="scss" scoped>
#map {
  @media screen and (max-width: 1054px) {
    margin-left: 0;
    width: 100%;
    padding: 0;
    border-radius: unset;
    .map {
      border-radius: unset;
    }
  }

  margin-left: 29rem;
  width: calc(100% - 29rem);
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

  /* company */
  .company-details {
    position: fixed;
    bottom: 4rem;
    box-shadow: 0 0.4rem 0.8rem rgba(0, 0, 0, 0.1);
    left: 6rem;
    border-radius: 1.2rem;
    z-index: 40;
    padding: 2rem;
    background-color: white;
    width: 50rem;

    box-sizing: border-box;
    height: 20.5rem;

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
      .company-managers {
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

    .company-content {
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
