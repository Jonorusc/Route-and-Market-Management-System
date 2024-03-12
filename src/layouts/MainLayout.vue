<script>
import { onMounted, ref, getCurrentInstance } from 'vue'
import jwt_decode from 'jwt-decode'
import SideBar from 'components/sidebar/SideBar.vue'
import { useUser } from 'app/hooks/use-user'

export default {
  components: {
    SideBar
  },
  setup() {
    const globals = ref(getCurrentInstance().appContext.config.globalProperties)
    const user = useUser()
    // prevent the loading spinner from showing on page load, just in case
    onMounted(() => {
      globals.value.$q.loading.hide()

      const token = localStorage.getItem('token')

      if (!token || jwt_decode(token).exp <= Math.floor(new Date() / 1000)) {
        localStorage.removeItem('token')
        globals.value.$router.push('/login')
        globals.value.$q.notify({
          message: 'Sua sessão expirou, por favor, faça login novamente.',
          color: 'negative',
          position: 'top',
          timeout: 4000
        })
      } else {
        const currentUser = user.currentUser

        if (currentUser && currentUser.role !== 'admin') {
          globals.value.$router.push('/rotas')
        }

        // if there's no user in the store, fetch it from the API
        if (!currentUser) {
          globals.value.$router.push('/login')
          user.getUserInfo()
        }
      }
    })

    return {
      user
    }
  }
}
</script>

<template>
  <q-layout>
    <q-page-container>
      <div class="flex bg-[#f8f8f8]">
        <SideBar />
        <main
          class="flex flex-col w-full lg:ml-[29rem] lg:w-[calc(100% - 29rem)]"
        >
          <router-view />
        </main>
      </div>
    </q-page-container>
  </q-layout>
</template>
