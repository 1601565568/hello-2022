<!--
 * @Date: 2022-04-19 14:15:10
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-28 11:13:24
 * @FilePath: \ECRP-SG-WEB\src\pages\PerformanceAppraisal\memberStatistics\index.vue
-->
<template>
  <ns-page-table>
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data.table.operate_buttons">
      </ns-table-operate-button>
    </template>
    <template slot="searchSearch">
      <el-form
        :model="quickSearchModel"
        :inline="true"
        @submit.native.prevent
        class="pull-right"
      >
        <el-form-item label="企业标签: ">
          <ns-select
            v-model="quickSearchModel.workTag"
            filterable
            clearable
            :props="propsSet"
            :params="selectParams"
            :url="$api.weWork.externalContact.queryCorpTagList"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            ref="quickText"
            v-model.trim="quickSearchModel.customerNameOrPlatNick"
            placeholder="微信/平台昵称"
            @keyup.enter.native="$quickSearchAction$('customerNameOrPlatNick')"
          >
            <Icon
              type="search"
              className=" el-input__icon"
              style="padding: 5px"
              slot="suffix"
              name="name"
              @click="$quickSearchAction$('customerNameOrPlatNick')"
            />
          </el-input>
        </el-form-item>
        <el-form-item>
          <ns-button type="primary" @click="$searchAction$()" class="searchbtn"
            >搜索</ns-button
          >
          <ns-button @click="$resetInputAction$()" class="resetbtn"
            >重置</ns-button
          >
        </el-form-item>
      </el-form>
    </template>
    <template slot="table">
      <el-table
        ref="table"
        :data="_data._table.data"
        class="template-table__main"
        stripe
        resizable
        v-loading.lock="_data._table.loadingtable"
        :element-loading-text="$t('prompt.loading')"
        @sort-change="tableSort"
      >
        <el-table-column prop="avatar" label="微信头像" align="left" width="80">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.avatar"
              fit="cover"
              :width="60"
              :height="60"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="customerName"
          label="微信昵称"
          align="center"
          min-width="145px"
        >
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="workTag"
          label="企业标签"
          align="center"
          min-width="145px"
        >
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="platNick"
          label="平台昵称"
          align="center"
          min-width="145px"
        >
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="orderPrice"
          label="下单金额/笔数"
          align="center"
          sortable="custom"
          min-width="145px"
        >
          <template slot-scope="scope">
            <template>
              {{ scope.row.orderPrice }}元/{{ scope.row.orderCount }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="payPrice"
          label="付款金额/笔数"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <template>
              {{ scope.row.payPrice }}元/{{ scope.row.payCount }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="退款金额/笔数"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <template>
              {{ scope.row.refundPrice }}元/{{ scope.row.refundCount }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="shopName" label="来源店铺" align="center">
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <template slot="pagination">
      <el-pagination
        v-if="_data._pagination.enable"
        class="template-table__pagination"
        :page-sizes="_data._pagination.sizeOpts"
        :total="_data._pagination.total"
        :current-page="_data._pagination.page"
        :page-size="_data._pagination.size"
        :layout="'total, sizes, prev, pager, next, jumper'"
        @size-change="$sizeChange$"
        @current-change="$pageChange$"
      >
      </el-pagination>
    </template>
    <!-- 分页-结束 -->
  </ns-page-table>
</template>

<script>
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import ElImage from '@nascent/nui/lib/image'

let vm
export default {
  name: 'MemberStatistics',
  mixins: [tableMixin],
  props: {
    types: Object,
    department: Array,
    role: Array,
    detailsData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data: function () {
    const operateButtons = [
      {
        func: function () {
          vm.$emit('handleJumpList')
        },
        icon: '$.noop',
        name: '返回',
        auth: '',
        visible: ''
      }
    ]

    const quickInput = [
      {
        template: '',
        inline: false,
        name: 'customerNameOrPlatNick',
        text: '',
        placeholder: '微信/平台昵称',
        type: 'text',
        value: '',
        isConvenient: false
      },
      {
        template: '',
        inline: false,
        name: 'workTag',
        text: '',
        placeholder: '请选择',
        type: 'text',
        value: '',
        isConvenient: false
      }
    ]
    const quickSearchNames = quickInput.map(x => x.name)
    const quickSearchModel = {}
    const model = Object.assign(
      {},
      {
        customerNameOrPlatNick: '',
        workTag: ''
      },
      {}
    )
    const that = this

    quickInput.map(item => {
      Object.defineProperty(quickSearchModel, item.name, {
        get: function () {
          return model[item.name]
        },
        set: function (val) {
          model[item.name] = val
        },
        enumerable: true
      })
    })

    return {
      propsSet: {
        label: 'tag_name',
        value: 'tag_id',
        disabled: 'disabled'
      },
      model: model,
      // eslint-disable-next-line vue/no-reserved-keys
      _order: {
        orderKey: 'orderPrice',
        orderDir: 'desc'
      },
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      url: this.$api.weWork.salesStatistics.statisticsDetail,
      pagination: {
        enable: true,
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      table: {
        quickSearchNames: quickSearchNames,
        operate_buttons: operateButtons,
        quickSearchMap: {}
      },
      selectParams: { isTagGroup: 0 }
    }
  },
  mounted: function () {
    vm = this
    this.$reload()
  },
  components: {
    ElImage
  },
  methods: {
    onSearch () {
      this.$searchAction$()
    },
    // 下单金额排序
    tableSort (data) {
      if (data.order === 'ascending') {
        this._data._order.orderDir = 'asc'
      } else if (data.order === 'descending') {
        this._data._order.orderDir = 'desc'
      }
      this.$searchAction$()
    },
    /**
     * 参数设置
     */
    $handleParams: function (params) {
      Object.assign(params.searchMap, this.detailsData)
      return params
    }
  }
}
</script>
