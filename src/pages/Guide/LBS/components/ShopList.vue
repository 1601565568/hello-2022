<template>
  <div>
    <page-table :searchCol='24' title='参与门店'>
      <template slot='search'>
        <el-form :inline="true" class='form-inline_top' @submit.native.prevent>
          <el-form-item label="" class='no-margin'>
            <el-input v-model="model.shopName" placeholder="请输入门店名称"  @keyup.enter.native="handleSearch" >
              <Icon type="ns-search-copy" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
            </el-input>
          </el-form-item>
        </el-form>
      </template>
      <template slot='table'>
        <template>
          <el-table
            :data="_data._table.data"
            class="new-table_border"
            style="width: 100%">
            <el-table-column
              prop="shopName"
              label="门店名称">
            </el-table-column>
             <el-table-column
              width='150px'
              prop="status"
              label="状态">
              <template slot-scope="scope">
                <el-tag :type="statusList[scope.row.status+''].color" class='scope-name_tag'>{{statusList[scope.row.status+''].value}}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </template>
      <template slot='pagination'>
        <div class='drawer-pagination'>
          <div class='pagecontent-left'>
            <div class='content-item' @click='handlePrev'><i class="el-icon-arrow-left"></i>上一个活动</div>
            <div class='content-item' @click='handleNext'>下一个活动<i class="el-icon-arrow-right"></i></div>
          </div>
          <el-pagination v-if="_data._pagination.enable"
                          style='width:300px'
                          class="template-table__pagination"
                          :page-sizes="_data._pagination.sizeOpts"
                          :total="_data._pagination.total"
                          :current-page="_data._pagination.page"
                          :page-size="_data._pagination.size"
                          layout="total, prev, pager, next, jumper"
                          @size-change="$sizeChange$"
                          @current-change="$pageChange$">
            </el-pagination>
          </div>
      </template>
    </page-table>
  </div>
</template>
<script>
import PageTable from '@/components/NewUi/PageTable'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import api from '@/config/http'
export default {
  data () {
    return {
      pagination4Emp: {
        enable: true,
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      url: this.$api.guide.lbs.getGroupShop,
      // 筛选数据
      model: {
        shopName: '',
        guid: ''
      },
      // 状态列表
      statusList: {
        '0': {
          value: '删除',
          color: 'info'
        },
        '-1': {
          value: '暂停',
          color: 'warning'
        },
        '1': {
          value: '正常营业',
          color: 'success'
        },
        '-2': {
          value: '已关店',
          color: 'info'
        }
      }
    }
  },
  props: ['guid'],
  components: {
    PageTable
  },
  mixins: [tableMixin],
  methods: {
    changeSearchfrom (obj = {}) {
      this.model = Object.assign(this.model, obj)
      this.$searchAction$()
    },
    handleChangeGuide (value) {
      this.changeSearchfrom({ guideIds: value })
    },
    handleSearch () {
      this.changeSearchfrom({ name: this.seachVal })
    },
    handlePrev () {
      this.$emit('onPrev')
    },
    handleNext () {
      this.$emit('onNext')
    }
  },
  watch: {
    guid: {
      handler (newVal, oldVal) {
        this.model.guid = newVal
        this.$searchAction$()
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .search-icon {
    font-size: 22px;
    margin-top: 2px;
  }
  .scope-name_tag.el-tag {
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
  .drawer-pagination {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .pagecontent-left {
      width: 223px;
      height: 32px;
      border: 1px solid #D9D9D9;
      border-radius: 2px;
      border-radius: 2px;
      display: flex;
      position: relative;
      user-select:none;
      cursor: pointer;
      &:after {
        content: ' ';
        position: absolute;
        left: 50%;
        top: 4px;
        bottom: 4px;
        width: 1px;
        background-color: #E8E8E8;
      }
      .content-item {
        width: 50%;
        font-size: 14px;
        color: #595959;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
