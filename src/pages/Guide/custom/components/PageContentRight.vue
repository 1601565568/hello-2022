<template>
  <div class="PageContentRight">
    <el-collapse class="common-collapse" v-model="activeNames">
      <el-collapse-item>
        <template slot="title">
          <div class="common-title" @click="onShowEdit()">
            <span>头部资料</span>
            <div class="switch" @click="onclick">
              <el-switch v-model="value1" active-color="#0091FA"> </el-switch>
            </div>
          </div>
        </template>
        <div @click="onShowEdit()" class="editWarpper">
          <!-- <CheckBox /> -->
          <Upload />
        </div>
      </el-collapse-item>
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
