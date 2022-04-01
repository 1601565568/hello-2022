<template>
  <div class="group-container" v-loading="_data._table.loadingtable">
    <div class="group-header">
      <div class="group-header-tip">
        <span>营销对象</span>
        <span>{{_data._pagination.total}}个{{type === 'staff' ? cloudPlatformType === 'ecrp' ? '员工的全部好友' : '成员的全部好友' : '客户分群'}}</span>
      </div>
    </div>
    <div class="new-table group-table">
      <el-table
        style="width: 100%;"
        class="table-form_reset"
        :data="_data._table.data"
      >
        <template v-if="type === 'staff'">
          <el-table-column prop="sendGuideName" :label="cloudPlatformType === 'ecrp' ? '员工姓名' : '成员姓名'">
            <template slot-scope="scope">
              {{ scope.row.sendGuideName || '-' }}
            </template>
          </el-table-column>

          <el-table-column prop="sendGuideWorkNum" label="工号">
            <template slot-scope="scope">
              {{ scope.row.sendGuideWorkNum || '-' }}
            </template>
          </el-table-column>

          <el-table-column prop="workShopName" v-if="cloudPlatformType === 'ecrp'" label="工作门店">
            <template slot-scope="scope">
              <el-popover
                v-if="scope.row.workShopName.length"
                placement="top-start"
                class="item"
                :title="`工作门店（${scope.row.workShopName.length}）`"
                trigger="hover"
                :content="scope.row.workShopName.join('；')">
                <span class="scope-name-tip" slot="reference">{{scope.row.workShopName.length ? scope.row.workShopName.slice(0, 2).join('；') : '-'}}</span>
                <div style="max-width: 400px">
                  {{scope.row.workShopName.join('；')}}
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </template>

        <template v-else>
          <el-table-column prop="ownerWorkNum" label="分群名称">
            <template slot-scope="scope">
              {{ scope.row.ownerWorkNum || '-' }}
            </template>
          </el-table-column>
        </template>

      </el-table>
    </div>
    <el-pagination
      v-if="_data._pagination.enable"
      class="table-pagination"
      :page-sizes="_data._pagination.sizeOpts"
      :total="_data._pagination.total"
      :current-page="_data._pagination.page"
      :page-size="_data._pagination.size"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="$sizeChange$"
      @current-change="$pageChange$">
    </el-pagination>
  </div>
</template>

<script>
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'

export default {
  mixins: [tableMixin],
  props: {
    type: {
      type: String,
      default: 'staff'
    },
    messageId: Number,
    reload: Boolean,
    urlList: String
  },
  watch: {
    reload (newVal, oldVal) {
      if (newVal) {
        this.searchForm()
      }
    }
  },
  data () {
    return {
      // 环境判断
      cloudPlatformType: this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType,
      successTotal: '0',
      url: this.urlList,
      model: {
        id: 0
      }
    }
  },
  mounted () {
    this.model = { id: this.messageId }

    this.searchForm()
    // console.log(this.url, 'url')
    // console.log(this.$api.weWork.sop.getChatRoomInfoList, 'url11')
  },
  methods: {
    searchForm () {
      this.$searchAction$()
    }
  }
}
</script>

<style lang="scss" scoped>
// @import "../../styles/table-reset.css";

.table-form_reset {
  ::v-deep .el-table__header th {
    background-color: #F5F5F5;
    padding: 8px 0;
    .cell {
      position: relative;
      &:after {
        content: ' ';
        position: absolute;
        background: #E8E8E8;
        width: 1px;
        right: 0;
        top: 0px;
        bottom: 0px;
      }
    }
  }

  ::v-deep .employee-talbe-header-cell {
    background: #F5F5F5;
  }

  ::v-deep .el-table__row {
    height: 48px;
  }
}
.group-container {
  width: 100%;

  .group-header {
    width: 100%;
    height: 65px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .group-header-tip {
      margin-left: 16px;
      font-size: 14px;
      span:first-child {
        color: #8C8C8C ;
        margin-right: 8px;
      }
    }
    .export-button {
      margin-right: 16px;
    }
  }
  .group-table {
    width: calc(100% - 32px);
    margin: 0 auto;

    .table-form_reset {
      font-size: 14px;
    }

    .scope-name-tip {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
