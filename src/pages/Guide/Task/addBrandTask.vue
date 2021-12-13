<template>
  <div>
    <!-- 页面顶部内容 - 标题、保存按钮、面包屑 -->
    <div class='newTask-head'>
      <ElBreadcrumb separator='/'>
        <ElBreadcrumbItem>业绩指标</ElBreadcrumbItem>
        <ElBreadcrumbItem>任务管理</ElBreadcrumbItem>
        <ElBreadcrumbItem>{{ titleText }}</ElBreadcrumbItem>
      </ElBreadcrumb>
      <div class='clearfix newTask-head__title'>
        <span class='newTask-head__title-content'> {{ titleText }} </span>
        <div class='float-right'>
          <NsButton @click='handleClose'>取消</NsButton>
          <NsButton type='primary' :loading="loading" @click="saveFun(model.subgroupId)">保存</NsButton>
          <el-dialog
            title="温馨提醒"
            :visible.sync="saveTipsFlag"
             width="480px"
            height="196px"
            custom-class='budgetTime'
            @before-close="() => closeSaveTips(false)">
            <div  style="display:flex;max-width:424px"><i class="el-icon-warning" style="color: #FFAA00;margin:5px 9px 0 7px"></i>
              <div v-if="!model.cost">
                保存后系统将自动获取会员分组名单，您可在编辑任务页面查看进度，保障任务正常进行。是否继续保存？
              </div>
              <div v-else-if="model.cost!='-1秒'">
                预估{{model.cost}}成功获取会员分组名单，请核对任务开始时间，保障任务正常进行。是否继续保存？
              </div>
              <div v-else>
                预算获取会员分组名单失败，请核对任务开始时间，保障任务正常进行。是否继续保存？
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <NsButton @click="() => closeSaveTips(false)" >取消</NsButton>
              <NsButton type="primary" @click="closeSaveTips(true)" >保存</NsButton>
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
    <!--  表单内容  -->
    <div class='newTask-content'>
      <ElScrollbar ref='fullScreen'>
        <ElForm ref="form" label-width='136px' :rules='rules' :model='model' :disabled='allNotEdit'>
          <ElCollapse v-model='activeNames'>
            <ElCollapseItem title='基础信息' name='1'>
              <ElFormItem label='任务名称' prop='name'>
                <div class='newTask-content__item'>
                  <ElInput
                    v-model='model.name'
                    show-word-limit
                    maxlength='25'
                    :disabled='canNotEdit'
                    placeholder='请输入任务名称'
                  />
                </div>
              </ElFormItem>
              <ElFormItem label='执行时间' required prop='activityTime'>
                <div class='newTask-content__item'>
                  <ElDatePicker
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    v-model='model.activityTime'
                    type='datetimerange'
                    range-separator='至'
                    start-placeholder='开始日期'
                    @change='timeFun'
                    :picker-options='pickerOptions0'
                    end-placeholder='结束日期'
                    :default-time="['00:00:00', '23:59:59']"
                  />
                </div>
              </ElFormItem>
              <ElFormItem label='提醒时间' prop='taskSendTime' required>
                <div class='newTask-content__item'>
                <el-time-picker
                  value-format='HH:mm:ss'
                  v-model="model.taskSendTime"
                  placeholder="选择提醒时间">
                </el-time-picker>
                </div>
                <div class='newTask-content__item-tip'
                  >店长将在提醒时间收到任务通知</div>
              </ElFormItem>
              <ElFormItem label='执行次数' prop='runType' required>
                <ElRadioGroup v-model='model.runType'
                  :disabled='canNotEdit'>
                  <ElRadio :label='0'>单次执行</ElRadio>
                  <ElRadio :label='1'>每日执行</ElRadio>
                </ElRadioGroup>
                <span class='newTask-content__item-tip'
                  >设为每日执行时，执行时间内每天都会重新通知店长、已分配任务的导购，同时重新计算统计执行情况</span
                >
              </ElFormItem>
            </ElCollapseItem>
            <ElCollapseItem title='任务内容' name='2'>
              <ElFormItem label='任务类型'>
                <ElRadioGroup v-model='model.type'
                  :disabled='canNotEdit'>
                  <ElRadio :label='0'>营销任务</ElRadio>
                  <ElRadio :label='1'>回访任务</ElRadio>
                  <ElRadio :label='3'>日常任务</ElRadio>
                  <ElRadio :label='2'>分享任务</ElRadio>
                </ElRadioGroup>
              </ElFormItem>
              <ElFormItem label='执行门店'>
                <ElRadioGroup v-model='model.shopRangeType'>
                  <ElRadio :label='0'>全部门店</ElRadio>
                  <ElRadio :label='1'>指定门店</ElRadio>
                </ElRadioGroup>
                <span v-if='model.shopRangeType === 1'><shopSelect :isInlineBlock='true' icon='el-icon-circle-plus-outline' @callBack="selectShopBack" :hasShopArr="hasShopArr">选择门店</shopSelect></span>
              </ElFormItem>
              <ElFormItem label='会员分组' class='special-layout'>
                <div class='newTask-content__item'>
                  <el-select
                    filterable
                    v-if="viewRange === 2"
                    :clearable='true'
                    v-model='model.areaId'
                    placeholder='请选择区域'
                    @change='chooseArea'
                    :disabled='canNotEdit'
                  >
                    <el-option
                      v-for='item in areaOptions'
                      :key='item.areaId'
                      :label='item.areaName'
                      :value='item.areaId'
                    >
                    </el-option>
                  </el-select>
                  <el-select
                    v-if="(viewRange === 2 && model.areaId) || viewRange === 1"
                    filterable
                    :clearable='false'
                    v-model='model.viewId'
                    placeholder='请选择视角'
                    @change='chooseView'
                    :disabled='canNotEdit'
                  >
                    <el-option
                      v-for='item in viewOptions'
                      :key='item.viewId'
                      :label='item.viewName'
                      :value='item.viewId'
                    >
                    </el-option>
                  </el-select>
                  <el-select
                    v-if="model.viewId"
                    filterable
                    :value='model.subgroupId'
                    placeholder='请选择会员分组'
                    @change='chooseSubgroup'
                    :disabled='canNotEdit'
                    style="margin-bottom:0px!important;"
                  >
                    <el-option
                      v-for='item in subgroups'
                      :key='item.id'
                      :label='item.name'
                      :value='item.id'
                    >
                    </el-option>
                  </el-select>
                  <el-dialog
                    title="预算完成获取客户名单时间吗？"
                    :visible.sync="dialogVisible"
                    height="196px"
                     width="480px"
                    custom-class='budgetTime'
                    :before-close="closeTips">
                    <div style="display:flex;max-width:424px;align-items:baseline"><i class="el-icon-warning" style="color: #FFAA00; margin:0 9px 7px"></i><div>成功获取会员分组名单后才可正常下发任务</div></div>
                    <span slot="footer" class="dialog-footer">
                      <NsButton @click="closeTips" >无需预算</NsButton>
                      <NsButton type="primary" @click="goBudget(model.subgroupId)" style="margin: 0 6px 0 16px" >立即预算</NsButton>
                    </span>
                  </el-dialog>
                   <div v-if="model.viewId&&model.subgroupId" class="succFont">
                    <div class="flex__box">
                      <div class="newTask-content__item-tip">成功获取会员分组名单后才可正常下发任务，获取失败时将通过企业微信通知创建人</div>
                      <div @click="showSubgroupMsg(model.subgroupId)" class="tips" v-if="!model.cost && !model.isClickBudget" >
                        <span>点击预算获取时长</span>
                      </div>
                      <!-- <div class="tips"  v-else-if="model.isClickBudget && !model.cost">预算中，可正常保存 <el-image -->
                      <!-- <div class="tips"  > -->
                         <!-- <el-image
                        style="width: 10px; height: 10px; margin-left:5px "
                        :src="imgUrl"
                        fit="cover" /> -->
                        <div  v-else-if="model.isClickBudget && !model.cost"><NsButton :loading='true' type='text'>预算中，可正常保存</NsButton></div>

                        <!-- </div> -->
                      <div class="tips" v-else-if="model.isClickBudget && model.cost !== '-1秒'">预估{{model.cost}}完成获取名单</div>
                      <div class="tips" v-else-if="model.isClickBudget && model.cost=='-1秒'">预算获取会员分组名单失败</div>
                    </div>
                    <div class="disc">
                      单次执行的任务，将于任务开始时间的凌晨获取客户名单（当日开始，则保存任务后获取客户名单）；<br />
                      每日执行的任务，将于每日凌晨获取客户名单（当日开始，则保存任务后获取当日客户名单）；
                    </div>
                  </div>
                </div>
                <span class='newTask-content__item-tip'>
                  选择区域后，可选择零售CRM客户洞察的客户分组
                </span>
              </ElFormItem>
              <ElFormItem label='任务简述' prop="remark" required>
                <div class='newTask-content__item'>
                  <ElInput
                    type='textarea'
                    :rows='5'
                    placeholder='请输入任务简述'
                    show-word-limit
                    maxlength='1000'
                    v-model="model.remark"
                  />
                </div>
              </ElFormItem>
              <template v-if="model.type === 2">
                <ElFormItem label='素材' required>
                  <div>
                    <NsButton icon='el-icon-circle-plus-outline'
                      :disabled='canNotEdit' @click='selectMaterialShowFun()'
                      >选择素材</NsButton
                    >
                  </div>
                  <div style="position: relative" class="modal">
                    <!--替换/删除遮罩层开始-->
                    <div class="material-model">
                      <div @click='selectMaterialShowFun()' :style="canNotEdit ? 'cursor:not-allowed' : ''">
                        <Icon type='ns-deal' color="#ffffff" font-size="14px" />
                        <span class="material-model-title">替换</span>
                      </div>
                      <div @click='deleteMaterialShowFun()' :style="canNotEdit ? 'cursor:not-allowed' : ''">
                        <Icon type='ns-delete' color="#ffffff" font-size="14px"/>
                        <span class="material-model-title">删除</span>
                      </div>
                    </div>
                    <!--替换/删除遮罩层结束-->
                    <div class='newTask-content__item catalogue-materials model-item' v-if="model.materialTitle">
                      <addMaterial
                       :data='selectMaterial'></addMaterial>
                      <!-- <p class='catalogue-materials__content'> -->
                        <!-- {{model.materialTitle}}
                      </p> -->
                      <!-- <div class='catalogue-materials__item--media'> -->
                        <!-- 视频、图片预览请使用SG项目中组件：NsPreview，可参照实例：https://test-sg.ecrpcloud.com/Guide/Material/Library -->
                        <!-- 展示图片结构 -->
                        <!-- <div class='catalogue-materials__image' v-if="model.materialType === 1">
                          <div v-for="(item, index) in model.materialMsg.imageList" :key="index">
                            <img :src='item.url' />
                          </div>
                        </div>
                        <div class='catalogue-materials__video' v-if="model.materialType === 2">
                          <video
                            :src='model.materialMsg.imageList[0].url'
                            style='width: 107px; height: 60px'
                          >
                            您的浏览器暂不支持播放该视频，请升级至最新版浏览器。
                          </video>
                          <div class='catalogue-materials__video--mask'>
                            <div class='catalogue-materials__video--wrapper'>
                              <Icon type='begin' />
                            </div>
                          </div>
                        </div>
                        <div class="catalogue-materials__article" v-if="model.materialType === 0">
                          <img :src="model.materialMsg.imageList[0].url">
                          <p>{{model.materialMsg.name}}</p>
                        </div> -->
                      <!-- </div> -->
                    </div>
                  </div>
                  <div class="v_btn" v-if="selectMaterial.mediaList && selectMaterial.mediaList.length > 0">共{{selectMaterial.mediaList && selectMaterial.mediaList.length || 0}}条信息
                    <el-tooltip v-if="subNumber(0, selectMaterial.mediaList)" content="图片" placement="top" effect="light">
                      <Icon class="icons" type="images" />
                    </el-tooltip>
                    <el-tooltip v-if="subNumber(2, selectMaterial.mediaList)" content="视频" placement="top" effect="light">
                      <Icon class="icons" type="videos" />
                    </el-tooltip>
                    <el-tooltip v-if="subNumber(3, selectMaterial.mediaList)" content="链接" placement="top" effect="light">
                      <Icon class="icons" type="links" />
                    </el-tooltip>
                    <el-tooltip v-if="subNumber(4, selectMaterial.mediaList)" content="小程序" placement="top" effect="light">
                      <Icon class="icons" type="apps" />
                    </el-tooltip>
                    <span @click="dialogClick(selectMaterial)">查看全部</span>
                  </div>
                </ElFormItem>
              </template>
            </ElCollapseItem>
          </ElCollapse>
        </ElForm>
      </ElScrollbar>
    </div>
    <!-- <ElDialog title="会员分组客户列表" :visible.sync="dialogVisible" width="960px"> -->
      <!-- <div class='table-top_tip'>任务下发前会实时获取最新的客户名单，任务下发后客户名单将不再变化</div> -->
      <!-- <lookCardList v-if="dialogVisible" :subgroupId="model.subgroupId"></lookCardList> -->
      <!-- <div class="taskList-table__content">
        <el-table ref="table" :data="tableData"
                  style="width: 100%;"
                  :element-loading-text="$t('prompt.loading')">
          <el-table-column prop="name"
                           label="姓名" />
          <el-table-column label="手机" align="center" width="120" prop="phone" />
          <el-table-column prop="store"
                           label="门店名称" />
          <el-table-column prop="guide"
                           label="专属导购" />
          <el-table-column align="center" prop="level"
                           label="等级" />
          <el-table-column align="center" prop="date" width="160"
                           label="入会时间" />
          <el-table-column prop="address"
                           label="地区" />
        </el-table>
      </div>

      <el-pagination class="taskList-table__footer"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[15, 25, 50, 100]"
                     :page-size="100"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="400">
      </el-pagination> -->
    <!-- </ElDialog> -->
    <el-dialog
      width="600px"
      title="查看全部"
      :visible.sync="dialogFlag">
        <materialDialog
          :listMap='listMap'
          @preview="togglePreview"
        ></materialDialog>
    </el-dialog>
    <selectMaterialListModal :callBack="selectMaterialBack" ref="selectDialogDom"></selectMaterialListModal>
  </div>
