<template>
  <page-table :searchCol='24'>
      <template slot='search'>
        <div class='title'>评论客户（总计：{{commentNum}}人）</div>
      </template>
      <template slot='button'>
        <ns-button type="primary" size='large'>批量达标</ns-button>
      </template>
      <template slot='table'>
        <template>
          <el-table
            :data="commentList"
            class="new-table_border"
            style="width: 100%">
            <el-table-column type="selection" align="center">
            </el-table-column>
            <el-table-column align="left" label="昵称">
              <template slot-scope="scope">
                <div class='td-detail'>
                  <img :src="scope.row.pic" class='td-img'>
                  <span class='td-name'>{{scope.row.name}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="sendTime" label="评论时间" :sortable="false" align="left">
          </el-table-column>
          </el-table>
        </template>
      </template>
      <template slot='pagination'>
        <el-pagination >
        </el-pagination>
      </template>
    </page-table>
</template>
<script>
import PageTable from '@/components/NewUi/PageTable'
export default {
  components: { PageTable },
  props: {
    commentList () {
      return []
    },
    commentNum: {}
  }
}
</script>
<style scoped lang='scss'>
@import "@components/NewUi/styles/reset.css";
.title {
  font-size: 16px;
  color: #262626;
  line-height: 24px;
  font-weight: 500;
}
.td-detail {
  display: flex;
  align-items: center;
  .td-img {
    width: 40px;
    height: 40px;
    margin-right: 8px;
    border-radius: 50%;
  }
  .td-name {
    font-size: 14px;
    color: #303133;
    line-height: 22px;
  }
}
</style>
