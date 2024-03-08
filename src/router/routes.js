const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue')
      },
      // ROTAS - ALL THE 'ROTAS' ROUTES
      {
        path: '/rotas',
        component: () => import('pages/RoutesPage.vue')
      },
      {
        path: '/produtos',
        component: () => import('pages/ProductsPage.vue')
      },
      {
        path: '/promotores',
        component: () => import('pages/PromoterPage.vue')
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
