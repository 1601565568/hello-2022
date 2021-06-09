<template>
  <div class="w-textarea" ref="wTextarea">
    <span
      :class="['w-textarea_tools__text', count.num < 0 ? '__danger' : '']"
      v-if="maxlength"
    >
      {{ count.text }}
    </span>
    <div class="w-textarea_tools__emoji" v-if="showEmoji">
      <el-popover width="447" trigger="hover">
        <i slot="reference"><Icon type="icon-smilebeifen-2" class="emoji-icon"/></i>
        <!-- 可通过 emojiList 传入自定义的图标列表 -->
        <emotion @emotion="addEmotion" :height="200" ref="emotion" />
      </el-popover>
    </div>
    <div class="w-textarea_tools__emoji emoji-text" v-if="showTextEmoji">
      <el-popover trigger="hover">
        <i slot="reference"><Icon type="icon-smilebeifen-3" class="emoji-icon"/></i>
        <!-- 可通过 emojiList 传入自定义的图标列表 -->
        <VEmojiPicker :pack="pack" @select="selectEmoji" />
      </el-popover>
    </div>
    <div class="w-textarea_tools" v-if="tools.length > 0">
      <div class="w-textarea_tools_left">
        <el-tooltip
          v-for="item in tools"
          effect="dark"
          :key="item.id"
          :content="item.title || item.text"
          placement="top"
        >
          <span class="w-textarea_tools__item" @click="openTagDialog(item)"
            ><Icon
              v-if="item.icon"
              class="w-textarea_tools__icon"
              :type="item.icon"
            />
            <img
              v-if="item.img"
              class="w-textarea_tools__img"
              :src="item.img"
            />
            {{ item.text }}</span
          ></el-tooltip
        >
      </div>
      <div><slot name="w-textarea_tools_right"></slot></div>
    </div>
    <div
      :class="`w-textarea_input ${className} ${disabled ? 'disabled' : ''}`"
      :contenteditable='contenteditable'
      :ref="className"
      :id="contentId"
      @blur="handleBlur()"
      @keydown.delete="handleDelete($event)"
      @input="handleInput($event.target)"
    ></div>
  </div>
</template>

