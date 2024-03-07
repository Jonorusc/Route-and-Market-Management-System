<script>
import { nextTick, ref, onMounted, computed, getCurrentInstance } from 'vue'
import { useUser } from 'app/hooks/use-user'

// components
import AdminRoutes from 'components/AdminRoutes.vue'

export default {
  name: 'RoutesPage',
  components: { AdminRoutes },
  setup() {
    const globals = ref(getCurrentInstance().appContext.config.globalProperties)
    const {
      currentUser: { role }
    } = useUser()

    return { role }
  }
}
</script>

<template>
  <div class="h-[100dvh] p-[2rem]">
    <template v-if="role === 'admin'"><AdminRoutes /> </template>
  </div>
</template>
