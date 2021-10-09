<template>
  <div class="item-view">
    <el-form
      :rules="rules"
      label-width="100px"
      label-position="left"
      size="medium"
      class="normal-from">
      <el-form-item
        label="活动规则"
        class="larger-item"
        prop="rulesText"
      >
        <tag-area
          v-model="pageObj.rules"
          tag="wise"
          ref="tagAreaTextRules"
          :maxlength="1000"
          placeholder="请输入活动规则"
          @inputLength="inputLength"
          :showEmoji="true"
          :showTextEmoji="true"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import TagArea from '@/components/NewUi/TagArea'
export default {
  name: 'rules',
  components: {
    TagArea
  },
  props: {
    value: Object
  },
  computed: {
    pageObj () {
      return this.value
    }
  },
  data () {
    return {
      rulesText: '分享下方海报，邀请好友扫码助力，添加于员工微信昵称为好友；邀请5位好友为你助力并添加好友，即可领取奖品！奖品限量100份，先到先得哦！',
      rules: {
        rulesText: [
          { required: true, message: '请输入活动规则', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    inputLength () {
      if (this.$refs.tagAreaTextRules) {
        this.$emit('scrollPhone', 'rules-view')
      }
    }
  }
}
</script>

<style scoped>
.item-view {
  margin-top: 24px;
  margin-bottom: 24px;
}
.remind-text {
  margin-top: 8px;
  font-size: 14px;
  color: #0392FB;
  line-height: 22px;
}
</style>
