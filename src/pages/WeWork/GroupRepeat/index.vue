<template>
  <div>
    <div style="padding: 16px;background: #fff;width:100%">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/userCenter/customer/customerList'}">用户中心</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/userCenter/group/list'}">群管理</el-breadcrumb-item>
        <el-breadcrumb-item>重复群统计</el-breadcrumb-item>
      </el-breadcrumb>
      <div style="fontSize:16px;marginTop:16px;fontWeight:bold">重复群统计 </div>
    </div>
    <div class="select-view">
      <GroupSelectDialog class="el-inline-block" v-bind:value="this.selectedData" @childChange="parentChang"
        ref="GroupSelectDialog"/>
    </div>
    <div class="data-view">
      <page-table style="padding-top:0">
        <template slot="table">
          <el-table
            :data="listData"
            class="new-table_border drawer-table"
            :row-style="{ height: '96px' }"
            v-loading="tableLoading"
          >
            <el-table-column prop="avatar" label="头像">
              <template slot-scope="scope">
                <img :src="scope.row.avatar"  width="50" height="50"/>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="昵称" > </el-table-column>
            <el-table-column prop="gender" label="性别" >
              <template slot-scope="scope">
                <span>{{ scope.row.gender === 0 ? '女' : '男' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="repeatedNum" label="所属群" >
              <template slot-scope="scope">
                <span>{{ scope.row.repeatedNum }}个</span>
              </template>
            </el-table-column>
            <el-table-column prop="firstJoinTime" label="首次入群时间"> </el-table-column>
            <el-table-column prop="dowm" label="操作">
              <template slot-scope="scope">
                <ns-button type="text" class="select-button" @click="showMoreData(scope.row)">详情</ns-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template slot="pagination">
          <el-pagination
            class="label-dialog__pagination"
            :page-sizes="pagination.sizeOpts"
            :total="pagination.total"
            :current-page.sync="pagination.page"
            :page-size="pagination.size"
            layout="total, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </template>
      </page-table>
    </div>
    <DataList
    v-bind:dataList="this.dataList"
    ref="datalist"
    v-bind:detailTableLoading="this.detailTableLoading"
    v-bind:userMessage="this.userMessage"/>
  </div>
</template>

<script>
import PageTable from '@/components/NewUi/PageTable'
import DataList from './components/DataList'
import ElBreadcrumb from '@nascent/nui/lib/breadcrumb'
import ElBreadcrumbItem from '@nascent/nui/lib/breadcrumb-item'
import GroupSelectDialog from './components/GroupSelectDialog'
export default {
  name: 'GroupRepeat',
  components: {
    PageTable,
    DataList,
    ElBreadcrumb,
    ElBreadcrumbItem,
    GroupSelectDialog
  },
  data () {
    return {
      listData: [],
      // 列表页加载
      tableLoading: false,
      userMessage: null,
      // 详情列表页数据加载
      detailTableLoading: false,
      // 详情列表数据
      dataList: [],
      // 分页配置
      pagination: {
        size: 10,
        sizeOpts: [10],
        page: 1,
        total: 4
      },
      flag: false
    }
  },
  methods: {
    handleCurrentChange () {},
    handleSizeChange () {},
    showMoreData (user) {
      this.$refs.datalist.openDeawer()
      this.queryRepeatedInContactDetailList(user.userId)
      this.userMessage = user
    },
    selectOptionClick (val) {
      this.flag = val
    },
    queryRepeatedInContactList () {
      let params = {
        'beanMap': {},
        'draw': 0,
        'length': 10,
        'orderDir': '',
        'orderKey': '',
        'searchMap': {
          'chatIds': '',
          'leastRepeatedInNum': 0
        },
        'searchValue': '',
        'start': 0
      }
      let that = this
      that.tableLoading = true
      this.$http.fetch(that.$api.weWork.groupManager.queryRepeatedInContactList, params).then((resp) => {
        if (resp.success && resp.result.data.length > 0) {
          this.listData = resp.result.data
        }
      }).finally(() => {
        that.tableLoading = false
      })
    },
    queryRepeatedInContactDetailList (detilUserId) {
      let params = {
        'beanMap': {},
        'draw': 0,
        'length': 10,
        'orderDir': '',
        'orderKey': '',
        'searchMap': {
          'userId': detilUserId
        },
        'searchValue': '',
        'start': 0
      }
      let that = this
      this.detailTableLoading = true
      this.$http.fetch(that.$api.weWork.groupManager.queryRepeatedInContactDetailList, params).then((resp) => {
        if (resp.success && resp.result.data.length > 0) {
          that.dataList = resp.result.data
        }
      }).finally(() => {
        that.detailTableLoading = false
      })
    }
  },
  mounted: function () {
    this.queryRepeatedInContactList()
  }
}
</script>

<style scoped>
@import '@components/NewUi/styles/reset.css';
@import './styles/index.css';
.container {
  background-color: white;
}
.data-view {
  background-color: white;
  border-radius: 4px;
}
.select-button {
  font-size: 14px;
  color: #0094fc;
  font-weight: 400;
}
.select-view{
  height: 64px;
  background-color: white;
  margin-bottom: 16px;
  margin-top: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}
.item-down {
  width: 171px;
  height: 32px;
  background: #FFFFFF;
  border: 1px solid #D9D9D9;
  border-radius: 2px;
  display: flex;
  flex-direction: row;
  font-size: 14px;
  align-items: center;
  margin-left: 16px;
  cursor: pointer;
  .name {
    width: 70px;
    margin-left:8px;
  }
  .icon-view {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
}
.drawer-table {
  padding: 0;
  font-size: 14px;
  font-weight: 400;
}
.arrowTransform{
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(0deg);
}
.arrowTransformReturn{
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(180deg);
}

</style>
