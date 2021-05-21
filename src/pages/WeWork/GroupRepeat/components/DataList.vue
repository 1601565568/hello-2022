<template>
  <el-drawer
    :visible.sync="drawer"
    :direction="direction"
    :before-close="handleClose"
    size="720px"
    :with-header="false"
    :modal="false"
  >
    <div>
      <div class="close-view">
        <Icon type="close" class="close-icon" @click="closeDeawer" />
      </div>
      <div class="drawer-title">详情</div>
      <div class="user-info-view">
        <div class="user-img">
          <img :src="userImg" class="user-img-rad"/>
          <div class="sex-view">
            <Icon type="ns-boy" style="color: #1890FF;"/>
            <!-- <Icon type="ns-girl" style="color: #F75961;"/> -->
          </div>
        </div>
        <div class="user-info">
          <div class="user-info-text">昵称：张三</div>
          <div class="user-info-text">性别：女</div>
        </div>
      </div>
      <page-table style="padding-top:0">
        <template slot="table">
          <el-table
            :data="listData"
            class="new-table_border drawer-table"
            :row-style="{ height: '48px' }"
          >
            <el-table-column prop="title" label="群名称"> </el-table-column>
            <el-table-column prop="owner" label="群主"> </el-table-column>
            <el-table-column prop="shop" label="工作门店"> </el-table-column>
            <el-table-column prop="time" label="入群时间"></el-table-column>
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
          title: '九和路篮球群',
          owner: '导购小李',
          shop: '九和路店',
          time: '2020-01-01 18:00:00'
        },
        {
          title: '九和路篮球群',
          owner: '导购小李',
          shop: '九和路店',
          time: '2020-01-01 18:00:00'
        },
        {
          title: '九和路篮球群',
          owner: '导购小李',
          shop: '九和路店',
          time: '2020-01-01 18:00:00'
        },
        {
          title: '九和路篮球群',
          owner: '导购小李',
          shop: '九和路店',
          time: '2020-01-01 18:00:00'
        },
        {
          title: '九和路篮球群',
          owner: '导购小李',
          shop: '九和路店',
          time: '2020-01-01 18:00:00'
        }
      ],
      userImg: 'https://gss0.baidu.com/7Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/f9198618367adab4852e139289d4b31c8601e461.jpg'
    }
  },
  methods: {
    closeDeawer () {
      this.drawer = false
    },
    openDeawer () {
      this.drawer = true
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

.user-info-view {
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  margin-top: 40px;
  margin-bottom: 16px;
}
.user-info-text {
  font-size: 14px;
  color: #262626;
  line-height: 22px;
  font-weight: 400;
}
.user-img {
  margin-right: 32px;
  width: 80px;
  height: 80px;
  position: relative;
}
.user-img-rad {
  width: 80px;
  height: 80px;
  border-radius: 40px;
}
.sex-view {
  position: absolute;
  width: 24px;
  height: 24px;
  background-color: white;
  top: 0;
  right: 0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
