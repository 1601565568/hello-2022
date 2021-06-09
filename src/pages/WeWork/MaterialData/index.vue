<template>
  <div>
    <div class="title">素材库明细统计</div>
    <div class="input-view">
      <div class="input-bg">
        <el-input
          placeholder="请输入编号"
          size="medium"
          prefix-icon="el-icon-search"
          v-model="inputValue"
        >
        </el-input>
      </div>
    </div>
    <page-table style="margin-top:16px">
      <template slot="table">
        <el-table :data="listData" class="new-table_border material-table">
          <el-table-column prop="title" label="素材标题" width="476px">
          </el-table-column>
          <el-table-column prop="send" label="已发送人数"> </el-table-column>
          <el-table-column prop="unsend" label="未发送人数"> </el-table-column>
          <el-table-column prop="title" width="125px" label="操作">
            <template>
              <ns-button type="text" class="select-button" @click="showMoreData"
                >查看数据</ns-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </page-table>
    <DataList ref="detaList" />
  </div>
</template>
<script>
import PageTable from '@/components/NewUi/PageTable'
import DataList from './components/DataList'
export default {
  name: 'MaterialData',
  components: { PageTable, DataList },
  data () {
    return {
      inputValue: '',
      listData: [
        {
          title:
            '素材标题素材标题素材标题素材标题素材标题素材标题素材标题素材标题素材',
          send: '90',
          unsend: '100'
        },
        {
          title:
            '素材标题素材标题素材标题素材标题素材标题素材标题素材标题素材标题素材',
          send: '90',
          unsend: '100'
        },
        {
          title:
            '素材标题素材标题素材标题素材标题素材标题素材标题素材标题素材标题素材',
          send: '90',
          unsend: '100'
        },
        {
          title:
            '素材标题素材标题素材标题素材标题素材标题素材标题素材标题素材标题素材',
          send: '90',
          unsend: '100'
        },
        {
          title:
            '素材标题素材标题素材标题素材标题素材标题素材标题素材标题素材标题素材',
          send: '90',
          unsend: '100'
        }
      ]
    }
  },
  methods: {
    showMoreData () {
      this.$refs.detaList.closeDeawer()
    }
  }
}
</script>
<style scoped lang="scss">
@import '@components/NewUi/styles/reset.css';
.title {
  height: 48px;
  background-color: white;
  font-size: 16px;
  color: #262626;
  line-height: 48px;
  font-weight: 500;
  padding-left: 16px;
}
.input-view {
  height: 64px;
  margin-top: 16px;
  background-color: white;
  display: flex;
  align-items: center;
  padding-left: 16px;
  .input-bg {
    width: 240px;
    height: 32px;
    font-size: 14px;
    line-height: 22px;
    font-weight: 400;
  }
}

.material-table {
  font-size: 14px;
  color: #262626;
  line-height: 22px;
  font-weight: 400;
}
.select-button {
  font-size: 14px;
  color: #0094fc;
  font-weight: 400;
}
</style>
