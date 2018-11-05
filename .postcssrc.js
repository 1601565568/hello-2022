// https://github.com/michael-ciniawsky/postcss-load-config
module.exports = {
  'plugins': {
    'postcss-import': {},
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
