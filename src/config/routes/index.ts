import ShopManager from './shopmanager'
import Reward from './reward'
import ShopMarketing from './shopmarketing'
import Other from './other'
import Database from './database'
import Isv from './isv'
import Management from './management'
import ContentManager from './contentmanager'
import social from './social'
import WeWork from './wework'
import dataCenter from './dataCenter'
import greeting from './greeting'
import customerCenter from './customerCenter'
import pullNew from '@/config/routes/pullNew'
import chatManage from '@/config/routes/chatManage'
export default [
  ShopManager,
  Reward,
  ShopMarketing,
  Other,
  Database,
  Isv,
  Management,
  ContentManager,
  social,
  dataCenter,
  WeWork, // 企业微信
  greeting,
  customerCenter,
  pullNew,
  chatManage,
  {
    path: '/operate/articleMaterialDetail',
    name: 'articleMaterialDetail',
    'component': () => import('@/pages/ISV/articleMaterialDetail.vue')
  },
  {
    path: '/operate/third/personalWeChat',
    name: 'personalWeChat',
    'component': () => import('@/pages/third/personalWeChat.vue')
  },
  {
    'path': '/operate',
    'name': 'ECRP_LOGIN',
    'title': 'ECRP登录',
    'component': () => import('@/pages/LoginEcrp/index.vue')
  },
  {
    'path': '/greeting',
    'name': 'Greeting',
    'title': 'ECRP登录',
    'component': () => import('@/pages/Greeting/index.vue')
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
    'component': () => import('@nascent/ecrp-ecrm/src/pages/Errors/Errors.vue')
  },
  {
    'path': '/icons',
    'name': 'Icon',
    'component': () => import('@nascent/ecrp-ecrm/src/pages/IconList.vue'),
    'meta': {
      'title': 'IconList',
      'requiresAuth': true
    }
  },
  {
    path: '/*',
    redirect: {
      name: 'Errors'
    }
  }
  // 不可在/* 之后配置 路由
]
