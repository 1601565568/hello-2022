export default (parentName: any, name: any, module: any) => (
  {
    path: `/${module}`,
    name: parentName,
    component: () => import('@nascent/ecrp-ecrm/src/layout/Default.vue'),
    meta: { requiresAuth: true },
    redirect: {
      path: `/${module}/Content`
    },
    children: [
      {
        path: `/${module}/Content`,
        name: `${module}`,
        title: '系统使用分析',
        meta: { requiresAuth: true },
        component: () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
        redirect: {
          path: `/${module}/Content/Index`
        },
        children: [
          {
            path: `/${module}/Content/Index`,
            name,
            meta: { requiresAuth: true },
            title: '系统使用分析',
            'component': () => import(`@/pages/${module}/index.vue`)
          }
        ]
      }
    ]
  }
)
