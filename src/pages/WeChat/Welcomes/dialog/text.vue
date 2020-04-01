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
            <ElInput
              type="textarea"
              :rows="4"
              maxlength='255' style="width:580px"
              clearable placeholder='请输入内容，长度在100个字符以内'
              v-model="model.content" />
          </el-form-item>
        </ElForm>
        <ElFormItem>
          <ElFormGrid>
            <ElPopover trigger="hover" placement="bottom">
              <VEmojiPicker :pack="pack" @select="selectEmoji" style="height: 200px;"/>
              <NsButton type="text" slot="reference"><Icon type="biaoqing" className="font-size-large cursor-pointer" /></NsButton>
            </ElPopover>
          </ElFormGrid>
          <ElFormGrid>
            <ns-button class="font-size-large cursor-pointer" type="text" @click="insertPlaceHolderToText('{customerNick}')"> &lt;好友微信昵称&gt; </ns-button>
          </ElFormGrid>
          <ElFormGrid>
            <ns-button class="font-size-large cursor-pointer" type="text" @click="insertPlaceHolderToText('{employeeName}')"> &lt;员工姓名&gt; </ns-button>
          </ElFormGrid>
        </ElFormItem>
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
import VEmojiPicker from 'v-emoji-picker'
import packData from './../json/emojis.json'
import { getErrorMsg } from '@/utils/toast'
export default {
  components: {
    VEmojiPicker
  },
  props: ['textModel', 'dialogVisibleText'],
  data () {
    return {
      // 表情包数据
      pack: packData,
      model: {
        content: '' // 内容
      },
      rules: {
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { max: 100, message: '长度在100个字符以内', trigger: 'blur' }
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
    },
    // 表情引入
    selectEmoji (emoji) {
      if (this.model.content === undefined) {
        this.model.content = ''
      }
      this.model.content += emoji.emoji
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
    }
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
