<template>
  <div>
    <div class="replace-rule" v-if='configObj.id'>
      仅员工参与裂变大师活动时，才可发送对应的裂变大师欢迎语；否则，将发送失败。
    </div>
    <div class="flex">
      <el-form :inline="true" class='form-inline_top poster-form'>
        <el-form-item label="">
          <el-input v-model="model.loginAccount" placeholder="请输入创建人"  @keyup.enter.native="handleSearch('loginAccount')">
            <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch('loginAccount')"></Icon>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="model.title" placeholder="请输入活动名称"  @keyup.enter.native="handleSearch('title')">
            <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch('title')"></Icon>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-scrollbar>
        <el-table
          ref="table"
          :data="_data._table.data"
          class="new-table_border"
          max-height='450px'
          :element-loading-text="$t('prompt.loading')"
          v-loading.lock="_data._table.loadingtable">
          <el-table-column width="50" label='单选'>
            <template slot-scope="scope">
              <div class="customerManage">
                <el-radio :label="scope.row.guestCodeId" v-model="configId" @input='handleChange'>
                  <span></span>
                </el-radio>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="活动名称">
            <template slot-scope="scope">
              <div class="scope-title">
                <!-- <img :src='scope.row.activityPlacard' class="scope-title_img"> -->
                <div class="scope-title_text">
                  {{scope.row.name}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="活动海报">
            <template slot-scope="scope">
              <div class="scope-title">
                <img :src='scope.row.activityPlacard' class="scope-title_img">
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="guideNames"
            label="参与活动人员">
            <template slot-scope="scope">
              <div class="scope-name">
                <div :class="'scope-name_text'+ (scope.row.guideCount>10?' more':'')" >
                  {{scope.row.guideNames}}
                </div>
                <el-popover
                  placement="top-start"
                  class="item"
                  :title="`参与活动人员（${scope.row.guideNames.split(',').length}）`"
                  width="200"
                  trigger="hover"
                  :content="scope.row.guideCount>10?(scope.row.guideNames+'...'):scope.row.guideNames">
                  <span :class="[scopeName==='QA'?nameTextQA:nameText]" slot="reference">共{{scope.row.guideNames.split(',').length}}个</span>
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="有效时间">
            <template slot-scope="scope">
              <template v-if="scope.row.validTimeType === 0">
                <span>永久有效</span>
              </template>
              <template v-else>
                <span>{{scope.row.validTimeStart}}</span>
                至
                <span>{{scope.row.validTimeEnd}}</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            width='90px'
            align='center'
            label="状态">
            <template slot-scope="scope">
              <el-tag :type="statusList[scope.row.activityStatus].color" class='scope-name_tag'>{{statusList[scope.row.activityStatus].value}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="loginAccount"
            width='100px'
            label="创建人">
          </el-table-column>
          <el-table-column
            prop="createTime"
            width='150px'
            label="创建时间">
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
    <el-pagination v-if="_data._pagination.enable" class="template-table-pagination"
                  :page-sizes="_data._pagination.sizeOpts"
                  :total="_data._pagination.total"
                  :current-page.sync="_data._pagination.page"
                  :page-size="_data._pagination.size"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="$sizeChange$"
                  @current-change="$pageChange$">
    </el-pagination>
  </div>
</template>
<script>
import index from './src/index'
export default index
</script>
<style scoped lang='scss'>
  @import "@components/NewUi/styles/reset.css";
  .poster-form .el-form-item--small.el-form-item:last-child {
    margin-bottom: 8px;
  }
  .checkNumberTitle {
    height: 30px;
    display: flex;
    align-items: center;
    .dialogtitle {
      font-size: 16px;
      color: #303133;
      display: inline-block;
      margin-right: 16px;
      font-weight: bold;
    }
    .number {
      font-size: 14px;
      color: #595959;
    }
  }
  .replace-rule {
    padding: 0 16px;
    margin-bottom: 16px;
    background: #F2F9FE;
    border-radius: 2px;
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #262626;
    .login-account {
      color: #606266;
      margin-left: 10px;
    }
    .rule-right {
      cursor: pointer;
      color: #0091FA;
      display: flex;
      align-items: center;
      .message-upload__tip {
        font-size: 20px;
        margin-right: 10px;
      }
    }
  }
  .search-icon {
    font-size: 22px;
    margin-top: 2px;
  }
  .flex {
    display: flex;
    justify-content: space-between;
    padding-right: 15px;
  }
  // .customerManage {
  //   color:transparent
  // }
  /* 去掉更换导购列表弹框单选组多余数字 */
  .customerManage >>> .el-radio__label {
    display: none!important;
  }
  .box-padding {
    color:#0091FA;
    padding: 0 20px;
    font-size: 16px;
    cursor: pointer;
  }
  .flex-box {
    display: flex;
    align-items: center;
    .copy {
      margin-left: 17px;
      font-size: 14px;
    }
    &.bottom {
      align-items: flex-end;
      justify-content: flex-start;
    }
    .copy-img {
      width: 122px;
      height: 216px;
    }
  }
  .question-circle {
    margin-left: 5px;
  }
  .scope-name_tip {
    cursor: pointer;
    color: #0091FA
  }
  .scope-title {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .scope-title_img {
    height: 86px;
    width: 48px;
    margin-right: 8px;
  }
  .search-icon {
    font-size: 22px;
    margin-top: 2px;
  }
  .scope-name_text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    &.more:after {
      content:'...'
    }
  }
    .scope-name_textQA {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    color: #2153D4;
    &.more:after {
      content:'...'
    }
  }
  .scope-name_tag.el-tag {
    border-radius: 2px;
    &.el-tag--success {
      background: #F7FFF0;
      border: 1px solid #53BF1D;
      color: #262626;
    }
    &.el-tag--info {
      background: #F5F5F5;
      border: 1px solid #D9D9D9;
      color: #262626;
    }
    &.el-tag--warning {
      background: #FFFBE6;
      border: 1px solid #FFAE0D;
      color: #262626;
    }
  }
  .self-btn {
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: #606266;
    .guideIds-icon {
      color:#C0C4CC;
    }
  }
</style>
