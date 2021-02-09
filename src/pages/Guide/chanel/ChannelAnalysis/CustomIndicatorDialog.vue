<template>
  <el-dialog
    width="1174px"
    :show-close="false"
    :visible="visible"
    @close="$emit('close')">
    <div class="custom-header">
      <div class="header-title">
        <h3>自定义指标</h3>
        <span class="select-tip">已选<i>9/9</i>个表头</span>
      </div>
      <el-input placeholder="请输入渠道名称" v-model="filterText">
        <Icon type="ns-search-copy" slot="suffix" style="font-size: 24px; margin-top: 2px"></Icon>
      </el-input>
    </div>
    <div class="indicator-list">
      <el-checkbox-group v-model="checkedCities">
        <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <span slot="footer" class="dialog-footer">
      <ns-button type="text" style="float: left">恢复默认</ns-button>
      <ns-button @click="$emit('close')">取 消</ns-button>
      <ns-button type="primary">确 定</ns-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['visible'],
  data () {
    return {
      filterText: '',
      checkedCities: ['上海', '北京'],
      cities: [
        '上海',
        '北京',
        '广州',
        '深圳',
        '哈哈我的名字比较长哈哈哈',
        '哈哈2',
        '哈哈3',
        '哈哈4',
        '哈哈5',
        '哈哈6',
        '哈哈7',
        '哈哈8',
        '哈哈9',
        '哈哈我的名字比较长哈哈哈2',
        '哈哈11',
        '哈哈14',
        '哈哈15'
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./styles/indicator-dialog-reset.css";
.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  border-bottom: 1px solid #E8E8E8;
  .header-title {
    display: flex;
    h3 {
      margin-left: 6px;
      font-size: 16px;
    }
    .select-tip {
      margin-left: 8px;
      i {
        font-style: normal;
        font-weight: bold;
      }
    }
  }
}

.indicator-list {
  padding-top: 8px;
  margin-left: 6px;
  max-height: 360px;
  overflow: auto;
}

.dialog-footer {
  .el-button {
    font-size: 14px;
    height: 32px;
  }
}
</style>
