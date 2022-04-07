<template>
  <page-table :searchCol='24'>
      <template slot='search'>
        <div class='title'>点赞客户（总计：{{likeNum}}人）</div>
      </template>
      <template slot='button'>
        <ns-button type="primary" size='large'>批量达标</ns-button>
      </template>
      <template slot='table'>
        <template>
          <el-table
            :data="likeList"
            class="new-table_border"
            style="width: 100%">
            <el-table-column type="selection" align="center">
            </el-table-column>
            <el-table-column align="center">
              <template slot-scope="scope">
                <div>
                  <img :src="scope.row.pic">
                  <span>{{name}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="sendTime" label="点赞时间" :sortable="false" align="left">
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
    likeList () {
      return []
    },
    likeNum: {}
  }
}
</script>
