/**
 * 监听路由变化时，是否要显示视角选择
 * @param $route 当前路由对象
 * @returns {boolean}
 */
export default ($route) => {
  // 部分路由无视角选择
  const path = $route.path
  if (path === '/Marketing/EnterpriseMessage' || path === '/Marketing/EnterpriseGroupMessage') {
    return true
  }
  return false
}
