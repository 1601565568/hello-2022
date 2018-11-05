<template>
  <div class="template-layout">
    <!-- 表格区域 -->
    <div class="template-layout-right">

      <el-row>
        <el-col :span="24">
          <div class="template-table-bar">
            <el-row type="flex">
              <!-- 表头操作栏-->
              <el-col :span="buttonRatio">
                <ns-button type='primary' class="pull-left" icon='plus' @click='onAddShop'>新增门店</ns-button>
                <ns-button type='primary' class="pull-left" icon='plus' @click='onImportshop'>导入门店</ns-button>
              </el-col>

              <!--搜索弹出-->
              <el-col :span="inputRatio">
                <el-form :model="quickSearchModel" :inline="true" class="pull-right">

                  <el-form-item v-show="_data._queryConfig.expand === false">
                    <el-input ref="quickText" v-model="quickSearchModel.name" placeholder="请输入门店名称">
                      <i class="el-icon-search el-input__icon " slot="suffix"
                         @click="$quickSearchAction$('name')"></i>
                    </el-input>
                  </el-form-item>

                  <el-form-item>
                    <ns-button type="text" @click="$handleTabClick">
                      {{collapseText}}<i
                      :class="{'el-icon--right': true, 'el-icon-arrow-down': !_data._queryConfig.expand, 'el-icon-arrow-up': _data._queryConfig.expand} "></i>
                    </ns-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>
          <!-- 表格搜索表单-->
          <div class="template-table-search" v-show="_data._queryConfig.expand">
            <div class="template-table-filter"
                 v-show="_data._queryConfig.expand === true && _data._queryConfig.showCondition === false">
              <el-row>
                <el-col :span="20" class="template-table-plat" >
                  <!-- 表格搜索表单-->
                  <el-form ref="table_filter_form" :model="model" :rules="rules"
                           :inline="true">
                    <el-form-item  class="no-margin">
                      <el-form-grid size="xmd">
                        <el-form-item  >
                          <el-input type="text" v-model="model.name" placeholder="门店名称"></el-input>
                        </el-form-item>
                      </el-form-grid>
                    </el-form-item>

                    <el-form-item  class="no-margin">
                      <el-form-grid >
                        <el-form-item>
                          <el-select  placeholder="选择状态" v-model="model.status">
                            <el-option label="在营" value="0"></el-option>
                            <el-option label="停业" value="1"></el-option>
                            <el-option label="关店" value="2"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-form-grid>
                    </el-form-item>

                    <el-form-item  class="no-margin">
                      <el-form-grid size="xmd">
                        <el-form-item>
                          <el-select placeholder="选择类型" v-model="model.type">
                            <el-option label="直营" value="0"></el-option>
                            <el-option label="加盟" value="1"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-form-grid>
                    </el-form-item>
                    <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
                    <ns-button @click="$resetInputAction$()">重置</ns-button>
                  </el-form>
                  <!-- <el-form-item >
                     <el-form-grid >
                       <el-form-item>
                         <el-select  placeholder="选择品牌"  v-model="findVo.brandId" @change="findList">
                           <el-option v-for="brand in brandList" :label="brand.name" :key="brand.id" :value="brand.id"></el-option>
                         </el-select>
                       </el-form-item>
                     </el-form-grid>
                   </el-form-item>-->
                </el-col>
              </el-row>
            </div>
          </div>

          <!-- 表格布局-->
          <el-table :data="_data._table.data" stripe ref="table">
            <el-table-column prop="ser" label="序号" align="center" type="index"  width="50"></el-table-column>
            <el-table-column prop="name" label="门店名称" align="left"></el-table-column>
            <el-table-column prop="guideNames" label="店长" align="center" width="200">
              <template slot-scope="scope">{{scope.row.guideNames == null? "-" :scope.row.guideNames}}</template>
            </el-table-column>
            <el-table-column prop="type" label="类型" align="center" width="80">
              <template slot-scope="scope">
                {{scope.row.type == 0 ? "直营" : "加盟"}}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 0" style="color: green;">在营</span>
                <span v-if="scope.row.status == 1" style="color: red;">停业</span>
                <span v-if="scope.row.status == 2" style="color: grey;">关店</span>
              </template>
            </el-table-column>
            <el-table-column label="所属区域" align="center" width="240">
              <template slot-scope="scope">{{scope.row.province == null || scope.row.province == "" ? "-" : scope.row.province}}/{{scope.row.city == null || scope.row.city == "" ? "-" : scope.row.city}}/{{scope.row.district == null || scope.row.district == "" ? "-" : scope.row.district}}</template>
            </el-table-column>
            <el-table-column label="地址" align="center" width="240">
              <template slot-scope="scope">{{scope.row.address==null? "-" : scope.row.address}}
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="100">
              <template slot-scope="scope">
                <div class="tmp-cell__buttons">
                  <ns-button type="text"  @click="edit(scope.row)">编辑</ns-button> <font color="blue">-</font>
                  <ns-button type="text"  @click="deleteShop(scope.row.id)">删除</ns-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination v-if="_data._pagination.enable" class="template-table-pagination"
                         @size-change="$sizeChange$"
                         @current-change="$pageChange$"
                         :current-page="_data._pagination.page"
                         :page-sizes="_data._pagination.sizeOpts"
                         :page-size="_data._pagination.size"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="_data._pagination.total"
          >
          </el-pagination>
        </el-col>
      </el-row>

      <!-- 新增门店/编辑门店 -->
      <el-dialog :title="titlename" :before-close="dialogFormVisiblex()" :visible.sync="dialogFormVisible">
        <el-form ref="form" :rules="rules" src="manageTable" :model="model.sgShop" label-width="100px" class="inputTextCenter" ><br/>
          <!--<el-form-item label="选择区域：" style="margin-right:0;" >-->
          <!--<ns-area @change="onChange"-->
          <!--v-model="selectedOptions3">-->
          <!--</ns-area>-->
          <!--</el-form-item>-->

          <el-form-item label="选择区域：" style="margin-right:0;" >
            <el-form-grid  prop="area">
              <ns-area  :props="key" @change="onChange" v-model="area"></ns-area>
            </el-form-grid>
          </el-form-item>

          <el-form-item label="门店名称：" required>
            <el-form-grid size="xmd">
              <el-form-item prop="name">
                <el-input  type="text" placeholder="请输入门店名字" v-model="model.sgShop.name" >
                </el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item><br/>

          <el-form-item label="详细地址：" required>
            <el-form-grid size="xmd">
              <el-form-item prop="address">
                <el-input  type="textarea" :autosize="{ minRows:2, maxRows: 3}" placeholder="请输入详细地址:XXX大街XX号" v-model="model.sgShop.address">
                </el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item><br/>

          <el-form-item label="门店类型：" >
            <el-form-grid size="xmd">
              <el-radio-group v-model="model.sgShop.type">
                <el-radio :label="0">直营</el-radio>
                <el-radio :label="1">加盟</el-radio>
              </el-radio-group>
            </el-form-grid>
          </el-form-item><br/>

          <el-form-item label="门店状态：">
            <el-form-grid size="xmd">
              <el-radio-group v-model="model.sgShop.status">
                <el-radio :label="0">在营</el-radio>
                <el-radio :label="1">停业</el-radio>
                <el-radio :label="2">关店</el-radio>
              </el-radio-group>
            </el-form-grid>
          </el-form-item> <br/>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <ns-button @click="dialogFormVisiblex()">取消</ns-button>
          <ns-button type="primary" @click="save">保存</ns-button>
        </div>
      </el-dialog>

      <!--门店导入 -->
      <el-dialog ref="importDialog" title="导入门店"
                 :visible.sync="diashopimportVisible"
                 :close-on-click-modal="false"  width="600">
        <el-form ref="form" placement="right" label-width="110px" :model="model" >
          <el-form-item label="模板下载：">
            <el-form-grid size="xmd">
              <el-form-item>
                <a class="el-button el-button--text" id="app-downloadTemplate" href="/static/fileTemplates/门店列表导入模板.xlsx">
                  <i class="fa fa-cloud-download">
                  </i> 点击此处，下载一份模板</a>
              </el-form-item>
            </el-form-grid>

          </el-form-item>

          <el-form-item label="选择品牌：">
            <el-form-grid >
              <el-select placeholder="选择品牌" v-model="serchShop.brandId" name="brandId" value="南讯">
                <el-option v-for="brand in brandList" :label="brand.name" :key="brand.id" :value="brand.id"></el-option>
              </el-select>
            </el-form-grid>
          </el-form-item>

          <el-form-item label="导入门店：" >
            <el-form-grid size="xmd">
              <el-form-item>
                <el-upload
                  ref="shopFile"
                  :data="{brandId:serchShop.brandId}"
                  :limit-file-list="true"
                  :on-success="onSuccess"
                  :on-progress = "onProgress"
                  :auto-upload="false"
                  action="/crmWebApi/guide/sgshop/upLoadShopFile"
                  accept=".xlsx,.xls" name="SgShop" >
                  <ns-button size="small" type="primary">选择文件</ns-button>
                </el-upload>
              </el-form-item>
            </el-form-grid>
            <el-form-grid block class="text-warning">
              <i slot="tip" class="el-icon-warn"></i>请注意!必须上传excel文件，后缀名为.xlsx或.xls;
            </el-form-grid>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <ns-button size="small" type="primary" @click="diashopimportVisible=false">取 消</ns-button>
          <ns-button size="small" type="primary" class="el-inline-block" @click="saveImportShop()">导入门店</ns-button>
        </div>
      </el-dialog>

      <!-- 选择店长 -->
      <el-dialog title="选择店长" :visible.sync="dialogChooseShopVisible" @change="chooseShopfindList('009')">
        <el-form inline :class="{ hide: isOpen }" class="rfm-form" label-width="80px">
          <el-form-item class="no-margin">
            <el-form-grid size="xmd">
              <el-form-item prop="name">
                <el-input autofocus v-model="serchShop.name" placeholder="姓名/手机号"></el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item>
            <el-form-grid>
              <el-select placeholder="选择品牌"  v-model="serchShop.brandId" @change="chooseShopfindList">
                <el-option v-for="brand in brandList" :label="brand.name" :key="brand.id" :value="brand.id"></el-option>
              </el-select>
            </el-form-grid>
          </el-form-item>
          <ns-button  type="primary" @click="chooseShopfindList()" >搜索</ns-button>
          <ns-button @click="$resetInputAction$()">重置</ns-button>
        </el-form>
        <!-- 表格及图表布局-->
        <el-row >
          <!-- 表格布局-->
          <el-table :data="tableDataChooseShop" @select="selectRow" @select-all="selectAll" stripe ref="shopFormChooseShop">
            <el-table-column prop="guideId"  type="selection"  width="30"></el-table-column>
            <el-table-column prop="name" label="姓名" align="left"></el-table-column>
            <el-table-column prop="mobile" label="手机号码" align="left"></el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination  v-model="serchShop.page" class="template-table-pagination" @size-change="chooseShophandleSizeChange" @current-change="chooseShophandleCurrentChange" :current-page="serchShop.page"
                          :page-sizes="[10, 20, 30, 50, 100]" :page-size="serchShop.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNumChooseShop">
          </el-pagination>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <ns-button @click="cancelchooseShop">取消</ns-button>
          <ns-button type="primary" @click="saveChooseShop()">保存</ns-button>
        </div>
      </el-dialog>

    </div>
  </div>

</template>

<script>
  import shop from './src/shop'
  export default shop
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