<script>
import Emotion from '@nascent/ecrp-ecrm/src/components/Emotion/index'
import VEmojiPicker from 'v-emoji-picker'
import packData from 'v-emoji-picker/data/emojis.json'
export default {
  name: 'wTextarea',
  data () {
    return {
      // 记录currentText以计算长度
      currentText: this.value,
      // 为input区域生成随机id，当在页面上有多个组件时，用于监听光标的变化
      contentId: `content${this.getGuid()}`,
      // 输入的时候锁定，禁止更新innerHTML
      isLocked: false,
      // 记录当前选中tag的ID
      currentTagId: null,
      // 当前光标位置
      savedRange: {},
      endOffset: -1,
      endDon: null,
      isFrist: true,
      pack: packData.data
    }
  },
  components: { Emotion, VEmojiPicker },
  props: {
    className: {
      type: String,
      default: 'w-textarea__input'
    },
    value: {
      type: String,
      default: ''
    },
    showEmoji: {
      type: Boolean,
      default: true
    },
    showTextEmoji: {
      type: Boolean,
      default: true
    },
    tag: {
      // 自定义模版标签的标签名
      type: String,
      // 默认使用wise作为标签名，并添加了默认样式
      // 当使用其他标签名的时候，需要另写标签样式
      default: 'wise'
    },
    tools: {
      // 自定义扩展功能：超链接'link'，模版标签'tag' 自定义类型'custom'：需传入自定义的回调函数
      type: Array,
      default () {
        return []
      }
    },
    placeholder: {
      type: String
    },
    maxlength: {
      // 最大输入长度
      type: [String, Number],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    emojiClass: {
      default: 'EMOJI_'
    }
  },
  computed: {
    count () {
      // 字符长度记数
      let num = this.maxlength - this.currentText.length
      let text =
        num < 0
          ? `已超出${Math.abs(num)}个字符`
          : `${this.currentText.length}/${this.maxlength}`
      this.$emit('inputLength', this.currentText.length)
      return { num, text }
    },
    contenteditable () {
      const userAgent = navigator.userAgent
      // 火狐只支持true 不支持 plaintext-only
      if (userAgent.indexOf('Firefox') > -1) {
        return !this.disabled
      }
      return this.disabled ? false : 'plaintext-only'
    }
  },
  mounted () {
    // 初始化数据
    // this.currentText && (this.$refs.wTextareaContent.innerHTML = this.currentText)
    // 创建模版标签的style
    this.createStyle()
    // 每次光标变化的时候，保存 range
    document.addEventListener('selectionchange', this.selectHandler)
    setTimeout(() => {
      const dom = document.getElementsByClassName(this.className)[0]
      this.currentText = dom.innerText
    }, 1000)
    this.$refs[this.className].innerHTML = this.value
  },
  beforeDestroy () {
    // 卸载事件
    document.removeEventListener('selectionchange', this.selectHandler)
  },
  methods: {
    addEmotion: function (val) {
      // 创建模版标签
      let node = document.createElement(this.tag)
      node.innerText = val
      // 添加id便于删除
      node.id = this.getGuid()
      node.setAttribute('contenteditable', false)
      node.className = this.emojiClass + val
      this.addNode(node)
    },
    selectEmoji (val) {
      const extNode = document.createTextNode(val.emoji)
      this.insertNode(extNode)
    },
    updateData (text) {
      this.$emit('input', text)
    },
    createStyle () {
      // 为自定义的模版标签添加样式，使之不可编辑
      let style = document.createElement('style')
      style.innerHTML = `.w-textarea ${this.tag} {
        cursor: default;
        -webkit-user-modify: read-only !important;
      }
      `
      this.$refs.wTextarea.appendChild(style)
    },
    closeModal () {
      this.form.text = ''
      this.showModal = false
    },
    openTagDialog (item) {
      // 将事件抛给父组件处理
      // 处理后需要调用 addTag() 或者 addLink() 将内容传回来
      // this.$emit('add', item)
      // // 处理后需要调用 addTag()、addLink() 或 addText() 将内容传回来
      // if (item.type === 'custom') {
      //   // 会调用传入的回调函数字段 callback
      //   item.callback(item)
      // } else if (item.type === 'link') {
      //   this.addLink(item.text, item.url)
      // } else {
      //   this.addTag(item)
      // }

      this.addTag(item)
    },
    addTag (item) {
      // 创建模版标签
      let node = document.createElement(this.tag)
      node.innerText = item.value
      node.setAttribute('contenteditable', false)
      // 添加id便于删除
      node.id = this.getGuid()
      node.className = item.id
      this.insertNode(node)
    },
    addLink (text, url) {
      // 创建a标签
      let node = document.createElement('a')
      node.innerText = text
      node.href = url
      node.target = 'blank'
      this.insertNode(node)
    },
    /**
     * 向输入框中插入纯文本
     */
    addText (text) {
      let node = document.createElement('text')
      node.innerText = text
      this.insertNode(node)
    },
    insertNode (node) {
      // 判断是否第一次点击
      if (!this.savedRange.deleteContents) {
        const dom = document.getElementsByClassName(`${this.className}`)[0]
        dom.focus()
        setTimeout(() => {
          this.addNode(node)
        }, 100)
      } else {
        this.addNode(node)
      }
    },
    addNode (node) {
      // 在内容中插入标签
      // 删掉选中的内容（如有）
      // this.savedRange.deleteContents()
      // 插入链接
      // for (var s in this.endDon) {
      //   console.log(s, this.endDon[s])
      // }
      // this.savedRange.setStart(this.endDon, this.endOffset)
      // console.log(this.savedRange)
      if (this.disabled) {
        return false
      }
      this.savedRange.insertNode(node)
      this.endDon = node
      this.endOffset = this.savedRange.endOffset
      // 更新双向绑定数据
      if (this.endDon.style) {
        this.savedRange.setStartAfter(this.endDon)
      } else {
        this.savedRange.setStartAfter(this.endDon)
        // this.savedRange.setStart(this.endDon, this.endOffset)
      }
      let target = this.$refs[this.className]
      this.updateData(target.innerHTML)
      this.currentText = target.innerText
    },
    handleInput (target) {
      // 即时更新数据
      this.updateData(target.innerHTML)
      this.currentText = target.innerText
    },
    handleDelete (e) {
      // 监听“删除”事件
      if (this.currentTagId) {
        // 若已选中模版标签，直接删除dom节点
        let t = document.getElementById(this.currentTagId)
        this.$refs[this.className].removeChild(t)
        this.currentTagId = null
        // 阻止浏览器默认的删除事件，并手动更新数据
        e.preventDefault()
        this.handleInput(e.target)
      }
    },
    handleBlur () {
      this.isLocked = false
      this.$emit('handleBlur')
    },
    // inputClick (e) {
    //   // 监听点击事件
    //   this.isLocked = true
    //   const TAG_NAME = e.target.nodeName
    //   if (TAG_NAME === this.tag.toUpperCase()) {
    //     // 点击模版标签时，记录id
    //     this.currentTagId = e.target.id
    //     e.target.className = 'active'
    //   } else if (this.currentTagId) {
    //     // 清空active样式
    //     let target = document.getElementById(this.currentTagId)
    //     target.className = ''
    //     this.currentTagId = null
    //   } else {
    //     this.currentTagId = null
    //   }
    // },
    getGuid () {
      // 生成随机ID
      return `r${new Date().getTime()}d${Math.ceil(Math.random() * 1000)}`
    },
    selectHandler () {
      // 监听选定文本的变动
      let sel = window.getSelection()
      let range = sel.rangeCount > 0 ? sel.getRangeAt(0) : null
      // console.log(111, range)
      if (
        range &&
        range.commonAncestorContainer.ownerDocument.activeElement.id ===
          this.contentId
      ) {
        this.savedRange = range.cloneRange()
        this.endOffset = this.savedRange.endOffset
        if (this.savedRange.endContainer.nodeName !== 'DIV') {
          this.endDon = this.savedRange.endContainer
        }
      }
    },
    /**
     * 替换标签成模板
     * hasBracket 是否带括号 默认true
     */
    htmlToString (html, hasBracket = true) {
      const pre = hasBracket ? '{' : ''
      const after = hasBracket ? '}' : ''
      return html.replace(/<wise.*?\bclass="/g, pre).replace(/">.*?<\/wise>/g, after).replace(/<(div|br|p).*?>/g, '\n').replace(/<(span|b).*?>/g, '').replace(/<\/(div|br|p)>/g, '').replace(/<\/(span|b)>/g, '')
    },
    /**
     * 替换模板成标签
     * hasBracket 是否带括号 默认true
     */
    stringTohtml (string, hasBracket = true) {
      const pre = hasBracket ? '{' : ''
      const after = hasBracket ? '}' : ''
      if (this.$refs.emotion) {
        this.$refs.emotion.emojiList.map(item => {
          const regexp = new RegExp(
            pre + this.emojiClass + '\\[' + item + '\\]' + after,
            'g'
          )
          string = string.replace(
            regexp,
            `<wise id="${this.getGuid()}" class="${
              this.emojiClass
            }[${item}]">${`[${item}]`}</wise>`
          )
        })
      }
      this.tools.map(item => {
        const regexp = new RegExp(pre + item.id + after, 'g')
        string = string.replace(
          regexp,
          `<wise id="${this.getGuid()}" class="${item.id}">${item.value}</wise>`
        )
      })
      return string.replace(/\n/g, '<br/>')
    },
    // 替换模板成文字
    stringTotext (string) {
      this.tools.map(item => {
        const regexp = new RegExp('{' + item.id + '}', 'g')
        string = string
          .replace(regexp, '{' + item.value + '}')
          .replace(/\n/g, ' <br /> ')
      })
      if (this.$refs.emotion) {
        this.$refs.emotion.emojiList.map(item => {
          const regexp = new RegExp(
            '{' + this.emojiClass + '\\[' + item + '\\]}',
            'g'
          )
          string = string.replace(regexp, `[${item}]`)
        })
      }
      return string
    },
    // 替换标签成文字
    htmlToText (html) {
      return html.replace(/<wise.*?\bclass=".*?">/g, '{').replace(/<\/wise>/g, '}').replace(/<(div|br|p).*?>/g, '\n').replace(/<(span|b).*?>/g, '').replace(/<\/(div|br|p)>/g, '').replace(/<\/(span|b)>/g, '')
    }
  },
  watch: {
    value (val) {
      // 非锁定状态下，实时更新innerHTML
      // if (!this.isLocked) {
      //   // this.$refs.wTextareaContent.innerHTML = val
      // }
      // this.$refs.wTextareaContent.innerHTML = val
      if (this.disabled) {
        this.$refs[this.className].innerHTML = val
      }
    }
  }
}
</script>

<style lang="scss">
// 给标签默认样式，不可scoped
.w-textarea {
  wise {
    color: #26a2ff;
    padding: 0 1px;
    white-space: nowrap;
    cursor: default;
    -webkit-user-modify: read-only !important;
  }

  .active {
    background: #dcdfe6;
  }
}
</style>

<style lang="scss" scoped>
$borderColor: #d9d9d9;
$bgColor: #f5f5f5;
$textColor: #595959;

.w-textarea {
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid $borderColor;
  margin-bottom: 15px;
  overflow: hidden;
  position: relative;

  &_input {
    width: 100%;
    min-height: 100px;
    box-sizing: border-box;
    padding: 10px;
    padding-bottom: 32px;
    line-height: 1.5;
    word-break: break-word;
    // 允许编辑，禁止富文本
    // -webkit-user-modify: read-write-plaintext-only !important;
    // -moz-user-modify: read-write;
    &.disabled {
      -webkit-user-modify: read-only !important;
    }
    &:focus {
      outline: none;
    }
  }

  &_tools {
    padding: 8px;
    display: flex;
    justify-content: space-between;
    background-color: $bgColor;
    color: $textColor;
    font-size: 12px;
    overflow: hidden;
    &_left {
      flex: 1;
    }
    &_right {
      width: 30%;
    }
    &__item {
      float: left;
      line-height: 1;
      padding: 2px 8px;
      margin-right: 8px;
      margin-bottom: 5px;
      color: $textColor;
      cursor: pointer;
      border-radius: 18px;
      border: none;
      line-height: 20px;
      background: #fff;
      transition: all 0.3s;
      display: flex;
      align-items: center;
    }
    &__icon {
      font-size: 16px;
      color: #8c8c8c;
      border-radius: 50%;
      margin-right: 4px;
    }
    &__img {
      width: 16px;
      height: 16px;
      margin-right: 4px;
      image-rendering: -moz-crisp-edges;
      image-rendering: -o-crisp-edges;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
      -ms-interpolation-mode: nearest-neighbor;
    }
    &__emoji {
      position: absolute;
      bottom: 0;
      left: 12px;
      &.emoji-text {
        left: 42px;
      }
    }
    &__text {
      display: inline-block;
      line-height: 40px;
      padding: 0 8px;
      float: right;
      color: $textColor;
      cursor: default;
      transition: all 0.3s;
      position: absolute;
      bottom: 0;
      right: 12px;
      color: #c0c4cc;
      &:hover {
        opacity: 1;
      }

      &.__danger {
        color: red;
      }
    }
  }
}
.emoji-icon {
  font-size: 20px;
  color: #0091FA;
}
</style>
