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
                <ns-button type="text" @click="onSaveOpen(scope.row)">代码模版</ns-button>
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
.shanghu{
  color:#FF8C00 !important;
}
.authorization{
  border-bottom: 1px solid #888888;
}
.newestDialog{
  padding:0 10px;
}
.newestDialog .el-dialog__header{
  border-bottom:1px solid #888; 
}
.newestDialog .el-dialog__body{
  padding: 0 !important;
}
.el-row{
  padding-top:15px;
  border-bottom: 8px solid #eee;
}
</style>
