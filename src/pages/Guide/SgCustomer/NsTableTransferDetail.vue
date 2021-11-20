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
    <h3>转移明细</h3>
    <div class="box-card">
      <div class="nav">
        <el-input placeholder="请输入手机号"  suffix-icon="el-icon-search" class="name iconfont"  v-model="input"></el-input>
        <el-input placeholder="请输入会员姓名" suffix-icon="el-icon-search"  class="name  iconfont"  v-model="input"></el-input>
        <el-input placeholder="请输入好友昵称" suffix-icon="el-icon-search" class="name  iconfont" v-model="input"></el-input>
        <div class="drop">
          <el-dropdown>
            <el-button type="primary">
                操作人：全部<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>1</el-dropdown-item>
              <el-dropdown-item>2</el-dropdown-item>
              <el-dropdown-item>3</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <button class="btn">导出文件</button>
        <div class="picker">
          <span>转移时间：</span>
          <el-date-picker class="date"
            v-model="value2"
            type="datetimerange"
            align="right"
            aria-placeholder="转移时间："
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
        <div class="drop1">
          <el-dropdown>
            <el-button type="primary">
                会员转移状态：选择状态<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>1</el-dropdown-item>
              <el-dropdown-item>2</el-dropdown-item>
              <el-dropdown-item>3</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="drop1">
          <el-dropdown>
            <el-button type="primary">
                好友转移状态：选择状态<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>1</el-dropdown-item>
              <el-dropdown-item>2</el-dropdown-item>
              <el-dropdown-item>3</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 会员列表 -->
    <div class="box">
      <span class="b-trandfer">会员信息</span>
      <span class="f-trandfer">好友信息</span>
    </div>
    <el-table :data="tableData" style="width: 100%" border>
        <el-table-column label="会员" width="188x">
            <template slot-scope="scope">
            <div class="img">
              <el-row :gutter="20">
                <div class="gutter">
                  <img :src="scope.row.date" width="50px" height="50px" class="img">
                  <span class="namer">{{scope.row.name}}</span>
                </div>
              </el-row>
            </div>
            </template>
        </el-table-column>
        <el-table-column label="性别" prop="gender" ></el-table-column>
        <el-table-column label="手机号" prop="phone" width="120px"> </el-table-column>
        <el-table-column label="会员卡号" prop="card"> </el-table-column>
        <el-table-column label="原专属导购" prop="original" width="100px"> </el-table-column>
        <el-table-column label="新专属导购" prop="newShopping"  width="100px"> </el-table-column>
        <el-table-column label="会员转移状态" prop="transfer"  width="100px"> </el-table-column>
        <el-table-column label="好友" width="198px">
            <template slot-scope="scope">
              <el-row :gutter="20">
                <div class="gutter">
                  <img :src="scope.row.date1" width="50px" height="50px" >
                  <span class="namer">{{scope.row.namer}}</span>
                </div>
              </el-row>
            </template>
        </el-table-column>
        <el-table-column label="手机号" prop="fPhone" width="120px"> </el-table-column>
        <el-table-column label="原添加人" prop="addPerson" width="100px"> </el-table-column>
        <el-table-column label="新添加人" prop="newPerson" width="100px"> </el-table-column>
        <el-table-column label="好友转移状态" prop="fTransfer" width="100px"> </el-table-column>
        <el-table-column label="备注" prop="remark" width="100px"> </el-table-column>
        <el-table-column label="操作人" prop="operationPerson"> </el-table-column>
        <el-table-column label="转移时间" prop="add_time" width="100px"></el-table-column>
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
import { fill } from 'lodash'
export default {
  data () {
    return {
      input: '',
      tableData: [{
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
      ]
    }
  }
}
</script>

<style scoped>
@import '@components/NewUi/styles/reset.css';
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
  width: 200px;
  margin-right: 16px;
  margin-top: 17px;
  margin-bottom: 16px;
}
.el-icon-search{
  border: none;
}
.picker {
  width: 458px;
  height: 32px;
  display: inline-block;
  margin-right: 17px;
  border:1px solid #D9D9D9;
}
.picker span{
   width: 70x;
   height: 22px;
   display: inline-block;
   margin-left: 12px;
   font-size: 14px;
   color: #595959 ;
   margin-top: 4px;
}
.picker .date{
  width: 370px;
  border: none;
}
.selete {
  margin-right: 17px;
}
.btn {
  width: 86px;
  height: 28px;
  font-size: 14px;
  border:1px solid #D9D9D9  ;
  color: #595959 ;
  background-color: white;
  border-radius: 3px;
  margin-left: 150px;
}
.box .b-trandfer{
  display: inline-block;
  width: 73.7%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  font-weight: 800;
  border-right: 1px solid #D9D9D9;

}
.box .f-trandfer{
  display: inline-block;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  font-weight: 800;
  margin-left: 10px;;
}
.el-row{
  padding: 10px;
}
.el-row  .gutter{
    padding: 13px 2px 13px 16px;
  }
.gutter span{
  display: inline-block;
  width: 88px;
  height: 22px;
  margin-left: 10px;
  }
.drop{
  width: 129px;
  height: 32px;
  border: 1px solid #D9D9D9 ;
  text-align: center;
  line-height: 32px;
  border-radius: 3px;
  display: inline-block;
}
.drop1{
  width: 199px;
  height: 32px;
  border: 1px solid #D9D9D9 ;
  text-align: center;
  line-height: 32px;
  border-radius: 3px;
  display: inline-block;
  margin-right: 17px;
}
</style>
