<template>
  <div>
    <div class="select-view">
      <div class="item-down">
        <div class="name">企微群:</div>
        <div class="item-select">
          <el-select v-model="actionValue" :default-first-option='true' @visible-change="selectOptionClick">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="icon-view">
          <Icon type="ns-arrow-drowdown" :class="{ 'arrowTransform': !flag, 'arrowTransformReturn': flag}" style="color: #8C8C8C;"/>
        </div>
      </div>
    </div>
    <div class="data-view">
      <page-table style="padding-top:0">
        <template slot="table">
          <el-table
            :data="listData"
            class="new-table_border drawer-table"
            :row-style="{ height: '96px' }"
          >
            <el-table-column prop="img" label="头像">
              <template slot-scope="scope">
                <img :src="scope.row.img"  width="50" height="50"/>
              </template>
            </el-table-column>
            <el-table-column prop="nick" label="昵称" > </el-table-column>
            <el-table-column prop="sex" label="性别" > </el-table-column>
            <el-table-column prop="group" label="所属群" > </el-table-column>
            <el-table-column prop="time" label="首次入群时间"> </el-table-column>
            <el-table-column prop="dowm" label="操作">
              <template>
                <ns-button type="text" class="select-button" @click="showMoreData">详情</ns-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template slot="pagination">
          <el-pagination
            class="label-dialog__pagination"
            :page-sizes="pagination.sizeOpts"
            :total="pagination.total"
            :current-page.sync="pagination.page"
            :page-size="pagination.size"
            layout="total, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </template>
      </page-table>
    </div>
    <DataList ref="datalist"/>
  </div>
</template>

<script>
import PageTable from '@/components/NewUi/PageTable'
import DataList from './components/DataList'
export default {
  name: 'GroupRepeat',
  components: {
    PageTable,
    DataList
  },
  data () {
    return {
      listData: [
        {
          img:
            'https://th.bing.com/th/id/Rd32269e86c0a421ab6ec323f856329aa?rik=2wms6PzgczYcHA&riu=http%3a%2f%2fpicture.ik123.com%2fuploads%2fallimg%2f141127%2f12-14112G64421.jpg&ehk=KCOzMdmbdCLtKnNxKvcLZCKXq5BKtX4jx5ure2%2fZV7c%3d&risl=&pid=ImgRaw',
          nick: '普通红包',
          sex: '女',
          group: '这是一个群名称',
          time: '2021-03-31 13:54:19'
        },
        {
          img:
            'https://th.bing.com/th/id/Rd32269e86c0a421ab6ec323f856329aa?rik=2wms6PzgczYcHA&riu=http%3a%2f%2fpicture.ik123.com%2fuploads%2fallimg%2f141127%2f12-14112G64421.jpg&ehk=KCOzMdmbdCLtKnNxKvcLZCKXq5BKtX4jx5ure2%2fZV7c%3d&risl=&pid=ImgRaw',
          nick: '普通红包',
          sex: '女',
          group: '这是一个群名称',
          time: '2021-03-31 13:54:19'
        },
        {
          img:
            'https://th.bing.com/th/id/Rd32269e86c0a421ab6ec323f856329aa?rik=2wms6PzgczYcHA&riu=http%3a%2f%2fpicture.ik123.com%2fuploads%2fallimg%2f141127%2f12-14112G64421.jpg&ehk=KCOzMdmbdCLtKnNxKvcLZCKXq5BKtX4jx5ure2%2fZV7c%3d&risl=&pid=ImgRaw',
          nick: '普通红包',
          sex: '女',
          group: '这是一个群名称',
          time: '2021-03-31 13:54:19'
        },
        {
          img:
            'https://th.bing.com/th/id/Rd32269e86c0a421ab6ec323f856329aa?rik=2wms6PzgczYcHA&riu=http%3a%2f%2fpicture.ik123.com%2fuploads%2fallimg%2f141127%2f12-14112G64421.jpg&ehk=KCOzMdmbdCLtKnNxKvcLZCKXq5BKtX4jx5ure2%2fZV7c%3d&risl=&pid=ImgRaw',
          nick: '普通红包',
          sex: '女',
          group: '这是一个群名称',
          time: '2021-03-31 13:54:19'
        }
      ],
      options: [
        {
          value: '选项1',
          label: '全部动作'
        },
        {
          value: '选项2',
          label: '下载'
        },
        {
          value: '选项3',
          label: '发送'
        }
      ],
      actionValue: '全部动作',
      // 分页配置
      pagination: {
        size: 10,
        sizeOpts: [10],
        page: 1,
        total: 4
      },
      flag: false
    }
  },
  methods: {
    handleCurrentChange () {},
    handleSizeChange () {},
    showMoreData () {
      this.$refs.datalist.openDeawer()
    },
    selectOptionClick (val) {
      this.flag = val
    }
  }
}
</script>

<style scoped>
@import '@components/NewUi/styles/reset.css';
@import './styles/index.css';
.container {
  background-color: white;
}
.data-view {
  background-color: white;
  border-radius: 4px;
}
.select-button {
  font-size: 14px;
  color: #0094fc;
  font-weight: 400;
}
.select-view{
  height: 64px;
  background-color: white;
  margin-bottom: 16px;
  margin-top: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}
.item-down {
  width: 171px;
  height: 32px;
  background: #FFFFFF;
  border: 1px solid #D9D9D9;
  border-radius: 2px;
  display: flex;
  flex-direction: row;
  font-size: 14px;
  align-items: center;
  margin-left: 16px;
  cursor: pointer;
  .name {
    width: 70px;
    margin-left:8px;
  }
  .icon-view {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
}
.drawer-table {
  padding: 0;
  font-size: 14px;
  font-weight: 400;
}
.arrowTransform{
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(0deg);
}
.arrowTransformReturn{
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(180deg);
}

</style>
