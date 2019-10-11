<template>
  <div>
    <ns-page-table>
      <!-- 按钮 -->
      <template slot="buttons">
        <ns-table-operate-button :buttons="_data._table.table_buttons"></ns-table-operate-button>
      </template>
      <!-- 简单搜索 -->
      <template slot="searchSearch">
        <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
          <el-form-item v-show="_data._queryConfig.expand === false">
            <el-input ref="quickText" v-model.trim="quickSearchModel.customer_name" placeholder="客户名称"
                      @keyup.enter.native="$quickSearchAction$('customer_name')">
              <Icon fontType="el-icon-search" className="el-input__icon" slot="suffix" @click="$quickSearchAction$('customer_name')"></Icon>
            </el-input>
          </el-form-item>
          <el-form-item>
            <ns-button type="text" @click="$handleTabClick">
              {{collapseText}}
              <Icon className="el-icon--right" v-if="_data._queryConfig.expand" fontType="el-icon-arrow-up"/>
              <Icon className="el-icon--right" v-else fontType="el-icon-arrow-down"/>
            </ns-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 简单搜索-结束 -->

      <!-- 高级搜索 -->
      <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
      <template slot="advancedSearch" v-if="_data._queryConfig.expand">
        <el-form ref="table_filter_form" label-width="100px" @keyup.enter.native="$searchAction$" class="surround-btn"
                 :model="model" :inline="true">
          <div class='page-search '>
              <div class="page-search-item payTotal">
                  <span>消费金额：</span>
                  <el-radio-group v-model="payAmountRadio" @change="changePayAmountRadio">
                    <el-radio-button label="1"><i class='lable-i all'>全部</i></el-radio-button>
                    <el-radio-button label="2"><i class='lable-i'>100 ~ 500</i></el-radio-button>
                    <el-radio-button label="3"><i class='lable-i'>500 ~ 2000</i></el-radio-button>
                    <el-radio-button label="4"><i class='lable-i'>2000 以上</i></el-radio-button>
                  </el-radio-group>
                    <el-form-grid size="md">
                      <el-input type="text" placeholder="起始金额" v-model.trim="model.payAmountStart"></el-input>
                    </el-form-grid>
                    -
                    <el-form-grid size="md">
                      <el-input type="text" placeholder="截止金额" v-model.trim="model.payAmountEnd"></el-input>
                    </el-form-grid>
              </div>
              <div class="page-search-item page-search-item-last">
                <span>消费单数：</span>
                <el-radio-group v-model="model.numLabelPosition">
                  <el-radio-button label="numAll"><i class='lable-i all'>全部</i></el-radio-button>
                  <el-radio-button label="numSmall"><i class='lable-i'>0~10</i></el-radio-button>
                  <el-radio-button label="numCenter"><i class='lable-i'>10~50</i></el-radio-button>
                  <el-radio-button label="numBig"><i class='lable-i'>50 以上</i></el-radio-button>
                </el-radio-group>
                    <el-form-grid size="md">
                      <el-input type="text" placeholder="起始单数" v-model.trim="model.payTimesStart"></el-input>
                    </el-form-grid>
                    -
                    <el-form-grid size="md">
                      <el-input type="text" placeholder="截止单数" v-model.trim="model.payTimesEnd"></el-input>
                    </el-form-grid>
              </div>
              <div class="page-search-item">
                <span>客户名称：</span>
                <el-form-grid size="md">
                  <el-input type="text" v-model.trim="model.customer_name"></el-input>
                </el-form-grid>
                <span>真实姓名：</span>
                <el-form-grid size="md">
                  <el-input type="text" v-model.trim="model.true_name"></el-input>
                </el-form-grid>
                <span>手机：</span>
                <el-form-grid size="md">
                  <el-input type="text" v-model.trim="model.mobile"></el-input>
                </el-form-grid>
                <span>客户类型：</span>
                <el-form-grid size="md">
                  <el-select placeholder="请选择客户类型" v-model="model.memberState" clearable>
                    <el-option value="1">会员</el-option>
                    <el-option value="2">非会员</el-option>
                  </el-select>
                </el-form-grid>

              </div>

              <div class="page-search-item">
                <span>会员卡号：</span>
                <el-form-grid size="md">
                  <el-input type="text" v-model.trim="model.member_card">
                  </el-input>
                </el-form-grid>
              </div>
          </div>
        </el-form>
        <div class="template-table__more-btn">
          <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
          <ns-button @click="resetInputAction()">重置</ns-button>
        </div>
      </template>
      <!-- 高级搜索-结束 -->

      <!-- 表格 -->
      <template slot="table">
        <el-table ref="table" :data="_data._table.data" class="template-table__main"
                  stripe resizable v-loading.lock="_data._table.loadingtable"
                  :element-loading-text="$t('prompt.loading')">
          <el-table-column type="selection" align="center" :width="50"></el-table-column>
          <el-table-column label="客户信息" align="left">
            <template slot-scope="scope">
              <img :src="scope.row.customer_head_image" width="30" height="30"/>
              <span>{{scope.row.customer_name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="手机号" align="left">
            <template slot-scope="scope">
              <span v-if="scope.row.mobile">{{scope.row.mobile}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="会员卡号" align="left">
            <template slot-scope="scope">
              <span v-if="scope.row.member_card === null">非会员</span>
              <span v-else>{{scope.row.member_card}}</span>
            </template>
          </el-table-column>
          <el-table-column label="真实姓名" align="left">
            <template slot-scope="scope">
              <span v-if="scope.row.true_name === null">-</span>
              <span v-else>{{scope.row.true_name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="消费总额 / 消费单数" align="left">
            <template slot-scope="scope">
              <span>￥{{scope.row.pay_amount}} / {{scope.row.pay_times}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="last_pay_time" label="最近消费时间" align="left"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="160">
            <template slot-scope="scope">
              <ns-button type="text" @click="$emit('detail',scope.row)">详情</ns-button>
              <ns-button type="text" @click="$emit('addIntegral',scope.row)">给积分</ns-button>
              <ns-button type="text" @click="$emit('sendSMS',scope.row)" v-if="scope.row.mobile">发短信</ns-button>
              <ns-button type="text" disabled v-else>发短信</ns-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 表格-结束 -->

      <!-- 分页 -->
      <template slot="pagination">
        <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                       :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                       :current-page.sync="_data._pagination.page" :page-size="_data._pagination.size"
                       layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                       @current-change="$pageChange$">
        </el-pagination>
      </template>
      <!-- 分页-结束 -->
    </ns-page-table>
  </div>
</template>

<script>
import CustomerTable from './src/table'
import NsDroptree from '@nascent/ecrp-ecrm/src/components/NsDroptree'

CustomerTable.components = { NsDroptree }
export default CustomerTable
</script>

<style scoped lang="scss">
.page-search{
  background-color:#ffffff;
  .page-search-item-last{
    padding-bottom: 20px
  }
  .page-search-item{
    padding: 20px 20px 0 20px;
    &.last{
      padding-bottom: 20px
    }
    span{
      display: inline-block;
      width: 70px;
      text-align: right;
      margin-top: 3px
    }

    .el-form-grid{
      margin-right: 0
    }
    &.payTotal{
      overflow: hidden;
      .fr{
        float:right
      }
    }
  }
  .el-radio-group{
    margin-right: 20px;

  }
  .el-radio-button__inner{
      width: 55px
    }
    .lable-i{
      display:inline-block;
      width:95px;
      font-style: normal;
      &.all{
        width: 20px;
      }
    }
}
</style>
