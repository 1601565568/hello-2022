<template>
  <div class="groupData">
    <el-dialog
      title="新建群聊"
      :visible.sync="sVisible"
      @closed="onClose"
      width="800px" class="dialog-chat">
      <div class="dialog-chat__content">
        <div class="dialog-left">
          <div class="dialog-left__input">
            <el-input
              placeholder="输入个人号"
              prefix-icon="el-icon-search"
              v-model='searchPrivateAccount'
              clearable
              @keyup.enter.native="searchWxPrivateAccount">
            </el-input>
          </div>
          <div class="dialog-left__checkbox">
            <el-table ref="privateAccountTable" :data="privateAccountData" class="template-table__main"
                      stripe
                      resizable v-loading.lock="loadingPrivateAccountTable"
                      :element-loading-text="$t('prompt.loading')"
                      row-key="id"
                      @selection-change="privateAccountSelectionChange"
                      :reserve-selection='true'>
              <el-table-column :show-overflow-tooltip="true" type="default" prop="nick"
                               label="可选择个人号" :sortable="false">
              </el-table-column>
              <el-table-column type="selection" align="right" :width="50"></el-table-column>
            </el-table>
            <el-pagination class="template-table__pagination"
                           :total="pagination.total"
                           :current-page="pagination.page" :page-size="pagination.size"
                           layout="total, prev, pager, next, jumper"
                           @current-change="onCurrentChange">
            </el-pagination>
          </div>
        </div>
        <div class="dialog-right">
          <div class="dialog-right__title">已选择个人号</div>
          <div class="dialog-right__content">
            <el-scrollbar class="scrollbara">
              <div class="dialog-selectitem" v-for='item of privateAccountSelection' :key='item.wid'>
                <span class="dialog-selectitem__discountgroup">{{item.nick}}</span>
                <i @click='onRemoveSelectedPrivateAccount(item)'><Icon type="shanchu2"/></i>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-btn">
        <ns-button @click="sVisible = false">取消</ns-button>
        <ns-button @click="selectedMemberDialog.visible = true" type='primary' :disabled='nextBtnDisabled'>下一步</ns-button>
      </span>
    </el-dialog>
    <!-- 新建群聊下一步弹窗-->
    <el-dialog
      title="新建群聊"
      :visible.sync="selectedMemberDialog.visible"
      width="663px" class="dialog-chat"
      @closed="onSelectedMemberDialogClose">
      <el-form label-width="80px" :inline="true" class="dialog-chat__form"
        :rules='selectedMemberRules' :model='saveModel' ref='saveModel'>
        <el-form-item label="群名称：" required prop='displayname'>
          <el-form-grid size="lg">
            <el-input v-model='saveModel.displayname' maxlength='15'></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item>
          <div class="dialog-max">
            <Icon type="tishi"/>
            <span class="dialog-max__length">字数最多15字</span>
          </div>
        </el-form-item>
        <div class="dialog-chat__content dialog-chat__content--boderbottom">
          <div class="dialog-left">
            <div class="dialog-left__input">
              <el-input
                placeholder="输入微信号/昵称"
                prefix-icon="el-icon-search"
                v-model="searchFriendModel"
                clearable
                @keyup.enter.native="searchFriend">
              </el-input>
            </div>
            <div class="dialog-left__checkbox">
              <el-table ref="friendTable" :data="friendData" class="template-table__main"
                        stripe
                        resizable v-loading.lock="loadingFriendTable"
                        :element-loading-text="$t('prompt.loading')"
                        row-key="id"
                        @selection-change="friendSelectionChange"
                        :reserve-selection='true'>
                <el-table-column :show-overflow-tooltip="true" type="default" prop="nick"
                                 label="选择好友" :sortable="false">
                </el-table-column>
                <el-table-column type="selection" align="right" :width="50"></el-table-column>
              </el-table>
              <el-pagination class="template-table__pagination"
                             :total="friendPagination.total"
                             :current-page="friendPagination.page" :page-size="friendPagination.size"
                             layout="total, prev, pager, next, jumper"
                             @current-change="onFriendCurrentChange">
              </el-pagination>
            </div>
          </div>
          <div class="dialog-right">
            <div class="dialog-right__title">已选择好友</div>
            <div class="dialog-right__content">
              <el-scrollbar class="scrollbarb">
                <div class="dialog-selectitem" v-for='item in friendSelection' :key='item.wid'>
                  <span class="dialog-selectitem__discountgroup">{{item.nick}}</span>
                  <i @click='onRemoveSelectedFriend(item)'><Icon type="shanchu2"/></i>
                </div>
              </el-scrollbar>
            </div>
          </div>
        </div>
<!--        todo-zsf 暂不支持新增公告-->
<!--        <el-form-item label='群公告：'>-->
<!--          <el-form-grid size="xlg">-->
<!--            <el-input-->
<!--              type="textarea"-->
<!--              :rows="4"-->
<!--              placeholder="请编辑群公告"-->
<!--              v-model="saveModel.chatroomnotice">-->
<!--            </el-input>-->
<!--          </el-form-grid>-->
<!--        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-btn">
        <ns-button @click="selectedMemberDialog.visible = false">上一步</ns-button>
        <ns-button @click="createGroup" type='primary' :loading='saving' :disabled='addBtnDisabled || saving'>确定</ns-button>
      </span>
    </el-dialog>
    <!-- 新建群聊下一步弹窗-->
  </div>
</template>
<script>
import Index from './src/add'

export default Index
</script>
<style scoped>
  @import '../src/dialog.pcss';
</style>
