<script>
import { getCurrentInstance, onMounted, computed, watch, ref } from 'vue'

import useClickOutside from 'app/hooks/use-click-outside'

import { useProductStore } from 'src/stores/product-store'

export default {
  name: 'AddProduct',
  emits: ['close', 'success'],
  props: {
    open: {
      type: Boolean,
      default: false
    },
    initial_product_id: {
      type: Number || null,
      default: null
    }
  },
  setup(props, ctx) {
    const globals = ref(getCurrentInstance().appContext.config.globalProperties)
    const onOpen = computed(() => props.open)
    const product_id = computed(() => props.initial_product_id)
    const productStore = useProductStore()
    const wrapper = ref(null)
    const product = ref({
      name: '',
      price: 0
    })

    // useClickOutside(wrapper, () => {
    //   ctx.emit('close', false)
    // })

    // methods
    function resetForm() {
      // sets all fields as an empty string
      product.value = Object.fromEntries(
        Object.keys(product.value).map((key) => [key, ''])
      )
    }

    function onReset() {
      resetForm()
      ctx.emit('close', false)
    }
    async function onSubmit() {
      const { name, price } = product.value

      if (name && price > 0) {
        globals.value.$q.loading.show({
          message: `${
            product_id.value === null ? 'Cadastrando' : 'Atualizando'
          } o produto, aguarde...`,
          spinnerSize: 100,
          spinnerColor: 'grey'
        })
        if (product_id.value === null) {
          create()
        } else {
          update()
        }
      } else {
        globals.value.$q.notify({
          type: 'negative',
          message:
            'Preencha todos os campos obrigatórios. Sendo preço maior que 0',
          position: 'top-right',
          timeout: 4000
        })
      }
    }
    async function create() {
      await productStore
        .addProduct({
          ...product.value
        })
        .then((res) => {
          globals.value.$q.notify({
            type: 'positive',
            message: `Produto ${res.name} cadastrado com sucesso!`,
            position: 'top',
            timeout: 4000
          })
          ctx.emit('success', res)
          resetForm()
          ctx.emit('close', false)
        })
        .catch((err) => {
          console.log(err)
          const { errors } = err

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
      await productStore
        .updateProduct(product_id.value, {
          ...product.value
        })
        .then((res) => {
          globals.value.$q.notify({
            type: 'positive',
            message: `Produto ${res.name} atualizado com sucesso!`,
            position: 'top',
            timeout: 4000
          })
          ctx.emit('success', res)
          resetForm()
          ctx.emit('close', false)
        })
        .catch((err) => {
          const { errors } = err

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
    watch(product_id, async (val) => {
      if (val !== null) {
        const current_product = productStore.getProducts.find(
          (p) => p.id === val
        )

        product.value = {
          name: current_product.name,
          price: current_product.price
        }
      }
    })

    return {
      onOpen,
      product_id,
      product,
      wrapper,
      onReset,
      onSubmit
    }
  }
}
</script>

<template>
  <section id="addProduct" :class="`${onOpen ? 'show' : 'hide'}`">
    <div class="register" ref="wrapper">
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="h-full !flex !flex-col !justify-between"
      >
        <div class="form">
          <h4>
            {{ `${product_id === null ? 'Cadastrar' : 'Editar'}` }} produto
          </h4>
          <div class="flex justify-start flex-col w-full">
            <div class="input">
              <label for="c-name">Nome</label>
              <q-input
                type="text"
                dense
                standout
                v-model="product.name"
                id="c-name"
                name="c-name"
                required
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
            <div class="input">
              <label for="c-name">Preço Unitário</label>
              <q-input
                type="number"
                dense
                standout
                v-model="product.price"
                id="c-responsavel"
                name="c-responsavel"
                required
                :rules="[
                  (val) =>
                    val > 0 ||
                    val > 10000 ||
                    'Preço deve ser maior que 0 e menor que 10000'
                ]"
              />
            </div>
          </div>
        </div>
        <div class="buttons">
          <button type="reset" class="cancel">Cancelar</button>
          <button type="submit" class="submit">
            {{ `${product_id === null ? 'cadastrar' : 'editar'}` }} produto
          </button>
        </div>
      </q-form>
    </div>
  </section>
</template>

<style lang="scss">
#addProduct {
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
    padding: 3rem;

    width: 35dvw;

    overflow-y: auto;
    height: 100vh;
    background: $background;

    .form {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
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

      @media screen and (max-width: 425px) {
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
      width: 100%;
      &::placeholder {
        color: $labels;
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
}

.q-field--standout .q-field__control {
  width: 100% !important;
  input {
    box-shadow: none !important;
  }
}
</style>
