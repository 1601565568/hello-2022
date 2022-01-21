export default {
  path: '/Greeting',
  name: 'SocialOperation',
  component: () => import('@/layout/Default.vue'),
  meta: { requiresAuth: true },
  redirect: {
    path: '/Greeting/Content'
  },
  children: [
    {
      path: '/Greeting/Content',
      name: 'Greeting',
      title: '系统使用分析',
      meta: { requiresAuth: true },
      component: () => import('@layout/Content.vue'),
      redirect: {
        path: '/Greeting/Content/Index'
      },
      children: [
        {
          path: '/Greeting/Content/Index',
          name: 'Greeting',
          meta: { requiresAuth: true },
          title: '系统使用分析',
          'component': () => import('@/pages/Greeting/index.vue')
        }
      ]
    }
  ]
}
