export default (parentName: any, secondName:any, name:any, module: any) => (
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
        name: secondName,
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
export const setRouter = (module: string, parentName: string, secondName?: string) => (
  {
    path: `/${module}/Content/Index`,
    name: parentName + secondName + module,
    meta: { requiresAuth: true },
    title: '系统使用分析',
    'component': () => import(`@/pages/${module}/index.vue`)
  }
)
export const thirdAuthRouter = (parentNamame: string, secondName?: string) => setRouter('ThirdAuth', parentNamame, secondName)
export const greetingRouter = (parentNamame: string, secondName?: string) => setRouter('Greeting', parentNamame, secondName)
export const setAllRouter = (parentNamame:string, secondName?: string) => [thirdAuthRouter(parentNamame, secondName), greetingRouter(parentNamame, secondName)]
