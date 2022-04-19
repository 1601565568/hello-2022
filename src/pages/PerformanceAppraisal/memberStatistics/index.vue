<!--
 * @Date: 2022-04-19 14:15:10
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-19 16:52:01
 * @FilePath: \ECRP-SG-WEB\src\pages\PerformanceAppraisal\memberStatistics\index.vue
-->
<template>
  <ns-page-table>
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data.table.operate_buttons">
      </ns-table-operate-button>
    </template>
    <!-- 按钮-结束 -->

    <!-- 简单搜索 -->
    <!-- el-form 需添加 @submit.native.prevent 配置 -->
    <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
    <template slot="searchSearch">
      <el-form
        :model="quickSearchModel"
        :inline="true"
        @submit.native.prevent
        class="pull-right"
      >
        <el-form-item label="企业标签: ">
          <ns-select
            v-model="quickSearchModel.tag"
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
            v-model.trim="quickSearchModel.name"
            placeholder="微信/平台昵称"
            @keyup.enter.native="$quickSearchAction$('name')"
          >
            <Icon
              type="search"
              className=" el-input__icon"
              style="padding: 5px;"
              slot="suffix"
              name="name"
              @click="$quickSearchAction$('name')"
            />
          </el-input>
        </el-form-item>
        <el-form-item>
          <ns-button type="primary" @click="$searchAction$()" class="searchbtn">搜索</ns-button>
            <ns-button @click="$resetInputAction$()" class="resetbtn">重置</ns-button>
        </el-form-item>
        <!-- <el-form-item>
          <ns-button type="text" @click="$handleTabClick">
            {{ collapseText }}
            <Icon :type="_data.queryConfig.expand ? 'up' : 'down'" />
          </ns-button>
        </el-form-item> -->
      </el-form>
    </template>
    <!-- 简单搜索-结束 -->

    <!-- 高级搜索 -->
    <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
    <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
    <!-- <template slot="advancedSearch" v-if="_data.queryConfig.expand">
      <el-form
        ref="table_filter_form"
        label-width="80px"
        @keyup.enter.native="onSearch"
        class="surround-btn"
        :model="model"
        :rules="rules"
        :inline="true"
      >
        <el-form-item label="活动名称：">
          <el-form-grid>
            <el-form-item>
              <el-input type="text" v-model.trim="model.name"> </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="创建人：">
          <el-form-grid>
            <el-form-item>
              <ns-select
                v-model="model.creater"
                filterable
                clearable
                :url="$api.marketing.weworkMarketing.getEmployee"
              />
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="活动状态：">
          <el-form-grid>
            <el-form-item>
              <ns-select
                v-model="model.status"
                filterable
                clearable
                :url="$api.marketing.weworkMarketing.getWxStatus"
              />
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="创建时间：">
          <el-form-grid>
            <el-form-item>
              <ns-datetime v-model="model.createTime"></ns-datetime>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="执行时间：">
          <el-form-grid>
            <el-form-item>
              <ns-datetime v-model="model.execTime"></ns-datetime>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">{{
          $t("operating.search")
        }}</ns-button>
        <ns-button @click="$resetInputAction$()">{{
          $t("operating.reset")
        }}</ns-button>
      </div>
    </template> -->
    <!-- 高级搜索-结束 -->

    <!-- 表格 -->
    <template slot="table">
      <!-- 表格配置 不能添加 border 配置 -->
      <!-- 表格配置 需添加 stripe （实现斑马线效果） -->

      <!-- 表格单元格宽度配置规范 -->
      <!-- 复选框/单选框 :width="50" -->
      <!-- 日期 年月日 :width="100"   年月日时分秒 :width="150" -->
      <!-- 手机号 :width="120" -->
      <!-- 操作栏 单个按钮 :width="80"  多个按钮 :width="120" -->

      <el-table
        ref="table"
        :data="_data.table.data"
        class="template-table__main"
        stripe
        resizable
        v-loading.lock="_data.table.loadingtable"
        :element-loading-text="$t('prompt.loading')"
        @sort-change="orderByInviteFriendNum"
      >
        <el-table-column
          type="default"
          prop="planName"
          label="微信头像"
          dbcolumn="planName"
          column="planName"
          align="left"
        >
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          type="default"
          prop="createTime"
          label="微信昵称"
          dbcolumn="createTime"
          column="createTime"
          align="center"
          :width="200"
        >
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          type="default"
          prop="auditTime"
          label="企业标签"
          dbcolumn="auditTime"
          column="auditTime"
          align="center"
          :width="200"
        >
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          type="default"
          prop="auditTime"
          label="平台昵称"
          dbcolumn="auditTime"
          column="auditTime"
          align="center"
          :width="200"
        >
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          type="default"
          prop="executeTime"
          label="下单金额/笔数"
          dbcolumn="executeTime"
          column="executeTime"
          align="center"
          sortable="custom"
          :width="200"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.executeTime">
              {{ scope.row.executeTime }}
            </template>
            <template v-else>-</template>
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          type="default"
          prop="trade_tag_name"
          label="付款金额/笔数"
          dbcolumn="trade_tag_name"
          column="trade_tag_name"
          align="left"
        >
        </el-table-column>

        <el-table-column
          type="default"
          prop="userName"
          label="退款金额/笔数"
          dbcolumn="userName"
          column="userName"
          align="left"
        >
        </el-table-column>

        <el-table-column
          type="default"
          prop="status"
          label="来源店铺"
          dbcolumn="status"
          column="status"
          align="center"
        >
        </el-table-column>
      </el-table>
    </template>
    <!-- 表格-结束 -->

    <!-- 分页 -->
    <template slot="pagination">
      <el-pagination
        v-if="_data.pagination.enable"
        class="template-table__pagination"
        :page-sizes="_data.pagination.sizeOpts"
        :total="_data.pagination.total"
        :current-page="_data.pagination.page"
        :page-size="_data.pagination.size"
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

