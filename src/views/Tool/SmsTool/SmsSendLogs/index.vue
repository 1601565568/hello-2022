<template>
  <ns-page-table>
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons">
      </ns-table-operate-button>
    </template>
    <!-- 按钮-结束 -->

    <!-- 简单搜索 -->
    <!-- el-form 需添加 @submit.native.prevent 配置 -->
    <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
    <template slot="searchSearch">
      <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" v-model.trim="quickSearchModel.target" placeholder="请输入手机号码" @keyup.enter.native="$quickSearchAction$('target')">
            <i class="el-icon-search el-input__icon" slot="suffix" name="name" @click="$quickSearchAction$('target')"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <ns-button type="text" @click="$handleTabClick">
            {{collapseText}}
            <i :class="{'el-icon--right': true, 'el-icon-arrow-down': !_data._queryConfig.expand, 'el-icon-arrow-up': _data._queryConfig.expand} ">
            </i>
          </ns-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- 简单搜索-结束 -->

    <!-- 高级搜索 -->
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="$searchAction$" class="surround-btn"
               :model="model" :rules="rules" :inline="true">
        <el-form-item label="手机号码：">
          <el-form-grid size="xmd">
            <el-form-item prop = "target" >
              <el-input type="text" v-model.trim = "model.target" placeholder="请输入手机号码">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="发送来源：">
          <el-form-grid size="xmd">
            <el-form-item prop = "sourceModel">
              <ns-select  v-model="model.source_model" :clearable="true" filterable placeholder="请选择发送来源"
                          :multiple="false" :url="$api.touch.smsSendLogs.getSourceModels">
              </ns-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="发送人：">
          <el-form-grid size="xmd">
            <el-form-item prop = "user_name" >
              <el-input type="text"
                        v-model.trim = "model.user_name" placeholder="请输入发送人">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="发送状态：">
          <el-form-grid size="xmd">
            <el-form-item prop = "send_status" >
              <el-select v-model="model.send_status"
                         filterable  clearable
                         placeholder="请选择发送状态" :multiple="false">
                <el-option label="失败" class="text-error" :value="0"></el-option>
                <el-option label="成功" class="text-success" :value="1"></el-option>
                <el-option label="黑名单" class="text-warning"  :value="-1"></el-option>
                <el-option label="重复" class="text-warning"  :value="-2"></el-option>
                <el-option label="非法号码" class="text-warning"  :value="-3"></el-option>
              </el-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="发送时间：" class="el-inline-block">
          <ns-datetime startPlaceholder="请选择开始时间" endPlaceholder="请选择结束时间" v-model="model.time"></ns-datetime>
          <!--<el-form-grid size="md">
            <el-form-item  prop = "start">
              <el-date-picker default-time="00:00:00" value-format="yyyy-MM-dd HH:mm:ss"
                              :editable="false" v-model="model.start"  type="datetime" > </el-date-picker>
            </el-form-item>
          </el-form-grid>
          <el-form-grid >
            ~
          </el-form-grid>
          <el-form-grid size="md">
            <el-form-item  prop = "end">
              <el-date-picker ref="ele" v-model="model.end"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              default-time="23:59:59">
              </el-date-picker>
            </el-form-item>
          </el-form-grid>-->
        </el-form-item>
      </el-form>
      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">{{$t('operating.search')}}</ns-button>
        <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
      </div>
    </template>
    <!-- 高级搜索-结束 -->

    <!-- 表格 -->
    <template slot="table">
      <el-table ref="table" :data="_data._table.data" class="template-table__main"
                stripe @selection-change="onHandleSelectChange"
                resizable v-loading.lock="_data._table.loadingtable"
                :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
        <!--<el-table-column type="selection" align="center" :width="45"></el-table-column>-->
        <el-table-column type = "default" prop = "target" label = "手机号码"
                         align = "left" width = "120px" :sortable = "false">
        </el-table-column>
        <el-table-column  type = "default" prop = "sourceName" label = "发送来源"
                         align = "left" :sortable = "false" width="200px">
          <!--<template slot-scope="scope">
            <span v-if='scope.row.source_model ==6'>订单催付</span>
            <span v-if='scope.row.source_model ==7'>物流追踪</span>
            <span v-if='scope.row.source_model ==8'>营销活动</span>
            <span v-if='scope.row.source_model ==11'>店铺配置-短信发送</span>
            <span v-if='scope.row.source_model ==14'>发货提醒</span>
            <span v-if='scope.row.source_model ==15'>签收关怀</span>
            <span v-if='scope.row.source_model ==17'>会员升级提醒</span>
            <span v-if='scope.row.source_model ==18'>会员账单</span>
            <span v-if='scope.row.source_model ==19'>付款关怀</span>
            <span v-if='scope.row.source_model ==20'>退款关怀</span>
            <span v-if='scope.row.source_model ==21'>到达提醒</span>
            <span v-if='scope.row.source_model ==22'>确认关怀</span>
            <span v-if='scope.row.source_model ==23'>生日关怀</span>
            <span v-if='scope.row.source_model ==24'>节日关怀</span>
            <span v-if='scope.row.source_model ==31'>呼叫中心</span>
            <span v-if='scope.row.source_model ==33'>短信批量发送-手动发送</span>
            <span v-if='scope.row.source_model ==34'>短信批量发送-导入发送</span>
            <span v-if='scope.row.source_model ==901'>短信测试通道</span>
            <span v-if='scope.row.source_model ==902'>营销活动-短信测试通道</span>
          </template>-->
        </el-table-column>
        <el-table-column  type = "default" prop = "user_name"
                         label = "发送人" align = "left" width = "100" :sortable = "false">
        </el-table-column>
        <el-table-column  type = "default" prop = "update_time" label = "发送时间"
                         align = "center" width = "150px" :sortable = "false">
        </el-table-column>
        <el-table-column  type = "default" label = "发送条数"
                          align = "center" width = "150px" :sortable = "false">
          <template slot-scope="scope">
            <span v-if="scope.row.send_content.length <= 70">1</span>
            <span v-if="scope.row.send_content.length > 70">{{Math.ceil(scope.row.send_content.length/67)}}</span>
          </template>
        </el-table-column>
        <el-table-column  type = "default" prop = "send_status" label = "发送状态"
                         dbcolumn = "send_status" column = "send_status" align = "left" width = "120px" :sortable = "false">
          <template slot-scope="scope">
            <div v-if='scope.row.send_status===-1' >黑名单</div>
            <div v-if='scope.row.send_status===0' class="text-error">失败</div>
            <div v-if='scope.row.send_status===1' class="text-success">成功</div>
            <div v-if='scope.row.send_status===-2'>重复</div>
            <div v-if='scope.row.send_status===-3'>非法号码</div>
          </template>
        </el-table-column>
        <el-table-column  type = "default" prop = "send_content"
                         label = "发送内容" align = "left" :sortable = "false">
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
</template>
<script>
  import index from './src/index'

  export default index
</script>
