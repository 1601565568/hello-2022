import apiConf from '@/config/http'
import access from './access'
import common from './common'
import hash from './hash'
import downloadConfig from './downloadConfig'
import customerProperty from './customerProperty'
import customerUpdateInfoLog from './customerUpdateInfoLog'
import brand from './brand'
import menu from './menu'
import channel from './channel'
import department from './department'
import sysRole from './sysRole'
import sysShop from './sysShop'
import exportlog from './exportlog'
import exportTask from './exportTask'
import sysUser from './sysUser'
import exportDownloadLog from './exportDownloadLog'
export default {
  access,
  common,
  hash,
  downloadConfig,
  customerProperty,
  customerUpdateInfoLog,
  brand,
  menu,
  channel,
  sysRole,
  department,
  sysShop,
  exportlog,
  exportTask,
  sysUser,
  exportDownloadLog,
  /**
   * $api.uploadFile('test')
   * @param {string} module 上传模块名
   */
  uploadFile: function (module) {
    if (typeof module === 'string') {
      return `${apiConf.API_ROOT}/core/kduploadfile/uploadFile/${module}`
    }
  },
  /**
   * $api.downloadFile('文件ID')
   * @param {string} id 文件ID
   */
  downloadFile: function (id) {
    if (typeof id === 'string') {
      return `${apiConf.API_ROOT}/core/kduploadfile/downloadFile?id=${id}`
    }
  },
  /**
   * $api.deleteFile('文件ID')
   * @param {string} id 文件ID
   */
  deleteFile: function (id) {
    if (typeof id === 'string') {
      return `${apiConf.API_ROOT}/core/kduploadfile/deleteFile?id=${id}`
    }
  },
  /**
   * $api.sgUploadFile('test')
   * @param {string} module 上传模块名
   */
  sgUploadFile: function (module) {
    if (typeof module === 'string') {
      return `${apiConf.API_ROOT}/core/sgfile/uploadFile/${module}`
    }
  },
  // 上传证书
  uploadCert: function () {
    return `${apiConf.API_ROOT}/wxpay/method/uploadCert`
  },
  /**
   * manualShopIds
   * @param {string}  manualShopIds 外部门店编码
   */
  importFileShopIds: function () {
    return `${apiConf.API_ROOT}/guide/task/importFileShopIds`
  },
  /**
   * @param {string} module 门店指标上传表格
   */
  sgUploadExcel: function () {
    return `${apiConf.API_ROOT}/guide/importquota/uploadexcel`
  },
  /**
 * @param {string} module 快捷话术上传EXCEl
 */
  sgUploadQuickExcel: function () {
    return `${apiConf.API_ROOT}/guide/quicklyword/uploadQuickExcel`
  },
  /**
   * $api.sgUploadFile('test')
   * @param {string} module 上传模块名
   */
  sgMoreAccountUploadFile: function (module) {
    if (typeof module === 'string') {
      return `${apiConf.API_ROOT}/guide/sgmoreaccount/uploadFile/${module}`
    }
  },
  /**
   * $api.sgDownloadFile('文件fileKey')
   * @param {string} fileKey 文件fileKey
   */
  sgDownloadFile: function (fileKey) {
    if (typeof fileKey === 'string') {
      return `${apiConf.API_ROOT}/core/sgfile/downloadFile?fileKey=${fileKey}`
    }
  },
  /*
  *  删除API，参数id ：文件ID
  * */
  deleteFileById: {
    url: '/core/kduploadfile/deleteFile',
    method: 'get'
  }
}
