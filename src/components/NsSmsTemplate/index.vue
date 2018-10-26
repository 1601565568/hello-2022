<template>
  <div class="tmp-signature">
    <div class="tmp-fieldset__tags" v-show="tags.length>0">
      <el-tooltip effect="light" placement="top"
                  v-for="(tag,index) in tags"
                  :key="index"
                  :content="'点击插入' + tag.name + '(默认长度' + tag.length + '个字符)'">
        <el-tag :disable-transitions="true" size="mini"
                @click.native="setTagWords(tag)">{{tag.name}}
        </el-tag>
      </el-tooltip>
    </div>
    <div class="form-textarea">
      <el-input type="textarea"
                ref="content"
                v-bind="$props"
                placeholder="请输入短信内容，限500字"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
                v-model="currentContent"></el-input>
    </div>
    <div class="tmp-signature__info">
      <i class="el-icon-info text-tips">
        您已录入 <b class="text-warning">{{signature.length + wordCount}}</b> 个字(含签名)，将被做为 <b class="text-warning">{{smsCount}}</b>
        条短信发送，每条按
        <b class="text-warning">{{smsOneLength}}</b> 字计价。
        <el-tooltip effect="light" placement="right"
                    :content="'拆分规则：超过 ' + singleSmsWordCount + ' 个字将视为长短信，按 ' + longSmsWordCount + ' 个字/条计费,含有占位符的短信字数统计有误差，请谨慎输入。'">
          <i class="el-icon-question text-tips"></i>
        </el-tooltip>
      </i>
      <p><i class="el-icon-info text-tips"> 内容含有网址请在后面添加空格。</i></p>
    </div>

  </div>
