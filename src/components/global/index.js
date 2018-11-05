import global from './components'

const components = {
  ...global
}

const install = function (Vue, opts = {}) {
  if (install.installed) return

  Object.keys(components).forEach(key => {
    Vue.component(components[key].name || key, components[key])
  })
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
const API = {
    // version: process.env.VERSION, // eslint-disable-line no-undef
  install,
  ...components
}

export default API
