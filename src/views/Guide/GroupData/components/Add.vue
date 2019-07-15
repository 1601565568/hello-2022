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
        <ns-button @click="sVisible = false" type='primary' :disabled='nextBtnDisabled'>下一步</ns-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Index from './src/add'

export default Index
</script>
<style scoped>
  @import '../src/dialog.pcss';
</style>
