<template>
  <div class="template_main">
    <div class="template-page">
      <div class="page-header">
        <div class="page-header__text">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item
              :to="{ path: '/PerformanceAppraisal/SalesStatistics/List' }"
              >绩效考核</el-breadcrumb-item
            >
            <el-breadcrumb-item>销售数据统计</el-breadcrumb-item>
          </el-breadcrumb>
          <span class="head-title">销售数据统计</span>
        </div>
      </div>
    </div>

    <div class="blue-tip">
      <div>点击设置销售数据计算规则</div>
      <div>
        <ns-button type="text" @click="handlePreview(true, 1)"
          >统计设置</ns-button
        >
      </div>
    </div>
    <div class="page-content">
      <el-tabs class="el-tabs" v-model="tabId">
        <el-tab-pane
          v-for="item in tabOptions.tabList"
          :key="item.name"
          :label="item.name"
        ></el-tab-pane>
      </el-tabs>
      <div class="params-container">
        <el-form :inline="true" class="form-inline_top">
          <el-form-item>
            <div class="shop-content">
              <span>选择{{ platformText }}：</span>
              <GuideDialog
                :selfBtn="true"
                :appendToBody="true"
                :switchAreaFlag="1"
                :isButton="false"
                :auth="true"
                type="primary"
                btnTitle=""
                :dialogTitle="`选择${platformText}`"
                v-model="guideIds"
                @input="guideClick"
              >
                <template slot="selfBtn">
                  <div class="self-btn">
                    {{
                      guideIds && guideIds.length
                        ? `已选择${guideIds.length}个${platformText}`
                        : "全部"
                    }}
                    <Icon type="geren" class="guideIds-icon"></Icon>
                  </div>
                </template>
              </GuideDialog>
            </div>
          </el-form-item>
          <el-form-item label="订单来源：" class="el-form__change">
            <el-select
              v-model="model.payConfigId"
              placeholder="请选择"
              @change="handleChangePay"
            >
              <el-option
                v-for="item in orderOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="店铺来源：" class="el-form__change">
            <el-select
              v-model="model.payConfigId"
              placeholder="请选择"
              @change="handleChangePay"
            >
              <el-option
                v-for="item in storeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期: ">
            <el-date-picker
              style="margin-left:15px"
              value-format="yyyy-MM-dd"
              format="yyyy/MM/dd"
              type="date"
              :clearable="false"
              v-model="tableParams.time"
              @change="handleSearch"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="_data._table.data"
        class="new-table_border table-container"
        style="width: 100%"
      >
        <el-table-column prop="name">
          <template slot="header">
            企业微信成员
            <el-tooltip
              effect="light"
              popper-class="popperClass"
              placement="top"
            >
              <Icon type="question-circle" class="question-circle" />
              <template slot="content">
                企业微信后台专属对外信息被删除或取消显示时，状态则会提醒异常，<br />请及时前往企业微信后台新增相同名称的专属对外信息或恢复显示
              </template>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="webTitle" label="下单金额/笔数">
        </el-table-column>
        <el-table-column prop="style" label="付款金额/笔数"> </el-table-column>
        <el-table-column prop="status" label="退款金额/笔数"> </el-table-column>
        <el-table-column prop="status" label="平均客单价"> </el-table-column>
        <el-table-column prop="status" label="购买人数"> </el-table-column>
        <el-table-column prop="status" label="购买率"> </el-table-column>
        <el-table-column prop="address" width="125px" label="操作">
          <template slot-scope="scope">
            <ns-button type="text" @click="handleDetail(scope.row.id)"
              >详情</ns-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="_data._pagination.enable"
        class="template-table__pagination"
        :page-sizes="_data._pagination.sizeOpts"
        :total="_data._pagination.total"
        :current-page="_data._pagination.page"
        :page-size="_data._pagination.size"
        layout="slot, sizes, prev, pager, next, jumper"
        @size-change="$sizeChange$"
        @current-change="$pageChange$"
      >
        <span class="pagination-text">单页显示: </span>
      </el-pagination>
    </div>

    <el-dialog
      title="对外信息展示"
      custom-class="full-dialog"
      class="full-dialog"
      height="600px"
      width="1000px"
      :visible.sync="previewVisin"
    >
      <div class="dialog-content">
        <div class="blue-tip">
          <template v-if="previewType === 1">
            <div>
              路径：我的企业->通讯录管理->对外资料显示-修改->添加自定义信息<br />添加自定义信息：名称可自定义，类型请选择“网页”。
            </div>
          </template>
          <template v-if="previewType === 2">
            企业可在企业成员的企业信息处配置专属对外信息，可在专属对外信息内添加文字、图片、视频等，客户在员工名片点击后，即可进入由企业发布的内容页面，达到内容营销的作用。
          </template>
        </div>
        <!-- <template v-if="previewType === 1">
          <img src="./images/peizhi.png" class="full-img" />
        </template>
        <template v-if="previewType === 2">
          <img src="./images/shouji.png" class="full-img padding-img" />
        </template> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import Index from './src/index'
