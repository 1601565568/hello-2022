<template>
  <el-drawer
    :visible.sync="drawer"
    :direction="direction"
    size="720px"
    :with-header="false"
    destroy-on-close
    :modal="false"
  >
    <div>
      <div class="close-view">
        <Icon type="close" class="close-icon" @click="closeDeawer" />
      </div>
      <div class="drawer-title">{{ item.materialTitle }}</div>
      <div class="menu-view">
        <div class="item-down">
          <div class="name">动作:</div>
          <div class="item-select">
            <el-select v-model="actionValue" :default-first-option="true">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="user-view">
          <el-form :inline="true" class="form-inline_top">
            <el-form-item label="门店/员工：">
              <NsGuideDialog
                :selfBtn="true"
                :appendToBody="true"
                :isButton="false"
                :auth="false"
                type="primary"
                btnTitle=""
                dialogTitle="门店/员工："
                @input="handleChangeGuide"
                v-model="guideIds"
              >
                <template slot="selfBtn">
                  <div class="self-btn">
                    {{
                      guideIds && guideIds.length
                        ? `已选择${guideIds.length}个员工`
                        : '全部'
                    }}
                    <Icon type="geren" class="guideIds-icon"></Icon>
                  </div>
                </template>
              </NsGuideDialog>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <page-table style="padding-top:0">
        <template slot="table">
          <el-table
            :data="listData"
            class="new-table_border drawer-table"
            :row-style="{ height: '48px' }"
          >
            <el-table-column prop="trackTime" label="日期"> </el-table-column>
            <el-table-column prop="eventType" label="动作" :width="80">
            </el-table-column>
            <el-table-column prop="employeeNumber" label="工号" :width="114">
            </el-table-column>
            <el-table-column prop="guideName" label="员工"> </el-table-column>
            <el-table-column prop="address" label="所属门店"></el-table-column>
          </el-table>
        </template>
        <template slot="pagination">
          <el-pagination
            class="label-dialog__pagination"
            :page-sizes="paginationToPerson.sizeOpts"
            :total="paginationToPerson.total"
            :current-page.sync="paginationToPerson.page"
            :page-size="paginationToPerson.size"
            layout="total, prev, pager, next"
            @size-change="handleSizeChangeForPerson"
            @current-change="handleCurrentChangeForPerson"
          >
          </el-pagination>
        </template>
      </page-table>
    </div>
  </el-drawer>
</template>
<script>
import ElDrawer from '@nascent/nui/lib/drawer'
import PageTable from '@/components/NewUi/PageTable'
import NsGuideDialog from '@/components/NsGuideDialog'
export default {
  name: 'dataList',
  components: { ElDrawer, PageTable, NsGuideDialog },
  data () {
    return {
      direction: 'rtl',
      drawer: false,
      listData: [],
      inputValue: '',
      activeName: 'first',
      options: [
        {
          value: '选项1',
          label: '全部动作'
        },
        {
          value: '16',
          label: '下载'
        },
        {
          value: '14',
          label: '发送'
        },
        {
          value: '18',
          label: '补充'
        }
      ],
      actionValue: '全部动作',
      guideIds: [],
      item: {},
      paginationToPerson: {
        size: 10,
        sizeOpts: [10],
        page: 1,
        total: 0
      }
    }
  },
  methods: {
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
    closeDeawer () {
      this.drawer = !this.drawer
      this.item = {}
    },
    openDeawer (item, startTime, endTime) {
      this.item = item
      this.drawer = true
      this.loadDetail(startTime, endTime)
    },
    handleClose () {},
    handleClick (tab, event) {},
    handleChangeGuide () {},
    loadDetail (startTime, endTime) {
      const parms = {
        endTime: endTime,
        startTime: startTime,
        eventType: '',
        guideIdsStr: '',
        shopIdsStr: '',
        materialId: this.item.materialId,
        start:
          (this.paginationToPerson.page - 1) * this.paginationToPerson.size,
        length: this.paginationToPerson.size
      }
      this.$http
        .fetch(this.$api.guide.getStatisticsDetailByMaterial, parms)
        .then(resp => {
          const json = resp.result
          const arr = json.data || []
          this.listData = arr
          this.paginationToPerson.total = parseInt(json.recordsTotal)
        })
        .catch(resp => {})
    }
  }
}
</script>
<style scoped>
@import '@components/NewUi/styles/reset.css';
@import '../styles/index.css';
.user-view {
  margin-left: 0;
}
.form-inline_top .el-form-item {
  height: 32px;
  margin-bottom: 0;
  border: 1px solid #d9d9d9;
}
.form-inline_top {
  margin-left: 16px;
  display: flex;
  align-items: center;
  height: 32px;
}
.self-btn {
  width: 150px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #606266;
  .guideIds-icon {
    color: #c0c4cc;
  }
}
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
  align-items: center;
  /* background-color: red; */
}

.item-down {
  width: 143px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  display: flex;
  flex-direction: row;
  font-size: 14px;
  align-items: center;
  .name {
    width: 42px;
    margin-left: 8px;
  }
}
</style>
