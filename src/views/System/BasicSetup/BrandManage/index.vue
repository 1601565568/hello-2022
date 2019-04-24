<template>
  <div class="template-page">
    <ns-table-brand ref="table" @add-tags="addTags" @update-tags="updateTags" @relation-tags="relationTags"> </ns-table-brand>
    <el-dialog :title="title" :visible.sync="visible"
               :before-close="onCloseDialog" width="470px">
      <el-scrollbar outsider ref="brandManageHeight">
        <el-form ref="form" placement="right" label-width="100px" :model="brandModel" :rules="rules">
          <el-form-item label="品牌名称："  class = "el-inline-block" required>
            <el-form-grid size="xmd">
              <el-form-item prop = "tag_name" >
                <el-input type="text" v-model.trim = "brandModel.tag_name" placeholder="请输入品牌名称">
                </el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <div v-if="isShow">
          <el-form-item label="会员场景："  required>
            <el-form-grid>
              <el-form-item prop = "is_member" >
                <el-radio v-model="brandModel.member_scene" label="1">交易即会员</el-radio>
                <el-radio v-model="brandModel.member_scene" label="2">注册即会员</el-radio>
              </el-form-item>
            </el-form-grid>
          </el-form-item>

          <el-form-item label="业务平台：" required>
            <el-form-grid width="300">
              <el-form-item prop = "is_member">
                <el-form-item class="plat-item"><span class="plat-item__label">线上</span><el-checkbox class="float-right" v-model="onLine" label="全选" @change="changeOnLine" :indeterminate="isIndeterminate"></el-checkbox></el-form-item>
                <el-form-item prop="checkPlatForm">
                  <el-checkbox-group v-model="brandModel.checkPlatForm" @change="indexChangePlatForm" class="padding-lr-small">
                    <el-row>
                      <el-col :span="8" v-for="plat in platForm" :key="plat.value">
                        <el-checkbox :label="plat.value">{{plat.label}}</el-checkbox>
                      </el-col>
                    </el-row>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item class="plat-item"><span class="plat-item__label">线下</span><el-checkbox v-model="underLine" class="float-right" label="全选"></el-checkbox></el-form-item>
                <el-form-item>
                  <div class="padding-lr-small">
                    <el-checkbox v-model="underLine" label="线下"></el-checkbox>
                  </div>
                </el-form-item>
              </el-form-item>
            </el-form-grid>
          </el-form-item>

          <el-form-item label=" 描述：">
            <el-form-grid size="lg">
              <el-form-item prop = "remark" >
                <el-input type="textarea" v-model.trim = "brandModel.remark" placeholder="请输入描述">
                </el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          </div>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onCloseDialog">{{$t('operating.cancel')}}</ns-button>
        <ns-save @click="onSave" :loading="brandLoading"></ns-save>
      </div>
    </el-dialog>

    <el-dialog title="关联店铺" :visible.sync="visibleShop"
               :close-on-click-modal = "false" :before-close="onCloseRelation" width="850px">

      <p class="relevance-shop__title"><i class="iconfont icon-shop"></i>
        <template v-if="tagName.length>25">
          <el-tooltip class="item" effect="light" :content="tagName" placement="top-start">
            <span>{{tagName.slice(0,25)+ '...'}}</span>
          </el-tooltip>
        </template>
        <template v-else>
          {{tagName}}
        </template>
        <span style="padding-left: 10px;">已选<span class="text-danger padding-lr-base">{{shopCount}}</span>家</span>
        <el-form class="float-right clearfix" :inline=true>
          <el-form-item>
            <ns-droptree v-model="isOnline" :data="channels" show-checkbox clearable :isShow="false"></ns-droptree>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="searchModel.shopName" placeholder="请输入店铺内容"></el-input>
          </el-form-item>
          <el-form-item>
            <ns-button type="primary" @click="searchAction">{{$t('operating.search')}}</ns-button>
          </el-form-item>
        </el-form>
      </p>
      <div class="relevance-shop__main">
        <div class="relevance-shop__content">
          <template v-if="shops.length == 0">
            <ns-no-data height="200">{{$t('prompt.noData')}}</ns-no-data>
          </template>
          <template v-else>
          <el-checkbox-group v-model="checkedShops" @change="handleCheckedShopsChange">
            <el-checkbox v-for="shop in shops" :label="shop.value" :key="shop.value">{{shop.label}}</el-checkbox>
          </el-checkbox-group>
          </template>
        </div>
        <div class="relevance-shop__footer">
          <el-checkbox @change="change" v-model="indexAllSelect" class="padding-r-base" :indeterminate="isIndeterminate">本页全选
          </el-checkbox>
          <el-checkbox @change="changeAll" v-model="allSelect" :indeterminate="isAllIndeterminate">全部全选
          </el-checkbox>
          <el-pagination
            class="float-right clearfix"
            :current-page.sync="pagination.page"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :page-sizes="pagination.sizeOpts"
            :page-size="pagination.pageSize"
            :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
          </el-pagination>
        </div>
      </div>
        <span slot="footer" class="dialog-footer">
          <ns-button @click="onCloseRelation">{{$t('operating.cancel')}}</ns-button>
          <ns-save @click="onSaveRelation" :loading="relationLoading"></ns-save>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import index from './src/index'
import NsTableBrand from './NsTableBrand'
import NsDroptree from 'components/NsDroptree'
index.components = {
  NsTableBrand,
  NsDroptree
}
export default index
</script>

<style scoped>
  @import "@/style/small/variables.pcss";
  .plat-item {
    border-bottom: 1px solid var(--theme-base-border-color-primary);
    .plat-item__label {
      display: inline-block;
      height: 100%;
      padding: 0 var(--default-padding-xlarger);
      background: var(--theme-color-primary);
      color: var(--theme-color-white);
      border-radius: var(--default-radius-small) var(--default-radius-small) 0 0;
    }
  }
  /* 关联店铺的样式*/
  .relevance-shop__title{
    padding:var(--default-margin-base) var(--default-margin-base) var(--default-margin-larger);
  i{
    background: var(--theme-color-primary);
    width: 24px;
    height:24px;
    border-radius: 100%;
    color:#fff;
    display: inline-block;
    margin-right: 3px;
  &:before{
     font-size: 14px;
     line-height: 22px;
     position: relative;
     left: 4px;
     top: 0;
   }
  }
  }
  .relevance-shop__main{
  >>> .el-form{
    padding:var(--default-margin-base);
  }
  width:100%;
  border:1px solid var(--theme-base-border-color-primary);
  .relevance-shop__content{
    padding:var(--default-margin-base);
    width:100%;
  >>> .el-checkbox{
    width:32.7%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right:var(--default-margin-base);
  &+.el-checkbox{
     margin-left:0;
   }
  }
  }
  .relevance-shop__footer{
    border-top:1px solid var(--theme-base-border-color-primary);
    padding:var(--default-margin-base);
  >>> .el-checkbox{
    line-height: var(--default-form-item-small-height);
  }
  >>> .el-pagination{
    padding:0;
    display: inline-block;
  }
  }
  }
  /* 关联店铺的样式-end*/
</style>
