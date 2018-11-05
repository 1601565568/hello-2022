import access from './access'

const asyncRouters = function (ars) {
  ars.forEach((one) => {
    if (one.componentPath && access.router(one)) {
      one.component = () => import('views/' + one.componentPath)
    } else {
      one.component = () => import('views/Errors/InsufficientPermissions')
    }
    if (one.children && one.children.length > 0) {
      asyncRouters(one.children)
    }
  })
  return ars
}

export default function (ars) {
  return asyncRouters(ars)
}
