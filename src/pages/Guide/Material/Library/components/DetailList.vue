<template>
  <el-drawer
    :visible.sync="drawer"
    :direction="direction"
    :before-close="handleClose"
    size="720px"
    :with-header="false"
  >
    <div>
      <div class="close-view">
        <Icon type="close" class="close-icon" @click="closeDeawer" />
      </div>
      <div class="drawer-title">自创明细</div>
      <el-select v-model="value" placeholder="所属员工：" class="drawer-select">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div class="drawer-showinfo">
        <div>
          <span>已完成员工 100人</span>
          <span style="margin-left:46px"
            >未完成员工 <span class="remind-text">100</span>人</span
          >
        </div>
        <div class="drawer-output">
          导出CSV文件
        </div>
      </div>
      <page-table style="padding-top:0">
        <template slot="table">
          <el-table :data="listData" class="new-table_border drawer-table">
            <el-table-column prop="time" label="完成时间"> </el-table-column>
            <el-table-column prop="guideName" label="员工"> </el-table-column>
            <el-table-column prop="shopName" label="所属门店">
            </el-table-column>
            <el-table-column prop="title" width="125px" label="操作">
              <template>
                <ns-button type="text" class="select-button">查看</ns-button>
                <ns-button type="text" class="select-button">删除</ns-button>
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
  </el-drawer>
</template>
<script>
import ElDrawer from '@nascent/nui/lib/drawer'
import PageTable from '@/components/NewUi/PageTable'
import { getErrorMsg } from '@/utils/toast'
export default {
  name: 'detailList',
  components: { ElDrawer, PageTable },
  props: {
    materialScriptId: {
      type: Number,
      default: 1807
    }
  },
  data () {
    return {
      title: '自创明细',
      direction: 'rtl',
      drawer: false,
      listData: [],
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      value: '',
      guideIdsStr: '',
      isCompletion: 0,
      shopIdsStr: '',
      // 分页配置
      pagination: {
        size: 10,
        sizeOpts: [10],
        page: 1,
        total: 0
      }
    }
  },
  mounted () {},
  methods: {
    handleSizeChange (size) {
      this.pagination = {
        ...this.pagination,
        size,
        page: 1
      }
      this.loadList()
    },
    handleCurrentChange (page) {
      this.pagination.page = page
      this.loadList()
    },
    closeDeawer () {
      this.drawer = !this.drawer
      this.pagination = {
        size: 10,
        sizeOpts: [10],
        page: 1,
        total: 0
      }
      this.loadList()
    },
    handleClose () {},
    loadList () {
      const params = {
        searchMap: {
          materialScriptId: this.materialScriptId,
          guideIdsStr: this.guideIdsStr,
          isCompletion: this.isCompletion,
          shopIdsStr: this.shopIdsStr
        },
        start: (this.pagination.page - 1) * this.pagination.size,
        length: this.pagination.size
      }
      this.$http
        .fetch(this.$api.guide.findScriptCompletionDetailList, params)
        .then(resp => {
          console.log(resp)
          if (resp.success) {
            this.listData = resp.result.data
            this.pagination.total = parseInt(resp.result.recordsTotal)
          }
          this.$notify.success(`${this.title}成功`)
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg(this.title, resp))
        })
        .finally(() => {})
    }
  }
}
</script>
<style scoped lang="scss">
@import '@components/NewUi/styles/reset.css';
.drawer-title {
  height: 53px;
  font-size: 16px;
  color: #262626;
  line-height: 53px;
  padding-left: 16px;
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
  border-radius: 2px;
  line-height: 32px;
  text-align: center;
}
.drawer-select {
  margin-left: 16px;
  margin-top: 16px;
  width: 143px;
  height: 32px;
  background: #ffffff;
  border-radius: 2px;
  font-size: 14px;
  color: #262626;
}
.select-button {
  font-size: 14px;
  color: #0094fc;
  font-weight: 400;
}
.remind-text {
  color: #0091fa;
}
</style>
