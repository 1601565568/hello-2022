import store from 'store/dist/store.legacy.min.js'
import config from './config'

const menuConfig = store.get('menu_config') || {width: config.width.open, top: config.top, menu_flag: config.menu_flag}
export default menuConfig
