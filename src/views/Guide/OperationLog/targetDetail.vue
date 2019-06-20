<template>
  <ns-page-table @scopeRowCount="scopeRowCount">
      <!-- 搜索 -->
      <template slot="advancedSearch">
        <el-form ref="table_form" @keyup.enter.native="findList()" :inline="true" :model="model" label-width="80px">
          <el-form-item label="数据模块：">
            <el-form-grid size="sm">
              <el-select placeholder="请选择" v-model="moduleType" @change="setUrl" clearable filterable>
                <el-option v-for="module in dataModule" :label="module.label" :value="module.value"
                           :key="module.value"></el-option>
              </el-select>
            </el-form-grid>
          </el-form-item>
          <template v-if="moduleType === 1 || moduleType === 9">
            <el-form-item label="员工姓名：">
              <el-form-grid size="sm">
                <el-input v-model="model.guide.guideName" clearable></el-input>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="联系方式：">
              <el-form-grid size="sm">
                <el-input v-model="model.guide.mobile" clearable></el-input>
              </el-form-grid>
            </el-form-item>
          </template>
          <template v-else-if="moduleType === 2">
            <el-form-item label="会员姓名：">
              <el-form-grid size="sm">
                <el-input v-model="model.customer.name" clearable></el-input>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="手机号：">
              <el-form-grid size="sm">
                <el-input v-model="model.customer.mobile" clearable></el-input>
              </el-form-grid>
            </el-form-item>
          </template>
          <template v-else-if="moduleType === 4">
            <el-form-item label="任务名称：">
              <el-form-grid size="xmd">
                <el-input v-model="model.task.name" clearable></el-input>
              </el-form-grid>
            </el-form-item>
          </template>
          <template v-else-if="moduleType === 6">
            <el-form-item label="分组名称：">
              <el-form-grid size="sm">
                <el-input v-model="model.materialSubdivision.subdivision_name" clearable></el-input>
              </el-form-grid>
            </el-form-item>
          </template>
          <template v-else-if="moduleType === 7">
            <el-form-item label="素材分组">
              <el-form-grid size="sm">
                <el-select v-model="model.material.subdivisionId" placeholder="请选择分组" clearable filterable>
                  <el-option v-for="item in subdivisionList" :key="item.subdivision_id" :label="item.subdivision_name"
                             :value="item.subdivision_id">
                  </el-option>
                </el-select>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="素材内容：">
              <el-form-grid size="sm">
                <el-input v-model="model.material.content" clearable></el-input>
              </el-form-grid>
            </el-form-item>
          </template>
          <template v-else-if="moduleType === 3 || moduleType === 5">
            <el-form-item label="门店名称：">
              <el-form-grid size="sm">
                <el-input v-model="model.shop.shopName" clearable></el-input>
              </el-form-grid>
            </el-form-item>
          </template>
          <template v-else-if="moduleType === 8">
            <el-form-item label="优惠券名称：">
              <el-form-grid size="sm">
                <el-input v-model="model.coupon.title" clearable></el-input>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="优惠券编码：">
              <el-form-grid size="sm">
                <el-input v-model="model.coupon.code" clearable></el-input>
              </el-form-grid>
            </el-form-item>
          </template>
        </el-form>
        <div class="template-table__more-btn">
          <ns-button type="primary" @click="findList()">搜索</ns-button>
          <ns-button @click="$resetInput()">重置</ns-button>
        </div>
      </template>
      <!-- 表格布局-->
      <template slot="table">
        <el-table ref="table" :data="_data._table.data" class="template-table__main" stripe resizable
                  v-loading.lock="_data._table.loadingtable"
                  :element-loading-text="$t('prompt.loading')"
                  @sort-change="$orderChange$">
          <template v-if="tableType === 1 || tableType === 9">
            <el-table-column prop="work_id" label="工号" align="center" :key="1"></el-table-column>
            <el-table-column prop="name" label="姓名" align="left" :key="2"></el-table-column>
            <el-table-column prop="mobile" label="联系方式" align="center" :key="3"></el-table-column>

            <el-table-column prop="shopName,count" label="所属门店" align="left">
              <template slot-scope="scope">
                <ns-button style="color:#0091FA" @click="scopeRowCount(scope.row)" v-if="scope.row.count > 1" type="text">{{scope.row.count}}家</ns-button>
                <div v-else>
                  {{scope.row.shopName || '-'}}
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="id" label="数据库ID" align="center" :key="5"></el-table-column>
          </template>
          <template v-else-if="tableType === 2">
            <el-table-column prop="name" label="会员姓名" align="left" :key="6">
              <template slot-scope="scope">{{scope.row.name || '-'}}</template>
            </el-table-column>
            <el-table-column prop="mobile" label="手机号" align="center" :key="7">
              <template slot-scope="scope">{{scope.row.mobile?scope.row.mobile:'-'}}</template >
            </el-table-column>
            <el-table-column prop="grade,memberCard" label="会员类型/卡号" align="left" :key="8">
              <template slot-scope="scope">
                <div v-if="scope.row.memberCard !== null || scope.row.grade !== null">
                  {{scope.row.grade === '0' || scope.row.grade === null ? '-'+ ' / ' +scope.row.memberCard :'会员' + scope.row.grade + ' / '+scope.row.memberCard}}
                </div>
                <div v-if="scope.row.memberCard == null && scope.row.grade === null">未绑卡</div>
              </template>
            </el-table-column>
            <el-table-column prop="guideName" label="专属导购" align="left" :key="9">
              <template slot-scope="scope">{{scope.row.guideName ? scope.row.guideName : "-"}}</template>
            </el-table-column>
            <el-table-column prop="id" label="数据库ID" align="center" :key="10">
              <template slot-scope="scope">{{scope.row.nickType ? '('+scope.row.nickType+')'+scope.row.nick: "-"}}</template>
            </el-table-column>
          </template>
          <template v-else-if="tableType === 4">
            <el-table-column prop="name" label="任务名称" align="left" :key="11"></el-table-column>
            <el-table-column prop="status" label="状态" align="center" width="100" :key="12">
              <template slot-scope="{row}">
                <span v-if="row.state === 1" class="text-primary">执行中</span>
                <span v-if="row.state === 4" class="text-warning">已过期</span>
                <span v-if="row.state === 2" class="text-error">终止</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="任务来源" align="center" width="100" :key="13">
              <template slot-scope="{row}">
                <span v-if="row.shopId === 0">品牌任务</span>
                <span v-else>门店任务</span>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="数据库ID" align="center" width="150" :key="14"></el-table-column>
          </template>
          <template v-else-if="tableType === 6">
            <el-table-column prop="subdivision_name" label="素材分组" align="left" :key="15"></el-table-column>
            <el-table-column prop="subdivision_id" label="数据库ID" align="center" :key="16"></el-table-column>
          </template>
          <template v-else-if="tableType === 7">
            <el-table-column prop="content" label="素材内容" :key="17">
              <template slot-scope="scope">
                <listItemShow :itemObj="scope.row" :appendToBody="true"></listItemShow>
              </template>
            </el-table-column>
            <el-table-column width="100" label="素材类型" :key="18">
              <template slot-scope="{row}">
                <span v-if="row.m_type === 0">文章素材</span>
                <span v-else>图文素材</span>
              </template>
            </el-table-column>
            <el-table-column prop="subdivision_name" align="left" width="120" label="分组名称" :key="19"></el-table-column>
            <el-table-column prop="id" label="数据库ID" align="center" :key="20"></el-table-column>
          </template>
          <template v-else-if="tableType === 5">
            <el-table-column label="门店名称" prop="shopName" show-overflow-tooltip :key="21"></el-table-column>
            <el-table-column label="状态" width="150" align="left" show-overflow-tooltip :key="22">
              <template slot-scope="{row}">
                <span v-if="row.shopStatus === 1">正常营业</span>
                <span v-else-if="row.shopStatus === -1">暂停营业</span>
                <span v-else-if="row.shopStatus === -2">已关店</span>
              </template>
            </el-table-column>
            <el-table-column prop="shopId" label="数据库ID" align="center" :key="23"></el-table-column>
          </template>
          <template v-else-if="tableType === 3">
            <el-table-column label="门店名称" prop="shopName" show-overflow-tooltip :key="31"></el-table-column>
            <el-table-column label="状态" width="150" align="left" show-overflow-tooltip :key="32">
              <template slot-scope="{row}">
                <span v-if="row.shopStatus === 1">正常营业</span>
                <span v-else-if="row.shopStatus === -1">暂停营业</span>
                <span v-else-if="row.shopStatus === -2">已关店</span>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="数据库ID" align="center" :key="33"></el-table-column>
          </template>
          <template v-else-if="tableType === 8">
            <el-table-column  prop="title" align="left" label="卡券信息" :sortable="false" :key="24">
              <template slot-scope="scope">
                <span>优惠券名称:{{scope.row.couponTitle}}</span><br>
                <span>使用条件:{{scope.row.useConditionStr}}</span><br>
                <span>优惠券编码:{{scope.row.couponCode}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="有效时间" :sortable="false" width="180" :key="25">
              <template slot-scope="{row}">
                <div v-if="row.dateValidType == 0">
                  <span>{{row.startTime}}</span><br><span>至</span><br><span>{{row.endTime}}</span>
                </div>
                <div v-if="row.dateValidType == 1">
                  <span>领取后第{{row.afterGetValidDays}}天生效</span><br>
                  <span>有效期{{row.validDays}}天</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" align="center" label="创建时间" :sortable="false" width="180" :key="27"></el-table-column>
            <el-table-column prop="type" align="center" label="状态" :sortable="false" width="100" :key="26">
              <template slot-scope="scope">{{scope.row.couponStatus == '0' ? "禁用" : "启用"}}
              </template>
            </el-table-column>
            <el-table-column prop="couponId" label="数据库ID" align="center" :key="28"></el-table-column>
          </template>
          <template v-else-if="tableType === 10">
            <el-table-column prop="name" label="账号" align="left" :key="29"></el-table-column>
            <el-table-column label="授权状态" align="center" width="100">
              <template slot-scope="{row}">
                <span v-if="row.wxStatus === 1">已授权</span>
                <span v-else>未授权</span>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="数据库ID" align="center" :key="30"></el-table-column>
          </template>
        </el-table>
      </template>
      <!-- 分页 -->
    <template slot="pagination">
      <el-pagination v-if="_data._pagination.enable" class="template-table-pagination"
                     :page-sizes="_data._pagination.sizeOpts"
                     :total="_data._pagination.total"
                     :current-page.sync="_data._pagination.page"
                     :page-size="_data._pagination.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="$sizeChange$"
                     @current-change="$pageChange$">
      </el-pagination>
    </template>
    </ns-page-table>
</template>

<script>
import tableMixin from 'web-crm/src/mixins/table'
import listItemShow from '../Material/components/listItemShow'
export default {
  name: 'targetDetail',
  components: { listItemShow },
  mixins: [tableMixin],
  props: {
    dataModule: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data: function () {
    return {
      url: null,
      moduleType: null,
      tableType: 1,
      subdivisionList: [],
      model: {
        guide: {
          guideName: null,
          mobile: null
        },
        customer: {
          name: null,
          mobile: null
        },
        task: {
          name: null
        },
        materialSubdivision: {
          subdivision_name: null
        },
        material: {
          content: null,
          subdivisionId: null
        },
        shop: {
          shopName: name
        },
        coupon: {
          title: null,
          code: null
        }
      }
    }
  },
  mounted: function () {
    this.moduleType = this.dataModule ? this.dataModule[0].value : null
    this.setUrl(this.moduleType)
    this.$reload()
  },
  created: function () {
    this.loadMaterialSubdivision()
  },
  methods: {
    scopeRowCount (row) { // 查看员工属性
      let _this = this
      _this.$emit('scopeRowCount', row)
    },
    setUrl: function (val) {
      let _this = this
      switch (val) {
        case 1: _this.url = this.$api.guide.guide.findList; break
        case 2: _this.url = this.$api.guide.guide.customerFindCustomerList; break
        case 3: _this.url = this.$api.guide.guide.findShopListOnCondition; break
        case 4: _this.url = this.$api.guide.task.queryTaskList; break
        case 5: _this.url = this.$api.guide.guide.rewardruleList; break
        case 6: _this.url = this.$api.guide.materialGroudList; break
        case 7: _this.url = this.$api.guide.materialFindListByBrandId; break
        case 8: _this.url = this.$api.guide.activityCoupon.findList; break
        case 9: _this.url = this.$api.guide.guide.findList; break
        case 10: _this.url = this.$api.guide.sgwxaccount.findList; break
        default: break
      }
    },
    $resetInput: function () {
      let _this = this
      for (let key1 in _this.model) {
        if (_this.model[key1] instanceof Object) {
          for (let key2 in _this.model[key1]) {
            _this.model[key1][key2] = null
          }
        } else {
          _this.model[key1] = null
        }
      }
      this.$searchAction$()
    },
    $handleParams: function (params) {
      let model = {}
      let _this = this
      switch (_this.moduleType) {
        case 1: model = _this.model.guide; break
        case 2: model = _this.model.customer; break
        case 3: model = _this.model.shop; break
        case 4: model = _this.model.task; break
        case 5: model = _this.model.shop; break
        case 6: model = _this.model.materialSubdivision; break
        case 7: model = _this.model.material; break
        case 8: model = _this.model.coupon; break
        case 9: model = _this.model.guide; break
        default: break
      }
      params.searchMap = Object.assign({}, {}, {}, model)
      return params
    },
    findList: function () {
      let _this = this
      this.$searchAction$()
      _this.tableType = this.moduleType
      _this.$refs.table.doLayout()
    },
    // 加载素材分组列表
    async loadMaterialSubdivision () {
      await this.$http
        .fetch(this.$api.guide.materialGroudListAll, {})
        .then(resp => {
          this.subdivisionList = resp.result
        }).catch(resp => {
          this.$notify.error(resp.msg)
        })
    }
  }
}
</script>
