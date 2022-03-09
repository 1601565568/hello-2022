<template>
  <div  :class="[fuscous==='QA'?fuscousQA:fuscousIcon]" ref="wTextarea">
    <!-- 标签列表 start -->
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
    <!-- 标签列表 end -->
    <!-- 内容输入区域 start -->
    <div
      :class="`w-textarea_input ${className} ${disabled ? 'disabled' : ''}`"
      :contenteditable='contenteditable'
      :placeholder="placeholder"
      :ref="className"
      :id="contentId"
      @blur="handleBlur()"
      @focus="handleFouce"
      @keydown='handleDown($event)'
      @keydown.delete="handleDelete($event)"
      @input="handleInput($event.target)"
    ></div>
    <!-- 内容输入区域 end -->
    <!-- 字数限制 start -->
    <!-- 字体表情 end -->
   <div class="v_footer">
      <span
        :class="['w-textarea_tools__text', count.num < 0 ? '__danger' : '']"
        v-if="maxlength"
      >
        {{ count.text }}
      </span>
      <!-- 字数限制 end -->
      <!-- 图片表情 start -->
      <div class="w-textarea_tools__emoji" v-if="showEmoji">
        <el-popover width="447" trigger="hover">
          <i slot="reference"><Icon type="icon-smilebeifen-2" class="emoji-icon" :class="[fuscous!=='QA' ? 'colorNormal' : 'colorQA']" /></i>
          <!-- 可通过 emojiList 传入自定义的图标列表 -->
          <emotion @emotion="addEmotion" :height="200" ref="emotion" />
        </el-popover>
      </div>
      <!-- 图片表情 end -->
      <!-- 字体表情 start -->
      <div class="w-textarea_tools__emoji emoji-text" v-if="showTextEmoji">
        <el-popover trigger="hover">
          <i slot="reference"><Icon type="icon-smilebeifen-3" class="emoji-icon" :class="[fuscous!=='QA' ? 'colorNormal' : 'colorQA']" /></i>
          <!-- 可通过 emojiList 传入自定义的图标列表 -->
          <VEmojiPicker :pack="pack" @select="selectEmoji" />
        </el-popover>
      </div>
      <span class="show-default-text" v-if="isShowDefault" @click="showDefaultText">恢复默认欢迎语</span>
    </div>
  </div>
