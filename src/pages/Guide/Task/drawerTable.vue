<template>
  <div class="drawer">
    <ElScrollbar ref="fullScreen">
      <div class="drawer-head clearfix">
        门店名称
        <ElForm inline class="float-right" :model="form">
          <ElFormItem label="日期：">
            <ElDatePicker
              v-model="form.time"
              type="date"
              placeholder="选择日期" />
          </ElFormItem>
          <NsButton>导出CSV文件</NsButton>
        </ElForm>
      </div>
      <div class="drawer-info">
        执行导购：
        <span class="drawer-info__content">20人（ <span class="text-danger">3</span> 人未完成）</span>
      </div>
      <div class="drawer-table">
        <el-table ref="table" :data="tableData"
                  resizable v-loading.lock="_data._table.loadingtable"
                  style="width: 100%;"
                  :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
          <el-table-column prop="name"
                           label="导购" />
          <el-table-column label="工号" prop="number" />
          <el-table-column prop="store"
                           label="门店名称" />
          <el-table-column align="center"
                           label="任务状态">
            <template slot-scope="scope">
              <span v-if="scope.row.state === 0" class="text-danger">未完成任务</span>
              <span v-if="scope.row.state === 1" class="text-info">任务进行中</span>
              <span v-if="scope.row.state === 2" class="text-success">已完成任务</span>
              <span v-if="scope.row.state === 3">未开始任务</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="time" width="155"
                           label="完成时间" />
          <el-table-column prop="content"
                           label="反馈" >
            <template slot-scope="scope">
              <div v-html="scope.row.content" class="table-content" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination v-if="_data._pagination.enable" class="drawer-footer"
                     :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                     :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                     layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                     @current-change="$pageChange$">
      </el-pagination>
    </ElScrollbar>
  </div>
</template>

