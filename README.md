ECRP-SG-WEB
npm install numeral  //格式化数字
import numeral from 'numeral'
let num = 1000.578
var number = numeral(num)
var string = number.format('0,0.00')

item[i] = that.$numeral(item[i] / 10000).format('0,0.00')