<template>
  <el-drawer
    :with-header="false"
    :visible.sync="drawer"
    :before-close="handleClose"
    destroy-on-close
    append-to-body
    :modal="false"
    size="750px"
  >
    <div class="down-view">
      <div class="close-view">
        <Icon type="close" class="close-icon" @click="handleClose" />
      </div>
      <div class="down-title">下载中心</div>
      <div class="remind-view">
        下载中心仅保留近7天生成的报表，请尽快下载
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
        <div class="date-view base-view">
          <span style="font-size:13px">生成时间：</span>
          <el-date-picker
            v-model="datePickerValue"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="center"
            value-format="yyyy-MM-dd"
            prefix-icon=""
            @change="dataPickerChange"
            :pickerOptions='pickerOptions'
          >
          </el-date-picker>
        </div>
      </div>
      <DownTableList ref="downTableList" @updatePageSize="updatePageSize"/>
      <div class="down-page-view">
        <el-pagination
          background
          :page-sizes="downPagination.sizeOpts"
          :total="downPagination.total"
          :current-page.sync="downPagination.page"
          :page-size="downPagination.size"
          layout="total, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          >
          </el-pagination>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import ElDrawer from '@nascent/nui/lib/drawer'
import DownTableList from './DownTableList'
export default {
  name: 'downFileList',
  components: {
    ElDrawer,
    DownTableList
  },
  data () {
    return {
      drawer: false,
      inputTitle: '',
      datePickerValue: [],
      selectDate: '',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.selectDate = minDate.getTime()
          if (maxDate) {
            this.selectDate = ''
          }
        },
        disabledDate: (time) => {
          if (this.selectDate !== '') {
            const one = 6 * 24 * 3600 * 1000
            const minTime = this.selectDate - one
            const maxTime = this.selectDate + one
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        }
      },
      downPagination: {
        size: 10,
        sizeOpts: [5, 10, 15],
        page: 1,
        total: 0
      }
    }
  },
  methods: {
    updatePageSize (total) {
      this.downPagination.total = total
    },
    handleSizeChange (size) {
      this.downPagination = {
        ...this.downPagination,
        size,
        page: 1
      }
      this.loadDetail()
    },
    handleCurrentChange (page) {
      this.downPagination.page = page
      this.loadDetail()
    },
    dataPickerChange (e) {
      this.loadTableList()
    },
    handleClose () {
      this.drawer = false
      this.inputTitle = ''
      this.datePickerValue = []
      this.resetData()
    },
    openDrawer () {
      this.drawer = true
      this.$nextTick(() => {
        this.loadTableList()
        this.exportIsSuccess(0)
      })
    },
    inputChange (e) {
      this.loadTableList()
    },
    loadTableList () {
      this.resetData()
      this.loadDetail()
    },
    loadDetail () {
      this.$refs.downTableList.loadDetail(this.downPagination, this.inputTitle, this.datePickerValue)
    },
    resetData () {
      this.downPagination = {
        size: 10,
        sizeOpts: [5, 10, 15],
        page: 1,
        total: 0
      }
    },
    async exportIsSuccess (type) {
      const json = await this.$http.fetch(this.$api.guide.task.isSuccess, { state: type })
      if (json.success) {
        this.$emit('updateShowRed')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@pages/WeWork/MaterialChat/styles/index.css';
.down-view {
  height: 100%;
  position: relative;
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
  .down-page-view {
    position: absolute;
    bottom: 30px;
    left: 0;
    width: 100%;
    z-index: 2000;
    padding:  0 15px;
    display: flex;
    flex-direction: row-reverse;
    background-color: white;
    >>> .el-pagination {
      box-shadow: none;
      text-align: left;
    }
  }
}
.down-search {
  margin-top: 18px;
  display: flex;
  flex-direction: row;
  padding:  0 16px;
  align-items: center;
  z-index: 1000;
}
.input-view {
  margin-right: 16px;
  width: 240px;
}
.date-view {
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  padding: 0px 12px;
}
.date-view >>> .el-input__inner {
  width: 326px;
  height: 30px;
  border: none;
}
.date-view >>> .el-range-input {
  font-size: 14px;
}
</style>
