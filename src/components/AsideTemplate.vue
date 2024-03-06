<template>
  <section ref="wrapper" id="addCompanies" :class="`${open ? 'show' : 'hide'}`">
    <div class="register">
      <h4>Cadastrar empresa</h4>
      <q-form @submit="onSubmit" @reset="onReset">
        <div class="form">
          <div class="left">
            <div class="input">
              <label for="c-name">Nome</label>
              <q-input
                type="text"
                dense
                standout
                v-model="company.name"
                id="c-name"
                name="c-name"
                required
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>

            <div class="input">
              <label for="c-cnpj">CNPJ</label>
              <q-input
                type="text"
                dense
                standout
                v-model="company.cnpj"
                id="c-cnpj"
                name="c-cnpj"
                required
                :rules="[(val) => !!val || 'Campo obrigatório']"
                mask="##.###.###/####-##"
              />
            </div>

            <div class="input">
              <label for="c-email">E-mail</label>
              <q-input
                dense
                standout
                type="email"
                v-model="company.email"
                id="c-email"
                name="c-email"
                required
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>

            <div class="input">
              <label for="c-whatsapp">Whatsapp</label>
              <q-input
                dense
                standout
                type="text"
                v-model="company.whatsapp_phone"
                id="c-whatsapp"
                name="c-whatsapp"
                required
                :rules="[(val) => !!val || 'Campo obrigatório']"
                mask="(##) #####-####"
              />
            </div>

            <div class="input">
              <label for="c-rep">Representante</label>
              <q-input
                type="text"
                dense
                standout
                v-model="company.representantive_user"
                id="c-rep"
                name="c-rep"
              />
            </div>

            <div class="twice">
              <div class="input">
                <label for="c-lat">Latitude</label>
                <q-input
                  type="text"
                  dense
                  standout
                  v-model="company.latitude"
                  id="c-lat"
                  name="c-lat"
                  class="short"
                  required
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                />
              </div>
              <div class="input">
                <label for="c-log">Longitude</label>
                <q-input
                  type="text"
                  dense
                  standout
                  v-model="company.longitude"
                  id="c-log"
                  name="c-log"
                  class="short"
                  required
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                />
              </div>
            </div>
            <div class="twice">
              <div class="input">
                <label for="c-estado">Estado</label>
                <q-select
                  id="c-estado"
                  v-model="company.state_id"
                  name="select-estado"
                  dense
                  option-value="id"
                  option-label="letter"
                  emit-value
                  standout
                  map-options
                  :options="states"
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                  label="Selecione"
                  use-input
                  input-debounce="0"
                  @filter="filterStates"
                />
              </div>
              <div class="input">
                <label for="c-cidade">Cidade</label>
                <q-select
                  id="c-cidade"
                  v-model="company.city_id"
                  name="select-cidade"
                  dense
                  standout
                  option-value="id"
                  option-label="title"
                  emit-value
                  map-options
                  :options="cities"
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                  label="Selecione"
                  use-input
                  input-debounce="0"
                  @filter="filterCities"
                >
                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-italic text-grey">
                        Dados indisponíveis
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="input">
              <label for="c-observations">Observações</label>
              <q-input
                dense
                standout
                type="text"
                v-model="company.notes"
                id="c-observations"
                name="c-observations"
              />
            </div>
            <div class="input mt-8">
              <label for="c-category">Categoria</label>
              <q-select
                id="c-category"
                v-model="company.category_id"
                name="select-category"
                dense
                option-value="id"
                option-label="name"
                emit-value
                standout
                map-options
                :options="categories"
                :rules="[(val) => !!val || 'Campo obrigatório']"
                label="Selecione"
              />
            </div>
          </div>
        </div>
        <div class="buttons">
          <button type="reset" class="cancel">Cancelar</button>
          <button type="submit" class="submit">cadastrar empresa</button>
        </div>
      </q-form>
    </div>
  </section>
</template>

<script>
import { defineComponent, nextTick } from 'vue'
// mocks
import {
  categories as $categories,
  states as $states
} from 'src/composables/mock.companies'

import useApi from 'src/composables/api'

const { getCategories, getStates, getCitiesByState, addCompany } = useApi()

