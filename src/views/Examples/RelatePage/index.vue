<template>
  <!-- 页面关联分析页面 -->
  <div class="analysis-content">
    <div class="instructions-content">
      <div class="instructions-content__info">
        1.先浏览的宝贝清单默认只展示TOP10宝贝，你可以通过商品ID等查询指定的商品；<br>
        2.此报表可以让你了解到看了A宝贝的人接下来又看了哪个宝贝，且通过后看了宝贝的跳转访问数的高低看出客户在浏览行为上哪两个产品更存在关联性。因此在店铺装修及下单后的短信关怀时可尝试做相关推荐；<br>
        3.报表数据仅从CRM4.0上线后开始提供；<br>
      </div>
    </div>
    <ns-page-table :colButton="0">
      <template slot="searchSearch">
        <el-form label-width="70px"
                 :inline="true">
          <el-form-item label="浏览时间：">
            <ns-datetime type="date"
                         v-model="time">
            </ns-datetime>
          </el-form-item>
          <el-form-item label-width="0">
            <el-form-grid size="md">
              <el-select v-model="selectValue" placeholder="请选择">
                <el-option
                  v-for="item in selectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-grid>：
            <el-form-grid size="md">
              <el-input type="text"></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item>
            <ns-button type="primary">{{$t('operating.search')}}</ns-button>
            <ns-button>{{$t('operating.reset')}}</ns-button>
          </el-form-item>
        </el-form>
      </template>

      <!-- 表格 -->
      <template slot="table">
        <div class="template-table__main">
          <el-row :gutter="5">
            <el-col :span="12">
              <div class="template-page__table content-style">
                <div class="page-block__title">
                  <p class="el-inline-block">
                    先看了Top10
                  </p>
                </div>
                <el-table
                  stripe
                  :summary-method="getSummariesTop"
                  show-summary
                  :data="tableData"
                  style="width: 100%">
                  <el-table-column
                    width="100"
                    align="center"
                    label="商品图片">
                    <template slot-scope="scope">
                      <img :src="scope.row.picture" class="table-picture">
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="商品名称">
                    <template slot-scope="scope">
                      <p>{{scope.row.info.name}}</p>
                      <span>{{scope.row.info.price}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="access"
                    label="访问数"
                    width="80"
                    align="right">
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="template-page__table content-style">
                <div class="page-block__title">
                  <p class="el-inline-block">
                    后看了
                  </p>
                </div>
                <el-table
                  stripe
                  :summary-method="getSummariesOther"
                  show-summary
                  :data="tableData1"
                  style="width: 100%">
                  <el-table-column
                    width="100"
                    align="center"
                    label="商品图片">
                    <template slot-scope="scope">
                      <img :src="scope.row.picture" class="table-picture">
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="商品名称">
                    <template slot-scope="scope">
                      <p>{{scope.row.info.name}}</p>
                      <span>{{scope.row.info.price}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="jump"
                    label="跳转访问数"
                    width="80"
                    align="right">
                  </el-table-column>
                  <el-table-column
                    prop="access"
                    label="访问数"
                    width="80"
                    align="right">
                  </el-table-column>
                  <el-table-column
                    prop="rate"
                    label="关联率"
                    width="80"
                    align="right">
                  </el-table-column>
                </el-table>
                <el-pagination
                  :current-page="currentPage"
                  :page-sizes="[100, 200, 300, 400]"
                  :page-size="100"
                  layout="total, sizes, prev, pager, next, jumper"
                  :next-click-unlimited="true"
                  :total="400">
                </el-pagination>
              </div>
            </el-col>
          </el-row>
        </div>
      </template>
      <!-- 表格-结束 -->
    </ns-page-table>
  </div>
  <!-- /页面关联分析页面 -->
</template>

<script>
  import index from './src/index'
  export default index
</script>
