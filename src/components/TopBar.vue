<template>
  <section id="topbar">
    <div class="search" tabindex="0">
      <i class="fi fi-rr-search"></i>
      <input type="text" placeholder="Pesquisar" v-model="search" />
      <div
        v-if="search.length > 2 && filteredCompanies.length > 0"
        class="search-results"
      >
        <div
          v-for="result in filteredCompanies"
          :key="result.id"
          class="item"
          @click="$emit('filter', result), (search = '')"
        >
          <h3>{{ result.name }}</h3>
          <h4>{{ result.representantive_user }}</h4>
        </div>
      </div>
    </div>

    <button class="add-companies" @click="$emit('open', true)">
      <span class="title">adicionar empresa</span>
      <i class="fi fi-rr-plus"></i>
    </button>
  </section>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'TopBar',
  emits: ['open', 'filter'],
  props: {
    companies: {
      type: Array,
      required: true
    }
  },
  setup() {
    const search = ref('')
    const wait = ref(false)
    return { search, wait }
  },
  computed: {
    filteredCompanies() {
      return this.companies?.filter((company) =>
        company.name.toLowerCase().includes(this.search.toLowerCase())
      )
    }
  },
  watch: {
    search() {
      if (this.search.length > 2 && this.filteredCompanies.length > 0)
        this.wait = false
      else if (this.search.length > 2 && this.filteredCompanies.length === 0) {
        if (this.wait) return

        this.wait = true

        // display something on the screen if there was no data
        setTimeout(() => {
          if (this.search.length > 2 && this.filteredCompanies.length === 0) {
            this.$q.notify({
              color: 'warning',
              message: `Nenhuma empresa foi encontrada com o nome: "${this.search}".`,
              position: 'bottom',
              timeout: 2000
            })
            this.wait = false
          }
        }, 500)
      }
    }
  }
})
</script>
<style lang="scss" scoped>
#topbar {
  @media screen and (max-width: 1054px) {
    margin-left: 0;
    width: 100%;
  }

  @media screen and (max-width: 540px) {
    flex-direction: column;
    align-items: flex-start;
    row-gap: 1rem;
  }

  margin-left: 29rem;
  width: calc(100% - 29rem);
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
      top: 100%;
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

  .add-companies {
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