</template>
<script>
import Emotion from '@nascent/ecrp-ecrm/src/components/Emotion/index'
import VEmojiPicker from 'v-emoji-picker'
import packData from 'v-emoji-picker/data/emojis.json'
export const toolFn = {

  getEmijoList () {
    return ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '囧', '抓狂', '吐', '偷笑', '愉快', '白眼', '傲慢', '困', '惊恐', '流汗', '憨笑', '悠闲', '奋斗', '咒骂', '疑问', '嘘', '晕', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '可怜', '菜刀', '西瓜', '啤酒', '咖啡', '猪头', '玫瑰', '凋谢', '嘴唇', '爱心', '心碎', '蛋糕', '炸弹', '便便', '月亮', '太阳', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', 'OK', '跳跳', '发抖', '怄火', '转圈', '笑脸', '生病', '破涕为笑', '吐舌', '脸红', '恐惧', '失望', '无语', '嘿哈', '捂脸', '奸笑', '机智', '皱眉', '耶', '吃瓜', '加油', '汗', '天啊', 'Emm', '社会社会', '旺柴', '好的', '打脸', '加油加油', '哇', '翻白眼', '666', '让我看看', '叹气', '苦涩', '裂开', '鬼魂', '合十', '强壮', '庆祝', '礼物', '红包', '發', 'Blessing']
  },
  // 生成随机ID
  getGuid () {
    return `r${new Date().getTime()}d${Math.ceil(Math.random() * 1000)}`
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
  // 替换标签成文字
  htmlToText (html) {
    return html.replace(/<wise.*?\bclass=".*?">/g, '{').replace(/<\/wise>/g, '}').replace(/<(div|br|p).*?>/g, '\n').replace(/<(span|b).*?>/g, '').replace(/<\/(div|br|p)>/g, '').replace(/<\/(span|b)>/g, '')
  },
  /**
   * 替换模板成标签
   * hasBracket 是否带括号 默认true
   * replaceData @param {tools,emojiClass,showEmoji} 如果不传取上下文中的对应值
   */
  stringTohtml (string, hasBracket = true, replaceData) {
    const pre = hasBracket ? '{' : ''
    const after = hasBracket ? '}' : ''
    let { tools = [], emojiClass = 'EMOJI_', showEmoji = true } = this
    if (Object.prototype.toString.call(replaceData) === '[object Object]') {
      tools = replaceData.tools || tools
      emojiClass = replaceData.emojiClass || emojiClass
      showEmoji = replaceData.showEmoji || showEmoji
    }
    if (showEmoji) {
      toolFn.getEmijoList().map(item => {
        const regexp = new RegExp(
          pre + emojiClass + '\\[' + item + '\\]' + after,
          'g'
        )
        string = string.replace(
          regexp,
          `<wise id="${toolFn.getGuid()}" class="${
            emojiClass
          }[${item}]">${`[${item}]`}</wise>`
        )
      })
    }
    tools.map(item => {
      const regexp = new RegExp(pre + item.id + after, 'g')
      string = string.replace(
        regexp,
        `<wise id="${toolFn.getGuid()}" class="${item.id}">${item.value}</wise>`
      )
    })
    return string.replace(/\n/g, '<br/>')
  },
  /**
   * 替换模板成文字
   * replaceData @param {tools,emojiClass,showEmoji} 如果不传取上下文中的对应值
   */
  stringTotext (string, replaceData) {
    let { tools = [], emojiClass = 'EMOJI_', showEmoji = true } = this
    if (Object.prototype.toString.call(replaceData) === '[object Object]') {
      tools = replaceData.tools || tools
      emojiClass = replaceData.emojiClass || emojiClass
      showEmoji = replaceData.showEmoji || showEmoji
    }
    tools.map(item => {
      const regexp = new RegExp('{' + item.id + '}', 'g')
      string = string
        .replace(regexp, '{' + item.value + '}')
        .replace(/\n/g, ' <br /> ')
    })
    if (showEmoji) {
      toolFn.getEmijoList().map(item => {
        const regexp = new RegExp(
          '{' + this.emojiClass + '\\[' + item + '\\]}',
          'g'
        )
        string = string.replace(regexp, `[${item}]`)
      })
    }
    return string
  }
}
export default {
  name: 'wTextarea',
  data () {
    return {
      fuscous: process.env.VUE_APP_THEME,
      fuscousQA: 'w-textareaQA',
      fuscousIcon: 'w-textarea',
      colorQA: 'colorQA',
      colorNormal: 'colorNormal',
      // 记录currentText以计算长度
      currentText: this.value,
      // 为input区域生成随机id，当在页面上有多个组件时，用于监听光标的变化
      contentId: `content${this.getGuid()}`,
      // 输入的时候锁定，禁止更新innerHTML
      isLocked: false,
      // 记录当前选中tag的ID
      currentTagId: null,
      // 输入框对象
      savedRange: {},
      // 当前光标位置
      endOffset: -1,
      // 光标元素
      endDon: null,
      // 字符表情插件的数据
      pack: packData.data
    }
  },
  components: { Emotion, VEmojiPicker },
  props: {
    // 是否禁用回车键
    disabledEnter: {
      type: Boolean,
      default: false
    },
    // 输入框类名 如页面由多个组件必传
    className: {
      type: String,
      default: 'w-textarea__input'
    },
    isShow: {
      type: Boolean,
      default: false
    },
    // 输入框值
    value: {
      type: String,
      default: ''
    },
    // 默认展示图片表情
    showEmoji: {
      type: Boolean,
      default: false
    },
    // 默认展示字体表情
    showTextEmoji: {
      type: Boolean,
      default: false
    },
    tag: {
      // 自定义模版标签的标签名
      type: String,
      default: 'wise'
    },
    // 输入框上方表情
    tools: {
      type: Array,
      default () {
        return []
      }
    },
    // 原始属性 placeholder
    placeholder: {
      type: String
    },
    // 最大长度
    maxlength: {
      // 最大输入长度
      type: [String, Number],
      default: ''
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 图片表情占位符前缀，h5端如果是微信自己发送的需要传""
    emojiClass: {
      default: 'EMOJI_'
    },
    isShowDefault: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    count () {
      // 字符长度记数
      let currentTextLength = this.currentText.length
      if (this.$refs[this.className] && this.$refs[this.className].innerHTML && this.$refs[this.className] && this.$refs[this.className].innerHTML === '<br>') {
        currentTextLength -= 1
      }
      let num = this.maxlength - currentTextLength
      let text =
        num < 0
          ? `已超出${Math.abs(num)}个字符`
          : `${currentTextLength}/${this.maxlength}`
      this.$emit('inputLength', currentTextLength)
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
    showDefaultText () {
      this.$emit('showDefaultText')
    },
    // 添加图片表情
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
    // 添加字体表情
    selectEmoji (val) {
      this.addText(val.emoji)
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
    openTagDialog (item) {
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
      const extNode = document.createTextNode(text)
      this.insertNode(extNode)
    },
    insertNode (node) {
      this.isLocked = true
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
      // 添加内容
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
    handleFouce () {
      this.isLocked = true
    },
    handleDown (e) {
      if (e.keyCode === 13 && this.disabledEnter) {
        e.preventDefault()
      }
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
      this.$emit('handleBlur')
    },
    getGuid () {
      // 生成随机ID
      return `r${new Date().getTime()}d${Math.ceil(Math.random() * 1000)}`
    },
    selectHandler () {
      // 监听选定文本的变动
      let sel = window.getSelection()
      let range = sel.rangeCount > 0 ? sel.getRangeAt(0) : null
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
      return toolFn.htmlToString.call(this, html, hasBracket)
    },
    /**
     * 替换模板成标签
     * hasBracket 是否带括号 默认true
     */
    stringTohtml (string, hasBracket = true) {
      return toolFn.stringTohtml.call(this, string, hasBracket)
    },
    // 替换模板成文字
    stringTotext (string) {
      return toolFn.stringTotext.call(this, string)
    },
    // 替换标签成文字
    htmlToText (html) {
      return toolFn.htmlToText.call(this, html)
    }
  },
  watch: {
    value (val) {
      if (!this.isLocked) {
        this.$refs[this.className].innerHTML = val
      }
    },
    isShow: {
      handler (val) {
        if (val) {
          this.createStyle()
          // 每次光标变化的时候，保存 range
          document.addEventListener('selectionchange', this.selectHandler)
          setTimeout(() => {
            const dom = document.getElementsByClassName(this.className)[0]
            this.currentText = dom.innerText
          }, 1000)
          this.$refs[this.className].innerHTML = this.value
        }
      },
      deep: true
    }
  }
}

</script>

<style lang="scss">
// 给标签默认样式，不可scoped
.w-textarea, .w-textareaQA {
  wise {

    padding: 0 1px;
    white-space: nowrap;
    cursor: default;
    -webkit-user-modify: read-only !important;
  }

  .active {
    background: #dcdfe6;
  }
}
.w-textarea {
  wise{
    color: #26a2ff;
  }
}
.w-textareaQA{
  wise {
    color: #2153D4;
  }
}
.colorQA {
  color: #2153D4;
}
.colorNormal {
  color: #26a2ff;
}
</style>

<style lang="scss" scoped>
$borderColor: #d9d9d9;
$bgColor: #f5f5f5;
$textColor: #595959;
.w-textarea, .w-textareaQA {
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
    // padding-bottom: 32px;
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
      // position: absolute;
      // bottom: 0;
      // left: 12px;
      display: inline-block;
      margin-left: 12px;
      &.emoji-text {
        margin-left: 12px;
      }
    }
    &__text {
      display: inline-block;
      padding: 0 8px;
      float: right;
      color: $textColor;
      cursor: default;
      transition: all 0.3s;
      color: #c0c4cc;
      &:hover {
        opacity: 1;
      }

      &.__danger {
        color: red;
      }
    }
     &__default {
      display: inline-block;
      padding: 0 8px;
      float: left;
      color: $textColor;
      cursor: default;
      transition: all 0.3s;
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
}
.w-textarea_input:empty:before{
  content: attr(placeholder);
  color: #BFBFBF;
  font-size: 14px;
}
.w-textarea_input:focus:before{
  content:none;
}
.v_footer{
  height: 20px;
  line-height: 20px;
  margin-bottom: 8px;
  position: relative;
}
.show-default-text {
  font-size: 14px;
  color: #0392FB;
  position: absolute;
  left: 80px;
  cursor: pointer;
}
</style>