let vm
export default {
  name: 'MemberStatistics',
  mixins: [tableMixin],
  props: {
    types: Object,
    department: Array,
    role: Array
  },
  data: function() {
    const operateButtons = [
      {
        func: function() {
          vm.$router.push({
            path: '/PerformanceAppraisal/SalesStatistics/List'
          })
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
        name: 'name',
        text: '',
        placeholder: '微信/平台昵称',
        type: 'text',
        value: '',
        isConvenient: false
      },
      {
        template: '',
        inline: false,
        name: 'tag',
        text: '',
        placeholder: '选择',
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
        name: '',
        tag: ''
      },
      {}
    )
    const that = this

    quickInput.map(item => {
      Object.defineProperty(quickSearchModel, item.name, {
        get: function() {
          return model[item.name]
        },
        set: function(val) {
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
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      state: {},
      url: this.$api.marketing.weworkMarketing.queryTableGroup,
      pagination: {
        enable: true,
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      table: {
        // table_buttons: tableButtons,
        quickSearchNames: quickSearchNames,
        operate_buttons: operateButtons,
        quickSearchMap: {}
      },
      selectParams: { isTagGroup: 0 }
      // queryConfig: {
      //   expand: false
      // }
      // MARKETING_TYPE: MARKETING_TYPE
    }
  },

  mounted: function() {
    vm = this
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
    const { id } = this.$route.query
  },
  components: {},
  methods: {
    onSearch() {
      this.$searchAction$()
    },
    // 下单金额排序
    orderByInviteFriendNum (data) {
      console.log(data, 'data----4')
      this.model.type = '3'
      if (data.order === 'ascending') {
        this.model.sortType = '2'
      } else if (data.order === 'descending') {
        this.model.sortType = '1'
      } else {
        this.model.type = '1'
        this.model.sortType = '1'
      }
      this.$searchAction$()
    },
    /**
     * 参数设置
     */
    $handleParams: function (params) {
      Object.assign(params.searchMap, this.$route.query)
      return params
    }
  }
}
</script>
