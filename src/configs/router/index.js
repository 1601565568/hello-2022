import ShopManager from './shopmanager'
import Reward from './reward'
import ShopMarketing from './shopmarketing'
import Other from './other'
import Examples from './examples'
import Database from './database'
import Isv from './isv'
export default [
  ShopManager,
  Reward,
  ShopMarketing,
  Other,
  Examples,
  Database,
  Isv,
  // 以下为系统默认路由，修改请请与项目负责人进行确认
  {
    path: '/',
    name: 'index',
    redirect: {
      name: 'Overview'
    }
  },
  {
    path: '/404',
    name: '404',
    componentPath: 'Errors/404'
  },
  {
    path: '/401',
    name: '401',
    componentPath: 'Errors/401'
  },
  {
    path: '/LoginError',
    name: 'loginError',
    componentPath: 'Errors/LoginError'
  },
  {
    path: '/*',
    hidden: true,
    redirect: {
      name: '404'
    }
  }
  // 不可在/* 之后配置 路由
]
