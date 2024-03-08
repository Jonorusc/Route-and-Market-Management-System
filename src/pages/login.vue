<script>
import { ref, getCurrentInstance } from 'vue'
import { userStore } from 'src/stores/user-store'

export default {
  name: 'LoginPage',
  setup() {
    const form = ref({
      email: '',
      password: ''
    })
    const isAttemptingLogin = ref(false)
    const useUserStore = userStore()
    const globals = ref(getCurrentInstance().appContext.config.globalProperties)

    async function onSubmit() {
      // check if the form is valid
      if (!form.value.email || !form.value.password) {
        globals.value.$q.notify({
          color: 'info',
          message: 'Preencha todos os campos',
          position: 'bottom',
          timeout: 4000,
          progress: true
        })
        return
      }

      isAttemptingLogin.value = true
      globals.value.$q.loading.show({
        message: 'Realizando login, aguarde...',
        spinnerSize: 100,
        spinnerColor: 'grey'
      })
      await useUserStore
        .login({ ...form.value })
        .then((res) => {
          if (!res.access_token) {
            this.$q.notify({
              color: 'negative',
              message: 'Erro inesperado ao fazer login, tente novamente',
              position: 'bottom',
              timeout: 4000,
              progress: true
            })
            return
          }
          localStorage.setItem('token', res.access_token)
          globals.value.$router.push('/')
        })
        .catch((err) => {
          globals.value.$q.notify({
            color: 'negative',
            message: err.message,
            position: 'bottom',
            timeout: 4000,
            progress: true
          })
        })
        .finally(() => {
          isAttemptingLogin.value = false
          globals.value.$q.loading.hide()
        })
    }
    return {
      form,
      isAttemptingLogin,
      useUserStore,
      onSubmit
    }
  }
}
</script>

<template>
  <q-page id="login">
    <img
      src="https://convicti.com.br/assets/images/r_footer-logo.webp"
      alt="Convicti logomarca"
      class="logo"
    />
    <q-form @submit="onSubmit" id="form">
      <div class="input">
        <label for="form-email">E-mail</label>
        <input v-model="form.email" type="text" id="form-email" />
      </div>
      <div class="input">
        <label for="form-password">Senha</label>
        <input v-model="form.password" type="password" id="form-password" />
      </div>

      <q-btn
        class="mt-5"
        label="Entrar"
        type="submit"
        color="secondary"
        :disabled="isAttemptingLogin"
      />
    </q-form>
  </q-page>
</template>

<style lang="scss" scoped>
#login {
  height: 100vh;
  width: 100vw;
  background-color: $primary;
  display: flex;
  align-items: center;
  flex-direction: column;
  row-gap: 8rem;
  padding: 9rem 1rem;
  .logo {
    width: 30rem;
    height: auto;
    @media screen and (max-width: 375px) {
      width: 24rem;
    }
  }
  #form {
    width: min(90%, 40rem);
    .input {
      display: flex;
      flex-direction: column;
      label {
        color: white;
      }
      input {
        font-family: 'Nunito Sans';
        font-size: 1.6rem;
        font-weight: 500;
        width: 100%;
        height: 3.5rem;
        outline: none;
        border: none;
        text-indent: 0.5rem;
        border-radius: 0.45rem;
        margin: 0.5rem 0;
        &:focus,
        &:active {
          outline: solid 0.2rem $secondary;
          outline-offset: -0.1rem;
          border-color: $secondary;
          box-shadow:
            0 0 0 0.2rem $secondary,
            inset 0 0 0 0.2rem $secondary;
        }
      }
    }

    button {
      width: 100%;
      border-radius: 0.45rem;
      text-transform: capitalize;
      font-size: 1.6rem;
    }
  }
}
</style>
