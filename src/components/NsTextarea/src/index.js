import emitter from '@nascent/nui/src/mixins/emitter'

export default {
  name: 'NsTextarea',
  componentName: 'NsTextarea',
  mixins: [emitter],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: String,
    height: {
      type: Number,
      default: 120
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    // 最大可输入长度
    maxlength: {
      type: Number,
      default: 0
    },
    // 是否限制限制数量
    showWordLimit: {
      type: Boolean,
      default: false
    },
    // 替换规则{ key, value }
    replaceOptions: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      innerValue: this.value,
      writable: true,
      regStr: /([^{}]+)|([{}])/g
    }
  },
  watch: {
    value (newValue) {
      if (this.maxlength && this.getLength(newValue)) {
        newValue = this.innerValue
        this.$emit('input', newValue)
        return
      }
      if (this.innerValue !== newValue) {
        this.innerValue = newValue
        this.setTextareaValue()
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.change', [newValue])
        }
      }
    }
  },
  computed: {},
  created () {
    this.setTextareaValue()
  },
  mounted () {
    // 注册事件
    this.addEvent()
  },
  beforeDestroy () {
    // 移除事件
    this.removeEvent()
  },
  methods: {
    getDom () {
      return this.$refs.textarea
    },
    // 绑定事件
    addEvent () {
      let doc = this.getDom()
      this.bindEvent(doc, 'keyup', this.handleKeyup)
      this.bindEvent(doc, 'blur', this.blur)
    },
    // 移除事件
    removeEvent () {
      let doc = this.getDom()
      this.unBindEvent(doc, 'keyup', this.handleKeyup)
      this.unBindEvent(doc, 'blur', this.blur)
    },
    getLength (val = this.innerValue) {
      return (val.replace(/\n/g, '')).length
    },
    handleKeyup (e) {
      let html = this.getDom().innerHTML
      let value = this.formatHtml(e.keyCode === 8 && html === '<br>' ? '' : html)
      if (this.maxlength && this.getLength(value) > this.maxlength) {
        this.setTextareaValue(this.innerValue)
        return
      }
      this.innerValue = value
      this.$emit('input', value)
    },
    // 输入框内容格式化
    formatHtml (html) {
      if (this.replaceOptions.length) {
        html = html.replace(/<span contenteditable="false" class="ns-textarea__tag".*?>(.*?)<\/span>/g, (str, val) => {
          let opt = this.replaceOptions.find(o => o.label === val)
          return opt ? `{${opt.key}}` : str
        })
      }
      // 换行标签替换
      html = html.replace(/<br.*?\/?>/g, '\n')
      // 去除span标签
      html = html.replace(/<span.*?>/g, '').replace(/<\/span>/g, '')
      // 去除div标签
      html = html.replace(/<div.*?>(\s|.*?)<\/div>/g, (str, val) => {
        return `${val === '\n' ? '' : '\n'}${val}`
      })
      // 转义符替换
      html = html.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      return html
    },
    // 输入框内容设置
    setTextareaValue () {
      this.$nextTick(() => {
        let dom = this.getDom()
        let splitArr = this.innerValue.match(this.regStr) || []
        let prefixTag = false
        let tempArr = []
        splitArr.forEach((str, index) => {
          let opt = null
          if (index > 0 && splitArr[index - 1] === '{' && splitArr[index + 1] === '}') {
            opt = this.replaceOptions.find(o => o.key === str)
          }
          if (opt) {
            prefixTag = true
            tempArr[index - 1] = ''
            tempArr[index] = this.createItemEl(opt.label, 'tag')
          } else {
            tempArr[index] = this.createItemEl(prefixTag ? '' : str)
            prefixTag = false
          }
        })
        let container = this.createItemEl('')
        tempArr.forEach(el => {
          el && container.appendChild(el)
        })
        dom.innerHTML = ''
        dom.appendChild(container)
        this.focus()
      })
    },
    createItemEl (text, type = 'text') {
      let span = document.createElement('span')
      span.contentEditable = type === 'text'
      span.className = type === 'text' ? '' : 'ns-textarea__tag'
      span.innerHTML = text
      return span
    },
    bindEvent (element, type, callback) {
      if (element.addEventListener) {
        if (type.slice(0, 2) === 'on') {
          type = type.slice(2)
        }
        element.addEventListener(type, callback)
      } else {
        if (type.slice(0, 2) !== 'on') {
          type = `on${type}`
        }
        element.attachEvent(type, callback)
      }
    },
    unBindEvent (element, type, callback) {
      if (element.removeEventListener) {
        if (type.slice(0, 2) === 'on') {
          type = type.slice(2)
        }
        element.removeEventListener(type, callback)
      } else {
        if (type.slice(0, 2) !== 'on') {
          type = `on${type}`
        }
        element.detachEvent(type, callback)
      }
    },
    // 聚焦
    focus () {
      let el = this.getDom()
      if (window.getSelection) {
        el.focus()
        let range = window.getSelection()
        range.selectAllChildren(el)
        range.collapseToEnd()
      } else if (document.selection) {
        let range = document.selection.createRange()
        range.moveToElementText(el)
        range.collapse(false)
        range.select()
      }
    },
    // 失焦
    blur () {
      this.getDom().blur()
      // this.$emit('blur', this.innerValue)
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.blur', [this.innerValue])
      }
    }
  }
}
