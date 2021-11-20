<template>
  <div>
    <!-- 导航区域 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>用户中心</el-breadcrumb-item>
            <el-breadcrumb-item>会员管理</el-breadcrumb-item>
            <el-breadcrumb-item>会员列表</el-breadcrumb-item>
            <el-breadcrumb-item>转移明细</el-breadcrumb-item>
        </el-breadcrumb> -->
    <!-- 卡片视图 -->
    <h1>转移明细</h1>
    <div class="box-card">
      <div class="nav">
        <el-input
          placeholder="请输入手机号"
          suffix-icon="el-icon-search"
          class="name"
        ></el-input>
        <el-input
          placeholder="请输入会员姓名"
          suffix-icon="el-icon-search"
          class="name"
        ></el-input>
        <el-input
          placeholder="请输入好友昵称"
          suffix-icon="el-icon-search"
          class="name"
        ></el-input>
        <el-select v-model="select" slot="prepend" placeholder="操作人：全部">
          <el-option label="1" value="1"></el-option>
        </el-select>
        <el-time-picker
          class="picker"
          is-range
          v-model="value1"
          range-separator="——"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
          >转移时间</el-time-picker
        >
        <el-select
          class="selete"
          v-model="select"
          slot="prepend"
          placeholder="会员转移状态：选择状态"
        >
          <el-option label="1" value="1"></el-option>
        </el-select>
        <el-select
          class="selete"
          v-model="select"
          slot="prepend"
          placeholder="好友转移状态：选择状态"
        >
          <el-option label="1" value="1"></el-option>
        </el-select>
      </div>
    </div>
    <div class="box">
      <span class="b-trandfer">会员信息</span>
      <span class="f-trandfer">好友信息</span>
    </div>
    <el-table :data="tableData" style="width: 100%" border>
        <el-table-column label="会员" width="120px">
            <template slot-scope="scope">
                <span class="title">{{ fit }}</span>
                <el-avatar shape="square" :size="100" :fit="fit" :src="scope.data"></el-avatar>
                <span>{{scope.data}}</span>
            </template>
        </el-table-column>
        <el-table-column label="性别" prop="gender" ></el-table-column>
        <el-table-column label="手机号" prop="phone" width="120px"> </el-table-column>
        <el-table-column label="会员卡号" prop="card"> </el-table-column>
        <el-table-column label="原专属导购" prop="original" width="100px"> </el-table-column>
        <el-table-column label="新专属导购" prop="newShopping"  width="100px"> </el-table-column>
        <el-table-column label="会员转移状态" prop="transfer"  width="100px"> </el-table-column>
        <el-table-column label="好友" prop="friend" width="120px">
            <template slot-scope="scope" >
                <span class="title">{{ fit }}</span>
                <el-avatar shape="square" :size="100" :fit="fit" :src="scope.data"></el-avatar>
                <span >{{scope.data}}</span>
            </template>
        </el-table-column>
        <el-table-column label="手机号" prop="fPhone" width="120px"> </el-table-column>
        <el-table-column label="原添加人" prop="addPerson" width="100px"> </el-table-column>
        <el-table-column label="新添加人" prop="newPerson" width="100px"> </el-table-column>
        <el-table-column label="好友转移状态" prop="fTransfer" width="100px"> </el-table-column>
        <el-table-column label="备注" prop="remark" width="100px"> </el-table-column>
        <el-table-column label="操作人" prop="operationPerson"> </el-table-column>
        <el-table-column label="转移时间" props="add_time" width="100px">
           <template slot-scope="scope">{{scope.row.add_time|dateFormat}}</template>
        </el-table-column>
    </el-table>
    <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
  </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableData: [
        { gender: '女',
          phone: '18566677789',
          card: '会员卡号',
          original: '原专属门店',
          newShopping: '新专属门店',
          transfer: '转移状态',
          fPhone: '18566677789',
          addPerson: '原员工姓名',
          newPerson: '新员工姓名',
          fTransfer: '接替状态',
          remark: '可显示接替失败原因',
          operationPerson: 'admin'
        },
        { gender: '女',
          phone: '18566677789',
          card: '会员卡号',
          original: '原专属门店',
          newShopping: '新专属门店',
          transfer: '转移状态',
          fPhone: '18566677789',
          addPerson: '原员工姓名',
          newPerson: '新员工姓名',
          fTransfer: '接替状态',
          remark: '可显示接替失败原因',
          operationPerson: 'admin'
        },
        { gender: '女',
          phone: '18566677789',
          card: '会员卡号',
          original: '原专属门店',
          newShopping: '新专属门店',
          transfer: '转移状态',
          fPhone: '18566677789',
          addPerson: '原员工姓名',
          newPerson: '新员工姓名',
          fTransfer: '接替状态',
          remark: '可显示接替失败原因',
          operationPerson: 'admin'
        }
      ]
    }
  }
}
</script>

<style scoped>
.nav {
  margin-left: 16px;
}
.box-card {
  width: 100%;
  height: 113px;
  background: #ffffff;
  border-radius: 4px;
}

.box-card .name {
  width: 240px;
  height: 32px;
  margin-right: 16px;
  margin-top: 17px;
  margin-bottom: 16px;
}
.picker {
  margin-right: 17px;
}
.selete {
  margin-right: 17px;
}
.btn {
  width: 116px;
  height: 32px;
}
.box .b-trandfer{
  display: inline-block;
  width: 50%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  font-weight: 800;

}
.box .f-trandfer{
  display: inline-block;
  width: 50%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  font-weight: 800;
}
</style>