<script>
import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  mixins: [tableMixin, scrollHeight],
  components: {
  },
  data () {
    const pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    const tableButtons = [
      {
        func: function () {},
        icon: '$.noop',
        name: '查看详情',
        auth: '',
        visible: ''
      }
    ]

    const model = Object.assign({},
      {
        taskType: '',
        state: '',
        taskName: ''
      },
      {})
    return {
      // 页面滚动条内容高度配置
      scrollBarDeploy: {
        ref: 'fullScreen', // 页面滚动条ref的名称
        excludeHeight: 0
      },
      model: model,
      rules: Object.assign({}, {}, {}),
      url: '',
      // eslint-disable-next-line vue/no-reserved-keys
      _pagination: pagination,
      // eslint-disable-next-line vue/no-reserved-keys
      _table: {
        table_buttons: tableButtons,
        quickSearchMap: {}
      },
      // eslint-disable-next-line vue/no-reserved-keys
      _queryConfig: {
        expand: false
      },
      form: {
        time: ''
      },
      tableData: [{
        name: '姓名',
        store: '门店名称',
        number: 123141241,
        time: '2020/09/30 10:00:00',
        content: '浙江省-杭州市-江干区',
        state: 0
      }, {
        name: '姓名',
        store: '门店名称',
        number: 123141241,
        time: '2020/09/30 10:00:00',
        content: '浙江省-杭州市-江干区',
        state: 1
      }, {
        name: '姓名',
        store: '门店名称',
        number: 123141241,
        time: '2020/09/30 10:00:00',
        content: '浙江省-杭州市-江干区',
        state: 2
      }, {
        name: '姓名',
        store: '门店名称',
        number: 123141241,
        time: '2020/09/30 10:00:00',
        content: '<div><img src="https://img.alicdn.com/bao/uploaded/i1/1640288245/TB2uOXzx2uSBuNkHFqDXXXfhVXa_!!1640288245.png_100x100.jpg" alt=""><img src="https://img.alicdn.com/bao/uploaded/i1/1640288245/TB2uOXzx2uSBuNkHFqDXXXfhVXa_!!1640288245.png_100x100.jpg" alt="">反馈的文本内容+图片</div>',
        state: 3
      }, {
        name: '姓名',
        store: '门店名称',
        number: 123141241,
        time: '2020/09/30 10:00:00',
        content: '浙江省-杭州市-江干区',
        state: 2
      }, {
        name: '姓名',
        store: '门店名称',
        number: 123141241,
        time: '2020/09/30 10:00:00',
        content: '<div><img src="https://img.alicdn.com/bao/uploaded/i1/1640288245/TB2uOXzx2uSBuNkHFqDXXXfhVXa_!!1640288245.png_100x100.jpg" alt=""><img src="https://img.alicdn.com/bao/uploaded/i1/1640288245/TB2uOXzx2uSBuNkHFqDXXXfhVXa_!!1640288245.png_100x100.jpg" alt="">反馈的文本内容+图片</div>',
        state: 3
      }, {
        name: '姓名',
        store: '门店名称',
        number: 123141241,
        time: '2020/09/30 10:00:00',
        content: '浙江省-杭州市-江干区',
        state: 2
      }, {
        name: '姓名',
        store: '门店名称',
        number: 123141241,
        time: '2020/09/30 10:00:00',
        content: '<div><img src="https://img.alicdn.com/bao/uploaded/i1/1640288245/TB2uOXzx2uSBuNkHFqDXXXfhVXa_!!1640288245.png_100x100.jpg" alt=""><img src="https://img.alicdn.com/bao/uploaded/i1/1640288245/TB2uOXzx2uSBuNkHFqDXXXfhVXa_!!1640288245.png_100x100.jpg" alt="">反馈的文本内容+图片</div>',
        state: 3
      }, {
        name: '姓名',
        store: '门店名称',
        number: 123141241,
        time: '2020/09/30 10:00:00',
        content: '浙江省-杭州市-江干区',
        state: 2
      }, {
        name: '姓名',
        store: '门店名称',
        number: 123141241,
        time: '2020/09/30 10:00:00',
        content: '<div><img src="https://img.alicdn.com/bao/uploaded/i1/1640288245/TB2uOXzx2uSBuNkHFqDXXXfhVXa_!!1640288245.png_100x100.jpg" alt=""><img src="https://img.alicdn.com/bao/uploaded/i1/1640288245/TB2uOXzx2uSBuNkHFqDXXXfhVXa_!!1640288245.png_100x100.jpg" alt="">反馈的文本内容+图片</div>',
        state: 3
      }, {
        name: '姓名',
        store: '门店名称',
        number: 123141241,
        time: '2020/09/30 10:00:00',
        content: '浙江省-杭州市-江干区',
        state: 2
      }, {
        name: '姓名',
        store: '门店名称',
        number: 123141241,
        time: '2020/09/30 10:00:00',
        content: '<div><img src="https://img.alicdn.com/bao/uploaded/i1/1640288245/TB2uOXzx2uSBuNkHFqDXXXfhVXa_!!1640288245.png_100x100.jpg" alt=""><img src="https://img.alicdn.com/bao/uploaded/i1/1640288245/TB2uOXzx2uSBuNkHFqDXXXfhVXa_!!1640288245.png_100x100.jpg" alt="">反馈的文本内容+图片</div>',
        state: 3
      }]
    }
  },
  methods: {
    onSearch () {
      // console.log('搜索响应')
    }
  }
}
</script>

<style scoped>
@import "@theme/variables.pcss";
.drawer {
  padding: 0 16px;
}
@component-namespace drawer {
  @b head {
    line-height: 28px;
    font-size: var(--default-font-size-middle);
    padding: 12px 0;
    >>> .el-form-item--small.el-form-item {
      margin: 0 16px 0 0!important;
    }
    >>> .el-button--small {
      position: relative;
      top: 1px;
    }
  }
  @b info {
    margin-top: 8px;
    background: #F2F9FE;
    border-radius: 2px;
    padding: 0 16px;
    color: #303133;
    line-height: 40px;
    @e content {
      color: #262626;
    }
  }
  @b table {
    padding-top: 16px;
    &:before {
      background-color: #E8E8E8;
    }
    >>> th {
      background-color: #f5f5f5;
      padding: 9px 0;
      border-color: #E8E8E8;
      &:first-child .cell {
        padding-left: 25px;
      }
      &:not(:last-child) .cell:after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        content: ' ';
        border-left: 1px solid #E8E8E8;
      }
      .cell {
        padding: 0 9px;
      }
    }
    >>> td {
      padding: 10px 0;
      border-color: #E8E8E8;
      &:first-child .cell {
        padding-left: 25px;
      }
    }
    >>> .table-content {
      img {
        width: 32px;
        height: 32px;
        border-radius: 3px;
        margin-right: 4px;
        & + img {
          margin-left: 4px;
        }
      }
    }
  }
  @b footer {
    padding: 16px;
    box-shadow: none;
  }
}
</style>