// import PageTable from '@/components/NewUi/PageTablePro'
// import NsGuideDialog from '@/components/NsGuideDialog'
// import ElDrawer from '@nascent/nui/lib/drawer'
// import NsShopDialog from '@/components/NsShopDialog'
import ElBreadcrumb from '@nascent/nui/lib/breadcrumb'
import ElBreadcrumbItem from '@nascent/nui/lib/breadcrumb-item'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
import GuideDialog from '@/components/NewUi/GuideDialog'
// import AllTable from './components/List/AllTable'
// import EachTable from './components/List/EachTable'
// Index.components = {
//   PageTable,
//   ElDrawer,
//   NsShopDialog,
//   NsGuideDialog,
//   ElBreadcrumb,
//   ElBreadcrumbItem
//   // AllTable,
//   // EachTable
// };
export default {
  components: {
    // PageTable,
    // ElDrawer,
    // NsShopDialog,
    // NsGuideDialog,
    GuideDialog,
    ElBreadcrumb,
    ElBreadcrumbItem
  },
  computed: {
    platformText() {
      return '111'
    }
  },
  data() {
    return {
      previewVisin: false, // 弹框状态
      previewType: 1, // 弹框展示内容 1 配置说明 2 对外信息展示 说明
      url: this.$api.weWork.friendsCircle.profileList,
      delectingIds: [], // 正在删除中的id
      tabId: null,
      tabOptions: {
        tabList: [{ name: '成员销售数据' }, { name: '群销售数据' }]
      },
      tableParams: {},
      guideIds: [],
      orderOptions: [],
      storeOptions: []
    }
  },
  mixins: [tableMixin],
  methods: {
    fetchList() {},
    handleSearch() {},
    /**
     * 查看/关闭 配置说明
     * @param {*} previewVisin
     */
    handlePreview(previewVisin, previewType) {
      this.previewType = previewType
      this.previewVisin = previewVisin
    },
    /**
     * 去企微
     */
    handleQY() {
      window.open(
        'https://work.weixin.qq.com/wework_admin/loginpage_wx?redirect_uri=https://work.weixin.qq.com/wework_admin/frame#profile/contactsMng/exMemberAttrVisable'
      )
    },
    /**
     * 删除
     * @param {number} id
     */
    handleDelect(id) {
      this.$confirm(
        '删除后，网页中的内容将被清空，是否确认删除？',
        '提示信息',
        {
          confirmButtonText: '确定',
          type: 'warning',
          cancelButtonText: '取消'
        }
      ).then(() => {
        this.requestDelect(id)
      })
    },
    /**
     * 请求删除
     * @param {number} id
     */
    requestDelect(id) {
      this.delectingIds.push(id)
      this.$http
        .fetch(this.$api.weWork.friendsCircle.profileDelById, { id })
        .then(() => {
          this.$notify.success('删除成功')
          this.$searchAction$()
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('删除失败', resp))
          const index = this.delectingIds.findIndex(item => item.id === id)
          this.delectingIds.split(index, 1)
        })
    },
    /**
     * 同步修改单条状态
     * @param {number} state 需要修改的状态
     * @param {number} index  下标修改状态使用
     */
    changeState(status, index) {
      this.$set(this._data._table.data, index, {
        ...this._data._table.data[index],
        status
      })
    },
    /**
     * 更新
     * @param {number} id
     * @param {number} index  下标修改状态使用
     */
    handleRefresh(id, index) {
      this.changeState(1, index)
      this.$http
        .fetch(this.$api.weWork.friendsCircle.profileSync, { id })
        .then(res => {
          this.changeState(res.result, index)
          this.$notify.success('更新成功')
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('更新失败', resp))
        })
    },
    /**
     * 编辑/新建
     * @param {number｜null} id
     */
    handleDetail(id) {
      const query = id ? { id } : {}
      this.$router.push({
        path: '/Marketing/FriendsCircle/OutEdit',
        query
      })
    },
    tabSwitchActivityList() {},
    initPageData() {
      this.paginationToDate = {
        ...this.paginationToDate,
        size: 10,
        page: 1
      }
      this.paginationToPerson = {
        ...this.paginationToPerson,
        size: 10,
        page: 1
      }
    },
    guideClick() {
      // this.initPageData()
      // this.loadDateList()
      // this.loadMaterialList()
      // this.loadChartData()
    },
    handleChangePay() {}
  },
  mounted() {
    this.$searchAction$()
  }
}
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.title-tab {
  display: flex;
  margin-left: 16px;
  position: relative;
  &::before {
    content: " ";
    position: absolute;
    left: 0;
    top: 50%;
    height: 24px;
    width: 1px;
    margin-top: -12px;
    background: #e8e8e8;
  }
  .tab-item {
    padding: 0 16px;
    font-size: 14px;
    color: #595959;
    cursor: pointer;
    font-weight: normal;
    &.active {
      color: #262626;
      font-weight: bold;
    }
  }
}
.self-btn {
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #606266;
  .guideIds-icon {
    color: #c0c4cc;
  }
}
.dialog-content {
  background: #f5f5f5;
  width: 100%;
  .blue-tip {
    margin: 16px 0;
  }
  .full-img {
    width: 100%;
    &.padding-img {
    }
  }
}
.refresh-btn {
  font-size: 14px;
  margin-left: 5px;
  cursor: pointer;
}
.col-text_error {
  color: #f39801;
}
.template_main {
  .head-title {
    display: inline-block;
    margin-top: 16px;
  }
  .page-content {
    margin-top: 16px;
    padding: 0 16px 16px;
    background: #fff;
  }
  .params-container {
    margin-top: 16px;
  }
  .table-container {
    margin-top: 16px;
  }
  .shop-content {
    // position: relative;
    // top: -1px;
    display: flex;
    // font-size: 14px;
    // border: 1px solid #D9D9D9;
    // height: 30px;
    // align-items: center;
    // padding: 0 8px;
    // border-radius: 2px;
    // margin-left: 16px;
  }
  .pagination-text {
    float: left;
    font-weight: 400;
  }
}

//
.page-header {
  background: #ffffff;
  margin: -10px -10px 0;
  padding: 16px;
  margin-bottom: 16px;
}
.page-header__text {
  font-size: 16px;
  color: #262626;
  line-height: 24px;
  font-weight: bold;
}
.template-table__pagination {
  padding: 13px 20px;
}
</style>
<style scoped>
.template_main >>> .full-dialog {
  padding-bottom: 20px;
  box-sizing: content-box;
}
.template_main >>> .el-tabs__header {
  border-bottom: none;
}
</style>
