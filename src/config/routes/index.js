import ShopManager from './shopmanager'
import Reward from './reward'
import ShopMarketing from './shopmarketing'
import Other from './other'
import Database from './database'
import Isv from './isv'
import Management from './management'
import ContentManager from './contentmanager'
export default [
  ShopManager,
  Reward,
  ShopMarketing,
  Other,
  Database,
  Isv,
  Management,
  ContentManager,
  {
    path: '/operate/articleMaterialDetail',
    name: 'articleMaterialDetail',
    'component': () => import('@/views/ISV/articleMaterialDetail')
  },
  {
    path: '/operate/third/personalWeChat',
    name: 'personalWeChat',
    'component': () => import('@/views/third/personalWeChat')
  },
  {
    'path': '/operate',
    'name': 'ECRP_LOGIN',
    'title': 'ECRP登录',
    'component': () => import('@/views/LoginEcrp/index')
  },
  // 以下为系统默认路由，修改请请与项目负责人进行确认
  {
    'path': '/',
    'name': 'index',
    'redirect': {
      'name': 'Overview'
    }
  },
  {
    'path': '/errors/:msg?',
    'name': 'Errors',
    'component': () => import('@nascent/ecrp-ecrm/src/views/Errors/Errors')
  },
  {
    path: '/*',
    redirect: {
      name: 'Errors'
    }
  }
  // 不可在/* 之后配置 路由
]
