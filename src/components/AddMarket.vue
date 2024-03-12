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

import useClickOutside from 'app/hooks/use-click-outside'

import { useMarketStore } from 'src/stores/market-store'
import { useLocationStore } from 'src/stores/location-store'

export default {
  name: 'AddMarket',
  emits: ['close', 'success'],
  props: {
    open: {
      type: Boolean,
      default: false
    },
    initial_market_id: {
      type: Number || null,
      default: null
    }
  },
  setup(props, ctx) {
    const globals = ref(getCurrentInstance().appContext.config.globalProperties)
    const locationStore = useLocationStore()
    const states = ref(locationStore.states)
    const cities = ref(locationStore.cities)
    const onOpen = computed(() => props.open)
    const market_id = computed(() => props.initial_market_id)
    const marketStore = useMarketStore()
    const state_id = ref(null)
    const city_id = ref(null)
    const wrapper = ref(null)
    const market = ref({
      name: '',
      person_responsible: '',
      cnpj: '',
      whatsapp_phone: '',
      city_id: '',
      state_id: '',
      latitude: '',
      longitude: ''
    })

    // useClickOutside(wrapper, () => {
    //   ctx.emit('close', false)
    // })

    // mounted
    onMounted(async () => {
      states.value = await locationStore.fetchStates()
    })

    // methods
    function resetForm() {
      // sets all fields as an empty string
      market.value = Object.fromEntries(
        Object.keys(market.value).map((key) => [key, null])
      )
    }
    // add option to filter in q-select
    function statesFilterFn(val, options = { store: [], query: 'sigla' }) {
      try {
        states.value = options.store
        if (val.length < 1) {
          return
        }
        const needle = val?.toLowerCase()
        const busca = options.store.filter((v) =>
          v[options.query]?.toLowerCase().includes(needle)
        )
        //
        if (busca.length > 0) states.value = busca
      } catch {
        //
      }
    }
    function citiesFilterFn(val, options = { store: [], query: 'sigla' }) {
      try {
        cities.value = options.store
        if (val?.length < 1) {
          return
        }
        const needle = val?.toLowerCase()
        const busca = options.store.filter((v) =>
          v[options.query]?.toLowerCase().includes(needle)
        )
        //
        if (busca.length > 0) cities.value = busca
      } catch {
        //
      }
    }

    function onReset() {
      resetForm()
      ctx.emit('close', false)
    }
    async function onSubmit() {
      const { name, cnpj, whatsapp_phone, city_id, latitude, longitude } =
        market.value

      if (
        name &&
        cnpj &&
        whatsapp_phone &&
        state_id.value &&
        city_id &&
        latitude &&
        longitude
      ) {
        // before submit remove mask from cnpj (mask="##.###.###/####-##") and whatsapp_phone (mask="(##) #####-####")
        market.value.cnpj = market.value.cnpj.replace(/\D/g, '')
        market.value.whatsapp_phone = market.value.whatsapp_phone.replace(
          /\D/g,
          ''
        )

        globals.value.$q.loading.show({
          message: `${
            market_id.value === null ? 'Cadastrando' : 'Atualizando'
          } o mercado, aguarde...`,
          spinnerSize: 100,
          spinnerColor: 'grey'
        })
        if (market_id.value === null) {
          create()
        } else {
          update()
        }
      } else {
        globals.value.$q.notify({
          type: 'negative',
          message: 'Preencha todos os campos obrigatórios',
          position: 'top',
          timeout: 4000
        })
      }
    }
    async function create() {
      await marketStore
        .addMarket({
          ...market.value,
          state_id: state_id.value
        })
        .then((res) => {
          globals.value.$q.notify({
            type: 'positive',
            message: `Mercado ${res.name} cadastrado com sucesso!`,
            position: 'top',
            timeout: 4000
          })
          resetForm()
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
    async function update() {
      await marketStore
        .updateMarket(market_id.value, {
          ...market.value,
          state_id: state_id.value
        })
        .then((res) => {
          globals.value.$q.notify({
            type: 'positive',
            message: `Mercado ${res.name} atualizado com sucesso!`,
            position: 'top',
            timeout: 4000
          })
          ctx.emit('success', res)
          resetForm()
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
    // watches
    watch(market_id, async (val) => {
      if (val !== null) {
        const current_market = marketStore.markets.find((m) => m.id === val)

        state_id.value = current_market.state_id
        market.value = {
          name: current_market.name,
          person_responsible: current_market.person_responsible,
          cnpj: current_market.cnpj,
          whatsapp_phone: current_market.whatsapp_phone,
          latitude: current_market.latitude,
          longitude: current_market.longitude
        }
      }
    })

    watch(state_id, async (val) => {
      if (val) {
        globals.value.$q.loading.show({
          message: 'Carregando cidades...',
          spinnerSize: 100,
          spinnerColor: 'grey'
        })
        const response = await locationStore.fetchCity(val)
        cities.value = response
        globals.value.$q.loading.hide()
      }
      if (market_id.value !== null) {
        const current_market = marketStore.markets.find(
          (m) => m.id === market_id.value
        )
        market.value = {
          ...market.value,
          city_id: current_market.city_id
        }
      }
    })

    return {
      onOpen,
      market_id,
      states,
      market,
      cities,
      wrapper,
      citiesFilterFn,
      statesFilterFn,
      onReset,
      onSubmit,
      locationStore,
      state_id,
      city_id
    }
  }
}
</script>

<template>
  <section id="addMarket" :class="`${onOpen ? 'show' : 'hide'}`">
    <div class="register" ref="wrapper">
      <q-form @submit="onSubmit" @reset="onReset">
        <div class="form">
          <h4>
            {{ `${market_id === null ? 'Cadastrar' : 'Editar'}` }} mercado
          </h4>
          <div class="flex gap-10 justify-center min-h-full">
            <div class="left">
              <div class="input">
                <label for="c-name">Nome</label>
                <q-input
                  type="text"
                  dense
                  standout
                  v-model="market.name"
                  id="c-name"
                  name="c-name"
                  required
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                />
              </div>
              <div class="input">
                <label for="c-name">Nome do responsável</label>
                <q-input
                  type="text"
                  dense
                  standout
                  v-model="market.person_responsible"
                  id="c-responsavel"
                  name="c-responsavel"
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
                  v-model="market.cnpj"
                  id="c-cnpj"
                  name="c-cnpj"
                  required
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                  mask="##.###.###/####-##"
                  fill-mask
                />
              </div>

              <div class="input">
                <label for="c-whatsapp">Whatsapp</label>
                <q-input
                  dense
                  standout
                  type="text"
                  v-model="market.whatsapp_phone"
                  id="c-whatsapp"
                  name="c-whatsapp"
                  required
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                  mask="(##) #####-####"
                  fill-mask
                />
              </div>
            </div>
            <div class="right">
              <div class="input">
                <label for="c-lat">Latitude</label>
                <q-input
                  type="text"
                  dense
                  standout
                  v-model="market.latitude"
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
                  v-model="market.longitude"
                  id="c-log"
                  name="c-log"
                  class="short"
                  required
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                />
              </div>
              <div class="input">
                <label for="c-estado">Estado</label>
                <q-select
                  id="c-estado"
                  v-model="state_id"
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
                  hide-selected
                  fill-input
                  input-debounce="500"
                  @input-value="
                    statesFilterFn($event, {
                      store: locationStore.states,
                      query: 'letter'
                    })
                  "
                />
              </div>
              <div class="input">
                <label for="c-cidade">Cidade</label>
                <q-select
                  id="c-cidade"
                  v-model="market.city_id"
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
                  hide-selected
                  fill-input
                  input-debounce="0"
                  @input-value="
                    citiesFilterFn($event, {
                      store: locationStore.cities,
                      query: 'title'
                    })
                  "
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
        </div>
        <div class="buttons">
          <button type="reset" class="cancel">Cancelar</button>
          <button type="submit" class="submit">
            {{ `${market_id === null ? 'cadastrar' : 'editar'}` }} mercado
          </button>
        </div>
      </q-form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
#addMarket {
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
  .register {
    @media screen and (max-width: 425px) {
      width: 100%;
    }
    background: red;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem 6rem;
    /* h4 {
      font-size: 2.2rem;
      font-weight: 700;
      text-transform: capitalize;
      color: $labels;
      margin-bottom: 1rem;
      @media screen and (max-width: 375px) {
        width: 30rem !important;
      }
      @media screen and (max-width: 1370px) {
        text-align: center;
      }
    } */

    @media screen and (min-width: 1440px) {
      width: 55dvw;
      overflow-y: auto;
      padding: 2rem 10rem;
    }

    @media screen and (max-width: 480px) {
      padding: 1rem;
    }
    width: 100%;
    overflow-y: auto;
    height: 100vh;
    background: $background;

    .form {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: fit-content;
      margin: 0 auto;
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
      @media screen and (max-width: 480px) {
        width: 20rem;
        padding: 1rem 0;
      }
    }
  }
}
</style>
