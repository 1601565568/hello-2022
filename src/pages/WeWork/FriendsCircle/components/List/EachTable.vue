<template>
  <div>
    <el-table
      :data="data"
      class="new-table_border"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="内容">
        <template slot-scope="scope">
          <Matter :type='scope.row.type'/>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        width='120px'
        label="使用范围">
      </el-table-column>
      <el-table-column
        prop="time"
        width='150px'
        label="发布时间">
        <template slot-scope="scope">
          <span class='col-text'>{{scope.row.time}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createName"
        width='200px'
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="createName"
        width='200px'
        label="置顶">
      </el-table-column>
      <el-table-column
        prop="address"
        width='125px'
        label="操作">
        <template slot-scope="scope">
          <ns-button type="text" @click='handleDetail({guid:scope.row.guid,id:scope.row.id})'>详情</ns-button>
          <ns-button type="text" @click='handleEnd(scope.row.guid,scope.row.createId)'>删除</ns-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>
<script>
import Matter from './Matter'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  data () {
    return {
      data: [
        {
          type: 1,
          desc: '小朋友圈1',
          styleType: '朋友圈样式',
          time: '2019/08/09 10:29'
        },
        {
          type: 2
        },
        {
          type: 3
        }
      ]
    }
  },
  mixins: [tableMixin],
  components: { Matter }
}
</script>
<style lang="scss" scoped>
.col-text {
  font-size: 14px;
}
</style>
