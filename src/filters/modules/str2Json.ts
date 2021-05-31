export default function (value: string): { [key: string]: any } {
  if (typeof value === 'string') {
    return JSON.parse(value)
  } else {
    return value
  }
}
