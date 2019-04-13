<template>
  <div>
    <ns-page-table>
      <!-- 按钮 -->
        <template slot="buttons">
          <ns-table-operate-button :buttons="_data._table.table_buttons"></ns-table-operate-button>
        </template>
      <!-- 简单搜索 -->
      <!-- el-form 需添加 @submit.native.prevent 配置 -->
      <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
      <template slot="searchSearch">
        <el-form :model="model" :inline="true" @submit.native.prevent  class="pull-right">
          <el-form-item v-show="_data._queryConfig.expand === false">
            <el-input ref="quickText" style="width: 250px" v-model="model.name" placeholder="请输入请输入小程序名称" @keyup.enter.native="$quickSearchAction$('name')" clearable>
            </el-input>
            <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
            <ns-button @click="$resetInputAction$()">重置</ns-button>
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
      <!-- 高级搜索开始 -->
      <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" :model="model" label-width="80px" :inline="true">

        <el-form-item label="集团ID：">
          <el-form-grid size="xmd">
            <el-input ref="quickText" style="width: 150px" v-model="model.groupId" placeholder="请输入集团ID" @keyup.enter.native="$quickSearchAction$('groupId')" clearable>
            </el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="小程序名称：">
          <el-form-grid>
            <el-input ref="quickText" style="width: 150px" v-model="model.name" placeholder="请输入小程序名称" @keyup.enter.native="$quickSearchAction$('name')" clearable>
            </el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="appid：">
          <el-form-grid>
            <el-input ref="quickText" style="width: 150px" v-model="model.appid" placeholder="请输入appid" @keyup.enter.native="$quickSearchAction$('appid')" clearable>
            </el-input>
          </el-form-grid>
        </el-form-item>
      </el-form>

      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
        <ns-button @click="$resetInputAction$()">重置</ns-button>
      </div>
    </template>
      <!-- 高级搜索结束 -->
      <!-- 表格 -->
      <template slot="table">
        <el-table ref="table" :data="_data._table.data" class="template-table__main"
                  stripe
                  resizable v-loading.lock="_data._table.loadingtable"
                  :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
          <el-table-column prop="groupId" label="集团ID" align="left" ></el-table-column>
          <el-table-column prop="name" label="微信名称" align="left" ></el-table-column>
          <el-table-column prop="appid" label="应用ID" align="left" ></el-table-column>
          <el-table-column label="企业ID" align="left" >
            <template slot-scope="{row}">
              <span v-if="row.corpid === null">-</span>
              <span v-else>{{row.corpid}}</span>
            </template>
          </el-table-column>
          <el-table-column label="支付ID" align="left" >
            <template slot-scope="{row}">
              <span v-if="row.pay_id === null">-</span>
              <span v-else>{{row.pay_id}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="update_time" label="更新时间" align="left"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="操作" width="190px" align="right">
            <template slot-scope="scope">
              <span class="tmp-cell__buttons">
                <ns-button type="text" @click="onSaveOpen(scope.row)">编辑</ns-button>
                <ns-button v-if="scope.row.wxStatus === 1" type="text" @click="onCodeTemplate(scope.row)">代码模版</ns-button>
                <ns-button type="text" @click="onRefresh(scope.row)">刷新</ns-button>
                <ns-button type="text" @click="onDelete(scope.row)">删除</ns-button>
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
    </ns-page-table>
    <!-- 初始弹窗开始 -->
    <el-dialog size="small" :title="titleText"
               :visible.sync="dialogFormVisible"
               :modal-append-to-body="false"
               @before-close="closeDialog()">
      <el-form :model="model" ref="form" label-width="150px" :rules="rules" placement="right">
        <el-form-item label="小程序类型：" prop="type" required>
            <el-radio  v-model="model.type" :label="1" >店长</el-radio>
            <el-radio  v-model="model.type" :label="0" >导购</el-radio>
        </el-form-item>
        <el-form-item label="集团id：" prop="groupId" required>
          <el-input type="text" placeholder="请输入集团id" v-model="model.groupId" ></el-input>
        </el-form-item>
        <el-form-item label="微信名称：" prop="name" required>
          <el-input v-if="model.fromType === 1" type="text" :disabled='true' placeholder="请输入微信名称" v-model="model.name"></el-input>
          <el-input v-else type="text" placeholder="请输入微信名称" v-model="model.name" ></el-input>
        </el-form-item>
        <el-form-item label="应用ID：" prop="appid" required>
          <el-input v-if="model.fromType === 1" type="text" :disabled='true' placeholder="请输入应用ID" v-model="model.appid"></el-input>
          <el-input v-else type="text" placeholder="请输入应用ID" v-model="model.appid" ></el-input>
        </el-form-item>
        <el-form-item v-if="model.fromType !== 1" label="应用秘钥：" prop="secret" required>
          <el-input type="text" placeholder="请输入应用秘钥" v-model="model.secret"></el-input>
        </el-form-item>
        <el-form-item label="外部联系人企业秘钥：" prop="userCorpsecret" required>
          <el-input type="text" placeholder="请输入外部联系人企业秘钥" v-model="model.userCorpsecret" ></el-input>
        </el-form-item>
        <el-form-item  label="通讯录企业秘钥：" prop="addressCorpsecret" required>
          <el-input type="text" placeholder="请输入通讯录企业秘钥" v-model="model.addressCorpsecret" ></el-input>
        </el-form-item>
        <el-form-item label="企业ID：" prop="corpid">
          <el-input type="text" placeholder="请输入企业ID" v-model="model.corpid" ></el-input>
        </el-form-item>
        <el-form-item label="企业密钥：" prop="corpsecret">
          <el-input type="text" placeholder="请输入企业密钥" v-model="model.corpsecret"></el-input>
        </el-form-item>
        <el-form-item label="支付ID：" prop="payId">
          <el-input type="text" placeholder="请输入支付ID" v-model="model.payId"></el-input>
        </el-form-item>
        <el-form-item label="支付密钥：" prop="paySecret">
          <el-input type="text" placeholder="请输入支付密钥" v-model="model.paySecret"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="dialogFormVisible = false">取消</ns-button>
          <ns-button type="primary" @click="onSave">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 初始弹窗结束 -->
    <!-- 提交审核弹窗开始 -->
    <el-dialog size="small" :title="titleText"
               :visible.sync="dialogAutid"
               :modal-append-to-body="false" :close-on-click-modal="true"
               @before-close="closeDialog()">
      <el-form :model="submittedObj" ref="form" label-width="150px" :rules="checkRules" placement="right">
        <el-form-item label="模版Id：" prop="template_id"  required>
          <el-input type="text" placeholder="请输入模版Id" v-model="submittedObj.template_id"  maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="自定义标签：" prop="appid" required>
          <el-input type="textarea" max="20" v-model="submittedObj.appid" placeholder="小程序的标签，多个标签用空格分隔，标签不能多于10个，标签长度不超过20"></el-input>
        </el-form-item>
        <el-form-item label="可选类目：" prop="firstId" required>
          <el-select placeholder="请选择可选类目" v-model="submittedObj.firstId" >
            <el-option v-for="shop in submittedObj.categoryList" :label="shop.theSecond_class" :value="shop.first_id" :key="shop.first_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="页面地址：" prop="secondId" required>
          <el-form-grid  size="lg">
            <el-select placeholder="请选择页面地址" v-model="submittedObj.secondId" >
              <el-option v-for="shop in submittedObj.pageList" :value="shop" :key="shop"></el-option>
            </el-select>
          </el-form-grid>

        </el-form-item>
        <el-form-item label="页面标题："  prop="corpsecret" required>
          <el-input type="text" max="32" placeholder="请输入页面标题" maxlength="50" v-model='submittedObj.corpsecret'></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="dialogAutid = false">取消</ns-button>
        <ns-button type="primary" @click="onPresent(submittedObj)">提交</ns-button>
      </div>
    </el-dialog>
    <!-- 提交审核弹窗结束 -->
    <!-- 最新弹窗主页面开始 -->
    <el-dialog size="small" class="newestDialog" :title="titleText" width="60%"
              :visible.sync="newestDialog"
              :modal-append-to-body="false" :close-on-click-modal="true"
              @before-close="closeDialog()">
      <el-row>
        <ns-button type="primary" @click="newest">同步最新</ns-button>
        <ns-button type="primary" @click="domainName">域名配置</ns-button>
        <ns-button type="primary" @click="qrCode">体验二维码</ns-button>
        <ns-button type="primary" @click="release">发布</ns-button>
      </el-row>
      <el-table ref="table" :data="modelArry" stripe >
        <el-table-column prop="template_id" label="模板ID"  align="left" width="88"></el-table-column>
        <el-table-column prop="version" label="版本" align="center" width="130"></el-table-column>
        <el-table-column prop="developer" label="开发者" align="center"></el-table-column>
        <el-table-column prop="user_desc" label="备注" align="center" ></el-table-column>
        <el-table-column prop="status" :show-overflow-tooltip="true" label="操作" align="center" width="180">
          <template slot-scope="{row}">
            <div>
              <ns-button v-if="row.status === 0" type="primary"  @click="uploading(row)">
                &nbsp;&nbsp;上&nbsp;&nbsp;&nbsp;&nbsp;传&nbsp;&nbsp;
              </ns-button>
              <ns-button class="underReview" v-if="row.status === 2" @click="underReview(row)" >
                &nbsp;审&nbsp;核&nbsp;中&nbsp;
              </ns-button>
              <ns-button v-if="row.status === 3" type="text" @click="auditSuccess(row)" >
                审核成功
              </ns-button>
              <ns-button v-if="row.status === 4" type="primary" >
                &nbsp;已&nbsp;发&nbsp;布&nbsp;
              </ns-button>
              <ns-button v-if="row.status === 1" type="primary" @click="submitted(row)" >
                提交审核
              </ns-button>
              <ns-button class="auditFailure" v-if="row.status === -1" @click="auditFailure(row)">
                审核失败
              </ns-button>
              <ns-button class="auditFailure" v-if="row.status === 5" @click="auditFailure(row)">
                &nbsp;已&nbsp;撤&nbsp;回&nbsp;
              </ns-button>
              <ns-button type="info" @click="dialogDeleteTemplateShow(row)">
                删除
              </ns-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="newestDialog = false">取消</ns-button>
        <ns-button type="primary" @click="newestDialog = false">确定</ns-button>
      </div>
    </el-dialog>
    <!--删除代码模板弹窗-->
    <el-dialog size="small" class="authorization" :title="titleText" width="25%"
               :visible.sync="dialogDeleteTemplate"
               :modal-append-to-body="false"
               @before-close="closeDialog()">
      <div>
        <p class="shanghu">将从模板库删除该小程序代码模板</p>
      </div>
      <div slot="footer" class="authorization_footer">
        <ns-button @click="dialogDeleteTemplate = false">取消</ns-button>
        <ns-button type="primary" @click="deleteTemplate">确认</ns-button>
      </div>
    </el-dialog>
    <!-- 最新弹窗主页面结束 -->
    <!-- 最新弹窗模板详情开始 -->
    <el-dialog :title="titleText"
      :visible.sync="shopKuhuShow"
      width="600px"
      @keyup.enter.native="onKeyUp"
      @keyup.esc.native="onKeyUp" >
    <div>
      <div class="kehuBox-main">
        <div>
          <div class="kehuBox-main-span">
            <el-row>
              <el-col :span='20'><span>模版Id：{{particularsObj.template_id || '-'}}</span></el-col>
            </el-row>
            <el-row>
              <el-col :span='20'><span>版本号：{{particularsObj.version || '-'}}</span></el-col>
            </el-row>
            <el-row>
              <el-col :span='20'><span>开发者：{{particularsObj.developer || '-'}}</span></el-col>
            </el-row>
            <el-row>
              <el-col :span='20'><span>代码备注：{{particularsObj.user_desc || '-'}}</span></el-col>
            </el-row>
            <el-row>
              <el-col :span='20'><span>自定义标签：{{particularsObj.audit_tags || '-'}}</span></el-col>
            </el-row>
            <el-row>
              <el-col :span='20'>
                <p>可选类目：
                  <span v-if="particularsObj.audit_category === {}">{{particularsObj.audit_category.first_class || '-'}}</span>
                  <span>-</span>
                  <span v-if="particularsObj.audit_category === {}">{{particularsObj.audit_category.second_class || '-'}}</span>
                </p>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='20'><span>页面地址：{{particularsObj.audit_address || '-'}}</span></el-col>
            </el-row>
            <el-row>
              <el-col :span='20'><span>页面标题：{{particularsObj.audit_title || '-'}}</span></el-col>
            </el-row>
            <el-row v-if='particularsObj.audit_error_msg !== null'>
              <el-col :span='20'>上次审核错误信息：<span v-html="particularsObj.audit_error_msg"></span></el-col>
            </el-row>
          </div>
          <div slot="footer" class="dialog_footer">
            <ns-button @click="shopKuhuShow = false">取消</ns-button>
            <ns-button type="primary" @click="uploadAgain(particularsObj)">{{checkText}}</ns-button>
          </div>
        </div>
      </div>
    </div>
    </el-dialog>
    <!-- 最新弹窗模板详情结束 -->
    <!-- 最新弹窗服务器域名开始 -->
    <el-dialog size="small" :title="titleText"
               :visible.sync="domainNameVisible"
               :modal-append-to-body="false"
               @before-close="closeDialog()">
      <div  class="dialog_domainName">
        <p>服务器域名</p>
      </div>
      <el-form :model="domainNameObj" ref="form" label-width="150px" :rules="domainNameRules" placement="left">
        <el-form-item label="request：" prop="request_domain" required>
          <el-input type="text" v-model="domainNameObj.request_domain" ></el-input>
        </el-form-item>
        <el-form-item label="socket：" prop="ws_request_domain" required>
          <el-input type="text" v-model="domainNameObj.ws_request_domain" ></el-input>
        </el-form-item>
        <el-form-item label="upliadFile：" prop="upload_domain" required>
          <el-input type="text" v-model="domainNameObj.upload_domain" ></el-input>
        </el-form-item>
        <el-form-item label="downloadFile：" prop="download_domain">
          <el-input type="text" v-model="domainNameObj.download_domain" ></el-input>
        </el-form-item>
      </el-form>
      <div  class="dialog_domainName">
        <p>业务域名</p>
      </div>
      <el-form :model="domainNameObj" ref="form" label-width="150px" :rules="businessRules" placement="left">
        <el-form-item label="webViewDomain：" prop="webview_domain" required>
          <el-input type="text" v-model="domainNameObj.webview_domain"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="domainNameVisible = false">取消</ns-button>
        <ns-button type="primary" @click="onSaveDomainName(domainNameObj)">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 最新弹窗服务器域名结束 -->
    <!-- 最新弹窗二维码开始 -->
    <el-dialog size="small" class="authorization" :title="titleText" width="40%"
               :visible.sync="qrCodeShow"
               :modal-append-to-body="false"
               @before-close="closeDialog()">
              <div class="qrCode">
                <img class="qrCode_img" :src="img"/>
              </div>
              <div slot="footer" class="dialog_footer">
                <ns-button type="primary" @click="qrCodeShow = false">确定</ns-button>
              </div>
    </el-dialog>
    <!-- 最新弹窗二维码结束 -->
    <!-- 最新弹窗模板上传开始 -->
    <el-dialog size="small" class="authorization" :title="titleText" width="40%"
               :visible.sync="newauthorization"
               :modal-append-to-body="false"
               @before-close="closeDialog()">
        <el-form :model="underReviewObj" ref="form" label-width="150px" :rules="uploadingRules" placement="left">
          <el-form-item label="模版Id：" prop="template_id" required>
            <el-input type="text" placeholder="请输入模版Id" v-model="underReviewObj.template_id" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="版本号：" prop="version" required>
            <el-input type="text" placeholder="请输入版本号" v-model="underReviewObj.version" maxlength="32"></el-input>
          </el-form-item>
          <el-form-item label="代码备注：" prop="user_desc" required>
            <el-input type="textarea" placeholder="请输入代码备注" v-model="underReviewObj.user_desc" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="外跳小程序白名单：" prop="developer">
            <el-input type="textarea" placeholder="需要跳转的小程序appId列表，多个appId以，隔开，最大输入9个" v-model="underReviewObj.appId_array" ></el-input>
          </el-form-item>
        </el-form>
      <div slot="footer" >
        <ns-button @click="newauthorization = false">取消</ns-button>
        <ns-button type="primary" @click="affirmUploading(underReviewObj)">上传</ns-button>
      </div>
    </el-dialog>
    <!-- 最新弹窗模板上传结束 -->
    <!-- 最新弹窗发布开始 -->
     <el-dialog size="small" class="authorization" :title="titleText" width="40%"
               :visible.sync="releaseShow"
               :modal-append-to-body="false"
               @before-close="closeDialog()">
       <div class="release_div" v-if="succeedObj.template_id">
          <div class="releaseShow_div">确认发布将发布已审核成功的模板</div>
          <el-row class="releaseShow_row">
            <el-col :span='6'><span>模版Id</span></el-col>
            <el-col :span='6'><span>页面标题</span></el-col>
            <el-col :span='6'><span>页面地址</span></el-col>
            <el-col :span='6'><span>操作</span></el-col>
          </el-row>
          <el-row class="releaseShow_lastRow">
            <el-col :span='6'><span>{{succeedObj.template_id || '-'}}</span></el-col>
            <el-col :span='6'><span>{{succeedObj.audit_title || '-'}}</span></el-col>
            <el-col :span='6'><span>{{succeedObj.audit_address || '-'}}</span></el-col>
            <el-col :span='6' v-if="succeedObj.template_id === undefined"><ns-button disabled type="primary" @click="releaseParticulars(succeedObj)">详情</ns-button></el-col>
            <el-col :span='6' v-else><ns-button type="primary" @click="releaseParticulars(succeedObj)">详情</ns-button></el-col>
          </el-row>
       </div>
       <div class="noSuccee_div" v-else>
         <div class="releaseShow_div">暂无可发布的模板!</div>
       </div>
      <div slot="footer" class="authorization_footer">
        <ns-button @click="releaseShow = false">取消</ns-button>
        <ns-button type="primary" v-if="succeedObj.template_id" @click="onPublish(succeedObj)">确认</ns-button>
        <ns-button type="primary" v-else @click="releaseShow = false">确认</ns-button>
      </div>
    </el-dialog>
    <!-- 最新弹窗发布结束 -->
    <!-- 最新弹窗微信号授权开始 -->
    <el-dialog size="small" class="authorization" :title="titleText" width="25%"
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
    <el-dialog
      title="草稿箱"
      :visible.sync="dialogVisible"
      width="1000px" height="600px">
      <el-table ref="table" :data="tableList" class="template-table__main"
                stripe
                resizable v-loading.lock="loadingTable"
                :element-loading-text="$t('prompt.loading')">
        <el-table-column prop="draft_id" align="center" label="草稿ID"></el-table-column>
        <el-table-column prop="user_version" align="center" label="版本号"></el-table-column>
        <el-table-column prop="developer" align="center" label="开发者"></el-table-column>
          <el-table-column prop="source_miniprogram" align="center" label="小程序来源"></el-table-column>
        <el-table-column prop="user_desc" label="描述"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作" align="center"
                         width="120">
          <template slot-scope="scope">
            <ns-table-column-operate-button :buttons="_data._table2.table_buttons2"
                                            :prop="scope">
            </ns-table-column-operate-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
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
.dialog_footer{
  margin: 10px 0 10px 0;
  display: flex;
  justify-content: flex-end;
}
.underReview{
  color: #FF8C00;
}
.dialog-top{
  border-top:1px solid #ddd;
  padding:10px 0 10px 78px;
}
.auditFailure{
  color:red;
}
.dialog_mian_logo{
  display: flex;
  justify-items:inherit;
  align-items:center;
}
.dialog_mian_logo .shoplogo{
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
<!-- .el-row{
  padding-top:15px;
  border-bottom: 8px solid #eee;
} -->
.dialog_mian{
  padding:10px 20px;
}
.dialog_mian_logo img{
  width: 30px;
  height: 30px;
  /* border-radius: 50%; */
}
.qrCode{
  display: flex;
  justify-content: center;
  align-items: center
}
.qrCode .qrCode_img{
  width: 280px;
  height: 280px;
}
.dialog_domainName{
  background-color: #dddddd;
  margin-bottom:15px;
  padding-left:10px;
}
.releaseShow_div{
  font-size: 16px;
  color: #FF8C00;
  margin-bottom:10px;
}
.releaseShow_row{
  margin-bottom:10px;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  font-weight: 600;
  padding: 0 20px;
  text-align: center;
}
.releaseShow_lastRow{
  padding: 0 20px;
  text-align: center;
}
.button{
  margin-left:150px
}
.nsButtonWidth{
  width: 66px;
}
</style>
