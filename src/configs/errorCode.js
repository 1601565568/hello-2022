export const SUCCESS = '0'// 成功
export const USER_SESSION_EXPIRE = '999'// 用户session过期
export const UNKNOWN = '1000'// 未知错误
export const YS_BALANCE_NO_ENOUGH = '1001'// 雁书账户余额/套餐包不足
export const YS_ACCOUNT_NO_EXIST = '1002'// 雁书账号不存在
export const IP_NO_WHITELIST = '1003'// 发送请求的IP不在白名单内
export const ACCOUNT_DISABLED = '1004'// 账号被冻结、禁用
export const MOBILE_BLANK = '1005'// 手机号码不能为空
export const MOBILE_ILLEGAL = '1006'// 手机号码不合法
export const MOBILE_BLACK = '1007'// 手机号在黑名单里
export const MOBILE_REPEAT = '1008'// 手机号重复
export const OUT_TODAY_SEND_TIMES = '1009'// 超过当日可发送次数
export const SMS_LACK_SIGNATURE = '1010'// 短信内容缺少签名
export const CREATE_TIME_ERROR = '1011'// 开始时间错误
export const UPDATE_TIME_ERROR = '1012'// 结束时间错误
export const PAGE__NO_ERROR = '1013'// 页码错误
export const PAGE_SIZE_ERROR = '1014'// 每页个数错误，限制访问=1-100)
export const REQUEST_RATE_QUICKLY = '1015'// 请求频率过快
export const OUT_PAGE_NO = '1016'// 超过页码数
export const SUBMIT_FAIL = '1017'// 提交失败
export const TITLE_REPEAT = '1018'// 标题重复
export const DATA_NO_EXIST = '1019'// 数据不存在
export const CONTENT_BLANK = '1020'// 内容不能为空
export const PARAMETER_ILLEGAL = '1021'// 参数不合法
export const PARAMETER_BLANK = '1022'// 参数不能为空
export const DATA_ADD_FAIL = '1023'// 数据新增失败
export const DATA_EDIT_FAIL = '1024'// 数据修改失败
export const SYSTEM_INSIDE_ERROR = '1026'// 系统内部错误
export const DATA_DECRYPT_FAIL = '1028'// 数据解密失败
export const DATA_ENCRYPT_FAIL = '1029'// 数据加密失败
export const FILE_TYPE_ILLEGAL = '1030'// 不合法的文件类型
export const UNIQUE_REPEAT = '1031' // 密钥重复
export const DATA_USING = '1032' // 数据正在使用
export const CAPTCHA_ERROR = '1033' // 手机短信验证码错误
export const LOGIN_ACCOUNT_NO_EXIST = '1034' // 账号不存在
export const LOGIN_PASSWORD_INCORRECT = '1035' // 密码不正确
export const YS_SUBMIT_FAIL = '1036' // 提交雁书失败
export const YS_CHANNEL_EXIST = '1037' // 存在有效雁书通道
export const DATA_EXIST = '1039' // 数据存在
export default {
  SUCCESS,
  USER_SESSION_EXPIRE,
  UNKNOWN,
  YS_BALANCE_NO_ENOUGH,
  YS_ACCOUNT_NO_EXIST,
  IP_NO_WHITELIST,
  ACCOUNT_DISABLED,
  MOBILE_BLANK,
  MOBILE_ILLEGAL,
  MOBILE_BLACK,
  MOBILE_REPEAT,
  OUT_TODAY_SEND_TIMES,
  SMS_LACK_SIGNATURE,
  CREATE_TIME_ERROR,
  UPDATE_TIME_ERROR,
  PAGE__NO_ERROR,
  PAGE_SIZE_ERROR,
  REQUEST_RATE_QUICKLY,
  OUT_PAGE_NO,
  SUBMIT_FAIL,
  TITLE_REPEAT,
  DATA_NO_EXIST,
  CONTENT_BLANK,
  PARAMETER_ILLEGAL,
  PARAMETER_BLANK,
  DATA_ADD_FAIL,
  DATA_EDIT_FAIL,
  SYSTEM_INSIDE_ERROR,
  DATA_DECRYPT_FAIL,
  DATA_ENCRYPT_FAIL,
  FILE_TYPE_ILLEGAL,
  UNIQUE_REPEAT,
  DATA_USING,
  CAPTCHA_ERROR,
  LOGIN_ACCOUNT_NO_EXIST,
  LOGIN_PASSWORD_INCORRECT,
  YS_CHANNEL_EXIST,
  YS_SUBMIT_FAIL,
  DATA_EXIST
}
