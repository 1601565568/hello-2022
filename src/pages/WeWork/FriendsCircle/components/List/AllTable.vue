<template>
  <el-table
    :data="data"
    class="new-table_border"
    style="width: 100%">
    <el-table-column
      prop="name"
      label="内容">
      <template slot-scope="scope">
        <!-- <TableItem :data='formatTableItem(scope.row)'/> -->
        <Matter :data='scope.row' />
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="对外信息名称">
      <template slot-scope="scope">
        <span class='col-text'>{{scope.row.name}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="style"
      width='120px'
      label="样式">
      <template slot-scope="scope">
        <span class='col-text'>{{styleList[scope.row.style]}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="status"
      width='120px'
      label="使用范围">
      <template slot-scope="scope">
        <template v-if='scope.row.userType === 1'>
          <ns-button type='text' @click='handlePreview(scope.row.guideIds)'>{{scope.row.guideIds && scope.row.guideIds.length ? scope.row.guideIds.length : 0}}名员工</ns-button>
        </template>
        <template v-else>
          全部员工
        </template>
      </template>
    </el-table-column>
    <el-table-column
      prop="createTime"
      width='170px'
      label="发布时间">
      <template slot-scope="scope">
        <span class='col-text'>{{scope.row.createTime}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="founder"
      width='200px'
      label="创建人">
    </el-table-column>
    <el-table-column
      prop="address"
      width='125px'
      label="操作">
      <template slot-scope="scope">
        <ns-button type="text" @click='handleDetail(scope.row.uuid)'>详情</ns-button>
        <ns-button type="text" @click='handleDelect(scope.row.uuid)'>删除</ns-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
// import TableItem from '@/pages/Guide/Material/Library/components/TableItem'
import Matter from './Matter'
export default {
  data () {
    return {
      styleList: { // 样式枚举
        0: '朋友圈样式',
        1: '设计师样式',
        2: '多媒体样式'
      }
    }
  },
  props: {
    data: {
      default () {
        return []
      }
    }
  },
  components: { Matter },
  methods: {
    formatTableItem (item) {
      return {
        content: item.content,
        mType: item.videoUrl ? 2 : item.imgUrl ? 1 : 0,
        imageList: item.videoUrl ? [item.videoUrl] : item.imgUrl ? item.imgUrl.split(',') : []
      }
    },
    handleDelect (uuid) {
      this.$emit('onDelect', uuid)
    },
    handleDetail (uuid) {
      this.$emit('onDetail', uuid)
    },
    handlePreview (guideIdList) {
      this.$emit('onPreview', guideIdList)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
.col-text {
  font-size: 12px;
}
</style>