</template>
<script>
import addBrandTask from './src/addBrandTask.js'
export default addBrandTask
</script>
<style lang="scss" scoped>
.v_btn{
  height: 20px;
  font-size: 12px;
  color: #383838;
  line-height: 20px;
  margin-top: 8px;
  .icons{
    margin-left: 4px;
    }
  svg{
    vertical-align: -2px;
  }
  span{
    margin-left: 5px;
    color: #0094FC;
    cursor: pointer;
  }
}
</style>
<style scoped>
@import '@theme/variables.pcss';
.newTask-head {
  padding: 16px 16px 12px;
  background: var(--theme-color-white);
  margin: -10px -10px 0;

  .newTask-head__title {
    margin-top: 12px;
    .newTask-head__title-content {
      line-height: 32px;
      color: #262626;
      font-size: var(--default-font-size-middle);
    }
    .float-right {
      padding-top: 2px;
      .el-button + .el-button {
        margin-left: 16px;
      }
    }
  }
}
.newTask-content {
  background: var(--theme-color-white);
  margin-top: var(--default-margin-larger);
}

>>> .budgetTime .el-dialog__body{
    font-size: 14px;
    color: #595959;
    line-height: 22px;
    }
   >>> .budgetTime .el-scrollbar__wrap{
     margin-top: 22px;
     font-size: 14px;
    color: #595959;
    line-height: 22px;
   }
