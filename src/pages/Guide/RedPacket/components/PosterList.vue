<template>
  <div class='dialog-table'>
    <page-table title=''>
      <!-- 搜索 start -->
      <template slot='search'>
        <el-form :inline="true" class='form-inline_top' @submit.native.prevent>
          <el-form-item label="">
            <el-input v-model="model.name" placeholder="请输入封面名称"  @keyup.enter.native="handleSearch" style='width:228px;'>
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
            </el-input>
          </el-form-item>
          <!-- <el-form-item label="">
            <el-input v-model="model.operatorName" placeholder="请输入创建人名称"  @keyup.enter.native="handleSearch" style='width:228px;'>
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
            </el-input>
          </el-form-item> -->
        </el-form>
      </template>
      <!-- 搜索 end -->
      <!-- 表格 start -->
      <template slot='table'>
        <template>
          <el-table
            height='400px'
            :data="_data._table.data"
            class="new-table_border"
            :class="[ENV === 'QA' && 'styQA']"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="红包封面">
              <template slot-scope="scope">
                <div class="scope-title">
                  <el-radio :value="checkItem.id" :label="scope.row.id" @change='handleCheck(scope.row)'><span></span></el-radio>
                  <div class='scope-img'><PreviewRedPacket :bgImage='scope.row.background'  previewType='dialog'/></div>
                  <!-- <img :src='redPacket' class='scope-img' /> -->
                  <div class="scope-title_tab" v-if='scope.row.isDefault'>
                    默认
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="封面名称">
            </el-table-column>
            <el-table-column
              prop="createTime"
              align='center'
              label="创建时间">
            </el-table-column>
            <el-table-column
              prop="operatorName"
              align='center'
              label="创建人">
            </el-table-column>
          </el-table>
        </template>
      </template>
      <!-- 表格 end -->
      <!-- 页面 start -->
      <template slot='pagination'>
        <el-pagination v-if="_data._pagination.enable"
                        class="template-table__pagination"
                        :page-sizes="_data._pagination.sizeOpts"
                        :total="_data._pagination.total"
                        :current-page="_data._pagination.page"
                        :page-size="_data._pagination.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="$sizeChange$"
                        @current-change="$pageChange$">
          </el-pagination>
      </template>
      <!-- 页面 end -->
    </page-table>
  </div>
</template>
<script>
import PageTable from '@/components/NewUi/PageTablePro'
import PreviewRedPacket from '../components/PreviewRedPacket'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  data () {
    return {
      ENV: process.env.VUE_APP_THEME,
      model: {
        name: '',
        operatorName: ''
      },
      drawer: false,
      url: this.$api.guide.redpacket.getCoverList,
      checkItem: {
        id: null,
        background: ''
      }
    }
  },
  mixins: [tableMixin],
  components: {
    PageTable, PreviewRedPacket
  },
  props: ['checked', 'background'],
  mounted () {
    this.$reload()
    this.checkItem.id = this.checked
    this.checkItem.background = this.background
  },
  methods: {
    handleSearch () {
      this.changeSearchfrom({ name: this.model.name })
    },
    /**
     * 修改搜索项
     * @param {*} [obj]
     */
    changeSearchfrom (obj = {}) {
      this.model = Object.assign(this.model, obj)
      this.$searchAction$()
    },
    handleCheck (checkItem) {
      this.checkItem = checkItem
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.search-icon {
  font-size: 25px;
}
.scope-title {
  display: flex;
  align-items: center;
}
.scope-title_tab {
  width: 42px;
  height: 24px;
  background: #F2F9FE;
  border-radius: 2px;
  text-align: center;
  line-height: 24px;
  color: #0091FA;
}
.scope-img {
  width: 38.66px;
  margin-right: 15.67px;
}
</style>
<style scoped>
.dialog-table >>> .template-table,.dialog-table >>> .template-table .teplate-table__box {
  padding: 0;
  margin: 0;
}
</style>
<style scoped>
  .styQA >>> .el-radio__input.is-checked .el-radio__inner{
      border-color: #2153D4;
  background-color: #2153D4;
  }
  .styQA >>> .scope-title_tab{
    color: #2153D4;
  }
</style>
