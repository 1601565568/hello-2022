const customCode = ['CustomerCode', 'CustomerCodeList', 'CustomerCodeEdit', 'CustomerCodeAnalysis'] // 一客一码
const WeWorkGroupWelcomeCode = ['WeWorkGroupWelcomeCode'] // 群欢迎语
const chatRoomGroup = ['chatRoomGroupAll', 'chatRoomGroup', 'chatRoomGroupAddOrEdit'] // 群聚合码
const WelcomeCodeList = ['WelcomeCodeList', 'WelcomeCodeEdit'] // 智能欢迎语
export default [...customCode, ...WeWorkGroupWelcomeCode, ...chatRoomGroup, ...WelcomeCodeList] // 需要拦截的路由
