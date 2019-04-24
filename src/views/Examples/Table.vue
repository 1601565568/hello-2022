<template>
  <div>
    <div class="text-main">
      <p class="text-info">表格不能添加 border 配置</p>
      <p class="text-info">表格需添加 stripe 配置（实现斑马线效果）</p>
      <br>
      <p class="font-size-middle">表格字段对齐模式</p>
      <p><span class="text-info">1、居左（不能确定值的字段）：</span>标题，内容、备注、手机号码（考虑扩展场景中有图标，所以宽度不固定）、平台。</p>
      <p><span class="text-info">2、居中（能确定值的字段）：</span>如：单复选（45px）、状态（80px）、时间（年月日100px,包含时分秒150px）、操作（只有一项文字的80px,两项文字120px,三项文字160px）</p>
      <p><span class="text-info">3、居右（数字型字段）：</span>如：积分、金额，保留两位小数</p>
    </div>

    <ns-page-table :colButton="6">
      <!-- 按钮 -->
      <template slot="buttons">
        <ns-table-operate-button :buttons="_data._table.operate_buttons">
        </ns-table-operate-button>
      </template>
      <!-- 按钮-结束 -->

      <!-- 简单搜索 -->
      <template slot="searchSearch">
        <el-form ref="table_filter_form" :model="model" :inline="true" @submit.native.prevent class="pull-right" @keyup.enter.native="onSearch" label-width="80px">
          <el-form-item label="姓名：">
            <el-form-grid size="xmd">
              <el-input placeholder="请输入姓名" v-model="model.name"></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="地址：">
            <el-form-grid size="xmd">
              <el-input placeholder="请输入地址" v-model="model.address"></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item>
            <ns-button type="primary" @click="$searchAction$()">{{$t('operating.search')}}</ns-button>
            <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 简单搜索-结束 -->

      <!-- 表格 -->
      <template slot="table">
        <!-- 表格配置 不能添加 border 配置 -->
        <!-- 表格配置 需添加 stripe （实现斑马线效果） -->

        <!-- 表格单元格宽度配置规范 -->
        <!-- 复选框/单选框 :width="45" -->
        <!-- 日期 年月日 :width="100"   年月日时分秒 :width="150" -->
        <!-- 手机号 :width="120" -->
        <!-- 操作（只有一项文字的80px,两项文字120px,三项文字160px） -->

        <el-table ref="table" :data="tableData" class="template-table__main"
                  stripe
                  resizable v-loading.lock="_data._table.loadingtable"
                  :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
          <el-table-column type="selection" align="center" :width="45">

          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="date"
                           label="日期" :sortable="false" :width="150">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="name"
                           label="姓名" :sortable="false">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="address"
                           label="地址" :sortable="false">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" align="center"
                           label="是否启用" width="100">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.state"></el-switch>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="操作" align="center"
                           width="160">
            <template slot-scope="scope">
              <ns-table-column-operate-button :buttons="_data._table.table_buttons"
                                              :prop="scope">
              </ns-table-column-operate-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 表格-结束 -->

      <!-- 分页 -->
      <template slot="pagination">
        <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                       :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                       :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                       layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                       @current-change="$pageChange$">
        </el-pagination>
      </template>
      <!-- 分页-结束 -->
    </ns-page-table>

    <el-table ref="table" :data="tableList" class="template-table__main"
              stripe
              resizable v-loading.lock="_data._table.loadingtable"
              :element-loading-text="$t('prompt.loading')">
      <el-table-column :show-overflow-tooltip="true" type="default" prop="title"
                       label="权益名称" :sortable="false" :width="200">
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" v-for="(list, $index) in tableList[0].info" :key="$index" align="center"
                       :label="list.title">
        <template slot-scope="scope">
          {{dataFormatter(scope.row, $index)}}
        </template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" type="default" align="center"
                       label="是否启用" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state"></el-switch>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="操作" align="center"
                       width="160">
        <template slot-scope="scope">
          <ns-table-column-operate-button :buttons="_data._table.table_buttons"
                                          :prop="scope">
          </ns-table-column-operate-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import tableMixin from 'web-crm/src/mixins/table'
