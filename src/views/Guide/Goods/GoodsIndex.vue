<template>
  <div class="template-page">
    <div class="template-page__row">
      <div class="template-page__row-right" style="margin: 0">
        <goods-table ref="table" @add="showGoodsDialog" @edit="showGoodsDialog" @detail="showDetailDialog"></goods-table>
      </div>
    </div>
    <el-dialog ref="editDialog" :title="goodsDialogTitle" :visible.sync="dialogVisible">
      <el-steps v-if="addFlag" :active="active" finish-status="success" simple>
        <el-step title="1、编辑基本信息"></el-step>
        <el-step title="2、编辑商品详情"></el-step>
      </el-steps>
      <el-form ref="form" label-width="120px" class="form-main" :model="formData" :rules="rules">
        <div v-if="active===0">
          <div style="box-sizing: border-box;margin: 10px 0 10px 0;
        border: 0 solid rgba(228, 228, 228, 1); border-bottom-width: 1px; border-radius: 0;">
            基本信息
          </div>
          <el-form-item label="商品名称：" required>
            <el-form-grid size="xlg">
              <el-form-item prop="title">
                <el-input v-model="formData.title" maxlength="100" placeholder="请输入商品名称，最长100位"></el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="商品编号：" required>
            <el-form-grid size="xlg">
              <el-form-item prop="goods_code">
                <el-input v-model="formData.goods_code" maxlength="32" placeholder="请输入商品编号，最长32位"></el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="卖点描述：">
            <el-form-grid size="xlg">
              <el-form-item prop="description">
                <el-input v-model="formData.description" maxlength="255" placeholder="请输入卖点描述，最长255位"></el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="商品分类：" class="el-inline-block">
            <el-form-grid size="xmd">
              <el-form-item prop="category">
                <ns-droptree v-model="formData.category" :data="treeData2" @node-click="categoryClick"
                             clearable></ns-droptree>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="默认图片：" class="el-inline-block">
            <el-form-grid style="width: 320px;">
              <el-form-item prop="logo">
                <el-upload class="avatar-uploader"
                           :action="this.$api.core.sgUploadFile('test')"
                           accept=".jpg,.jpeg,.png,.bmp,.gif" :show-file-list="false"
                           :on-success="handleAvatarSuccess"
                           :before-upload="beforeAvatarUpload">
                  <img width="200px" v-if="formData.picture_url" :src="formData.picture_url" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span style="margin-top: -4px;color:#A1A1A1">建议尺寸：800*800像素，图片不能超过200K</span>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <div style="box-sizing: border-box;margin: 10px 0 10px 0;
        border: 0 solid rgba(228, 228, 228, 1); border-bottom-width: 1px; border-radius: 0;">
            规格信息（SKU）
          </div>
          <el-form-item label="规格配置：">
            <div class="borderClass" style="margin-bottom: 5px;" v-if="typeList.length>0">
              <div v-for="(type,index) in typeList" :key="index">
                <el-form-item label-width="60px" label="规格名："
                              style="background-color: rgba(242, 242, 242, 1);color: #5E5E5E;">
                  <el-autocomplete class="inline-input" v-model="type.type" :fetch-suggestions="typeNameChange"
                                   placeholder="请选择或输入"></el-autocomplete>
                  <a @click="deleteGoodsType(index)" class="delete-icon" style="float: right;margin-right: 10px">
                    <i class="g-delete el-icon-delete"></i></a>
                </el-form-item>
                <el-form-item label-width="60px" label="规格值：">
                  <el-input class="inline-input" maxlength="20" v-for="(properties,index) in type.list"
                            :key="index" @blur="resetSkuList"
                            style="width: 143px;margin-right: 10px;margin-bottom: 5px;" v-model="properties.value">
                  </el-input>
                  <ns-button type="text" @click="addGoodsTypeValue(index)">添加规格值</ns-button>
                </el-form-item>
              </div>
            </div>
            <ns-button v-if="typeList.length<3" type="primary" @click="addGoodsType" round>
              +添加规格
            </ns-button>
          </el-form-item>
          <el-form-item label="规格明细：" v-if="skuList.length>0" required>
            <el-table ref="skuTable" :data="skuList" class="template-table__main borderClass"
                      stripe resizable :element-loading-text="$t('prompt.loading')" @row-click="rowClick">
              <el-table-column prop="type" label="sku属性" show-overflow-tooltip align="center"></el-table-column>
              <el-table-column label="建议零售价(元)" align="center">
                <template slot-scope="scope">
                  <el-input type="number" v-model="scope.row.price"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="成本价(元)" align="center">
                <template slot-scope="scope">
                  <el-input type="number" v-model="scope.row.cost_price"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="规格图片" align="center">
                <template slot-scope="scope,column,index">
                  <el-upload class="avatar-uploader2"
                             :action="$api.core.sgUploadFile('test')"
                             accept=".jpg,.jpeg,.png,.bmp,.gif" :show-file-list="false"
                             :on-success="handleAvatarSuccess2"
                             :before-upload="beforeAvatarUpload">
                    <img width="200px" v-if="scope.row.picture_url" :src="scope.row.picture_url" class="avatar2">
                    <i v-else class="el-icon-plus avatar-uploader2-icon"></i>
                  </el-upload>
                </template>
              </el-table-column>
              <el-table-column prop="sales_count" label="销量" align="center" show-overflow-tooltip></el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item :label="skuList.length>0?'批量设置零售价：':'建议零售价：'" required>
            <el-form-grid size="xmd">
              <el-form-item prop="price">
                <el-input type="number" v-model="formData.price" placeholder="请输入建议零售价" @blur="resetSkuPrice">
                  <template slot="prepend">¥</template>
                </el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item :label="skuList.length>0?'批量设置成本价：':'成本价：'">
            <el-form-grid size="xmd" style="float: left;">
              <el-form-item prop="cost_price">
                <el-input type="number" v-model="formData.cost_price" placeholder="请输入成本价" @blur="resetSkuCostPrice">
                  <template slot="prepend">¥</template>
                </el-input>
              </el-form-item>
            </el-form-grid>
            <p style="color:#A1A1A1;float: left;">成本价将用于营销建议，利润分析等</p>
          </el-form-item>
          <el-form-item label="划线价：">
            <el-form-grid size="xmd">
              <el-form-item prop="delete_price">
                <el-input type="number" v-model="formData.delete_price" placeholder="请输入划线价">
                  <template slot="prepend">¥</template>
                </el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
        </div>
        <!--富文本框 开始-->
        <el-form-item v-else prop="detail" label-width="0">
          <vue-ueditor-wrap :config="myConfig" v-model="detail" @ready="editorReady"></vue-ueditor-wrap>
        </el-form-item>
        <!--富文本框 结束-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="dialogVisible = false">取 消</ns-button>
        <ns-button type="primary" @click="onSave">{{nextSaveValue}}</ns-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import GoodsTable from './GoodsTable'
import GoodsIndex from './src/GoodsIndex'
import NsDroptree from 'components/NsDroptree'
import VueUeditorWrap from 'vue-ueditor-wrap'

GoodsIndex.components = { GoodsTable, NsDroptree, VueUeditorWrap }
export default GoodsIndex
</script>

<style scoped>
  >>>.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .form-main{
    padding-right: 30px;
  }
  .avatar-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 128px;
    height: 128px;
    line-height: 128px;
    text-align: center;
    display: inline-block;
  }

  .avatar {
    width: 128px;
    height: 128px;
    display: block;
  }

  >>>.avatar-uploader2 .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 1px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader2 .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader2 .avatar-uploader2-icon {
    font-size: 28px;
    color: #8c939d;
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    display: inline-block;
  }

  .avatar2 {
    width: 29px;
    height: 29px;
    display: block;
  }

  .borderClass {
    border: 1px solid rgba(228, 228, 228, 1);
    border-radius: 0px;
  }
  .el-inline-block{
    display: block;
  }
</style>
