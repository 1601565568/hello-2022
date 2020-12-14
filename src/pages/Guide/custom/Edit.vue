<template>
  <PageEdit
    ><div slot="header">
      <div class="common-header flex-box">
        <h3>编辑</h3>
        <div class="common-btn">
          <ns-button class="customer-btn_cancel" @click="onCancel"
            >取消</ns-button
          >
          <ns-button
            class="customer-btn_save"
            type="primary"
            size="large"
            @click="onSave"
            >保存</ns-button
          >
        </div>
      </div>
    </div>
    <div slot="content">
      <el-row class="custom-content">
        <el-col :span="4"
          ><ScrollView className="edit-content"
            ><PageContentLeft
              :defaultActive="menuObj.active"
              @onChange="onChangeMenu"
              :menuArr="menuArr"/></ScrollView
        ></el-col>
        <el-col :span="11"
          ><ScrollView className="edit-content"
            ><PageContentMiddle
              :menuListTitle="menuObj.menuListTitle"
              :menuType="menuObj.menuId"
              :editData="pageModuleType"
              ref="PageContentMiddle"/></ScrollView
        ></el-col>
        <el-col :span="9"
          ><ScrollView className="edit-content">
            <PageContentRight
              :editData="pageModuleType"
              @change="onSetChange"
            />
          </ScrollView>
        </el-col>
      </el-row>
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
import addMenu from './components/pageComponents/addMenu'
Edit.components = {
  ScrollView,
  PageContentLeft,
  PageContentMiddle,
  PageContentRight,
  PageEdit,
  addMenu
}
export default Edit
</script>
<style lang="scss" scoped>
@import '@components/NewUi/styles/reset.css';
.custom-content {
  background: #fff;
  border-radius: 4px;
}
.edit-content {
  max-height: calc(100vh - 172px);
}
@media screen and (max-width: 1625px) {
  .edit-content {
    max-height: calc(100vh - 152px);
  }
}
</style>
