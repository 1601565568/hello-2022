import ShopManager from './shopmanager'
import Reward from './reward'
import ShopMarketing from './shopmarketing'
import examples from './examples'
import Other from './other'
import Database from './database'
import Isv from './isv'
import Management from './management'
export default [
  ShopManager,
  Reward,
  ShopMarketing,
  Other,
  examples,
  Database,
  Isv,
  Management,
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
    'path': '/Errors/:msg?',
    'name': 'Errors',
    'component': () => import('web-crm/src/views/Errors/Errors')
  },
  {
    'path': '/404',
    'name': '404',
    'component': () => import('web-crm/src/views/Errors/404')
  },
  {
    'path': '/401',
    'name': '401',
    'component': () => import('web-crm/src/views/Errors/401')
  },
  {
    'path': '/*',
    'redirect': {
      'name': '404'
    }
  }
  // 不可在/* 之后配置 路由
]
