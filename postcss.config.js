const path = require('path')

module.exports = {
  plugins: {
    // autoprefixer: {}
    'postcss-import': {
      resolve: importAddress => {
        /**
         * 处理pcss文件和css文件的路径别名转换
         *
         * @type {string} 传入参数为样式文件地址字符串
         *
         * 使用位置：
         *   1. .vue文件
         *   2. .pcss文件
         *   3. .css文件
         *
         * e.g
         * '@/style/small/variables.pcss'  =>  '项目绝对路径/src/style/small/variables.pcss'
         */
        const ALAIS = {
          '@': path.join(__dirname, 'src', importAddress.substr(1)), // 项目业务资源文件目录/src
          '~': path.join(__dirname, 'node_modules', importAddress.substr(1)) // 项目包目录/node_modules
        }
        return ALAIS[importAddress[0]] ? ALAIS[importAddress[0]] : importAddress
      }
    },
    'saladcss-bem': {
      'shortcuts': {
        'component': 'b',
        'modifier': 'm',
        'descendent': 'e'
      },
      'separators': {
        'descendent': '__',
        'modifier': '--'
      }
    },
    'postcss-nested': {},
    'postcss-cssnext': {}
  }
}
