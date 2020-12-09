<template>
  <div class="pageRightEdit">
    <el-checkbox
      class="checkbox checkboxAll"
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAllChange"
      >全选</el-checkbox
    >
    <!-- <div class="pageRightEdit"> -->
    <el-checkbox-group
      v-model="checkedCities"
      @change="handleCheckedCitiesChange"
    >
      <el-checkbox
        text-color="#f00"
        fill="#f00"
        v-for="city in cities"
        :label="city"
        class="checkbox"
        :key="city"
        >{{ city }}</el-checkbox
      >
    </el-checkbox-group>
    <!-- </div> -->
  </div>
</template>
<script>
const cityOptions = ['上海', '北京', '广州', '深圳']
export default {
  data () {
    return {
      checkAll: false,
      checkedCities: ['上海', '北京'],
      cities: cityOptions,
      isIndeterminate: true
    }
  },
  methods: {
    handleCheckAllChange (val) {
      this.checkedCities = val ? cityOptions : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length
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
.el-checkbox__label {
  font-size: 14px !important;
  color: #262626 !important;
}
.checkboxAll {
  font-weight: bold;
}
</style>
<style scoped>
.checkbox {
  display: block;
  padding-top: 9px;
  height: 40px;
}
</style>
