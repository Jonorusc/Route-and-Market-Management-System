<script>
import { ref } from 'vue'
import { debounce } from 'lodash'

import { useMarketStore } from 'src/stores/market-store'
import { useRouteStore } from 'src/stores/route-store'

export default {
  name: 'TopBar',
  props: {
    filterKey: {
      type: String,
      default: 'name'
    },
    entity: {
      type: String,
      default: 'empresa'
    },
    data: {
      type: Array,
      default: () => []
    },
    showResults: {
      type: Boolean,
      default: true
    }
  },
  emits: ['filter', 'results'],
  setup(props) {
    const filter = ref('')
    const debouncedFilter = debounce((value) => {
      filter.value = value
    }, 600) // debounce time

    return {
      filter,
      debouncedFilter
    }
  },
  computed: {
    filteredData() {
      let isMatchFound = false
      const result = this.data.filter((item) => {
        if (item[this.filterKey].toLowerCase().indexOf(this.filter) === -1) {
          return false
        }
        isMatchFound = true
        return true
      })

      if (!isMatchFound) {
        if (this.entity === 'empresa') {
          this.$q.notify({
            message: `Nenhuma empresa foi encontrada com o nome: "${this.filter}".`,
            color: 'negative',
            position: 'top-right',
            timeout: 4000
          })
        } else {
          this.$q.notify({
            message: `Nenhum(a) ${this.entity} encontrado`,
            color: 'negative',
            position: 'top-right',
            timeout: 4000
          })
        }
      }
      return result
    }
  },
  watch: {
    filteredData(newVal) {
      if (this.filter.length > 2 && !this.showResults) {
        debounce(() => {
          this.$emit('results', newVal)
        }, 500)()
      }
    },
    filter(newVal) {
      if (newVal.length < 2 && !this.showResults) {
        debounce(() => {
          this.$emit('results', [])
        }, 500)()
      }
    }
  }
}
</script>

<template>
  <section id="topbar">
    <div class="search" tabindex="0">
      <i class="fi fi-rr-search search-icon"></i>
      <input
        type="text"
        ref="search"
        placeholder="Pesquisar"
        v-model="filter"
      />
      <!-- @input="debouncedFilter($event.target.value)" -->
      <div
        v-if="filter.length > 2 && filteredData.length > 0 && showResults"
        class="search-results"
      >
        <div
          v-for="item in filteredData"
          :key="item.id"
          class="item"
          @click="
            $emit('filter', item), (filter = ''), ($refs.search.value = '')
          "
        >
          <slot name="result" :entity="item"></slot>
        </div>
      </div>
    </div>

    <div class="flex gap-4">
      <slot name="buttons"></slot>
    </div>
  </section>
</template>

<style lang="scss">
#topbar {
  @media screen and (max-width: 1054px) {
    /* margin-left: 0; */
    width: 100%;
  }

  @media screen and (max-width: 540px) {
    flex-direction: column;
    align-items: flex-start;
    row-gap: 1rem;
  }

  /* margin-left: 29rem; */
  /* width: calc(100% - 29rem); */
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;

  .search {
    display: flex;
    align-items: center;
    background-color: white;
    column-gap: 0.8rem;
    border-radius: 0.5rem;
    padding: 1.8rem 2rem;
    width: 100%;
    max-width: 45rem;
    border-radius: 0.8rem;
    position: relative;
    &:where(:focus-within, :focus) {
      outline: solid 0.2rem $secondary;
      outline-offset: -0.1rem;
      border-color: $secondary;
      box-shadow:
        0 0 0 0.2rem $secondary,
        inset 0 0 0 0.2rem $secondary;
    }
    box-shadow: 0 0.1rem 0.4rem rgba(0, 0, 0, 0.1);
    i {
      font-size: 1.8rem;
      margin-right: 0.5rem;
      line-height: 1.8rem;
      color: #bebebe;
    }
    input {
      border: none;
      outline: none;

      background-color: inherit;
      width: 100%;
      font-family: 'Nunito Sans', sans-serif;
      font-size: 1.6rem;
      color: $primary;
      font-weight: 600;
      line-height: 1.6rem;
      &::placeholder {
        color: #bebebe;
      }
      &:focus {
        outline: none;
        border: none;
        box-shadow: none;
      }
    }

    .search-results {
      position: absolute;
      top: calc(100% + 0.5rem);
      left: 0;
      width: 100%;
      max-height: calc(100vh - 20rem);
      overflow-y: auto;
      box-shadow: 0 0.1rem 0.4rem rgba(0, 0, 0, 0.1);
      z-index: 10;
      margin-top: -0.4rem;
      .item {
        padding: 1.4rem 2rem;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        background-color: $background;
        border-bottom: 0.2rem solid $labels;
        &:last-child {
          border: none;
        }

        &:hover {
          background-color: $backgroundLight;
        }
        h3 {
          font-size: 1.6rem;
          font-weight: 600;
          color: $labels;
          margin: 0;
        }
        h4 {
          font-size: 1.4rem;
          font-weight: 400;
          color: $labels;
          margin: -1rem 0 0 0;
        }
      }
    }
  }

  .topbar-button {
    outline: none;
    border: none;
    display: flex;
    align-items: center;
    column-gap: 1rem;
    background-color: $backgroundLight;
    width: fit-content;
    padding: 1.8rem 2rem;
    border-radius: 0.8rem;
    cursor: pointer;
    user-select: none;

    &:active {
      /* scale: 0.95; */
      transform: translateY(0.2rem);
      background-color: $background;
      i {
        transform: scale(0.9) translateX(-0.2rem);
      }
      outline: solid 0.2rem $secondary;
      outline-offset: -0.1rem;
      border-color: $secondary;
      box-shadow:
        0 0 0 0.2rem $secondary,
        inset 0 0 0 0.2rem $secondary;
    }
    &:focus {
      outline: solid 0.2rem $secondary;
      outline-offset: -0.1rem;
      border-color: $secondary;
      box-shadow:
        0 0 0 0.2rem $secondary,
        inset 0 0 0 0.2rem $secondary;
    }
    .title {
      text-transform: capitalize;
      font-weight: 500;
      font-size: 1.6rem;
      color: $labels;
    }
    i {
      font-size: 1.8rem;
      color: $labels;
      line-height: 1.8rem;
    }
  }
}
</style>
