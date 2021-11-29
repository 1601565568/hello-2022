<template>
  <ElDrawer
    size="720px"
    class="drawer"
    :modal="false"
    :visible="visible"
    direction="rtl"
    append-to-body
    @close="$emit('update:visible', false)"
    @open="open"
  >
    <template slot="title">
      <h3 class="title">发表明细</h3>
    </template>
    <div class="drawer_content" ref="DrawerContent">
      <div class="group-container" v-loading="_data._table.loadingtable" element-loading-text="加载中，请稍等…">
        <div class="group-header1">
          <div class="group-header-tip">
            <span>总计：</span>
            <span> {{_data._ext ? (Number(_data._ext.published) + Number(_data._ext.unpublished)) : '' }}人</span>
          </div>
          <div class="group-header-tip">
            <span>已发表人数：</span>
            <span>{{_data._ext && _data._ext.published}}人</span>
          </div>
          <div class="group-header-tip">
            <span>未发表人数：</span>
            <span>{{_data._ext && _data._ext.unpublished}}人</span>
          </div>
        </div>
        <div class="group-header2">
          <el-form :inline="true" class='form-inline_top' style="display: flex">
            <el-form-item label="发表状态：" class='el-form__change'>
              <el-select v-model="model.publishStatus"  @change="changeStatus" placeholder="请选择">
                <el-option
                  v-for="item in messageTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择员工：">
              <NsGuideDialog :selfBtn='true' :appendToBody='true' :isButton="false" :auth="false" type="primary" btnTitle="" dialogTitle="选择员工" v-model="model.guideIds" @input="confirmGuideIds">
                <template slot='selfBtn'>
                  <div class='self-btn'>
                    {{(model.guideIds&&model.guideIds.length)?`已选择${model.guideIds.length}个员工`:'全部'}}
                    <Icon type="geren" class='guideIds-icon'></Icon>
                  </div>
                </template>
              </NsGuideDialog>
            </el-form-item>
          </el-form>
          <NsButton class="export-button" size="medium" @click="exportFile">导出文件</NsButton>
        </div>
        <div class="new-table group-table">
          <el-table
            style="width: 100%;"
            class="table-form_reset"
            :data="_data._table.data"
          >
            <el-table-column prop="guideName" label="员工" width="150px"></el-table-column>
            <el-table-column prop="workNumber" label="工号">
              <template v-slot="scope">
                {{scope.row.workNumber || '-'}}
              </template>
            </el-table-column>
            <el-table-column prop="publishStatus" label="发表状态" width="90px">
              <template v-slot="scope">
                {{scope.row.publishStatus === 0 ? '未发表' : '已发表'}}
              </template>
            </el-table-column>
            <el-table-column prop="shopName" label="所属门店" show-overflow-tooltip>
              <template v-slot="scope">
                <div class="shops">
                  <div class="shopname">
                    {{scope.row.shopName}}
                  </div>
                  <span v-if="scope.row.shopName.length > 20">共{{scope.row.shopName.split(',').length}}家门店</span>
                </div>
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
    </div>
  </ElDrawer>
</template>

<script>
// import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import tableMixin from '@/mixins/table'
import ElDrawer from '@nascent/nui/lib/drawer'
import NsGuideDialog from '@/components/NsGuideDialog'

export default {
  mixins: [tableMixin],
  components: {
    ElDrawer,
    NsGuideDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    momentId: String
  },
  data () {
    return {
      test: '',
      loading: false,
      url: this.$api.guide.momentList.getMomentTask,
      model: {
        guideIds: [],
        momentId: '',
        publishStatus: null
      },
      messageTypeOptions: [
        {
          value: null,
          label: '全部'
        },
        {
          value: 0,
          label: '未发表'
        },
        {
          value: 1,
          label: '已发表'
        }
      ]
    }
  },
  methods: {
    changeStatus () {
      this.searchForm()
    },
    searchForm () {
      this.$searchAction$()
    },
    confirmGuideIds () {
      this.searchForm()
    },
    open () {
      this.model = { momentId: this.momentId, publishStatus: null }
      this.searchForm()
    },
    resetScroll () {
      this.$refs.DrawerContent.parentElement.scrollTop = 0
    },
    exportFile () {
      if (!this._data || !this._data._table || !this._data._table.data || this._data._table.data.length < 1) {
        this.$notify.error('当前没有匹配的数据项')
        return
      }

      this.$notify.info('导出中，请稍后片刻')
      this.$http.fetch(this.$api.guide.momentList.exportMomentTask, { searchMap: this.model })
        .then((resp) => {
          let url = window.URL.createObjectURL(new Blob([resp.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url

          const fileName = decodeURIComponent(resp.headers['content-disposition'].split('=')[1])
          link.setAttribute('download', fileName)

          document.body.appendChild(link)
          link.click()
          this.$notify.success('下载完成')
        }).catch((resp) => {
          this.$notify.error('导出报错，请联系管理员')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./reset.css";

.drawer {
  .title {
    font-size: 16px;
    color: #262626;
    line-height: 24px;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #9093994d;
  }

  .drawer_content {
    .group-container {
      width: 100%;
      .group-header1 {
        display: flex;
        margin-top: 14px;
        .group-header-tip {
          margin-left: 16px;
          font-size: 14px;
          span:first-child {
            margin-right: 5px;
          }
        }
      }
      .group-header2 {
        margin-top: 16px;
        width: 100%;
        height: 65px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .self-btn {
          font-size: 14px;
          width: 130px;
          color: #606266;
          display: flex;
          /* align-content: center; */
          align-items: center;
          justify-content: space-between;
          .guideIds-icon {
            color: #c0c4cc;
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
        .shops {
          display: flex;
          width: 220px;
          .shopname {
            display: inline-block;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          span {
            padding-right: 15px;
            flex-shrink: 0;
          }
        }
      }
    }
  }
}
</style>