export default defineComponent({
  name: 'AddCompanies',
  emits: ['close', 'success'],
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      categories: $categories.data,
      states: $states,
      company: {
        name: '',
        email: '',
        cnpj: '',
        whatsapp_phone: '',
        representantive_user: '',
        category_id: '',
        city_id: '',
        state_id: '',
        latitude: '',
        longitude: '',
        notes: ''
      },
      cities: []
    }
  },
  mounted() {
    nextTick(async () => {
      this.$refs.wrapper.addEventListener('click', (e) => {
        if (e.target.id === 'addCompanies') {
          this.$emit('close', false)
        }
      })

      try {
        const [categories, states] = await Promise.all([
          getCategories(),
          getStates()
        ])

        this.categories = categories
        this.states = states
      } catch (err) {
        console.error(
          `%cErro nas chamadas de API[Cadastro de Empresas]: ${err.message}`,
          'background-color: red; color: white; padding: 4px;'
        )
        console.log(
          `%cUsando dados 'mockados'`,
          'background-color: #0e044a; color: #f8f8f8; padding: 4px;'
        )
      }
    })
  },
  methods: {
    resetForm() {
      this.company = Object.fromEntries(
        Object.keys(this.company).map((key) => [key, ''])
      )
    },
    // add option to filter in q-select
    filterStates(val, update) {
      if (!Array.isArray(this.states)) {
        return
      }

      const stateCopy = [...this.states]

      if (val === '') {
        update(() => {
          this.states = stateCopy
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()

        this.states = stateCopy.filter((v) => {
          const stringValue = String(v.letter)
          return stringValue.toLowerCase().includes(needle)
        })
      })
    },
    filterCities(val, update) {
      if (!Array.isArray(this.cities)) {
        return
      }

      const stateCopy = [...this.cities]

      if (val === '') {
        update(() => {
          this.cities = stateCopy
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()

        this.cities = stateCopy.filter((v) => {
          const stringValue = String(v.title)
          return stringValue.toLowerCase().includes(needle)
        })
      })
    },
    onReset() {
      this.resetForm()
      this.$emit('close', false)
    },
    async onSubmit() {
      const {
        name,
        email,
        cnpj,
        whatsapp_phone,
        category_id,
        state_id,
        city_id,
        latitude,
        longitude
      } = this.company
      // check if all fields are filled but 'representantive_user' and 'notes'

      if (
        name &&
        email &&
        cnpj &&
        whatsapp_phone &&
        category_id &&
        state_id &&
        city_id &&
        latitude &&
        longitude
      ) {
        // before submit remove mask from cnpj (mask="##.###.###/####-##") and whatsapp_phone (mask="(##) #####-####")
        this.company.cnpj = this.company.cnpj.replace(/\D/g, '')
        this.company.whatsapp_phone = this.company.whatsapp_phone.replace(
          /\D/g,
          ''
        )

        this.$q.loading.show({
          message: 'Cadastrando empresa...',
          spinnerSize: 100,
          spinnerColor: 'grey'
        })

        try {
          await addCompany(this.company)
            .then((res) => {
              this.$q.notify({
                type: 'positive',
                message: `Empresa ${res.name} cadastrada com sucesso!`,
                position: 'top',
                timeout: 2000
              })
              this.$emit('success', res)
              this.resetForm()
              this.$emit('close', false)
            })
            .catch((err) => {
              const { errors } = err

              Object.keys(errors).forEach((key) => {
                this.$q.notify({
                  type: 'warning',
                  message: errors[key][0],
                  position: 'top-right',
                  timeout: 7000,
                  progress: true
                })
              })
            })
            .finally(() => {
              this.$q.loading.hide()
            })
        } catch (err) {
          this.$q.loading.hide()
          console.error(
            `%cErro nas chamadas de API[Cadastro de Empresas]: ${err.message}`,
            'background-color: red; color: white; padding: 4px;'
          )
        }
      } else {
        this.$q.notify({
          type: 'negative',
          message: 'Preencha todos os campos obrigatórios',
          position: 'top',
          timeout: 2000
        })
      }
    }
  },
  watch: {
    async 'company.state_id'(newVal) {
      if (!newVal) return
      // get cities by state
      try {
        this.$q.loading.show({
          message: 'Carregando cidades...',
          spinnerSize: 100,
          spinnerColor: 'grey'
        })
        const cities = await getCitiesByState(newVal)
        this.cities = cities
        this.$q.loading.hide()
      } catch (err) {
        this.$q.loading.hide()
        this.$q.notify({
          type: 'negative',
          message: 'Erro ao buscar cidades',
          position: 'top',
          timeout: 2000
        })
        console.error(
          `%cErro nas chamadas de API[Cadastro de Empresas]: ${err.message}`,
          'background-color: red; color: white; padding: 4px;'
        )
      }
    }
  }
})
</script>
<style lang="scss" scoped>
#addCompanies {
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
  .register {
    @media screen and (max-width: 425px) {
      width: 100%;
    }
    background: red;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 2rem 6rem;
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

    @media screen and (min-width: 1440px) {
      width: 55vw;
      overflow-y: auto;
      padding: 2rem 10rem;
    }
    width: 100%;
    overflow-y: auto;
    height: 100vh;
    background: $background;

    .form {
      display: flex;
      justify-content: space-between;
      column-gap: 4rem;

      @media screen and (max-width: 1370px) {
        width: 55%;
      }

      @media screen and (max-width: 425px) {
        flex-direction: column;
        align-items: center;
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
      box-shadow: 0 0 0.3rem rgba(0, 0, 0, 0.1);
      width: 33rem;

      &::placeholder {
        color: $labels;
      }
    }
  }

  .twice {
    display: flex;
    width: 30rem;
    column-gap: 1rem;
    input,
    select {
      width: calc(15rem - 0.5rem);
    }
  }
  select {
    font-size: 1.8rem;
    text-indent: 0.5rem;
    font-weight: 600;
    color: $labels;
    background-color: white;
    outline: none;
    border: none;
    height: 3.5rem;
    border-radius: 0.4rem;
    box-shadow: 0 0 0.3rem rgba(0, 0, 0, 0.1);
    width: 30rem;
    background-size: 2rem;
    padding-right: 0.4rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url('/icons/angle-small-down.svg');
    background-repeat: no-repeat;
    background-position-x: 98%;
    background-position-y: 50%;
    background-color: white;
    background-size: 2rem;
    padding-right: 0.4rem;

    option {
      font-size: 1.8rem;
      font-weight: 600;
      color: $labels;
      background-color: $background;
      outline: none;
      border: none;
      height: 3.5rem;
      border-radius: 0.4rem;
      box-shadow: 0 0 0.3rem rgba(0, 0, 0, 0.1);
      width: 30rem;
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
    }
  }
}
</style>