export default {
  name: 'ColumnTable',
  mixins: [tableMixin],
  props: {
    types: Object
  },
  data: function () {
    var operateButtons = [
      {
        'func': function () {
        },
        'icon': '',
        'name': '新增',
        'auth': ``,
        'visible': ``
      },
      {
        'func': function () {
        },
        'icon': '',
        'name': '编辑',
        'auth': ``,
        'visible': ''
      },
      {
        'func': function () {
        },
        'icon': '',
        'name': '删除',
        'auth': ``,
        'visible': ``
      }
    ]
    var tableButtons = [
      {
        'func': function (obj) {},
        'icon': '$.noop',
        'name': '详情',
        'auth': ``,
        'visible': ``
      },
      {
        'func': function (obj) {},
        'icon': '$.noop',
        'name': '修改',
        'auth': ``,
        'visible': ``
      },
      {
        'func': function (obj) {},
        'icon': '$.noop',
        'name': '删除',
        'auth': ``,
        'visible': ``
      },
      {
        'func': function (obj) {
        },
        'icon': '$.noop',
        'name': '跟踪',
        'auth': ``,
        'visible': ``
      }
    ]

    var quickSearchModel = {}
    var model = Object.assign({},
      {
        name: '',
        address: ''
      },
      {})

    return {
      model: model,
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      state: {},
      tableData: [{
        date: '2016-05-02 12:12:12',
        name: '赵小虎',
        number: '12345678901',
        address: '上海市普陀区金沙江路 1518 弄',
        state: true
      }, {
        date: '2017-07-07 12:12:12',
        name: '钱小虎',
        number: '12345678901',
        address: '上海市普陀区金沙江路 1517 弄',
        state: true
      }, {
        date: '2018-08-08 12:12:12',
        name: '孙小虎',
        number: '12345678901',
        address: '上海市普陀区金沙江路 1519 弄',
        state: true
      }, {
        date: '2015-05-05 12:12:12',
        name: '李小虎',
        number: '12345678901',
        address: '上海市普陀区金沙江路 1516 弄',
        state: false
      }],
      tableList: [{
        title: '折扣',
        info: [{
          title: 'v1',
          message: [{ type: 1, value: 10 }]
        }, {
          title: 'v2',
          message: [{ type: 1, value: 9 }]
        }, {
          title: 'v3',
          message: [{ type: 1, value: 8 }]
        }, {
          title: 'v4',
          message: [{ type: 1, value: 7 }]
        }],
        state: true
      }, {
        title: '送积分',
        info: [{
          title: 'v1',
          message: [{ type: 1, value: 100 }]
        }, {
          title: 'v2',
          message: [{ type: 2, value: 1.5 }]
        }, {
          title: 'v3',
          message: [{ type: 2, value: 2 }]
        }, {
          title: 'v4',
          message: [{ type: 2, value: 3 }]
        }],
        state: true
      }, {
        title: '生日礼',
        info: [{
          title: 'v1',
          message: [{ type: 1, value: 0 }]
        }, {
          title: 'v2',
          message: [{ type: 2, value: 50 }]
        }, {
          title: 'v3',
          message: [{ type: 2, value: 100 }]
        }, {
          title: 'v4',
          message: [{ type: 2, value: 200 }]
        }],
        state: true
      }, {
        title: '贵宾室',
        info: [{
          title: 'v1',
          message: [{ type: 1, value: 0 }]
        }, {
          title: 'v2',
          message: [{ type: 1, value: 0 }]
        }, {
          title: 'v3',
          message: [{ type: 2, value: 1 }]
        }, {
          title: 'v4',
          message: [{ type: 2, value: 2 }]
        }],
        state: false
      }],
      grades: [],
      url: this.$api.database.black.queryTable,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchMap: {}
      }
    }
  },

  mounted: function () {
  },
  methods: {
    /* 表格格式化函数
       * title 所属权益名称
       * listData 权益名称对应的权益内容
       * value 权益内容对应属性值
       * */
    dataFormatter (row, index) {
      var title = row.title
      var listData = row.info[index].message[0]
      var value = listData.value
      if (title === '折扣') {
        value = this.discountFormatter(value)
      } else if (title === '送积分') {
        value = this.integralFormatter(listData, value)
      } else if (title === '生日礼') {
        value = this.giftFormatter(value)
      } else if (title === '贵宾室') {
        value = this.roomFormatter(value)
      }
      return value
    },
    /* 折扣权益内容格式化 */
    discountFormatter (value) {
      return `${value}折`
    },
    /* 送积分权益内容格式化 */
    integralFormatter (listData, value) {
      return listData.type === 1 ? `多送${value}` : `${value}倍`
    },
    /* 生日礼权益内容格式化 */
    giftFormatter (value) {
      return value !== 0 ? `价值${value}元生日大礼包一份` : '-'
    },
    /* 贵宾室权益内容格式化 */
    roomFormatter (value) {
      return value !== 0 ? `贵宾室服务，可带${value}人` : '-'
    },

    onSearch () {
      console.log('搜索响应')
    }
  }
}
</script>

<style scoped>
  @import "@/style/small/variables.pcss";
  .text-main {
    padding: var(--default-padding-base);
    margin-bottom: var(--default-margin-base);
    background-color: var(--theme-color-white);
    p {
      line-height: 30px;
    }
  }
  .template-table__main {
    margin-top: var(--default-margin-base);
  }
</style>
