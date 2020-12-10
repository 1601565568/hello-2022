<template>
  <div class="PageContentRight">
    <el-collapse class="common-collapse" v-model="activeNames">
      <template v-for="(item, index) in pageModuleType">
        <el-collapse-item :key="index">
          <template slot="title">
            <div class="common-title" @click="onShowEdit()">
              <span>{{item.settingName}}{{item.status}}</span>
              <div class="switch" @click="onclick">
                <el-switch v-model="item.status" active-color="#0091FA"> </el-switch>
              </div>
            </div>
          </template>
          <div @click="onShowEdit()" class="editWarpper">
            <component :is="formatSettingType(item.settingType)" :childrenEditData="item.itemList" @change="(data)=>{onChangeItem(data,index)}"></component>
            <!-- <CheckBox /> -->
            <!-- <Upload /> -->
          </div>
        </el-collapse-item>
      </template>
    </el-collapse>
  </div>
</template>
<script>
import PageContentRight from './src/PageContentRight.js'
import CheckBox from './PageContentRightComponents/checkBox'
import Upload from './PageContentRightComponents/Upload'
PageContentRight.components = {
  CheckBox,
  Upload
}
export default PageContentRight
</script>

<style scoped lang="scss">
@import './style/PageContentRight.css';
.common-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;
}
.editWarpper {
  padding: 16px 32px;
}
</style>
