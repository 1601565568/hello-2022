const getPostcssImportPath = require('./node_modules/@nascent/ecrp-ecrm/build/getPostcssImportPath.js')

module.exports = {
  plugins: {
    // autoprefixer: {}
    'postcss-import': {
      resolve: getPostcssImportPath
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
