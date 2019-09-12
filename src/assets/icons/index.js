
const requireAll = requireContext => requireContext.keys().map(requireContext)

const req = require.context('./svg', false, /\.svg$/)
requireAll(req)
const base = require.context('../../../node_modules/web-crm/src/assets/icons/base', false, /\.svg$/)
requireAll(base)
