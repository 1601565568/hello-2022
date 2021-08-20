// 三方应用之后此文件配置作废，请在thirdRouter 文件中配置
const customCode = ['CustomerCode', 'CustomerCodeList', 'CustomerCodeEdit', 'CustomerCodeAnalysis'] // 裂变大师
// const WeWorkGroupWelcomeCode = ['WeWorkGroupWelcomeCode'] // 群欢迎语
const SgPersonalQrcode = ['SgPersonalQrcode'] // 聚合二维码
const chatRoomGroup = ['chatRoomGroupAll', 'chatRoomGroup', 'chatRoomGroupAddOrEdit'] // 群聚合码
const WelcomeCodeList = ['WelcomeCodeList', 'WelcomeCodeEdit'] // 智能欢迎语
export default [...customCode, ...SgPersonalQrcode, ...chatRoomGroup, ...WelcomeCodeList] // 需要拦截的路由
