/*
 * @Descripttion: 企业微信-智能欢迎语-附件类型
 * @Author: yuye.huang
 * @Date: 2020-03-01 18:02:22
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-03-05 11:26:48
 */

/**
 * 图片
 * @type {Number}
 */
export const IMAGE = 1

/**
 * 链接
 * @type {Number}
 */
export const LINK = 2

/**
 * 小程序
 * @type {Number}
 */
export const MIN_APP = 3

export default {
  IMAGE,
  LINK,
  MIN_APP,
  Collection: {
    1: '图片',
    2: '链接',
    3: '小程序'
  }
}
