<template>
  <div class="pageRightEdit" :class="[fuscous==='QA'?fuscousQA:fuscousIcon]">
    <div class="checkboxWarpper">
      <el-checkbox
        class="checkbox checkboxAll"
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
        >全选</el-checkbox
      >
    </div>
    <template v-for="(item, index) in data">
      <div class="checkboxWarpper" :key="index">
        <el-checkbox
          class="checkbox"
          @change="onChangeCheckbox(item, index)"
          :value="formatCheckbox(item.status)"
          >{{ item.itemName }}</el-checkbox
        >
        <el-tooltip
          v-if="item.tips"
          class="question-circle"
          effect="dark"
          :content="item.tips"
          placement="top"
        >
          <!-- <span v-if="item.tips" :title="item.tips" class="question-circle"> -->
          <Icon type="question-circle" />
          <!-- </span> -->
        </el-tooltip>
        <el-tooltip
          v-if="
            item.itemName === '总收益' ||
              item.itemName === '本月收益和今日收益' ||
              item.itemName === '我的收益'
          "
          effect="dark"
          content="编辑"
          placement="top"
        >
          <span class="editIcon" @click="onPageRewardSetting"
            ><Icon type="edit"
          /></span>
        </el-tooltip>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    childrenEditData: {
      type: Array
    }
  },
  data () {
    return {
      data: JSON.parse(JSON.stringify(this.childrenEditData)),
      checkAll: false,
      isIndeterminate: false,
      fuscous: process.env.VUE_APP_THEME,
      fuscousQA: 'fuscousQA',
      fuscousIcon: 'fuscousIcon'
    }
  },
  watch: {
    childrenEditData: {
      handler (newValue, oldValue) {
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          this.data = JSON.parse(JSON.stringify(newValue))
        }
      },
      deep: true,
      immediate: true
    },
    data: {
      handler (val) {
        this.$emit('change', val)
        this.formatCheckAllStatus(val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    formatCheckbox (status) {
      return status === 1
    },
    onChangeCheckbox (item, index) {
      let setItem = JSON.parse(JSON.stringify(item))
      setItem.status = setItem.status === 1 ? 0 : 1
      this.$set(this.data, index, setItem)
    },
    formatCheckAllStatus (val) {
      let length = val.length
      let i = 0
      val.forEach(item => {
        if (item.status === 1) {
          i = i + 1
        }
      })
      if (i === length) {
        this.checkAll = true
        this.isIndeterminate = false
      } else if (i > 0 && i < length) {
        this.checkAll = false
        this.isIndeterminate = true
      } else {
        this.checkAll = false
        this.isIndeterminate = false
      }
    },
    handleCheckAllChange (val) {
      let arr = []
      arr = this.data.map(item => {
        return {
          ...item,
          status: val ? 1 : 0
        }
      })
      this.data = arr
    },
    onPageRewardSetting () {
      this.$emit('onPageRewardSetting')
    }
  }
}
</script>
<style>
.pageRightEdit .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #0091fa;
  border-color: #0091fa;
}
.pageRightEdit .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #0091fa;
  border-color: #0091fa;
}
.pageRightEdit .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #262626;
}
.pageRightEdit .el-radio__label,
.pageRightEdit .el-checkbox__label {
  font-size: 14px;
  color: #262626;
}
.pageRightEdit .checkboxAll {
  font-weight: bold;
}
</style>
<style scoped>
.checkbox {
  display: block;
  padding-top: 9px;
  height: 40px;
  margin-left: 0px;
}
.checkboxWarpper {
  padding: 0 16px;
  position: relative;
  display: flex;
  align-items: center;
}
.checkboxWarpper:hover {
  cursor: pointer;
  background: #fbfbfb;
  border-radius: 2px;
}
.checkboxWarpper .editIcon {
  position: absolute;
  top: 50%;
  right: 16px;
  color: #8c8c8c;
  transform: translate(0%, -50%);
}
.checkboxWarpper .editIcon:hover {
  color: #262626;
}
.question-circle {
  color: #8c8c8c;
  margin-left: 10px;
}
.fuscousQA >>> .el-checkbox__input.is-checked .el-checkbox__inner{
  background-color: #2153D4;
    border-color: #2153D4;
}
.fuscousIcon >>> .el-checkbox__input.is-checked .el-checkbox__inner{
  background-color: #0091fa;
    border-color: #0091fa;
}
.fuscousQA >>> .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: #2153D4;
    border-color: #2153D4;
}
</style>
