<template>
  <div>
    <div class="header-view">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>数据运营</el-breadcrumb-item>
        <el-breadcrumb-item>企微运营数据</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/Social/OperationData/MaterialChat' }">素材库行为统计</el-breadcrumb-item>
        <el-breadcrumb-item>未执行统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="name-view">未执行统计</div>
    <div class="output-view">
      <div class="no-input-view">
        <el-input v-model="inputTitle" placeholder="请输入素材标题">
          <Icon
            type="ns-search-copy"
            slot="suffix"
            style="font-size: 24px; margin-top: 2px"
          ></Icon>
        </el-input>
      </div>
      <div class="output-button">导出CSV文件</div>
    </div>
    <div class="chat-bg">
      <div></div>
      <div class="reminde-view">
        仅统计有未执行数据的素材，全部执行完成的素材不显示
      </div>
      <page-table style="padding-top:0">
        <template slot="table">
          <el-table
            :data="listData"
            class="new-table_border drawer-table"
            :row-style="{ height: '48px' }"
          >
            <el-table-column prop="title" label="素材标题"> </el-table-column>
            <el-table-column prop="send" label="未发送人次"> </el-table-column>
            <el-table-column prop="dowm" label="未下载人次"> </el-table-column>
            <el-table-column prop="dowm" label="未补全人次"> </el-table-column>
            <el-table-column prop="status" width="125px" label="操作">
              <template>
                <ns-button
                  type="text"
                  class="select-button"
                  @click="showMoreData"
                  >查看数据</ns-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </page-table>
    </div>
    <UnDone ref="undone"/>
  </div>
</template>

<script>
import PageTable from '@/components/NewUi/PageTable'
import ElBreadcrumb from '@nascent/nui/lib/breadcrumb'
import ElBreadcrumbItem from '@nascent/nui/lib/breadcrumb-item'
import UnDone from './components/UnDone'
export default {
  name: 'noStatistical',
  components: {
    PageTable,
    ElBreadcrumb,
    ElBreadcrumbItem,
    UnDone
  },
  data () {
    return {
      name: 'zhang san',
      listData: [
        {
          title: '素材标题素材标题素材标题素材标题素材标题素…',
          send: '789787',
          dowm: '47867979'
        },
        {
          title: '素材标题素材标题素材标题素材标题素材标题素…',
          send: '789787',
          dowm: '47867979'
        },
        {
          title: '素材标题素材标题素材标题素材标题素材标题素…',
          send: '789787',
          dowm: '47867979'
        },
        {
          title: '素材标题素材标题素材标题素材标题素材标题素…',
          send: '789787',
          dowm: '47867979'
        }
      ],
      inputTitle: ''
    }
  },
  methods: {
    showMoreData () {
      this.$refs.undone.closeDeawer()
    }
  }
}
</script>

<style scoped>
@import '@components/NewUi/styles/reset.css';
@import '@theme/variables.pcss';
@import './styles/index.css';
.output-view {
  background-color: white;
  height: 64px;
  margin-bottom: 8px;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 16px;
  padding-right: 16px;
}
.output-button {
  width: 116px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  font-size: 14px;
  color: #595959;
  text-align: center;
  line-height: 22px;
  font-weight: 400;
  line-height: 32px;
  cursor: pointer;
}
.chat-bg {
  background-color: white;
  padding-top: 16px;
}
.reminde-view {
  padding-left: 16px;
  margin-left: 16px;
  margin-right: 16px;
  background: #f2f9fe;
  border-radius: 2px;
  height: 40px;
  font-size: 14px;
  color: #595959;
  line-height: 22px;
  font-weight: 400;
  line-height: 40px;
}
.drawer-table {
  padding: 0;
  font-size: 14px;
  font-weight: 400;
}
.select-button {
  font-size: 14px;
  color: #0094fc;
  font-weight: 400;
}
.name-view {
  height: 48px;
  background-color: white;
  margin-bottom: 8px;
  font-size: 16px;
  color: #262626;
  line-height: 24px;
  font-weight: 500;
  line-height: 48px;
  padding-left: 16px;
}
.header-view {
  background-color: white;
  height: 46px;
  font-size: 14px;
  line-height: 46px;
  padding-left: 16px;
  line-height: 46px;
}
.header-view >>> .el-breadcrumb {
  line-height: 46px;
}
</style>
