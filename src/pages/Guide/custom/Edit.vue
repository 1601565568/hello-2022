<template>
  <PageEdit v-loading="loading"
    ><div slot="header">
      <div class="common-header flex-box">
        <h3>{{ isEdit ? '编辑' : '预览' }}</h3>
        <div class="common-btn">
          <ns-button
            class="customer-btn_save"
            type="primary"
            size="large"
            v-if="!isEdit"
            @click="onEdit"
            >编辑</ns-button
          >
          <ns-button class="customer-btn_cancel" v-if="isEdit" @click="onCancel"
            >取消</ns-button
          >
          <ns-button
            class="customer-btn_save"
            type="primary"
            size="large"
            v-if="isEdit"
            @click="onSave"
            >保存</ns-button
          >
          <ns-button
            class="customer-btn_save"
            type="primary"
            size="large"
            v-if="isEdit"
            @click="onSaveAndEsc"
            >保存并退出</ns-button
          >
        </div>
      </div>
    </div>
    <div slot="content">
      <el-row class="custom-content">
        <el-col class="PageContentLeft"
          ><ScrollView className="edit-content"
            ><PageContentLeft
              :defaultActive="defaultActive"
              @onChange="onChangeMenu"
              :menuArr="menuArr"/></ScrollView
        ></el-col>
        <el-col class="PageContentMiddle"
          ><ScrollView className="edit-content"
            ><PageContentMiddle
              @onClearSettingCode="onClearSettingCode"
              :menuListTitle="menuObj.menuListTitle"
              :menuType="menuObj.menuId"
              :moduleType="menuObj.moduleType"
              :editData="pageModuleType"
              :settingCode="settingCode"
              ref="PageContentMiddle"/></ScrollView
        ></el-col>
        <el-col v-if="isEdit"  class="PageContentRightwarpper"
          ><ScrollView className="edit-content">
            <PageContentRight
              :activeSetName="activeSetName"
              @onPageRewardSetting="onPageRewardSetting"
              @onShowEdit="onShowEdit"
              :editData="pageModuleType"
              @change="onSetChange"
            />
          </ScrollView>
        </el-col>
      </el-row>
      <el-dialog :visible.sync="tipsShow" width="30%">
        <div class="tipsShowTitle" slot="title">提示信息</div>
        <div class="tipsShowContent">
          <span class="ns-warm-cricle">!</span>是否保存当前修改?
        </div>
        <span slot="footer" class="dialog-footer">
          <ns-button @click="onTipsShowCancel">取 消</ns-button>
          <ns-button type="primary" @click="onConfirm">确 定</ns-button>
        </span>
      </el-dialog>
      <el-dialog :visible.sync="escShow" width="30%">
        <div class="tipsShowTitle" slot="title">提示信息</div>
        <div class="tipsShowContent">
          <span class="ns-warm-cricle">!</span
          >取消后将不会保存当前配置，确定取消吗？
        </div>
        <span slot="footer" class="dialog-footer">
          <ns-button @click="onEscCancel">取 消</ns-button>
          <ns-button type="primary" @click="onEscConfirm">确 定</ns-button>
        </span>
      </el-dialog>
      <PageRewardSetting
        ref="PageRewardSetting"
        @onConfirm="onSettingConfirm"
        :rewardSettingList="rewardSettingList"
      />
      <PageSetupSetting
        ref="PageSetupSetting"
        @onConfirm="onSetupConfirm"
      />
    </div>
  </PageEdit>
</template>
<script>
import ScrollView from '@/components/NewUi/ScrollView'
import Edit from './src/Edit.js'
import PageEdit from '@/components/NewUi/PageEdit'
import PageContentLeft from './components/PageContentLeft'
import PageContentMiddle from './components/PageContentMiddle'
import PageContentRight from './components/PageContentRight'
import PageRewardSetting from './components/pageComponents/pageRewardSetting'
import PageSetupSetting from './components/pageComponents/pageSetupSetting'
Edit.components = {
  ScrollView,
  PageContentLeft,
  PageContentMiddle,
  PageContentRight,
  PageEdit,
  PageRewardSetting,
  PageSetupSetting
}
export default Edit
</script>
<style lang="scss" scoped>
@import '@components/NewUi/styles/reset.css';
// .scroll-view {
//   display: none;
// }
.custom-content {
  display: flex;
  background: #fff;
  border-radius: 4px;
  .PageContentLeft {
    width: 16%;
  }
  .PageContentMiddle {
    flex: 1;
  }
  .PageContentRightwarpper {
    width: 40%;
  }
}
.edit-content {
  max-height: calc(100vh - 183px);
}
@media screen and (max-width: 1625px) {
  .edit-content {
    max-height: calc(100vh - 163px);
  }
}
.tipsShowTitle {
  padding-top: 5px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}
.tipsShowContent {
  padding: 16px 5px;
  color: #595959;
  font-size: 14px;
}
.ns-warm-cricle {
  display: inline-block;
  text-align: center;
  line-height: 14px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ffaa00;
  color: #fff;
  margin-right: 10px;
}
</style>