>>> .budgetTime .el-dialog__header .el-dialog__title{
  height: 30px;
  line-height: 30px;
}
>>> .budgetTime .el-dialog__footer{
      position: absolute;
    right: 0;
    bottom: 0;
    padding-bottom: 16px!important;
}
>>> .newTask-head {
  .el-breadcrumb {
    line-height: 22px;
  }
  .el-breadcrumb__item:not(:last-child) {
    .el-breadcrumb__inner,
    .el-breadcrumb__separator {
      color: var(--theme-font-color-secondary);
    }
  }
  .el-breadcrumb__separator {
    margin: 0 var(--default-margin-larger) 0 var(--default-margin-small);
  }
}
>>> .newTask-content {
  .el-collapse-item:last-child {
    margin-bottom: 0;
  }
  .el-collapse-item__header {
    position: relative;
    font-size: var(--default-font-size-middle);
    height: 56px;
    line-height: 56px;
    color: #262626;
    background: var(--theme-color-white);
    margin-bottom: 0;
    padding-left: 40px;
    .el-collapse-item__arrow {
      position: absolute;
      left: 16px;
    }
  }
  .el-collapse-item__wrap {
    padding: 16px 0;
  }
  .el-form-item .el-form-item__label {
    padding-right: 36px;
    color: #595959;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 24px;
  }
  .el-form-item--small.el-form-item:last-child {
    margin-bottom: 0;
  }
  .el-radio-group > .el-radio {
    margin-right: 16px;
  }
  .material-model{
    opacity: 0;
    position: absolute;
    background: rgba(0,0,0,0.45);
    border-radius: 2px;
    width: 626px;
    height: 92%;
    display: flex;
    align-items: center;
    margin-top: 10px;
    justify-content: center;
    &:hover {
       opacity: 1;
     }
    div:first-child {
      margin-right:33.8px;
      cursor: pointer;
    }
    div:nth-child(2) {
      cursor: pointer;
    }
    .material-model-title{
      font-size: 14px;
      color: #ffffff;
      margin-left: 9px;
    }
  }
  .newTask-content__item {
    display: inline-block;
    width: 626px;
    margin-right: 16px;
    > * {
      width: 100%;
    }
    > *:not(:last-child) {
      margin-bottom: 16px;
    }
    .el-date-editor .el-range-input {
      width: auto;
    }
  }
  .newTask-content__item-tip {
    position: relative;
    padding-left: 16px;
    height: var(--default-form-item-small-height);
    color: #595959;
  }
  .newTask-content__item-tip:before {
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -5px;
    content: ' ';
    width: 8px;
    height: 8px;
    border-radius: 100%;
    background: #f2aa18;
  }
  .chose-data-tip {
    margin-left: 16px;
  }
  .special-layout .el-form-item__content {
    display: flex;
  }
}

