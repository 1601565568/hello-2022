<template>
  <div>
    <div class="top-title-view">转移明细</div>
    <div class="top-search-view">
      <div class="seach-left-view">
        <div class="no-input-view base-view">
          <el-input
            v-model="input"
            placeholder="请输入素材标题"
            @change="inputClick"
          >
            <Icon
              type="ns-search"
              slot="suffix"
              style="font-size: 30px;"
              @click="inputClick"
            ></Icon>
          </el-input>
        </div>
        <div class="no-input-view base-view">
          <el-input
            v-model="input"
            placeholder="请输入会员姓名"
            @change="inputClick"
          >
            <Icon
              type="ns-search"
              slot="suffix"
              style="font-size: 30px;"
              @click="inputClick"
            ></Icon>
          </el-input>
        </div>
        <div class="no-input-view base-view">
          <el-input
            v-model="input"
            placeholder="请输入好友昵称"
            @change="inputClick"
          >
            <Icon
              type="ns-search"
              slot="suffix"
              style="font-size: 30px;"
              @click="inputClick"
            ></Icon>
          </el-input>
        </div>
        <div class="operation-view base-view">
          <div class="name">操作人：</div>
          <div class="item-select">
            <el-select v-model="actionValue" :default-first-option="true">
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
            <Icon
              type="ns-arrow-drowdown"
              style="color: #8C8C8C;"
            />
          </div>
        </div>
        <div class="date-view base-view">
          <span style="font-size:13px">转移时间：</span>
          <el-date-picker
            v-model="datePickerValue"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="center"
            value-format="yyyy-MM-dd"
            prefix-icon=""
          >
          </el-date-picker>
        </div>
        <div class="operation-view  base-view" style="width:220px">
          <div class="name" style="width:100px">会员转移状态：</div>
          <div class="item-select">
            <el-select v-model="actionValue" :default-first-option="true">
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
            <Icon
              type="ns-arrow-drowdown"
              style="color: #8C8C8C;"
            />
          </div>
        </div>
        <div class="operation-view base-view" style="width:220px">
          <div class="name" style="width:100px">好友转移状态：</div>
          <div class="item-select">
            <el-select v-model="actionValue" :default-first-option="true">
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
            <Icon
              type="ns-arrow-drowdown"
              style="color: #8C8C8C;"
            />
          </div>
        </div>
      </div>
      <div class="output-file">导出文件</div>
    </div>
    <div class="trans-table-view">
      <page-table style="padding-top:0">
        <template slot="table">
          <el-table
            :data="tableData"
            class="new-table_border drawer-table"
            :row-style="{ height: '96px' }"
            :border="false"
            :cell-style="{ borderRight: 'none'}"
          >
            <el-table-column label="会员信息">
              <el-table-column prop="name" label="会员" width="170px">
                <template slot-scope="scope">
                  <div class="user-info">
                    <img :src="scope.row.date" class="header-img">
                    <span>{{scope.row.name}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="gender" label="性别" width="72px"> </el-table-column>
              <el-table-column prop="phone" label="手机号" width="120px">
              </el-table-column>
              <el-table-column prop="card" label="会员卡号"  width="120px">
              </el-table-column>
              <el-table-column prop="original" label="原专属导购" width="290px">
              </el-table-column>
              <el-table-column prop="newShopping" label="新专属导购" width="290px">
              </el-table-column>
              <el-table-column prop="transfer" label="会员转移状态" width="125px">
              </el-table-column>
            </el-table-column>
            <el-table-column label="好友信息">
              <el-table-column prop="namer" label="好友" width="170px">
                <template slot-scope="scope">
                  <div class="user-info">
                    <img :src="scope.row.date" class="header-img">
                    <span>{{scope.row.name}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="fPhone" label="手机号" width="120px">
              </el-table-column>
              <el-table-column prop="addPerson" label="原添加人" width="120px">
              </el-table-column>
              <el-table-column prop="newPerson" label="好友转移状态" width="150px">
              </el-table-column>
              <el-table-column prop="remark" label="备注" width="120px">
              </el-table-column>
              <el-table-column prop="operationPerson" label="操作人" width="120px">
              </el-table-column>
              <el-table-column prop="add_time" label="转移时间" width="160px">
              </el-table-column>
            </el-table-column>
          </el-table>
        </template>
        <template slot="pagination">
          <el-pagination
            background
            class="label-dialog__pagination"
            :page-sizes="paginationToPerson.sizeOpts"
            :total="paginationToPerson.total"
            :current-page.sync="paginationToPerson.page"
            :page-size="paginationToPerson.size"
            layout="total, sizes, prev, pager, next, jumper"
          >
          </el-pagination>
        </template>
      </page-table>
    </div>
  </div>
</template>
<script>
import PageTable from '@/components/NewUi/PageTable'
export default {
  components: {
    PageTable
  },
  data () {
    return {
      input: '',
      tableData: [
        {
          date: require('@/assets/baguser.png'),
          name: '小樱',
          gender: '女',
          phone: '18566677789',
          card: '会员卡号',
          original: '原专属门店',
          newShopping: '新专属门店',
          transfer: '转移状态',
          date1: require('@/assets/baguser.png'),
          namer: '好友昵称',
          fPhone: '18566677789',
          addPerson: '原员工姓名',
          newPerson: '新员工姓名',
          fTransfer: '接替状态',
          remark: '可显示接替失败原因',
          operationPerson: 'admin',
          add_time: '2021-05-23 12:23:44'
        },
        {
          date: require('@/assets/baguser.png'),
          name: '小樱',
          gender: '女',
          phone: '18566677789',
          card: '会员卡号',
          original: '原专属门店',
          newShopping: '新专属门店',
          transfer: '转移状态',
          date1: require('@/assets/baguser.png'),
          namer: '好友昵称',
          fPhone: '18566677789',
          addPerson: '原员工姓名',
          newPerson: '新员工姓名',
          fTransfer: '接替状态',
          remark: '可显示接替失败原因',
          operationPerson: 'admin',
          add_time: '2021-05-23 12:23:44'
        },
        {
          date: require('@/assets/baguser.png'),
          name: '小樱',
          gender: '女',
          phone: '18566677789',
          card: '会员卡号',
          original: '原专属门店',
          newShopping: '新专属门店',
          transfer: '转移状态',
          date1: require('@/assets/baguser.png'),
          namer: '好友昵称',
          fPhone: '18566677789',
          addPerson: '原员工姓名',
          newPerson: '新员工姓名',
          fTransfer: '接替状态',
          remark: '可显示接替失败原因',
          operationPerson: 'admin',
          add_time: '2021-05-23 12:23:44'
        }
      ],
      options: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 14,
          label: '下载'
        },
        {
          value: 16,
          label: '发送'
        },
        {
          value: 18,
          label: '补全'
        }
      ],
      datePickerValue: '',
      actionValue: 0,
      paginationToPerson: {
        size: 10,
        sizeOpts: [5, 10, 15],
        page: 1,
        total: 0
      }
    }
  },
  methods: {
    inputClick () {}
  }
}
</script>

