<script setup>
import { defineAsyncComponent } from 'vue'
import { useUser } from 'app/hooks/use-user'

// components
const PromoterRoutes = defineAsyncComponent(() =>
  import('components/PromoterRoutes.vue')
)
const AdminRoutes = defineAsyncComponent(() =>
  import('components/AdminRoutes.vue')
)

const {
  currentUser: { role }
} = useUser()
</script>

<template>
  <div class="h-[100dvh]">
    <AdminRoutes v-if="role === 'admin'" />
    <PromoterRoutes v-else />
  </div>
</template>
