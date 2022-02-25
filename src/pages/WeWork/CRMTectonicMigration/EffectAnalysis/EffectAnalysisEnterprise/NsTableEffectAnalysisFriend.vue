<template>
  <div>
    <page-table :searchCol="24" :diyTitle="true">
      <template slot="title">
        <div class="head-router">
          <div>
            <span class="iconfont icon-icon-fanhuishangyiji icon-back" @click="$router.go(-1)"></span>
            <span>的效果分析</span>
          </div>
          <ns-table-operate-button :buttons="_data._table.operate_buttons">
          </ns-table-operate-button>
        </div>
      </template>
      <template slot='search'>
        <el-form :inline="true" class='form-inline_top'>
          <el-form-item label="">
            <el-input v-model.trim="model.nick" placeholder="请输入微信昵称" @keyup.enter.native="onSearch">
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="onSearch"></Icon>
            </el-input>
          </el-form-item>
          <el-form-item label="所属员工：">
            <el-select v-model="model.empId" filterable placeholder="请选择">
              <el-option v-for="item in employees" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="发送状态：">
            <el-select v-model="model.status" filterable clearable>
              <el-option key="1" label="成功" value="1" />
              <el-option key="2" label="失败" value="2" />
              <el-option key="0" label="待发送" value="0" />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot='table'>
        <div class="info-block">
          <span>发送总计:{{statistics.total}}</span>
          <span>发送成功:{{statistics.successTotal}}</span>
          <span>发送失败:{{statistics.failTotal}}</span>
          <span>待发送:{{statistics.unSendTotal}}</span>
        </div>
        <el-table ref="table" :data="_data._table.data" class="new-table_border"
                  v-loading.lock="_data._table.loadingtable" :element-loading-text="$t('prompt.loading')"
                  @sort-change="$orderChange$" :row-style="tableRowClassName">
          <el-table-column
            :show-overflow-tooltip="true"
            prop="plan_name"
            label="头像">
            <template slot-scope="scope">
              <template v-if="scope.row.headImg">
                <img :src="scope.row.headImg" class="head-img"/>
              </template>
              <template v-else><img class="head-img" src="./images/no-img.png"/></template>
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="friendNick"
            label="微信昵称">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="employeeWechatNick"
            label="好友所属员工">
            <template slot-scope="scope">
              {{scope.row.empName ? scope.row.empName: '-'}}
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="friendNick"
            label="工号">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="friendNick"
            label="确认结果">
            <template slot="header">
              <span>确认结果</span>
              <el-tooltip placement="top" effect="light" stype="">
                <Icon type="question-circle" theme="outlined" className="text-primary"/>
                <div slot="content">员工在移动端收到消息提醒后是否点击“发送”结果</div>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="sendStatus"
            label="发送状态">
            <template slot-scope="scope">
              <template v-if="scope.row.sendStatus === 0">待发送</template>
              <template v-else-if="scope.row.sendStatus === 1">发送成功</template>
              <template v-else-if="scope.row.sendStatus === 2">发送失败</template>
              <template v-else>待发送</template>
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="auditTime"
            label="发送时间"
            sortable="1">
            <template slot-scope="scope">
              <template v-if="scope.row.auditTime">
                {{scope.row.auditTime}}
              </template>
              <template v-else>-</template>
            </template>
          </el-table-column>

        </el-table>
      </template>
      <template slot="pagination">
        <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                      :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                      :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                      :layout="true? 'total, sizes, prev, pager, next, jumper':'total'" @size-change="$sizeChange$"
                      @current-change="$pageChange$">
        </el-pagination>
      </template>
    </page-table>
    <!-- <ns-page-table> -->
      <!-- 按钮 -->
      <!-- <template slot="buttons">
        <ns-table-operate-button :buttons="_data._table.operate_buttons">
        </ns-table-operate-button>
      </template> -->
      <!-- 按钮-结束 -->

      <!-- 高级搜索 -->
      <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
      <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
      <!-- <template slot="advancedSearch"> -->
        <!-- <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="onSearch" class="surround-btn"
                :model="model" :rules="rules" :inline="true" style="height: 80px">
          <el-form-item label="微信昵称：">
            <el-form-grid>
                <el-input type="text" v-model.trim="model.nick"> </el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="所属员工：">
            <el-form-grid>
              <el-select v-model="model.empId" filterable placeholder="请选择">
                <el-option v-for="item in employees" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="发送状态：">
            <el-form-grid>
                  <el-select v-model="model.status" filterable clearable>
                    <el-option key="1" label="成功" value="1" />
                    <el-option key="2" label="失败" value="2" />
                    <el-option key="0" label="待发送" value="0" />
                  </el-select>
            </el-form-grid>
          </el-form-item>
        </el-form> -->
        <!-- <div class="template-table__more-btn">
          <ns-button type="primary" @click="$searchAction$()">{{$t('operating.search')}}</ns-button>
          <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
        </div> -->
        <!-- <template>
          <div style="word-spacing: 30px;margin: 40px 0px 0px 20px; position: absolute;">发送总计:{{statistics.total}} 发送成功:{{statistics.successTotal}}  &nbsp;&nbsp;发送失败:{{statistics.failTotal}}&nbsp;&nbsp;待发送:{{statistics.unSendTotal}}
          </div>
        </template> -->
      <!-- </template> -->
      <!-- 简单搜索-结束 -->
      <!-- 表格 -->：
      <!-- <template slot="table"> -->
        <!-- 表格配置 不能添加 border 配置 -->
        <!-- 表格配置 需添加 stripe （实现斑马线效果） -->

        <!-- 表格单元格宽度配置规范 -->
        <!-- 复选框/单选框 :width="50" -->
        <!-- 日期 年月日 :width="100"   年月日时分秒 :width="150" -->
        <!-- 手机号 :width="120" -->
        <!-- 操作栏 单个按钮 :width="80"  多个按钮 :width="120" -->

        <!-- <el-table ref="table" :data="_data._table.data" class="template-table__main"
                  stripe
                  resizable v-loading.lock="_data._table.loadingtable" @selection-change="onHandleSelectChange"
                  :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
          <el-table-column type="selection" align="center" :width="50"></el-table-column>

          <el-table-column :show-overflow-tooltip="true" type="default" prop="plan_name"
                          label="头像" dbcolumn="plan_name" column="plan_name" align="left"
                          :sortable="false">
            <template slot-scope="scope">
              <template v-if="scope.row.headImg">
                <img :src="scope.row.headImg" style="width: 50px; height: 50px"/>
              </template>
              <template v-else><img src="./images/no-img.png" style="width: 50px; height: 50px"/></template>
            </template>
          </el-table-column>

          <el-table-column :show-overflow-tooltip="true" type="default" prop="friendNick"
                          label="微信昵称" dbcolumn="friendNick" column="friendNick" align="center"
                          :sortable="false">
          </el-table-column>

          <el-table-column :show-overflow-tooltip="true" type="default" prop="employeeWechatNick"
                          label="好友所属员工" dbcolumn="employeeWechatNick" column="employeeWechatNick" align="center"
                          :sortable="false" :width="200">
            <template slot-scope="scope">
              {{scope.row.empName ? scope.row.empName: '-'}}
            </template>
          </el-table-column> -->
  <!--

          <el-table-column :show-overflow-tooltip="true" type="default" prop="employee_wechat_nick"
                          label="员工微信账号" dbcolumn="employee_wechat_nick" column="employee_wechat_nick" align="center"
                          :sortable="false">
            <template slot-scope="scope">
              {{scope.row.empNick + '('+ scope.row.empNo+ ')'}}
            </template>
          </el-table-column>
  -->

          <!-- <el-table-column :show-overflow-tooltip="true" type="default" prop="auditStatus"
                          label="审核状态" dbcolumn="auditStatus" column="auditStatus" align="center"
                          :sortable="false" :width="100">
            <template slot="header">
              <span>审核状态</span>
              <el-tooltip placement="top" effect="light" stype="">
                <Icon type="question-circle" theme="outlined" className="text-primary"/>
                <div slot="content">企微官方错误排查审核</div>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <template v-if="scope.row.auditStatus === 0">未审核</template>
              <template v-else-if="scope.row.auditStatus === 1">审核成功</template>
              <template v-else>审核不通过</template>
            </template>
          </el-table-column>

          <el-table-column :show-overflow-tooltip="true" type="default" prop="sendStatus"
                          label="发送状态" dbcolumn="sendStatus" column="sendStatus" align="center"
                          :sortable="false" :width="100">
            <template slot-scope="scope">
              <template v-if="scope.row.sendStatus === 0">待发送</template>
              <template v-else-if="scope.row.sendStatus === 1">发送成功</template>
              <template v-else-if="scope.row.sendStatus === 2">发送失败</template>
              <template v-else>待发送</template>
            </template>
          </el-table-column> -->
        <!-- </el-table> -->
      <!-- </template> -->
      <!-- 表格-结束 -->

      <!-- 分页 -->
      <!-- <template slot="pagination">
        <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                      :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                      :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                      :layout="true? 'total, sizes, prev, pager, next, jumper':'total'" @size-change="$sizeChange$"
                      @current-change="$pageChange$">
        </el-pagination>
      </template> -->
      <!-- 分页-结束 -->
    <!-- </ns-page-table> -->
  </div>
</template>

<script>
import NsTableEffectAnalysisFriend from './src/NsTableEffectAnalysisFriend'
export default NsTableEffectAnalysisFriend
</script>

<style lang="scss" scoped>
@import "@/components/NewUi/styles/reset.css";
.head-img{
  width: 32px;
  height: 32px;
  border-radius: 2px;
}
.head-router{
  display: flex;
  justify-content: space-between;
  width: 100%;
  // margin: -10px -10px 16px;
  // padding-left: 16px;
  height: 48px;
  // line-height: 48px;
  background: #fff;
  font-size: 16px;
  color: #262626;
}
.icon-back{
  font-size: 16px;
  color: #909399;
  margin-right: 16px;
}
::v-deep .btn-content{
  min-width: 70px;
}
.info-block{
  font-size: 14px;
  color: #262626;
  line-height: 22px;
  margin-bottom: 16px;
  span{
    margin-right: 24px;
  }
}
</style>
