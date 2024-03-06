// if you wanna use swrv (I didn't like it very much. I prefer to use the real SWR in React/Next)
// import useSWRV from 'swrv'
// import { ref } from 'vue'

// import { options, getFetcher } from 'app/lib/utils/use-user'

// export default function useUser() {
//   const user = ref(null)
//   const { data, error, mutate, isValidating } = useSWRV(
//     '/auth/me',
//     getFetcher,
//     options
//   )

//   return { user, error, mutate, isValidating }
// }

import { defineStore } from 'pinia'
import { userStore } from 'src/stores/user-store'

export const useUser = () => {
  const $userStore = userStore()
  const userStoreCurrentUser = $userStore.currentUser
  const currentUser = userStoreCurrentUser

  const getUserInfo = $userStore.getUserInfo

  return {
    currentUser,
    getUserInfo
  }
}
