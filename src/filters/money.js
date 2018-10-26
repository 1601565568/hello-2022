export default function (value) {
  if (!value) {
    return
  }
  let val = value.toFixed(2)
  return `${val}`
}
