import CustomerInsight from './customerInsight'
import AutomaticService from './automaticService'
import Marketing from './marketing'
import System from './system'
import Examples from './examples'
import Tool from './tool'
import LoyaltyProgram from './loyaltyprogram'
import database from './database'
import guide from './guide'
import mall from './mall'
import affairCenter from './affairCenter'
import dataInsight from './dataInsight'
import comnunicate from './comnunicate'
export default [
  CustomerInsight,
  AutomaticService,
  Marketing,
  System,
  Examples,
  Tool,
  LoyaltyProgram,
  database,
  affairCenter,
  guide,
  mall,
  dataInsight,
  comnunicate,
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
