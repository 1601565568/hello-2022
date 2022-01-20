<template>
  <div>
    <div class="btn-import" :type="type" @click="onDialogOpen()"><Icon v-if="type === 'text'" type="plus"/>{{btnTitle}}</div>
    <el-dialog :title="dialogTitle" :visible.sync="ImportVisible" :show-scroll-x="false" :append-to-body="true"
               :close-on-click-modal = "false" :before-close="onDialogClose" width="1033px">
      <div slot="title">
        {{dialogTitle}}
      </div>
      <div v-loading="loading"
           element-loading-text="数据导入中，请稍等…">
        <el-tabs>
          <el-tab-pane label="手动输入">
            <el-form class="form">
              <el-form-item label="导入员工方式：">
                <el-select v-model="model.manualInput.type"  placeholder="请选择" clearable>
                  <el-option  v-for="item in statusOptions"
                              :key="item.value"
                              :label="item.name"
                              :value="item.type" >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <textarea
                  style="width: 900px;height: 100px;border: 1px solid #DCDFE6;"
                  ref="quickText"
                  v-model="model.manualInput.searchValue"
                  :placeholder="placeholder"
                  clearable
                ></textarea>
              </el-form-item>
              <div class="tmp-tips text-info">
                <Icon type="info-circle"  />
                输入多个员工信息时用英文逗号隔开，只支持当前账号数据权限下的员工
              </div>
              <div class="tmp-tips text-info">
                <Icon type="info-circle"  />
                员工姓名、手机号非唯一值，如当前账号数据权限下匹配到对应多个导购，将全部展示，请于搜索结果中编辑修改
              </div>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="文件导入">
            <el-form class="form">
              <el-form-item label="上传文档：">
                <el-form-grid>
                  <ElUpload
                    ref= "uploadRef"
                    action="#"
                    accept=".xls,.xlsx"
                    :before-upload="beforeUpload"
                    :http-request="UploadImage"
                    :on-exceed="handleExceed"
                    :on-change="handleChange"
                    :on-remove="handleRemove"
                    :limit="1"
                    :file-list="fileList2"
                    :show-file-list="true"
                    :multiple = "false">
                    <NsButton size="small" type="primary">选择文件</NsButton>
                  </ElUpload>
                </el-form-grid>
              </el-form-item>
              <div class="tmp-tips text-info">
                <Icon type="info-circle"  />
                您可使用系统提供的模板填写信息并导入，只支持当前账号数据权限下的员工
                <NsButton style="margin-left: 10px;" size="small"> <a :href=this.download download="">下载模板</a> </NsButton>
              </div>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onDialogClose()">{{$t('operating.cancel')}}</ns-button>
        <ns-button type="primary" @click="save()">保存</ns-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import index from './src/index'
export default index
</script>
<style scoped>
  @import "@theme/variables.pcss";
  .form{
    margin-top: 10px;
  }
  @component-namespace btn {
    @b import {
      width: 50px;
      height: 100%;
      text-align: center;
      color: #0091FA;
      cursor: pointer;
    }
  }
  /*@component-namespace form {*/
  /*  margin-top: 30px;*/
  /*  background-color: red;*/
  /*}*/
</style>
