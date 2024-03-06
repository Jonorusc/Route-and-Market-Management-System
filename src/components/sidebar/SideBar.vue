<script>
import { ref, watch, getCurrentInstance } from 'vue'
import { RouterLink } from 'vue-router'

import useResize from 'app/lib/utils/use-resize'
import useClickOutside from 'app/hooks/use-click-outside'
import { useUser } from 'app/hooks/use-user'

import { items as $items } from 'components/sidebar/items'

export default {
  name: 'SideBar',
  setup() {
    const globals = ref(getCurrentInstance().appContext.config.globalProperties)
    const userStore = useUser()

    const { width } = useResize()
    const sidebarRef = ref(null)
    const showSideBar = ref(true)
    const items = ref($items)

    watch(width, () => {
      if (width.value > 1054) {
        showSideBar.value = true
      } else {
        showSideBar.value = false
      }
    })

    useClickOutside(sidebarRef, () => {
      if (width.value <= 1054) {
        showSideBar.value = false
      }
    })

    function logoff() {
      localStorage.removeItem('token')

      globals.value.$router.push('/login')

      globals.value.$q.notify({
        color: 'positive',
        position: 'top',
        message: 'Você saiu do sistema!',
        timeout: 1500
      })
    }

    function authorizedToSee(admin_required = false) {
      if (admin_required) {
        return userStore?.currentUser?.role === 'admin' || false
      }
      return true
    }

    return {
      userStore,
      showSideBar,
      items,
      logoff,
      authorizedToSee,
      sidebarRef
    }
  }
}
</script>

<template>
  <section id="sidebar" ref="sidebarRef">
    <nav :class="`${showSideBar ? 'show' : 'hide'}`">
      <div class="logo">
        <img
          src="https://convicti.com.br/assets/images/r_footer-logo.webp"
          alt="Convicti logomarca"
          class="logo"
        />
      </div>
      <div class="menu">
        <h5 class="menu-title">Menu</h5>
        <ul class="menu-list" v-if="userStore.currentUser">
          <template v-for="item in items" :key="item.id">
            <RouterLink
              v-if="authorizedToSee(item.admin_required)"
              :to="{ path: item.route_path }"
              v-slot="{ isExactActive }"
            >
              <li
                :class="`menu-item pt-2 pb-2 pr-5 pl-5 ${
                  isExactActive ? 'active' : ''
                }`"
              >
                <i :class="item.icon_class"></i>
                <span>{{ item.title }}</span>
              </li>
            </RouterLink></template
          >
        </ul>
        <ul v-else>
          <div class="flex items-center justify-center h-full">
            <div
              class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent border-background align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
              role="status"
            >
              <span
                class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...</span
              >
            </div>
          </div>
          <h5 class="text-background text-center mt-1">
            Carregando Usuário...
          </h5>
        </ul>
      </div>
      <button class="log-off" @click="logoff">
        <i class="fi fi-rr-power"></i>
        <span>Sair</span>
      </button>
    </nav>
    <div
      :class="`toggler ${showSideBar ? 'show' : 'hide'}`"
      @click="showSideBar = !showSideBar"
    >
      <i v-if="showSideBar" class="fi fi-rr-cross-small"></i>
      <i v-else class="fi fi-rr-menu-burger"></i>
    </div>
  </section>
</template>

<style lang="scss" scoped>
#sidebar {
  .toggler {
    @media screen and (max-width: 1054px) {
      display: flex;
    }
    position: fixed;
    bottom: -1rem;
    left: 22rem;
    display: none;
    justify-content: flex-end;
    align-items: center;
    column-gap: 1rem;
    margin-bottom: 4rem;
    transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
    cursor: pointer;
    i {
      font-size: 2.5rem;
      color: $background;
    }
    z-index: 30;

    @media screen and (max-width: 320px) {
      left: 18rem;
    }

    &.hide {
      left: 2rem;
      i {
        color: $primary;
      }
    }
  }

  nav {
    position: fixed;
    width: min(70vw, 29rem);
    height: 100vh;
    background-color: $primary;
    padding: 4rem 4rem;
    display: flex;
    flex-direction: column;
    z-index: 20;
    transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);

    @media screen and (max-width: 375px) {
      padding: 4rem 2rem;
    }

    &.hide {
      transform: translateX(-100%);
      opacity: 0;
      pointer-events: none;
    }

    &.show {
      transform: translateX(0);
      opacity: 1;
      pointer-events: all;
    }

    .logo {
      width: 21rem;
      object-fit: cover;
      @media screen and (max-width: 768px) {
        width: 14rem;
      }
    }

    .menu {
      margin-top: 10rem;
      .menu-title {
        font-size: 1.6rem;
        color: white;
        margin: 0 0 1.5rem 0;
        text-transform: uppercase;
        letter-spacing: 0.2rem;
      }

      .menu-list {
        list-style: none;
        padding: 0;
        margin: 0;
        .menu-item {
          user-select: none;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          font-size: 2rem;
          margin-bottom: 0.8rem;
          color: #e2e2e290;
          font-weight: 550;
          column-gap: 1.8rem;
          border-radius: 0.5rem;
          cursor: pointer;

          @media screen and (max-width: 768px) {
            justify-content: flex-start;
            padding: 0.5rem;
          }

          &:active {
            background-color: #f2f2f2;
          }
          i {
            line-height: 2rem;
          }

          &.active {
            background-color: #fff;
            color: $labels;
          }
        }
      }
    }

    .log-off {
      display: flex;
      align-items: center;
      font-size: 1.6rem;
      color: white;
      background-color: transparent;
      outline: none;
      border: none;
      align-self: flex-start;
      column-gap: 0.8rem;
      margin-top: auto;

      cursor: pointer;
      i {
        line-height: 1.6rem;
      }
    }
  }
}
</style>