</template>
<script>
  /**
   * bus-signaturee
   * @desc 短信签名编辑模板
   * ______________Attributes_________________
   *
   * @param {Array}   tags                - 标签组对象，包含 nickname,name,msg,count
   * @param {String}  value               - 输入框内的值
   *
   * -----------------------------------------
   *
   * @example
   *
   * <bus-signature  v-model="form_data.SMSTemplate" :tags="form_related_data.smsPlaceholder">
   * </bus-signature>
   */

  var isIE = !(!document.all)
  export default {
    name: 'SmsTemplate',
    data () {
      return {
        startNum: 0,   // 光标开始位置(当选中文本时)
        endNum: 0,     // 光标结束位置(当选中文本时)
        wordCount: 0,   // 输入框内的字符数总和（包含占位符所需要的长度）
        smsCount: 1,    // 短信数
        isFirst: true,  // 第一次时，对光标位置进行赋值
        singleSmsWordCount: 70,
        smsOneLength: 70,
        longSmsWordCount: 67,
        isClickTag: false
      }
    },
    computed: {
      currentContent: {
        get () {
          return this.value || ''
        },
        set (value) {
          this.$emit('input', value)
        }
      }
    },
    watch: {
      'value' (val) {
        this.$emit('el.form.change', val)
      },
      currentContent: {
        immediate: true,
        handler: function (newVal, oldVal) {
          this.wordCount = this.setWordCount(newVal)
          if (this.isFirst) {
            this.endNum = this.startNum = newVal.length
            this.isFirst = false
          }
        },
        deep: true
      },
      wordCount (val) {
        this.calculateContentLen()
      },
      signature: function () {
        this.calculateContentLen()
      }
    },
    props: {
      // 标签组对象，包含 nickname,name,msg,count
      tags: {
        type: Array,
        default: function () {
          return []
        }
      },
      value: String,
      signature: {
        type: String,
        default () {
          return ''
        }
      },
      placeholder: '请输入短信内容，限500字'
    },
    methods: {
      calculateContentLen: function () {
        let contentLength = this.wordCount + this.signature.length
        if (contentLength > this.singleSmsWordCount) {
          this.smsCount = Math.ceil(contentLength / this.longSmsWordCount)
          this.smsOneLength = this.longSmsWordCount
        } else {
          this.smsOneLength = this.singleSmsWordCount
          this.smsCount = 1
        }
      },
      setTagWords (tag) {
        this.isClickTag = true
        this.currentContent = this.insertContent(this.currentContent, tag, this.startNum, this.endNum)
        this.$nextTick(() => {
          this.isClickTag = false
        })
        // 光标起始位置累加
        this.endNum = this.startNum += tag.placeholder.length
        this.$nextTick(() => {
          this.moveToCursor() // 重新定位光标
        })
      },
      // 查询短信分割信息
      querySmsSplitInfo: function () {
        let that = this
        this.$http.fetch(this.$api.core.common.getYsSmsSplitInfo)
          .then((resp) => {
            if (resp.result) {
              that.singleSmsWordCount = resp.result.singleSmsWordCount ? parseInt(resp.result.singleSmsWordCount) : 70
              that.longSmsWordCount = resp.result.longSmsWordCount ? parseInt(resp.result.longSmsWordCount) : 67
            }
          })
      },
      /**
       * 指定位置插入标签占位符字符串，当光标有选中一段字符时，会将直接将其替换
       * @param {str}       需要做插入的字符串
       * @param {insertStr} 需要插入的字符串
       * @param {start}     指定开始位置
       * @param {end}       指定结束位置
       * */
      insertContent (str, tag, start, end) {
        if (start !== end) {
          let prevStr = str.substring(0, start)
          let nextStr = str.substring(end, str.length)
          return prevStr + tag.placeholder + nextStr
        } else {
          let prevStr = str.substring(0, start)
          let nextStr = str.substring(start, str.length)
          return prevStr + tag.placeholder + nextStr
        }
      },
      /**
       * 获取当前（上一次）光标的位置
       * @参考 http://blog.csdn.net/chadcao/article/details/6575927
       * @TODO IE、火狐浏览器下未验证
       */
      getCurrentCursor () {
        let start = 0
        let end = 0
        let oTextarea = this.$refs.content.$el.children[0] // 获取textarea标签
        if (isIE) {
          // selection 当前激活选中区，即高亮文本块，和/或文当中用户可执行某些操作的其它元素。
          // createRange 从当前文本选中区中创建 TextRange 对象，
          // 或从控件选中区中创建 controlRange 集合。
          var sTextRange = document.selection.createRange()
          // 判断选中的是不是textarea对象
          if (sTextRange.parentElement() === oTextarea) {
            // 创建一个TextRange对象
            var oTextRange = document.body.createTextRange()
            // 移动文本范围以便范围的开始和结束位置能够完全包含给定元素的文本。
            oTextRange.moveToElementText(oTextarea)
            // 这里我们比较oTextRange和sTextRange的开头，的到选中区域的开头位置
            for (start = 0; oTextRange.compareEndPoints('StartToStart', sTextRange) < 0; start++) {
              oTextRange.moveStart('character', 1)
            }
            // 需要计算一下\n的数目(按字符移动的方式不计\n,所以这里加上)
            for (var i = 0; i <= start; i++) {
              if (oTextarea.value.charAt(i) === '\n') {
                start++
              }
            }
            // 再计算一次结束的位置
            oTextRange.moveToElementText(oTextarea)
            for (end = 0; oTextRange.compareEndPoints('StartToEnd', sTextRange) < 0; end++) {
              oTextRange.moveStart('character', 1)
            }
            for (var j = 0; j <= end; j++) {
              if (oTextarea.value.charAt(j) === '\n') {
                end++
              }
            }
          }
        } else {
          start = oTextarea.selectionStart
          end = oTextarea.selectionEnd
        }
        this.startNum = start
        this.endNum = end
      },
      /**
       * 跳转到上一次光标的位置
       * @参考 http://blog.csdn.net/chadcao/article/details/6575927
       * @TODO IE、火狐浏览器下未验证
       */
      moveToCursor () {
        let oTextarea = this.$refs.content.$el.children[0]
        let start = this.startNum
        let end = this.endNum
        if (isNaN(start) || isNaN(end)) {
          alert('位置输入错误')
        }
        if (isIE) {
          let oTextRange = oTextarea.createTextRange()
          let LStart = this.startNum
          let LEnd = this.endNum
          let start = 0
          let end = 0
          let value = oTextarea.value
          for (let i = 0; i < value.length && i < LStart; i++) {
            let c = value.charAt(i)
            if (c !== '\n') {
              start++
            }
          }
          for (let j = value.length - 1; j >= LEnd && j >= 0; j--) {
            let c = value.charAt(j)
            if (c !== '\n') {
              end++
            }
          }
          oTextRange.moveStart('character', start)
          oTextRange.moveEnd('character', -end)
          // oTextRange.collapse(true);
          oTextRange.select()
          oTextarea.focus()
        } else {
          oTextarea.select()
          oTextarea.selectionStart = this.startNum
          oTextarea.selectionEnd = this.endNum
        }
      },
      /**
       * 计算textarea内的文本字数，包含标签占位符指定的字符长度
       * @param {str} 指定字符串
       *
       */
      setWordCount (str) {
        let matchArr = []
        let sumCount = 0
        let resultCount = 0
        matchArr = this.currentContent.match(/{[^}]+}/g) // 筛选字符中{}，组成一个数组
        if (matchArr) {
          for (let i = 0; i < matchArr.length; i++) {
            this.tags.forEach(item => {
              if (matchArr[i] === item.placeholder) {
                sumCount += item.length    // 当与占位符匹配到时，长度累加其对应的数值
                str = str.replace(matchArr[i], '') // 将与其匹配的字符串替换成空
              }
            })
          }
          resultCount = sumCount + str.length // 占位符匹配到的字数和+字符串被替换掉的字符升序
        } else {
          resultCount = str.length // 当匹配不到任何占位符时，长度就是原字符串的长度
        }
        return resultCount
      },
      handleBlur (event) {
        this.getCurrentCursor()
        this.$emit('blur', event)
      },
      handleFocus (event) {
        this.$emit('focus', event)
      },
      handleInput (value) {
        this.getCurrentCursor()
        this.$emit('input', value)
      },
      handleChange (value) {
        this.getCurrentCursor()
        this.$emit('change', value)
      }
    },
    created: function () {
      this.querySmsSplitInfo()
    }
  }
</script>
<style scoped>
  @import "../../style/small/variables.pcss";
  .tmp-signature__tags .el-tag {
    cursor: pointer;
    margin-right: var(--default-margin-small);
  }

  .tmp-signature__tags .el-tag:hover {
    border-color: var(--theme-color-primary);
    color: var(--theme-color-primary);
  }

  .tmp-signature__info {
    padding: var(--default-padding-base) var(--default-padding-small) 0;
    line-height: 1.8;

  i {
    line-height: 1.6;
  }

  }
</style>
