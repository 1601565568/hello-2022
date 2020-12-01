const customCode = ['CustomerCode', 'CustomerCodeList', 'CustomerCodeEdit', 'CustomerCodeAnalysis'] // 一客一码
const WeWorkGroupWelcomeCode = ['WeWorkGroupWelcomeCode'] // 群欢迎语
const chatRoomGroup = ['chatRoomGroupAll', 'chatRoomGroup', 'chatRoomGroupAddOrEdit'] // 群聚合码
export default [...customCode, ...WeWorkGroupWelcomeCode, ...chatRoomGroup] // 需要拦截的路由
