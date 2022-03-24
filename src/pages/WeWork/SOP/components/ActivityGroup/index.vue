<template>
  <div class="group-container" v-loading="_data._table.loadingtable">
    <div class="group-header">
      <div class="group-header-tip" v-if="type === 'activity'">
        <span>发送群</span>
        <span>{{_data._pagination.total}}个群</span>
      </div>
      <div class="group-header-tip" v-else-if="type === 'log'">
        <span>发送结果</span>
        <span>{{successTotal}}/{{_data._pagination.total}}个群</span>
      </div>
      <NsButton class="export-button" size="medium" @click="exportFile">导出文件</NsButton>
    </div>
    <div class="new-table group-table">
      <el-table
        style="width: 100%;"
        class="table-form_reset"
        :data="_data._table.data"
      >
        <el-table-column prop="chatRoomName" label="群名称" ></el-table-column>
        <el-table-column prop="sendGuideName" label="执行员工" >
           <template slot-scope="scope">
            {{ scope.row.sendGuideName || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="sendGuideWorkNum" label="执行员工工号" width="110" >
          <template slot-scope="scope">
            {{ scope.row.sendGuideWorkNum || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="ownerName" label="群主"></el-table-column>
        <el-table-column prop="ownerWorkNum" label="群主工号">
          <template slot-scope="scope">
            {{ scope.row.ownerWorkNum || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="personNum" label="群成员数"></el-table-column>
        <el-table-column prop="workShopName" label="工作门店">
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
        <el-table-column v-if="type === 'log'" prop="status" label="结果">
          <template slot-scope="scope">
            {{ scope.row.status === 0 ? '未知' : '成功' }}
          </template>
        </el-table-column>
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
      default: 'activity',
      validator: function (value) {
        // activity 活动或审核 log 发送日志页面
        return ['activity', 'log'].indexOf(value) !== -1
      }
    },
    activityId: Number,
    reload: Boolean,
    activityCode: String
  },
  watch: {
    reload (newVal, oldVal) {
      if (newVal) {
        this.model = { id: this.activityId }
        if (this.type === 'log') this.getSuccessTotal()
        this.searchForm()
      }
    }
  },
  data () {
    return {
      successTotal: '0',
      url: this.$api.weWork.sop.getChatRoomInfoList,
      model: {
        id: 0
      }
      // _order: {
      //   orderDir: 'desc',
      //   orderKey: 'personNum'
      // }
    }
  },
  mounted () {
    this.model = { id: this.activityId }

    if (this.type === 'log') {
      this.getSuccessTotal()
    }
    this.searchForm()
  },
  methods: {
    searchForm () {
      this.$searchAction$()
    },
    /**
     * 获取发送成功消息数
     */
    getSuccessTotal () {
      this.$http.fetch(this.$api.weWork.sop.getSuccessTotal, this.model)
        .then(resp => {
          this.successTotal = resp.result
        }).catch((respErr) => {
          this.$notify.error('获取总成功数失败')
        })
    },
    exportFile () {
      if (!this._data || !this._data._table || !this._data._table.data || this._data._table.data.length < 1) {
        this.$notify.error('当前没有匹配的数据项')
        return
      }
      const params = {
        id: this.activityId,
        showSuccessField: this.type === 'log' ? 1 : 0,
        exportType: 5,
        code: this.activityCode
      }
      this.$http.fetch(this.$api.guide.task.exportExcel, params).then((resp) => {
        this.$notify.success('文件已导入下载中心')
      }).catch((resp) => {
        this.$notify.error(resp.msg || '导出报错，请联系管理员')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/table-reset.css";

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
