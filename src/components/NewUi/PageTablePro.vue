<template>
  <div class='template-container'>
    <div class='template-table__bar-name' v-if='title'>
      <h1>{{title}}</h1>
      <slot name='title'></slot>
    </div>
    <slot name='tab'></slot>
    <div class="template-table">
      <div class='teplate-table__box'>
        <!-- 头部提示 -->
        <div class='header-tip' v-if='headerTip'>
          <div class='header-tip__content'>{{headerTip}}</div>
        </div>
        <!-- 工具栏 -->
        <div class="template-table__bar">
          <el-row class="template-table__bar-base">
            <!-- 搜索条件-->
            <el-col :span='searchCol' class="search-content">
              <slot name='search' />
            </el-col>
            <!-- 按钮-->
            <el-col :span='24-searchCol' class="btn-content">
              <slot name='button' />
            </el-col>
          </el-row>
        </div>

        <!-- 表格 -->
        <slot name="table">

        </slot>
        <!-- 分页 -->
        <slot name="pagination">

        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageTablePro',
  props: {
    headerTip: {
      default: false
    },
    searchCol: {
      default: 21
    },
    title: {
      type: String
    }
  }
}
</script>
<style lang="scss" scoped>
.template-table__bar-name {
  font-size: 16px;
  color: #262626;
  line-height: 48px;
  background-color: #fff;
  font-weight: bold;
  margin: -10px -10px 0px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  h1 {
    font-size: 16px;
    color: #262626;
    min-width: 70px
  }
}
.template-table {
  padding: 16px;
  margin: 0 -10px;
  .template-table__bar {
    padding: 0;
    box-shadow: none;
    display: flex;
    justify-content: space-between;
    .search-content {
      display: flex;
      justify-content: flex-start;
    }
  }
  .template-table__bar-base {
    width: 100%;
    margin-bottom: 7px;
  }
  .teplate-table__box {
    padding: 16px;
    background: #fff;
  }
}
.btn-content {
  display: flex;
  justify-content: flex-end;
  height: 100%;
  align-items: flex-start;
}
.el-pagination {
  box-shadow: none
}
.header-tip {
  padding-bottom: 16px;
  background: #fff;
}
.header-tip__content {
  font-size: 14px;
  color: #595959;
  line-height: 22px;
  background: #F2F9FE;
  padding: 9px 16px;
}
</style>
