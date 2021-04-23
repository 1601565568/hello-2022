<template>
  <el-dialog
    title="文本"
    width="658px"
    :visible="visible"
    @close="close"
    @open="open"
    modal-append-to-body
    append-to-body
  >
    <el-form class="text-message el-form-reset" label-width="6px" label-position="left" :model="defaultModel">
      <el-form-item>
        <span class="title">文本内容</span>
        <tag-area ref="TagAreaText" class="tag-area" v-model="defaultModel.content" tag="wise" :maxlength="1000" :tools="tooltags" placeholder="请输入活动介绍" :showEmoji="true" @inputLength="() => {}"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <NsButton @click="close" size="medium">取 消</NsButton>
      <NsButton type="primary" size="medium" @click="confirm">确 定</NsButton>
    </span>
  </el-dialog>
</template>

<script>
import TagArea from '@/components/NewUi/TagArea'

export default {
  components: {
    TagArea
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    content: {
      type: Object,
      default: function () {
        return {
          type: 'text',
          content: ''
        }
      }
    }
  },
  data () {
    return {
      defaultModel: {
        type: 'text',
        content: ''
      },
      tooltags: [
        { type: 'tag', text: `插入好友昵称`, id: 'FRIEND_NICKNAME', value: '好友昵称', icon: 'xingming-2-x' },
        { type: 'tag', text: `插入导购姓名`, id: 'GUIDE_NAME', value: '导购姓名', icon: 'nicheng-2-x' },
        { type: 'tag', text: `插入好友昵称`, id: 'GUIDE_NICKNAME', value: '导购门店名称', icon: 'mendian-2-x' }
      ]
    }
  },
  mounted () {},
  methods: {
    close () {
      this.defaultModel = {
        type: 'text',
        content: ''
      }
      this.$emit('update:visible', false)
    },
    open () {
      if (this.content !== null) {
        this.defaultModel = { ...this.content }
      }
    },
    confirm () {
      let content = this.$refs.TagAreaText.htmlToString(this.defaultModel.content)

      this.$emit('confirm', { ...this.defaultModel, content })

      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./styles/reset.css";
.text-message {
  .el-form-item {
    .title {
      display: block;
      font-size: 14px;
      margin-bottom: 8px;
    }
    .tag-area {
      width: 626px;
      height: 232px;
    }
  }
}
</style>