@component-namespace catalogue {
  @b materials {
    padding: 16px;
    margin-top: 8px;
    background: #f5f5f5;
    border-radius: 2px;
    @e image {
      margin-right: -6px;
      margin-bottom: -5px;
      vertical-align: middle;
      display: flex;
      flex-wrap: wrap;
      img {
        margin: 0 5px 5px 0;
        width: 78px;
        height: 78px;
        border-radius: 3px;
        cursor: pointer;
        object-fit: cover;
      }
    }
    @e article {
      background: #ccc;
      display: flex;
      align-items: center;
      padding: 5px;
      img {
        width: 78px;
        height: 78px;
        border-radius: 3px;
        cursor: pointer;
        object-fit: cover;
        margin-right: 5px
      }
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    @e content {
      margin-bottom: 8px !important;
      line-height: 22px;
      color: #595959;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    @e video {
      display: inline-block;
      position: relative;
      font-size: 0;
      line-height: 1;
      vertical-align: middle;
      video {
        width: 100%;
        height: 142px;
        border-radius: 3px;
        object-fit: cover;
      }

      @m mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.25);
        cursor: pointer;
        border-radius: 3px;
      }
      @m wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
          /* margin-left: -20px; */
          /* margin-top: -20px; */
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background-color: hsla(0,0%,100%,.4);
          display: flex;
          align-items: center;
          justify-content: center;
        > svg {
          margin: -1px 0 0 4px;
          font-size: 15px;
          color: #fff;
        }
      }
    }
  }
}
.table-top_tip {
  background: #F2F9FE;
  height: 40px;
  padding: 0 16px;
  line-height: 40px;
  font-size: 12px;
  margin-bottom: 16px;
}
.succFont{
  font-size: 12px;
  margin-top: 2px;
}
.flex__box{
  display: flex;
  height: 20px;
  line-height: 20px;
  align-items: center;
  color: #595959;;
  .tips{
    color: #0094FC ;
    padding:none;
    cursor: pointer;
  }
  .newTask-content__item-tip{
    height: 20px;
  }
}
.disc{
  padding-left: 16px;
   height: 40px;
  line-height: 20px;
}
.el-icon-warning:before{
  font-size: 14px;

  /* line-height: 22px; */
}

</style>
