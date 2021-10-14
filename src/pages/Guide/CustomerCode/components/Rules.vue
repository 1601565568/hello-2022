<template>
  <div class="item-view">
    <el-form
      :model="pageObj"
      :rules="rules"
      label-width="110px"
      label-position="left"
      size="medium"
      ref="rulesForm"
      class="normal-from">
      <el-form-item
        label="活动规则"
        class="larger-item"
        prop="rules"
      >
        <tag-area
          v-model="pageObj.rules"
          tag="wise"
          ref="tagAreaTextRules"
          :maxlength="1000"
          placeholder="请输入活动规则"
          @input="inputLength"
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
      rules: {
        rules: [
          { required: true, message: '请输入活动规则', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    validateRules () {
      return new Promise((resolve, reject) => {
        this.$refs.rulesForm.validate((valid) => {
          if (valid) {
            resolve()
          }
        })
      })
    },
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
