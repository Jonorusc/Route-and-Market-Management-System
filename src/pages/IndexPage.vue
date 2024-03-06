<template>
  <div class="h-[100dvh]">
    <Topbar
      @open="handleModal"
      @filter="handleTopbarFilter"
      :companies="companies"
    />
    <MainMap :companies="companies" :filter="filterId" />
    <!-- <AddCompanies
      @close="handleModal"
      @success="handleRegisterCompany"
      :open="openModal"
    /> -->
  </div>
</template>

<script>
import { defineComponent, nextTick, ref } from 'vue'

// componentes
import Topbar from 'components/TopBar.vue'
import MainMap from 'components/MainMap.vue'
import AddCompanies from 'components/AddCompanies.vue'
//
import useApi from 'src/composables/api'
import { companies as $companies } from 'src/composables/mock.companies'

export default defineComponent({
  name: 'IndexPage',
  components: {
    Topbar,
    MainMap
    // AddCompanies
  },
  setup() {
    const openModal = ref(false)
    const companies = ref($companies.data)
    const filterId = ref(0)
    return {
      openModal,
      companies,
      filterId
    }
  },
  methods: {
    handleRegisterCompany(company) {
      nextTick(async () => {
        // fetch companies again
        await this.fetchCompanies(company)
      })
    },
    handleModal(value) {
      this.openModal = value
    },
    handleTopbarFilter(company) {
      this.filterId = company.id
    },
    async fetchCompanies(company = {}) {
      try {
        this.$q.loading.show({
          message: 'Carregando Empresas...',
          spinnerSize: 100,
          spinnerColor: 'grey'
        })
        await getCompanies()
          .then((res) => {
            this.companies = res.data
          })
          .catch((err) => {
            this.companies = $companies.data
            console.error(
              `%c${err.message}`,
              'background-color: red; color: white; padding: 4px;'
            )
            console.log(
              `%cUsando dados "mockados"`,
              'background-color: #0e044a; color: #f8f8f8; padding: 4px;'
            )
          })
          .finally(() => {
            this.$q.loading.hide()
          })
      } catch (err) {
        this.companies = $companies.data
        console.error(
          `%c${err}`,
          'background-color: red; color: white; padding: 4px;'
        )
      }
      if (!company.id) return
      // ask if the user wanna visualize the company in the map
      this.$q.notify({
        type: 'success',
        progress: true,
        message: `Deseja visualizar a empresa ${company.name} no mapa?`,
        timeout: 5000,
        actions: [
          {
            label: 'Sim',
            handler: () => {
              this.filterId = company.id
            },
            color: 'positive'
          },
          {
            label: 'Não',
            handler: () => {},
            color: 'negative'
          }
        ]
      })
    }
  },
  mounted() {}
})
</script>
