<template>
  <el-drawer
    :visible.sync="drawer"
    :direction="direction"
    :before-close="handleClose"
    size="720px"
    :with-header="false"
  >
    <div>
      <div class="close-view">
        <Icon type="close" class="close-icon" @click="closeDeawer" />
      </div>
      <div class="drawer-title">发送群列表</div>
      <div class="menu-view">
        <div class="item-view">
          <el-input v-model="inputValue" placeholder="请输入内容"></el-input>
        </div>
        <div class="item-down">
          <el-select v-model="actionValue" placeholder="动作">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="item-name">
          <el-select v-model="actionValue" placeholder="门店/员工：">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="drawer-output">
          导出CSV文件
        </div>
      </div>
      <page-table style="padding-top:0">
        <template slot="table">
          <el-table
            :data="listData"
            class="new-table_border drawer-table"
            :row-style="{ height: '48px' }"
          >
            <el-table-column prop="title" label="素材标题"> </el-table-column>
            <el-table-column prop="status" label="动作"> </el-table-column>
            <el-table-column prop="name" label="员工"> </el-table-column>
            <el-table-column prop="address" label="所属门店"></el-table-column>
          </el-table>
        </template>
      </page-table>
    </div>
  </el-drawer>
</template>
<script>
import ElDrawer from '@nascent/nui/lib/drawer'
import PageTable from '@/components/NewUi/PageTable'
export default {
  name: 'dataList',
  components: { ElDrawer, PageTable },
  data () {
    return {
      direction: 'rtl',
      drawer: false,
      listData: [
        {
          title: '素材标题素材标题',
          status: '下载',
          name: '朱琴眉',
          address: '杭州转塘店'
        },
        {
          title: '素材标题素材标题',
          status: '下载',
          name: '朱琴眉',
          address: '杭州转塘店'
        },
        {
          title: '素材标题素材标题',
          status: '下载',
          name: '朱琴眉',
          address: '杭州转塘店'
        },
        {
          title: '素材标题素材标题',
          status: '下载',
          name: '朱琴眉',
          address: '杭州转塘店'
        },
        {
          title: '素材标题素材标题',
          status: '下载',
          name: '朱琴眉',
          address: '杭州转塘店'
        }
      ],
      inputValue: '',
      activeName: 'first',
      options: [
        {
          value: '选项1',
          label: '全部动作'
        },
        {
          value: '选项2',
          label: '下载'
        },
        {
          value: '选项3',
          label: '发送'
        }
      ],
      actionValue: ''
    }
  },
  methods: {
    closeDeawer () {
      this.drawer = !this.drawer
    },
    handleClose () {},
    handleClick (tab, event) {}
  }
}
</script>
<style scoped >
@import '@components/NewUi/styles/reset.css';
.el-tabs__item {
  font-size: 18px !important;
  padding: 10px 0 50px !important;
  width: 120px !important;
}
.el-tabs__active-bar {
  width: 120px !important;
}
.drawer-title {
  height: 53px;
  font-size: 16px;
  color: #262626;
  line-height: 53px;
  padding-left: 16px;
  font-weight: bold;
}
.drawer-sub-title {
  font-size: 14px;
  color: #303133;
  line-height: 55px;
  font-weight: 500;
  padding-left: 32px;
  height: 55px;
}
.drawer-sub-cont {
  font-size: 14px;
  color: #606266;
  line-height: 24px;
  font-weight: 400;
  margin-left: 32px;
  margin-right: 32px;
  padding-bottom: 33px;
  border-bottom: 1px solid #e8e8e8;
}
.drawer-sub-img {
  width: 375px;
  height: 257px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  margin-left: 32px;
}
.close-view {
  height: 49px;
  display: flex;
  align-items: center;
}
.close-icon {
  margin-left: 16px;
  width: 20px;
  height: 20px;
}
.drawer-showinfo {
  font-size: 14px;
  color: #595959;
  line-height: 22px;
  font-weight: 400;
  margin-left: 16px;
  margin-right: 16px;
  display: flex;
  justify-content: space-between;
  height: 65px;
  align-items: center;
}
.drawer-showinfo >>> .el-tabs__header {
  border: none;
  box-shadow: none;
}

.drawer-table {
  padding: 0;
  font-size: 14px;
  font-weight: 400;
}
.drawer-output {
  width: 116px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  line-height: 32px;
  text-align: center;
  font-size: 14px;
}
.select-button {
  font-size: 14px;
  color: #0094fc;
  font-weight: 400;
}
.menu-view {
  height: 65px;
  display: flex;
  flex-direction: row;
  padding-left: 16px;
  padding-right: 16px;
  align-items: center;
  justify-content: space-between;
}

.item-view >>> .el-input__inner {
  width: 200px;
  height: 32px;
  font-size: 14px;
}

.item-down >>> .el-input__inner {
  width: 143px;
  height: 32px;
  font-size: 14px;
}

.item-name >>> .el-input__inner {
  width: 178px;
  height: 32px;
  font-size: 14px;
  font-weight: 400;
}

</style>
