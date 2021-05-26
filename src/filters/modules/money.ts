import numeral from 'numeral'
export default function (value: number) {
  return value ? numeral(value).format('0,0.00') : '0.00'
}
