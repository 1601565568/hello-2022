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
          <img :src="userMessage.avatar" class="user-img-rad"/>
          <div class="sex-view">
            <Icon type="ns-boy" style="color: #1890FF;" v-if="userMessage.gender === 1"/>
            <Icon type="ns-girl" style="color: #F75961;" v-if="userMessage.gender === 0"/>
          </div>
        </div>
        <div class="user-info">
          <div class="user-info-text">昵称：{{userMessage.name}}</div>
          <div class="user-info-text">性别：{{userMessage.gender === 0 ? '女' : '男'}}</div>
        </div>
      </div>
      <page-table style="padding-top:0">
        <template slot="table">
          <el-table
            :data="detailList"
            class="new-table_border drawer-table"
            :row-style="{ height: '48px' }"
            v-loading="detailTableLoading"
          >
            <el-table-column prop="name" label="群名称"> </el-table-column>
            <el-table-column prop="ownerName" label="群主"> </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="workShopName" label="工作门店" v-if="env!=='kd'"> </el-table-column>
            <el-table-column prop="joinTime" label="入群时间"></el-table-column>
          </el-table>
        </template>
      </page-table>
      <div class="detail-pagination">
        <el-pagination
          small
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pagination.currPage"
          :page-size="pagination.currSize"
          layout="total, prev, pager, next"
          :total="pagination.detailTotal"
          style="boxShadow: none;">
        </el-pagination>
      </div>
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
      firstOpen: false,
      userImg: 'https://gss0.baidu.com/7Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/f9198618367adab4852e139289d4b31c8601e461.jpg',
      pagination: {
        currPage: 1,
        currSize: 10,
        detailTotal: 0
      },
      detailList: [],
      detailTableLoading: false
    }
  },
  props: {
    dataList: {
      type: Array,
      default: null
    },
    userMessage: {
      type: Object,
      default: null
    },
    env: {
      type: String,
      default: ''
    }
    // detailTotal: {
    //   type: Number,
    //   default: 0
    // },
    // detilUserId: {
    //   type: String,
    //   default: ''
    // }
  },
  methods: {
    handleCurrentChange (value) {
      // this.$emit('childFn', value)
      this.pagination.currPage = value
      this.queryRepeatedInContactDetailList()
    },
    closeDeawer () {
      // this.firstOpen = false
      this.drawer = false
      // this.pagination.currPage = 1
    },
    openDeawer () {
      this.drawer = true
    },
    handleClose () {},
    handleClick (tab, event) {},
    queryRepeatedInContactDetailList () {
      let params = {
        'beanMap': {},
        'draw': 0,
        'length': this.pagination.currSize,
        'orderDir': '',
        'orderKey': '',
        'searchMap': {
          'userId': this.userMessage.userId
        },
        'searchValue': '',
        'start': (this.pagination.currPage - 1) * this.pagination.currSize
      }
      let that = this
      this.detailTableLoading = true
      this.$http.fetch(that.$api.weWork.groupManager.queryRepeatedInContactDetailList, params).then((resp) => {
        if (resp.success && resp.result.data.length > 0) {
          that.detailList = resp.result.data
          that.pagination.detailTotal = resp.result.recordsTotal * 1
        } else {
          that.detailList = []
          that.pagination.detailTotal = 0
        }
      }).finally(() => {
        that.detailTableLoading = false
      })
    }
  },
  watch: {
    userMessage: function () {
      this.pagination.currPage = 1
      this.queryRepeatedInContactDetailList()
    }
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
.detail-pagination{
  width: 720px;
  height: 62px;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: end;
  align-items: center;
  border-top: 1px solid #F0F0F0;
}
</style>
