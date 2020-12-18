const customCode = ['CustomerCode', 'CustomerCodeList', 'CustomerCodeEdit', 'CustomerCodeAnalysis'] // 一客一码
// const WeWorkGroupWelcomeCode = ['WeWorkGroupWelcomeCode'] // 群欢迎语
const SgPersonalQrcode = ['SgPersonalQrcode'] // 聚合二维码
const chatRoomGroup = ['chatRoomGroupAll', 'chatRoomGroup', 'chatRoomGroupAddOrEdit'] // 群聚合码
const WelcomeCodeList = ['WelcomeCodeList', 'WelcomeCodeEdit'] // 智能欢迎语
export default [...customCode, ...SgPersonalQrcode, ...chatRoomGroup, ...WelcomeCodeList] // 需要拦截的路由
