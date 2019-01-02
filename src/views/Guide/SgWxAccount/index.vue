<template>
  <div>
    <ns-page-table>
      <!-- 按钮 -->
      <template slot="buttons">
        <ns-table-operate-button :buttons="_data._table.table_buttons"></ns-table-operate-button>
      </template>
      <!-- 表格 -->
      <template slot="table">
        <el-table ref="table" :data="_data._table.data" class="template-table__main"
                  stripe
                  resizable v-loading.lock="_data._table.loadingtable"
                  :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
          <el-table-column prop="name" label="微信名称"></el-table-column>
          <el-table-column prop="appid" label="应用ID" align="left" width="180"></el-table-column>
          <el-table-column label="企业ID" align="left" width="180">
            <template slot-scope="{row}">
              <span v-if="row.corpid === null">-</span>
              <span v-else>{{row.corpid}}</span>
            </template>
          </el-table-column>
          <el-table-column label="支付ID" align="left" width="139">
            <template slot-scope="{row}">
              <span v-if="row.pay_id === null">-</span>
              <span v-else>{{row.pay_id}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="update_time" label="更新时间" width="160" align="left"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="操作" align="right" width="112">
            <template slot-scope="scope">
              <span class="tmp-cell__buttons">
                <ns-button type="text" @click="onSaveOpen(scope.row)">编辑</ns-button>
                <ns-button v-if="scope.row.appid !== 'wxd018c65db8b66408' && scope.row.appid !== 'wx088d6dbeea9c68c3'"
                           type="text" @click="onDelete(scope.row)">删除</ns-button>
              </span>
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
       <!-- <template slot="buttons">
        <ns-table-operate-button :buttons="_data._table.table_button"></ns-table-operate-button>
      </template> -->
    </ns-page-table>
    <!-- 初始弹窗开始 -->
    <el-dialog size="small" :title="titleText"
               :visible.sync="dialogFormVisible"
               :modal-append-to-body="false"
               @before-close="closeDialog()">
      <template slot="button">
        <ns-table-operate-button :button="_data._table.table_button"></ns-table-operate-button>
      </template>     
      <el-form :model="model" ref="form" label-width="150px" :rules="rules" placement="right">
        <el-form-item label="微信名称：" prop="name" required>
          <el-input type="text" placeholder="请输入微信名称" v-model="model.name" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="应用ID：" prop="appid" required>
          <el-input type="text" placeholder="请输入应用ID" v-model="model.appid" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="应用密钥：" prop="secret" required>
          <el-input type="text" placeholder="请输入应用密钥" v-model="model.secret" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="企业ID：" prop="corpid">
          <el-input type="text" placeholder="请输入企业ID" v-model="model.corpid" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="企业密钥：" prop="corpsecret">
          <el-input type="text" placeholder="请输入企业密钥" v-model="model.corpsecret" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="支付ID：" prop="payId">
          <el-input type="text" placeholder="请输入支付ID" v-model="model.payId" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="支付密钥：" prop="paySecret">
          <el-input type="text" placeholder="请输入支付密钥" v-model="model.paySecret" maxlength="100"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="dialogFormVisible = false">取消</ns-button>
        <ns-button type="primary" @click="onSave">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 初始弹窗结束 -->
    <!-- 授权小程序弹窗开始 -->
    <el-dialog size="small" class="newestDialog" :title="miniProgramText" width="80%"
              :visible.sync="miniProgram"
              :modal-append-to-body="false" :close-on-click-modal="true"
              @before-close="closeDialog()">
      <div class="dialog_mian">
        <div class="dialog_mian_logo">
          <img calss="shoplogo" src="../../../assets/shoplogo.png" />
          <h4>最火导购</h4>
          <p>（<ns-button type="text" @click="onUpdate">更新授权</ns-button>/<ns-button type="text" @click="onRelieve">解除授权</ns-button>）</p>
        </div>
        <div class="dialog_mian_topText">
          <p><span>介绍：</span>最伙导购是一款辅助线下实体店导购员应用，可以提升用户消费体验</p>
          <p><span>认证：</span>{{appObj.verify_type === 0 ? "已认证" : "未认证"}}</p>
          <p><span>主体信息：</span>{{appObj.principal_name}}</p>
          <p><span>AppID：</span>{{appObj.appid}}</p>
        </div>
        <div class="dialog_mian_centerText">
          <el-row>
              <el-col :span='8'><span>线上版本：{{appObj.online_version}}</span></el-col>
              <el-col :span='8'><span>{{appObj.online_version}}</span></el-col>
              <el-col :span='8'>小程序尚未发布<ns-button type="text" @click="onPublish(appObj.latestStatus)">（发布小程序）</ns-button></el-col>
          </el-row>
          <el-row>
              <el-col :span='8'><span>更新时间：{{appObj.update_time}}</span></el-col>
              <el-col :span='8'><span>2018-12-03 16:53:30</span></el-col>
          </el-row>
          <el-row>
              <el-col :span='8'><span>更新状态：{{appObj.online_version < appObj.latestAuditVersion ? '':'线上版本为最新版本'}}</span></el-col>
              <el-col :span='8'><span>
                {{appObj.latestAuditVersion}}版本{{appObj.latestStatus === 1 ? '已上传未审核' : appObj.latestStatus === 2 ? '审核中' : appObj.latestStatus === 3 ? '审核成功' : appObj.latestStatus === 4 ? '已发布' : appObj.latestStatus === 5 ? '已撤回' : ''}}</span>,点击<ns-button type="text" @click="onAutid(appObj.appid)">提交微信审核</ns-button>,重新发布</el-col>
          </el-row>
        </div>
        <div class="dialog_mian_bottomText">
          <el-row>
              <el-col :span='12'><span>支付设置：</span>商户编号：2958371925，商户密钥：ecehg3205t321kfsgl（修改）</el-col>
              <el-col :span='12'><span>未设置：</span>（新增）</el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
    <!-- 授权小程序弹窗结束 -->
    <!-- 提交审核弹窗开始 -->
    <el-dialog size="small" :title="autidText"
               :visible.sync="dialogAutid"
               :modal-append-to-body="false"
               @before-close="closeDialog()">
      <el-form :model="model" ref="form" label-width="150px" :rules="rules" placement="right">
        <el-form-item label="模版Id：" prop="templateId" required>
          <el-input type="text" disabled ="false" placeholder="请输入微信名称" v-model="model.templateId"  maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="自定义标签：" prop="appid" required>
          <el-input type="textarea" max="20" placeholder="小程序的标签，多个标签用空格分隔，标签不能多于10个，标签成都不超过20" v-model="model.appid" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="可选类目：" prop="secret" required>
           <el-select placeholder="请选择职务" v-model="model.job" clearable>
              <el-option label="店长" :value="1"></el-option>
              <el-option label="导购" :value="0"></el-option>
            </el-select>
          <!-- <el-input type="text" placeholder="请输入应用密钥" v-model="model.secret" maxlength="50"></el-input> -->
        </el-form-item>
        <el-form-item label="页面地址：" prop="corpid" required>
           <el-select placeholder="请选择职务" v-model="model.job" clearable>
              <el-option label="店长" :value="1"></el-option>
              <el-option label="导购" :value="0"></el-option>
            </el-select>
          <!-- <el-input type="text" placeholder="请输入企业ID" v-model="model.corpid" maxlength="32"></el-input> -->
        </el-form-item>
        <el-form-item label="页面标题：" prop="corpsecret" required>
          <el-input type="text" max="32" placeholder="请输入企业密钥" v-model="model.corpsecret" maxlength="50"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="dialogAutid = false">取消</ns-button>
        <ns-button type="primary" @click="onPresent()">提交</ns-button>
      </div>
    </el-dialog>
    <!-- 提交审核弹窗结束 -->
    <!-- 最新弹窗主页面开始 -->
    <el-dialog size="small" class="newestDialog" :title="titleTexts" width="60%"
              :visible.sync="newestDialog"
              :modal-append-to-body="false" :close-on-click-modal="true"
              @before-close="closeDialog()">
      <el-row>
        <ns-button type="primary" @click="newest">同步最新</ns-button>
        <ns-button type="primary" @click="domainName">域名配置</ns-button>
        <ns-button type="primary" @click="qrCode">体验二维码</ns-button>
        <ns-button type="primary" @click="release">发布</ns-button>
      </el-row>
      <el-table ref="table" :data="_data._table.data" stripe >
        <el-table-column prop="work_id" label="模板ID" align="left" width="88">
          <template slot-scope="scope">
            {{scope.row.work_id?scope.row.work_id:'-'}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="版本" align="center" width="130"></el-table-column>
        <el-table-column prop="nickname" label="开发者" align="center">
          <template slot-scope="scope">
            {{scope.row.nickname?scope.row.nickname:'-'}}
          </template >
        </el-table-column>
        <el-table-column prop="mobile" label="备注" align="center" ></el-table-column>
        <el-table-column prop="status,row" :show-overflow-tooltip="true" label="操作" align="center" width="120">
          <template slot-scope="scope">
            <div>
              <ns-button type="primary"  @click="uploading(scope.row)">
                上传
              </ns-button>
              <ns-button @click="underReview(scope.row)">
                审核中
              </ns-button>
              <ns-button type="primary" @click="auditSuccess(scope.row)">
                审核成功
              </ns-button>
              <ns-button type="text" @click="published(scope.row)">
                已发布
              </ns-button>
              <ns-button type="primary" @click="submitted(scope.row)">
                提交审核
              </ns-button>
              <ns-button @click="auditFailure(scope.row)">
                审核失败
              </ns-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                          :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                          :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                          layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                          @current-change="$pageChange$">
          </el-pagination>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="dialogFormVisible = false">取消</ns-button>
        <ns-button type="primary" @click="onSave">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 最新弹窗主页面结束 -->
    <!-- 最新弹窗模板详情开始 -->
    <el-dialog size="small" :title="titleText"
               :visible.sync="dialogFormVisible"
               :modal-append-to-body="false"
               @before-close="closeDialog()">
      <el-form :model="model" ref="form" label-width="150px" :rules="rules" placement="right">
        <el-form-item label="微信名称：" prop="name" required>
          <el-input type="text" placeholder="请输入微信名称" v-model="model.name" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="应用ID：" prop="appid" required>
          <el-input type="text" placeholder="请输入应用ID" v-model="model.appid" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="应用密钥：" prop="secret" required>
          <el-input type="text" placeholder="请输入应用密钥" v-model="model.secret" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="企业ID：" prop="corpid">
          <el-input type="text" placeholder="请输入企业ID" v-model="model.corpid" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="企业密钥：" prop="corpsecret">
          <el-input type="text" placeholder="请输入企业密钥" v-model="model.corpsecret" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="支付ID：" prop="payId">
          <el-input type="text" placeholder="请输入支付ID" v-model="model.payId" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="支付密钥：" prop="paySecret">
          <el-input type="text" placeholder="请输入支付密钥" v-model="model.paySecret" maxlength="100"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="dialogFormVisible = false">取消</ns-button>
        <ns-button type="primary" @click="onSave">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 最新弹窗模板详情结束 -->
    <!-- 最新弹窗服务器域名开始 -->

    <!-- 最新弹窗服务器域名结束 -->
    <!-- 最新弹窗二维码开始 -->

    <!-- 最新弹窗二维码结束 -->
    <!-- 最新弹窗模板上传开始 -->

    <!-- 最新弹窗模板上传结束 -->
    <!-- 最新弹窗提交审核开始 -->

    <!-- 最新弹窗提交审核结束 -->
    <!-- 最新弹窗微信号授权开始 -->
    <el-dialog size="small" class="authorization" :title="authorizationText" width="40%"
               :visible.sync="authorization"
               :modal-append-to-body="false"
               @before-close="closeDialog()">
      <div>
        <p class="shanghu">一个微信号只能授权给一个商户！</p>
        <p>点击授权跳转到微信公众平台授权页面，授权微信号</p>
      </div>         
      <div slot="footer" class="authorization_footer">
        <ns-button @click="authorization = false">取消</ns-button>
        <ns-button type="primary" @click="onToAuthorize">去授权</ns-button>
      </div>
    </el-dialog>
    <!-- 最新弹窗微信号授权结束 -->
  </div>
</template>

<script>
  import index from './src/index'

  export default index
</script>
<style>
.dialog_mian{
  padding:10px 30px 30px;
}
.dialog_mian_logo{
  display: flex;
  justify-items:inherit;
  align-items:center;
}
.dialog_mian_logo img{
  margin-right:5px;
}
.dialog_mian_topText p sapn{
  color:grey;
}
.dialog_mian_topText p{
  height: 30px;
  line-height: 30px;
}
.shanghu{
  color:#FF8C00 !important;
}
img{
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
<!-- .authorization{
  border-bottom: 1px solid #888888;
} -->
.newestDialog{
  padding:0 10px;
}
<!-- .newestDialog .el-dialog__header{
  border-bottom:1px solid #888; 
} -->
.newestDialog .el-dialog__body{
  padding: 0 !important;
}
.el-row{
  padding-top:15px;
}
<!-- .el-row{
  padding-top:15px;
  border-bottom: 8px solid #eee;
} -->
.dialog_mian{
  padding:10px 20px;
}

</style>
