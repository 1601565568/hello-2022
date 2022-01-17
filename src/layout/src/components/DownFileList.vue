<template>
  <el-drawer
    :with-header="false"
    :visible.sync="drawer"
    :before-close="handleClose"
    destroy-on-close
    append-to-body
    :modal="false"
    size="720px"
  >
    <div class="down-view">
      <div class="close-view">
        <Icon type="close" class="close-icon" @click="handleClose" />
      </div>
      <div class="down-title">下载中心</div>
      <div class="remind-view">
        下载中心仅保留近3天生成的报表，请尽快下载
      </div>
      <div class="down-search">
        <div class="input-view">
          <el-input
            placeholder="请输入文件名称"
            autofocus="false"
            type="text"
            v-model="inputTitle"
            @change="inputChange"
          >
            <Icon
              type="ns-search"
              slot="suffix"
              style="font-size: 30px;"
              @click="inputChange"
            ></Icon>
          </el-input>
        </div>
        <div class="input-view">
          <el-input
            placeholder="请输入生成时间"
            autofocus="false"
            type="text"
            v-model="inputTitle"
            @change="inputChange"
          >
            <Icon
              type="ns-search"
              slot="suffix"
              style="font-size: 30px;"
              @click="inputChange"
            ></Icon>
          </el-input>
        </div>
      </div>
      <div class="down-table" v-if="listData.length > 0">
        <page-table style="padding-top:0">
          <template slot="table">
            <el-table
              :data="listData"
              class="new-table_border drawer-table"
              :row-style="{ height: '48px' }"
            >
              <el-table-column prop="guideName" label="文件名称">
              </el-table-column>
              <el-table-column prop="phone" label="生成时间">
                <template slot-scope="scope">{{
                  scope.row.phone || '-'
                }}</template>
              </el-table-column>
              <el-table-column prop="post" label="操作">
                <template slot-scope="scope">{{
                  transPost(scope.row.post)
                }}</template>
              </el-table-column>
            </el-table>
          </template>
          <template slot="pagination">
            <el-pagination
              background
              class="label-dialog__pagination"
              :page-sizes="paginationToPerson.sizeOpts"
              :total="paginationToPerson.total"
              :current-page.sync="paginationToPerson.page"
              :page-size="paginationToPerson.size"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChangeForPerson"
              @current-change="handleCurrentChangeForPerson"
            >
            </el-pagination>
          </template>
        </page-table>
      </div>
      <div v-else>
        <NoData />
      </div>
    </div>
  </el-drawer>
</template>

<script>
import ElDrawer from '@nascent/nui/lib/drawer'
import PageTable from '@/components/NewUi/PageTable'
import NoData from '@/pages/WeWork/MaterialChat/components/NoData'
export default {
  name: 'downFileList',
  components: {
    ElDrawer,
    PageTable,
    NoData
  },
  data () {
    return {
      drawer: false,
      paginationToPerson: {
        size: 10,
        sizeOpts: [5, 10, 15],
        page: 1,
        total: 0
      },
      listData: [],
      inputTitle: ''
    }
  },
  methods: {
    handleClose () {
      this.drawer = false
    },
    openDrawer () {
      this.drawer = true
    },
    handleSizeChangeForPerson (size) {
      this.paginationToPerson = {
        ...this.paginationToPerson,
        size,
        page: 1
      }
      this.loadDetail()
    },
    handleCurrentChangeForPerson (page) {
      this.paginationToPerson.page = page
      this.loadDetail()
    },
    loadDetail () {},
    inputChange () {}
  }
}
</script>

<style lang="scss" scoped>
@import '@components/NewUi/styles/reset.css';
@import '@pages/WeWork/MaterialChat/styles/index.css';
.down-view {
  .close-view {
    height: 49px;
    display: flex;
    align-items: center;
    padding: 16px;
  }
  .down-title {
    font-size: 16px;
    color: #262626;
    line-height: 24px;
    font-weight: 500;
    padding: 16px;
  }
  .close-icon {
    width: 20px;
    height: 20px;
  }
  .remind-view {
    width: 688px;
    background: #f2f9fe;
    border-radius: 2px;
    margin-top: 16px;
    font-size: 14px;
    color: #595959;
    line-height: 22px;
    padding: 9px 16px;
    margin: 16px 16px 0 16px;
  }
}
.drawer-table {
  padding: 0;
  font-size: 14px;
  font-weight: 400;
}
.down-search {
  height: 65px;
  display: flex;
  flex-direction: row;
  padding-left: 16px;
  align-items: center;
}
.input-view {
  margin-right: 16px;
}
</style>
