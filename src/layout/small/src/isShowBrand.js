/**
 * 监听路由变化时，是否要显示企微选择
 * @param $route 当前路由对象
 * @returns {boolean}
 */
export default ($route) => {
  // 需显示区域选择的路由数组
  const showBrandSelectPathList = [
    '/Marketing/EnterpriseMessage',
    '/Social/WeComCustomerOperation/GroupRepeat',
    '/Social/WeWorkGroup/GroupWelcomeCode'
  ]

  return showBrandSelectPathList.indexOf($route.path) > -1
}
