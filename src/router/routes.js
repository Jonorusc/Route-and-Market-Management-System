const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: { transition: 'slide-right' }
      },
      // ROTAS - ALL THE 'ROTAS' ROUTES
      {
        path: '/rotas',
        component: () => import('pages/IndexPage.vue'),
        meta: { transition: 'slide-left' }
      },
      {
        path: '/addCargo',
        name: 'cadastrarCargo',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: '/visualizarCargo/:id',
        name: 'visualizarCargo',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: '/editarCargo/:id',
        name: 'editarCargo',
        component: () => import('pages/IndexPage.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/login.vue')
      },
      {
        path: '',
        name: 'loginDefault',
        component: () => import('pages/login.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
