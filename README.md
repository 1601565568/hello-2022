ECRP-SG-WEB
npm install numeral  //格式化数字
import numeral from 'numeral'
let num = 1000.578
var number = numeral(num)
var string = number.format('0,0.00')
console.log(string)  1,000.58