<template>
  <div>
    <ElDialog
      width="600px"
      title="文字"
      :visible.sync="dialogVisibleText"
      :before-close="close"
      :show-scroll-x=false>
      <!-- 文字弹框 start -->
      <div>
        <ElForm :rules="rules" ref="searchform" :model="model"  :inline="true">
          <el-form-item  label-width="0px" prop="content">
            <!--  表情包引入,input添加相关事件@input @blur @change ref="content" -->
            <ElInput
              type="textarea"
              :rows="4"
              maxlength='100'
              style="width:580px"
              @blur="handleBlur"
              @change="handleChange"
              clearable
              placeholder='请输入内容，长度在100个字符以内'
              ref="content"
              v-model="model.content"
              show-word-limit/><!-- @input="handleInput" -->
          </el-form-item>
          <ElFormItem>
            <!-- 表情包引入前端 开始-->
            <ElFormGrid>
              <div class="emoji-content" style="padding:0">
                <el-popover
                  width="447"
                  trigger="hover">
                  <i slot="reference" class="emoji-icon"><Icon type="biaoqing"/></i>
                  <!-- 可通过 emojiList 传入自定义的图标列表 -->
                  <emotion @emotion="handleEmotion" :height="200" />
                </el-popover>
              </div>
            </ElFormGrid>
            <!-- 表情包引入前端 结束-->
            <ElFormGrid>
              <ns-button style="padding:2px" class="cursor-pointer" type="text" @click="insertPlaceHolderToText('{customerNick}')"> &lt;好友微信昵称&gt; </ns-button>
            </ElFormGrid>
            <ElFormGrid>
              <ns-button style="padding:2px" class="cursor-pointer" type="text" @click="insertPlaceHolderToText('{employeeName}')"> &lt;员工姓名&gt; </ns-button>
            </ElFormGrid>
          </ElFormItem>
        </ElForm>
      </div>
      <span slot="footer">
        <NsButton @click="close">{{$t('operating.cancel')}}</NsButton>
        <NsSave @click="addText"/>
      </span>
    </ElDialog>
    <!-- 文字弹框 end -->
  </div>
</template>
<script>
import { getErrorMsg } from '@/utils/toast'
// 表情包引入插件
import Emotion from '@nascent/ecrp-ecrm/src/components/Emotion/index'
export default {
  components: {
    Emotion
  },
  props: ['textModel', 'dialogVisibleText'],
  data () {
    return {
      model: {
        content: '' // 内容
      },
      startNum: 0,
      endNum: 0,
      rules: {
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { max: 100, message: '长度在100个字符以内', trigger: 'blur' },
          { validator: contentCheck, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 为text文本插入预留字段
    insertPlaceHolderToText (append) {
      if (this.model.content === undefined) {
        this.model.content = ''
      }
      this.model.content += append
      this.moveToCursor()
    },
    // 添加文本 type=1
    addText () {
      this.$refs.searchform.validate(valid => {
        if (valid) {
          this.$emit('addText', this.model)
        }
      })
    },
    // 关闭弹框
    close () {
      this.$refs.searchform.resetFields()
      this.$emit('close', 'text')
    },

    /* ******************* 表情包引入事件 开始******************** */
    contentCheck: (rule, value, callback) => {
      const regexp = /\S+/
      if (value && !regexp.test(value)) {
        return callback(new Error('请输入欢迎语'))
      } else {
        callback()
      }
    },
    // 输入内容时，获取光标位置
    handleBlur (event) {
      this.getCurrentCursor()
    },
    handleInput (value) {
      this.getCurrentCursor()
      this.model.content = this.model.content.replace(/(^\s*)|(\s*$)/g, '')
    },
    handleChange (value) {
      this.getCurrentCursor()
    },
    // 获取光标位置
    getCurrentCursor () {
      let oTextarea = this.$refs.content.$el.children[0]// 获取textarea标签
      this.startNum = oTextarea.selectionStart
      this.endNum = oTextarea.selectionEnd
    },
    // 替换或放置内容
    insertContent (str, tag, start, end) {
      if (start !== end) {
        let prevStr = str.substring(0, start)
        let nextStr = str.substring(end, str.length)
        return prevStr + tag + nextStr
      } else {
        let prevStr = str.substring(0, start)
        let nextStr = str.substring(start, str.length)
        return prevStr + tag + nextStr
      }
    },
    // 重新定位光标
    moveToCursor () {
      let oTextarea = this.$refs.content.$el.children[0]
      let start = this.startNum
      let end = this.endNum
      if (isNaN(start) || isNaN(end)) {
        alert('位置输入错误')
      }
      oTextarea.select()
      oTextarea.selectionStart = this.startNum
      oTextarea.selectionEnd = this.endNum
    },
    handleEmotion: function (val) {
      // 内容拼接
      this.model.content = this.insertContent(this.model.content, val, this.startNum, this.endNum)
      // 光标起始位置累加
      this.endNum = this.startNum += val.length
      this.$nextTick(() => {
        this.moveToCursor() // 重新定位光标
      })
    }
    /* ****************** 表情包引入事件 结束******************* */
  },
  watch: {
    publishData () {
      this.model = this.textModel
    }
  },
  mounted () {
    this.model = this.textModel
  }
}
</script>
<style scoped>
  @import "@theme/variables.pcss";
  .container {
    width: 410px;
    margin: 0 auto;
  }
  .emoji-content {
    padding: var(--default-padding-larger) 0;
  .emoji-icon {
    font-size: var(--default-font-size-middle);
    color: var(--theme-color-primary);
  }
  }
</style>
