export default {
  path: '/ThirdAuth',
  name: 'SocialOperation',
  component: () => import('@nascent/ecrp-ecrm/src/layout/Default.vue'),
  meta: { requiresAuth: true },
  redirect: {
    path: '/ThirdAuth/Content'
  },
  children: [
    {
      path: '/ThirdAuth/Content',
      name: 'Greeting',
      title: '系统使用分析',
      meta: { requiresAuth: true },
      component: () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      redirect: {
        path: '/ThirdAuth/Content/Index'
      },
      children: [
        {
          path: '/ThirdAuth/Content/Index',
          name: 'Greeting',
          meta: { requiresAuth: true },
          title: '系统使用分析',
          'component': () => import('@/pages/ThirdAuth/index.vue')
        }
      ]
    }
  ]
}
