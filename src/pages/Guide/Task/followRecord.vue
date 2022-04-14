<template>
  <div class="drawer">
    <ElScrollbar ref="fullScreen">
      <div class="nav">导购的跟进记录</div>
      <div class="content">
        <el-timeline :reverse="false">
          <el-timeline-item
            v-for="itemF in recordData"
            :key="itemF.id"
            :timestamp="itemF.followTime"
            placement="top"
          >
            <div class="content">
              <div class="text" v-if="itemF.remark">{{ itemF.remark }}</div>
              <div class="pic" v-if="itemF.urlJson&&itemF.urlJson.length > 0">
                <div
                  class="picItem"
                  v-for="(item, index) in itemF.urlJson"
                  :key="index"
                  @click="onShowPic(itemF.urlJson,index)"
                >
                  <img :src="item" />
                </div>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
       <el-pagination
        v-if="pagination.enable"
        class="drawer-footer"
        :page-sizes="pagination.sizeOpts"
        :total="pagination.total"
        :current-page="pagination.page"
        :page-size="pagination.size"
        :pager-count="5"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="$sizeChange$"
        @current-change="$currentChange$"
      />
    </ElScrollbar>
    <NsPreview ref="NsPreview" :appendToBody="true"></NsPreview>
  </div>
</template>

<script>
import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import NsPreview from '@/components/NsPreview'
import ElTimeline from '@nascent/nui/lib/timeline'
import ElTimelineItem from '@nascent/nui/lib/timeline-item'
import { getErrorMsg } from '@/utils/toast'
import log from '@/apis/weWork/log'
export default {
  props: {
    runType: {
      type: Number,
      default: 0
    },
    draw: {
      type: Number
    },
    followType: {
      type: Number
    },
    guideId: {
      type: Number
    },
    queryDate: {
      type: String,
      default: null
    },
    shopId: {
      type: String
    },
    taskId: {
      type: String
    },
    subgroupCustomerId: {
      type: String
    }
  },
  mixins: [scrollHeight],
  components: {
    NsPreview,
    ElTimeline,
    ElTimelineItem
  },
  data () {
    const pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    return {
      // 页面滚动条内容高度配置
      scrollBarDeploy: {
        ref: 'fullScreen', // 页面滚动条ref的名称
        excludeHeight: 0
      },
      recordData: [],
      pagination: pagination
    }
  },
  methods: {
    init () {
      this.queryTask()
    },
    queryTask () {
      // 这个接口还可以接收三个参数，orderDir orderKey searchValue 暂时用不到
      const params = {
        draw: this.draw,
        length: this.pagination.size,
        start: (this.pagination.page - 1) * this.pagination.size,
        searchMap: {
          guideId: this.guideId,
          queryDate: this.queryDate,
          shopId: this.shopId,
          taskId: this.taskId,
          subgroupCustomerId: this.subgroupCustomerId
        }
      }
      this.$http
        .fetch(this.$api.guide.queryRecord, params)
        .then((resp) => {
          if (resp.success) {
            this.recordData = resp.result.data
            this.pagination.total = Number(resp.result.recordsTotal)
          }
        })
        .catch((resp) => {
          this.$notify.error(getErrorMsg('查看导购任务详情失败', resp))
        })
    },
    // 分页功能
    $currentChange$ (data) {
      this.pagination.page = data
      this.queryTask()
    },
    $sizeChange$ (data) {
      this.pagination.size = data
      this.queryTask()
    },
    onShowPic (arr, index) {
      // console.log(arr)
      this.$refs.NsPreview.toggleShow(0, arr)
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
.drawer {
  height: 100vh;
  overflow-y: auto;
  padding:0 16px;
}
.nav {
  width: 100%;
  height: 56px;
  font-size: 16px;
  color: #262626;
  line-height: 56px;
  font-weight: 500;
  margin-bottom: 16px;
}
.content{
   .el-timeline{
    padding-left: 2px;
  }
  .text{
    overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 8px;
  font-size: 14px;
  color: #595959;
  line-height: 22px;
  }
  .pic{
    margin-bottom: 4px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .picItem{
      width: 59px;
      height: 59px;
      margin-right: 4px;
      border-radius: 2px;
      img{
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  >>>.el-timeline-item__wrapper{
    padding-left: 20px;
  }
  >>>.el-timeline-item__node--normal{
    border: 1px solid rgba(0,148,252,1);
    background: #fff;
  }
  >>>.el-timeline-item__tail{
    border-left: 1px solid rgba(232,232,232,1);
  }
  >>>.el-timeline-item__timestamp.is-top{
    padding-top: 0;
    margin-bottom: 8px;
  }
  >>>.el-timeline-item__timestamp{
    font-size: 14px;
    color: #262626;
    line-height: 17px;
    font-weight: 500;
  }
}
.drawer-footer{
    padding: 16px;
    box-shadow: none;
    >>> .el-pagination__total {
      font-size: 14px;
      color: #262626;
      line-height: 30px;
    }
    >>> .el-select .el-input .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
    >>> .el-pagination__sizes .el-input .el-input__inner {
      font-size: 14px;
    }
     >>>.btn-prev .el-icon {
      font-size: 16px;
      margin-top: 2px;
    }
    >>>.btn-next .el-icon {
      font-size: 16px;
      margin-top: 2px;
    }
    >>> .el-pager li {
      font-size: 14px;
      width: 32px;
      height: 32px;
      line-height: 32px;
      border: 1px solid rgba(217, 217, 217, 1);
      border-radius: 2px;
      box-sizing: border-box;
      margin-right: 8px;
      min-width: 32px;
    }
    >>> .el-pager li.active {
      border: none;
    }
    >>> .el-pagination__jump{
      font-size: 14px;
    }
    >>>.el-pagination__editor.el-input{
      width: 50px;
      height: 32px;
      border: 1px solid rgba(217,217,217,1);
      border-radius: 2px;
      box-sizing: border-box;
      margin:0 8px
    }
    >>>.el-input.el-input--small .el-input__inner{
      border: none;
    }
  }
</style>
