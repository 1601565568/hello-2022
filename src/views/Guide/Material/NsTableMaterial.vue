<template>
  <div class="template-layout">
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons"></ns-table-operate-button>
    </template>
    <!-- 表格区域 -->
    <div class="template-layout-right">
      <el-row>
        <el-col :span="24">
          <div class="template-table-bar">
            <el-row type="flex">
              <el-col :span="buttonRatio">
                <ns-button type='primary' class="pull-left" icon='plus' @click='onAddImage(null)'>新增图文</ns-button>
                <ns-button type='primary' class="pull-left" icon='plus' @click='onAddLink(null)'>新增链接</ns-button>
                <ns-button type='primary' class="pull-left" icon='plus' @click='onUpdateGroup(null)'>设置分组</ns-button>
              </el-col>
              <el-col :span="inputRatio">
                <el-form :model="quickSearchModel" :inline="true" class="pull-right">
                  <el-form-item v-show="_data._queryConfig.expand === false">
                    <el-input ref="quickText" v-model="quickSearchModel.titleName" placeholder="请输入素材标题">
                      <Icon type="search" className="el-input__icon" style="padding: 5px;" slot="suffix"
                            @click="$quickSearchAction$('titleName')"/>
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <ns-button type="text" @click="$handleTabClick">
                      {{collapseText}}
                      <Icon :type="_data._queryConfig.expand ? 'up' : 'down'"/>
                    </ns-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>

          <!-- 搜索 -->
          <div class="template-table-search" v-show="_data._queryConfig.expand">
            <div class="template-table-filter"
                 v-show="_data._queryConfig.expand === true && _data._queryConfig.showCondition === false">
              <el-row>
                <el-col :span="20" class="template-table-plat">
                  <el-form ref="table_filter_form" :model="model" :rules="rules" :inline="true">
                    <el-form-item label="素材标题：">
                      <el-form-grid size="xmd">
                        <el-form-item prop="titleName" >
                          <el-input type="text" v-model="model.titleName">
                          </el-input>
                        </el-form-item>
                      </el-form-grid>
                    </el-form-item>
                    <el-form-item label="分享文案：">
                      <el-form-grid size="xmd">
                        <el-form-item prop="contentName">
                          <el-input type="text" v-model="model.contentName">
                          </el-input>
                        </el-form-item>
                      </el-form-grid>
                    </el-form-item>
                    <el-form-item label="素材链接：">
                      <el-form-grid size="xmd">
                        <el-form-item prop="urlName">
                          <el-input type="text" v-model="model.urlName">
                          </el-input>
                        </el-form-item>
                      </el-form-grid>
                    </el-form-item>
                    <el-form-item>
                      <el-form-grid>
                        <el-select placeholder="请选择" v-model="model.type"  clearable filterable>
                          <el-option label="品牌" :value="0"></el-option>
                          <el-option label="门店" :value="1"></el-option>
                        </el-select>
                      </el-form-grid>
                    </el-form-item>
                    <el-form-item>
                      <el-form-grid>
                        <el-select placeholder="请选择" v-model="model.sub" clearable filterable>
                          <el-option v-for="s in queryTable" :label="s.name" :value="s.id"
                                     :key="s.id"></el-option>
                        </el-select>
                      </el-form-grid>
                    </el-form-item>
                    <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
                    <ns-button @click="$resetInputAction$()">重置</ns-button>
                  </el-form>
                  <div class="template-table-control">
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <!-- 表格布局-->
          <el-table ref="table" :data="_data._table.data" class="template-table__main"
                    stripe
                    resizable v-loading.lock="_data._table.loadingtable" @selection-change="selsChange"
                    :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
            <el-table-column type="selection" align="center" :width="50"></el-table-column>
            <el-table-column prop="title" label="素材标题" align="left" width="200">
              <template slot-scope="scope">
                {{scope.row.title}}
              </template>
            </el-table-column>
            <el-table-column prop="title" label="素材内容" align="left">
              <template slot-scope="scope">
                分享文案：{{scope.row.content}}<br/>
                <template v-if="scope.row.imageUrl">
                  <span v-for="image in scope.row.imageUrl.split(',')" :key='image'><img :src="image" width="50" height="50" style="margin-right: 10px"/></span>
                </template><br/>
                分享链接：{{scope.row.url}}
              </template>
            </el-table-column>

            <el-table-column prop="type" label="发布方" align="center" width="200">
              <template slot-scope="scope">{{scope.row.type == 0 ? "品牌" : "门店"}}</template>
            </el-table-column>
            <el-table-column prop="subName" label="分组" width="200" align="center"></el-table-column>
            <el-table-column prop="update_time" label="更新时间 " width="200" align="center"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="100">
              <template slot-scope="scope">
                <div class="tmp-cell__buttons" v-if="scope.row.state">
                  <ns-button type="text"  @click="edit(scope.row)">编辑</ns-button>
                  <ns-button type="text"  @click="deleteMaterialById(scope.row.id, scope.row.title)">删除</ns-button>
                </div>
              </template>
            </el-table-column>

          </el-table>
          <!-- 分页 -->
          <template slot="pagination">
            <el-pagination v-if="_data._pagination.enable" class="template-table-pagination"
                           :page-sizes="_data._pagination.sizeOpts"
                           :total="_data._pagination.total"
                           :current-page.sync="_data._pagination.page"
                           :page-size="_data._pagination.size"
                           layout="total, sizes, prev, pager, next, jumper"
                           @size-change="$sizeChange$"
                           @current-change="$pageChange$">
            </el-pagination>
          </template>
          <!-- 分页-结束 -->
        </el-col>
      </el-row>
      <!-- 添加图文 -->
      <el-dialog size="small"
                 :visible.sync="dialogFormVisible_image"
                 :modal-append-to-body="false"
                 :title="title"
                 @before-close="closeDialog()">

        <el-form :model="model.sgMaterial" ref="form" label-width="100px" :rules="rules" placement="right">
          <el-form-item label="素材标题：" required>
            <el-form-grid size="xmd" >
              <el-form-item prop = "title">
                <el-input type="text" placeholder="请输入素材标题" v-model="model.sgMaterial.title"></el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item><br/>

          <el-form-item label="素材分组：">
            <el-form-grid>
              <el-select placeholder="所属分组" v-model="model.sgMaterialSubdivision.sub">
                <el-option v-for="s in queryTable" :label="s.name" :value="s.id"
                           :key="s.id"></el-option>
              </el-select>
            </el-form-grid>
          </el-form-item><br/>

          <el-form-item label="分享文案：">
            <el-form-grid size="lg">
              <el-form-item prop="content">
                <el-input type="textarea" v-model="model.sgMaterial.content" placeholder="请输入素材文案"></el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item><br/>
          <el-form-item label="二维码链接：">
            <el-form-grid size="xmd">
              <el-form-item prop="url">
                <el-input  v-model="model.sgMaterial.url" placeholder="请输入二维码链接"></el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item><br/>

          <el-form-item>
            <el-form-grid style="width: 320px">
              <el-form-item>
                <el-upload class="avatar-uploader" action=""  :http-request="uploadFile"
                           accept=".jpg,.jpeg,.png,.bmp,.gif" :show-file-list="false"
                           list-type="picture-card"
                           :on-success="handleAvatarSuccess"
                           :before-upload="beforeAvatarUpload">
                  <img width="150px" height="150px" v-if="model.sgMaterial.imgList" :src="model.sgMaterial.imgList" class="avatar">
                  <i width="200px" class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span>上传图片不能大于200KB</span>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <ns-button @click="dialogFormVisible_image = false">取消</ns-button>
          <ns-save type="primary" @click="onSaveImage">保存</ns-save>
        </div>
      </el-dialog>

      <!-- 添加链接 -->
      <el-dialog size="small"
                 :visible.sync="dialogFormVisible_link"
                 :modal-append-to-body="false"
                 :title="title"
                 @before-close="closeDialog()">
        <el-form :model="model.sgMaterial" ref="form" label-width="100px" :rules="rules" placement="right">
          <el-form-item label="素材标题：" required>
            <el-form-grid size="xmd" >
              <el-form-item prop = "title">
                <el-input v-model="model.sgMaterial.title" placeholder="请输入添加素材标题" ></el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item><br/>

          <el-form-item label="素材分组：">
            <el-form-grid>
              <el-select placeholder="所属分组" v-model="model.sgMaterialSubdivision.sub" clearable filterable>
                <el-option v-for="s in queryTable" :label="s.name" :value="s.id"
                           :key="s.id"></el-option>
              </el-select>
            </el-form-grid>
          </el-form-item><br/>
          <el-form-item label="分享文案：">
            <el-form-grid size="xmd">
              <el-form-item prop="content">
                <el-input type="textarea"  v-model="model.sgMaterial.content" placeholder="请输入素材文案"></el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item><br/>

          <el-form-item label="素材链接：" required>
            <el-form-grid size="xmd">
              <el-form-item prop="url">
                <el-input  v-model="model.sgMaterial.url" placeholder="请输入链接"></el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item><br/>

          <el-form-item>
            <el-form-grid>
              <el-form-item >
                <el-upload class="avatar-uploader" action=""  :http-request="uploadFile"
                           accept=".jpg,.jpeg,.png,.bmp,.gif" :show-file-list="false"
                           list-type="picture-card"
                           :on-success="handleAvatarSuccess"
                           :before-upload="beforeAvatarUpload">
                  <img width="200px" v-if="model.sgMaterial.imgList" :src="model.sgMaterial.imgList" class="avatar">
                  <i width="200px" class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span>上传图片不能大于200KB</span>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <ns-button @click="dialogFormVisible_link = false">取消</ns-button>
          <ns-save type="primary" @click="onSaveLink">保存</ns-save>
        </div>
      </el-dialog>

      <!-- 设置分组 -->
      <el-dialog  size="small"
                  :visible.sync="dialogFormVisible_update"
                  :modal-append-to-body="false"
                  :title="title"
                  @before-close="closeDialog()">
        <el-form ref="form" :rules="rules" src="manageTable" :model="model" label-width="100px" class="inputTextCenter"><br/>
          <el-form-item label="素材标题：">
            <el-form-grid size="xmd" >
              <el-form-item prop = "title">
                <span>{{model.titles}}</span>
              </el-form-item>
            </el-form-grid>
          </el-form-item><br/>

          <el-form-item label="素材分组：">
            <el-form-grid>
              <el-select placeholder="所属分组" v-model="model.sgMaterialSubdivision.sub" clearable filterable>
                <el-option v-for="s in queryTable" :label="s.name" :value="s.id"
                           :key="s.id"></el-option>
              </el-select>
            </el-form-grid>
          </el-form-item><br/>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <ns-button @click="dialogFormVisible_update = false">取消</ns-button>
          <ns-save type="primary" @click="onUpdate">保存</ns-save>
        </div>
      </el-dialog>

      <!-- 编辑 -->
      <el-dialog size="small"
                 :visible.sync="dialogFormVisible_edit"
                 :modal-append-to-body="false"
                 :title="title"
                 @before-close="closeDialog()">
        <el-form :model="model" ref="form" label-width="100px" :rules="rules" placement="right">
          <el-form-item label="素材标题：" required>
            <el-form-grid size="xmd" >
              <el-form-item prop = "title">
                <el-input v-model="model.title" placeholder="请输入素材标题：" ></el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item><br/>

          <el-form-item label="素材分组：">
            <el-form-grid size="xmd">
              <el-form-item prop="subName">
                <el-select v-model="model.sgMaterialSubdivision.sub">
                  <el-option v-for="s in queryTable"
                             :key="s.id"
                             :label="s.name"
                             :value="s.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form-grid>
          </el-form-item><br/>

          <el-form-item label="分享文案：">
            <el-form-grid size="xmd">
              <el-form-item prop="content">
                <el-input type="textarea" v-model="model.content" placeholder="请输入素材文案"></el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item><br/>

          <el-form-item label="二维码链接：">
            <el-form-grid size="xmd">
              <el-form-item prop="url">
                <el-input  v-model="model.url" placeholder="请输入二维码链接"></el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item><br/>

          <el-form-item>
            <el-form-grid>
              <el-form-item >
                <el-upload class="avatar-uploader" action=""  :http-request="uploadFile"
                           accept=".jpg,.jpeg,.png,.bmp,.gif" :show-file-list="false"
                           list-type="picture-card"
                           :on-success="handleAvatarSuccess"
                           :before-upload="beforeAvatarUpload">
                  <img width="150px" height="150px" v-if="model.sgMaterial.imgList" :src="model.sgMaterial.imgList" class="avatar">
                  <i width="200px" class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span>上传图片不能大于200KB</span>
              </el-form-item>
            </el-form-grid>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <ns-button @click="dialogFormVisible_edit = false">取消</ns-button>
          <ns-save type="primary" @click="onSaveEdit">保存</ns-save>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import Material from './src/Material'
import ElUpload from '@nascent/nui/lib/upload'
Material.components = { ElUpload }
export default Material
</script>
<style scoped>
  .rewardRuleBorder {
    margin-top: 10px;
    margin-bottom: 10px;
    border-bottom-color: #aba8a8;
    border-bottom-width: 1px;
    border-style: none none dashed;
  }

  .inputTextCenter input::-webkit-outer-spin-button,
  .inputTextCenter input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }
</style>
