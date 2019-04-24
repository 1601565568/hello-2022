<template>
  <div class="template-page">
    <ns-table-user-manage ref="table" @add_user="addUser" @update-user="updateUser" :department="department" :role="roleOption"></ns-table-user-manage>
    <el-dialog :title="title" :visible.sync="visibleUser"   :modal-append-to-body ="false"
               :close-on-click-modal = "false"  :before-close="onClose" width="400px">
      <el-form ref="form" placement="right" label-width="100px" :model="model" :rules="rules">
        <el-form-item label="用户名："  class = "el-inline-block" required>
          <el-form-grid size="xmd">
            <el-form-item prop = "login_account" >
              <el-input type="text"
                        v-model.trim = "model.login_account"
                        placeholder="请输入">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <span v-if="!reset">
        <el-form-item label="密码：" class = "el-inline-block" required>
          <el-form-grid size="xmd">
            <el-form-item prop = "user_psw" >
              <el-input type="password"
                        v-model = "model.user_psw"
                        placeholder="请输入密码">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="确认密码：" class = "el-inline-block" required>
          <el-form-grid size="xmd">
            <el-form-item prop = "user_repsw" >
              <el-input type="password"
                        v-model = "model.user_repsw"
                        placeholder="请输入确认密码">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        </span>
        <span v-else>
          <el-form-item label="密码：" class = "el-inline-block">
          <el-form-grid size="xmd">
            <el-form-item prop = "reset_psw" >
              <el-input type="password"
                        v-model = "model.reset_psw"
                        placeholder="请输入密码" auto-complete="off">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="确认密码：" class = "el-inline-block" >
          <el-form-grid size="xmd">
            <el-form-item prop = "reset_repsw" >
              <el-input type="password"
                        v-model = "model.reset_repsw"
                        placeholder="请输入确认密码"  auto-complete="off">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        </span>

        <el-form-item label="姓名：" class = "el-inline-block" required>
          <el-form-grid size="xmd">
            <el-form-item prop = "user_name" >
              <el-input type="text"
                        v-model = "model.user_name"
                        placeholder="请输入姓名">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="所属部门：" class = "el-inline-block" required>
          <el-form-grid size="xmd">
            <el-form-item prop = "department" >
              <ns-droptree v-model="model.department" :data="department" clearable></ns-droptree>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="所属角色：" class = "el-inline-block" required>
          <el-form-grid size="xmd">
            <el-form-item prop = "role_id" >
              <el-select v-model="model.role_id"  clearable :placeholder="$t('prompt.select')">
                <el-option v-for="role in roleOption" :key="role.value" :label="role.label" :value="role.value"></el-option>
              </el-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onClose()">{{$t('operating.cancel')}}</ns-button>
        <ns-save @click="onSave" :loading="saveLoading"></ns-save>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import index from './src/index'
import NsTableUserManage from './NsTableUserManage'
import NsDroptree from 'web-crm/src/components/NsDroptree'
index.components = {
  NsTableUserManage,
  NsDroptree
}
export default index
</script>
