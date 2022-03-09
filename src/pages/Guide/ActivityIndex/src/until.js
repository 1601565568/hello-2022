export const commissionTypeText = (type) => {
  let typeText = '-'
  if (type === 0) {
    typeText = '专属导购提成'
  } else if (type === 1) {
    typeText = '成单导购提成'
  }
  return typeText
}
