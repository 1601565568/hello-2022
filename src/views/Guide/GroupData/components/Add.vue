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
              @keyup.enter.native="loadWxPrivateAccount">
            </el-input>
          </div>
          <div class="dialog-left__checkbox">
            <div class="dialog-choice">可选择个人号</div>
            <el-scrollbar class="scrollbara">
              <el-checkbox-group :max="1" v-model="selectedPrivateAccount" class="checkbox">
                <div v-for="pa of privateAccountData" class="dialog-checkbox__item" :key='pa.wid'>
                  <el-checkbox :label="pa.wid">{{pa.nick}}</el-checkbox>
                </div>
              </el-checkbox-group>
              <el-pagination class="template-table__pagination"
                             :total="pagination.total"
                             :current-page="pagination.page" :page-size="pagination.size"
                             layout="total, prev, pager, next, jumper"
                             @current-change="onCurrentChange">
              </el-pagination>
            </el-scrollbar>
          </div>
        </div>
        <div class="dialog-right">
          <div class="dialog-right__title">已选择个人号</div>
          <div class="dialog-right__content">
            <el-scrollbar class="scrollbara">
              <div class="dialog-selectitem" v-for='item of selectedPrivateAccountItem' :key='item.wid'>
                <span class="dialog-selectitem__discountgroup">{{item.nick}}</span>
                <i class="iconfont icon-shanchu2" @click='onRemoveSelectedPrivateAccount(item)'></i>
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
      <el-form label-width="80px" :inline="true">
        <el-form-item label='群名称：' required='' class="el-inline-block">
<!--          <el-input v-model="saveModel.displayname" placeholder="输入群名称" maxlength='15'></el-input>-->
          <el-form-grid size="xlg">
            <el-col :span="20">
              <el-input v-model="saveModel.displayname" placeholder="输入群名称"></el-input>
            </el-col>
            <el-col :span="4">
              <div class="dialog-max">
                <i class="iconfont icon-tishi"></i>
                <span class="dialog-max__length">字数最多15字</span>
              </div>
            </el-col>
          </el-form-grid>
        </el-form-item>
      <div class="dialog-chat__content dialog-chat__content--boderbottom">
        <div class="dialog-left">
          <div class="dialog-left__input">
            <el-input
              placeholder="输入微信号/昵称"
              prefix-icon="el-icon-search"
              v-model="searchFriend"
              clearable>
            </el-input>
          </div>
          <div class="dialog-left__checkbox">
            <div class="dialog-choice">选择好友</div>
            <el-scrollbar class="scrollbarb">
              <el-checkbox-group v-model="selectedFriend" class="checkbox">
                <div v-for="f of friendData" class="dialog-checkbox__item" :key='f.wid'>
                  <el-checkbox :label="f.wid">{{f.nick}}</el-checkbox>
                </div>
              </el-checkbox-group>
              <el-pagination class="template-table__pagination"
                             :total="friendPagination.total"
                             :current-page="friendPagination.page" :page-size="friendPagination.size"
                             layout="total, prev, pager, next, jumper"
                             @current-change="onFriendCurrentChange">
              </el-pagination>
            </el-scrollbar>
          </div>
        </div>
        <div class="dialog-right">
          <div class="dialog-right__title">已选择好友</div>
          <div class="dialog-right__content">
            <el-scrollbar class="scrollbarb">
              <div class="dialog-selectitem" v-for='item of selectedFriendItem' :key='item.wid'>
                <span class="dialog-selectitem__discountgroup">{{item.nick}}</span>
                <i class="iconfont icon-shanchu2" @click='onRemoveSelectedFriend(item)'></i>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
        <el-form-item label='群公告：'>
          <el-form-grid size="xlg">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请编辑群公告"
              v-model="saveModel.chatroomnotice">
            </el-input>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-btn">
        <ns-button @click="selectedMemberDialog.visible = false">上一步</ns-button>
        <ns-button @click="dialogVisible = false" type='primary' :disabled='addBtnDisabled'>确定</ns-button>
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