<style scoped lang="scss">
@import '@components/NewUi/styles/reset.css';
@import './styles/index.css';
.drawer-table {
  padding: 0;
  font-size: 14px;
  font-weight: 400;
  border: none;
  .user-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    .header-img {
      width: 50px;
      height: 50px;
      margin-right: 20px;
    }
  }
}
.top-title-view {
  background-color: white;
  width: 100%;
  font-size: 16px;
  color: #262626;
  line-height: 24px;
  font-weight: 500;
  padding: 8px 16px;
  margin-bottom: 16px;
}
.top-search-view {
  width: 100%;
  background: white;
  border-radius: 4px;
  padding: 16px 16px 0 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  .seach-left-view {
    width: 80%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .output-file {
    background: #ffffff;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    text-align: center;
    font-size: 14px;
    color: #595959;
    cursor: pointer;
    width: 116px;
    height: 32px;
    line-height: 30px;
  }
  .base-view {
    margin-right: 16px;
    margin-bottom: 16px;
  }
  .operation-view {
    width: 163px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    display: flex;
    flex-direction: row;
    font-size: 14px;
    align-items: center;
    .name {
      width: 70px;
      margin-left: 8px;
    }
  }
  .trans-menmber {
    width: 200px;
  }
}
.icon-view {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.date-view {
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  padding: 0px 12px;
}

.el-icon-search {
  border: none;
}
.trans-table-view {
  margin-top: 16px;
  background-color: white;
}
</style>
