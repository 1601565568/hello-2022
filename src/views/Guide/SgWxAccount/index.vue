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
          <el-table-column label="企业微信id" align="left" width="180">
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
          <el-table-column :show-overflow-tooltip="true" label="操作" align="right" width="80">
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
    </ns-page-table>
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
        <ns-save type="primary" @click="onSave">保存</ns-save>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import index from './src/index'

  export default index
</script>

