<template>
  <div>
    <!-- <template v-if="textButton">
      <NsButton type="text" @click="onDialogOpen()"><Icon type="plus"/>{{btnTitle}}</NsButton>
    </template>
    <template v-else>
      <NsButton type="primary" @click="onDialogOpen" class="margin-lr-small"><i class="bui-select-employee"></i>{{btnTitle}}</NsButton>
    </template> -->
    <el-dialog :title="dialogTitle" :visible.sync="visible" :show-scroll-x="false" class="g-wrapper"
               :close-on-click-modal = "false" :before-close="onDialogClose" width="960px">
      <div>
        <div v-show="!onlyOne" style="width: 220px; margin-bottom: 10px">
          <el-tabs v-model="tabType" @tab-click="changeTab">
            <el-tab-pane label="客户分群" name="group"></el-tab-pane>
            <el-tab-pane label="员工全部好友" name="employee"></el-tab-pane>
          </el-tabs>
        </div>
        <el-form label-width="70px" :inline="true">
          <el-form-item v-show="tabType === 'group'">
            <el-form-item label="选择视角：">
              <el-form-grid>
                <el-select
                  filterable
                  :clearable='true'
                  v-model='model.viewId'
                  placeholder='请选择视角'
                  @change='chooseView'
                >
                  <el-option
                    v-for='item in viewOptions'
                    :key='item.viewId'
                    :label='item.viewName'
                    :value='item.viewId'
                  >
                  </el-option>
                </el-select>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="选择分类：">
              <el-form-grid>
                <ns-droptree ref="groupClassTree" :defaultExpandAll='true' :lazy="true" :load="loadNode4Group" :multiple="false" v-model="groupData.selectedGroup" clearable></ns-droptree>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="分群名称：">
              <el-form-grid>
                <ElInput :maxlength="20" v-model="groupData.name"/>
              </el-form-grid>
            </el-form-item>
            <el-form-item style="margin-right: 0">
              <el-form-grid>
                <ns-button type="primary" @click="searchData">{{$t('operating.search')}}</ns-button>
                <ns-button @click="resetSearch">{{$t('operating.reset')}}</ns-button>
                <ns-button @click="onSelectAllData">{{isCheckAll ? '取消全选' : '全选'}}</ns-button>
              </el-form-grid>
            </el-form-item>
          </el-form-item>
          <el-form-item v-show="tabType === 'employee'">
            <template v-if="cloudPlatformType === 'ecrp'">
              <el-form-item label="工作门店：">
                <el-form-grid size="md">
                  <ns-droptree v-if='isLoadShopAreaTree' ref="shopAreaTree" placeholder="请选择区域" :lazy="true" :data="shopAreaData" :load="loadShopAreaNode" :filter-lazy-nodes="filterShopArea" v-model="model.shopArea" clearable :defaultExpandAll='true'></ns-droptree>
                </el-form-grid>
                <el-form-grid size="md" style="margin-left:10px">
                  <el-select-load v-model="model.shopId" :options="shopOptions" filterable clearable :page-sizes="20" placeholder="选择门店">
                  </el-select-load>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="选择部门：">
                <el-form-grid size="md">
                  <ns-droptree ref="employeeDepartTree" :defaultExpandAll='true' :lazy="true" :data="deptData" :filter-lazy-nodes="filterDept" :load="loadNode" v-model="model.selectedDepart" clearable></ns-droptree>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="员工类型：">
                <el-form-grid>
                  <el-select v-model="model.employeeType">
                    <el-option label="不限" value="">
                    </el-option>
                    <el-option label="导购" value="2">
                    </el-option>
                    <el-option label="店长" value="3">
                    </el-option>
                  </el-select>
                </el-form-grid>
              </el-form-item>
            </template>
            <el-form-item label="手机号：">
              <el-form-grid size="md">
                <el-input :maxlength="11" v-model="model.mobile"></el-input>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="员工姓名：">
              <el-form-grid size="md">
                <ElInput :maxlength="20" v-model="model.name"/>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="微信昵称：" v-show="showWechatNick">
              <el-form-grid size="md">
                <ElInput :maxlength="20" v-model="model.wechatNick"/>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="微信号：" v-show="showWechatNo">
              <el-form-grid size="md">
                <ElInput :maxlength="20" v-model="model.wechatNo"/>
              </el-form-grid>
            </el-form-item>
            <el-form-item style="margin-right: 0">
              <el-form-grid>
                <ns-button type="primary" @click="searchData">{{$t('operating.search')}}</ns-button>
                <ns-button @click="resetSearch">{{$t('operating.reset')}}</ns-button>
                <ns-button @click="onSelectAllData">{{isCheckAll ? '取消全选' : '全选'}}</ns-button>
              </el-form-grid>
            </el-form-item>
          </el-form-item>
        </el-form>
        <el-row class="tmp-choose__condition" :gutter="24" v-show="tabType === 'group'">
          <el-col :span="12">
            <ElTable v-loading="tableLoading" stripe ref="groupTable" :data="employeeData" height="260" @select="selectChange" @select-all="selectAllChange">
              <ElTableColumn type="selection" width="55" />
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="subdivisionName" label="分群名称" align="left"/>
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="className" label="所属分类" align="left"/>
            </ElTable>
            <el-pagination v-if="_data.pagination4Emp.enable" class="template-table__pagination"
                           :page-sizes="_data.pagination4Emp.sizeOpts" :total="_data.pagination4Emp.total"
                           :current-page="_data.pagination4Emp.page" :page-size="_data.pagination4Emp.size"
                           :layout="true? 'total, sizes, prev, pager, next':'total'" @size-change="$sizeChange$"
                           @current-change="changePage">
            </el-pagination>
          </el-col>
          <el-col :span="12" class="tmp-choose__result">
            <ElTable v-if="tabType === 'group'" :data="selectedData" height="260">
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="subdivisionName" label="已选分群" align="left"/>
              <ElTableColumn  prop="select" align="center" width="55" v-if="!disabled">
                <template slot-scope="scope">
                  <ns-button
                    type="text"
                    size="mini"
                    @click="() => removeEmp(scope)">
                    <Icon type="delete" className="code-delete"/>
                  </ns-button>
                </template>
              </ElTableColumn>
            </ElTable>
          </el-col>
        </el-row>
        <el-row class="tmp-choose__condition" :gutter="24" v-show="tabType === 'employee'">
          <el-col :span="12">
            <ElTable v-loading="tableLoading" ref="employeeTable" stripe :data="employeeData" height="260" @select="selectChange" @select-all="selectAllChange">
              <ElTableColumn type="selection" width="55" />
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="name" label="员工姓名" align="left"/>
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="departName" label="所属部门" align="left"/>
            </ElTable>
            <el-pagination v-if="_data.pagination4Emp.enable" class="template-table__pagination"
                           :page-sizes="_data.pagination4Emp.sizeOpts" :total="_data.pagination4Emp.total"
                           :current-page="_data.pagination4Emp.page" :page-size="_data.pagination4Emp.size"
                           :layout="true? 'total, sizes, prev, pager, next':'total'" @size-change="$sizeChange$"
                           @current-change="changePage">
            </el-pagination>
          </el-col>
          <el-col :span="12">
            <!--<div v-infinite-scroll="loadSelectedDataF">
              <ElTable :data="loadSelectedData" height="260">
                <ElTableColumn :show-overflow-tooltip="true" type="default" prop="name" label="已选员工" align="left"/>
                <ElTableColumn  prop="select" align="center" width="55" >
                  <template slot-scope="scope">
                    <ns-button
                      type="text"
                      size="mini"
                      @click="() => removeEmp(scope)">
                      <Icon type="delete" className="code-delete"/>
                    </ns-button>
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>-->
            <div class="tmp-choose__result" >
              <p class="title">已选择了<span class="text-danger padding-lr-base">{{selectedData.length}}</span>个员工</p>
              <div v-if="loadSelectedData.length>0">
                <el-scrollbar style="margin-top: 5px; height: 220px">
                  <ul class="tmp-choose__goods" v-infinite-scroll="loadSelectedDataF">
                    <li v-for="(item,index) in loadSelectedData" :key="index">
                      <span class="g-name">{{item.name}}</span>
                      <a v-if="!disabled" @click="() => removeEmp({'$index': index, 'row': item})" class="delete-icon">
                        <Icon type="delete" className="g-delete"/></a>
                    </li>
                  </ul>
                </el-scrollbar>
              </div>
              <ns-no-data height="220" v-else>请从左侧员工列表中选择</ns-no-data>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onDialogClose()">{{$t('operating.cancel')}}</ns-button>
        <ns-save v-if="!disabled" @loading="tableLoading" @click="onSave()">{{disabled}}</ns-save>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//  使用方式：
//  <NsEmployeeOrCustGroupDialog onlyOne="employee" btnTitle="+选择营销人群" v-model="employeeSelectData"></NsEmployeeOrCustGroupDialog>
//  配置参数：
// onlyOne：配置只使用一种选择类型，可配置employee（员工个人号）或group（客户分群）;
//  不配置则默认两种情况可选
//  btnTitle：配置按钮文本
//  dialogTitle：配置弹框标题
//  v-model：接收值设置v-model="employeeSelectData"
//  employeeSelectData格式为
//  {
//    data: [],//选中的值，对象值根据类型为{employeeId:'',...}或{id:'',...}
//      type: 'employee'//如果设置了onlyOne，则该值要对应上
//  }
// employeeProps 配置选择个号返回属性，要与组件数据的属性对应上如 employeeId: 'employeeId'
// groupProps    配置选择分群返回属性，要与组件数据的属性对应上如 id: 'id'
// queryType 查询类型 为空=查所有  1= 只查个人号  2=只查企业号

import NsDroptree from '../NsDroptree'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { clone } from 'lodash'
import ElSelectLoad from '@nascent/nui/lib/select-load'
import InfiniteScroll from '@nascent/nui/lib/infinite-scroll'
import { mapState } from 'vuex'

let vm
const LOADPAGESIZE = 50
export default {
  name: 'NsEmployeeOrCustGroupDialog',
  mixins: [tableMixin],
  components: {
    NsDroptree,
    ElSelectLoad
  },
  directives: {
    InfiniteScroll
  },
  props: {
    value: {
      type: Object,
      default: function () {
        return {
          data: [],
          type: 'group'
        }
      }
    },
    // 判断是否需要门店回显
    echoStore: {
      default: function () {
        return false
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 配置选择员工返回属性,属性名不可更改，属性值可配置为需要设置的值
    employeeProps: {
      type: Object,
      default: function () {
        return {
          employeeID: 'employeeID'
        }
      }
    },
    // 配置选择分群返回属性,属性名不可更改，属性值可配置为需要设置的值
    groupProps: {
      type: Object,
      default: function () {
        return {
          id: 'id'
        }
      }
    },
    dialogTitle: {
      type: String,
      default: '选择营销人群'
    },
    btnTitle: {
      type: String,
      default: '+选择营销人群'
    },
    onlyOne: {
      type: String,
      default: ''
    },
    // 查询类型 为空=查所有  1= 只查个人号  2=只查企业号
    queryType: {
      type: Number
    },
    textButton: {
      type: Boolean,
      default: true
    },
    // 是否展示微信昵称条件
    showWechatNick: {
      type: Boolean,
      default: false
    },
    // 是否需要和右上角区域联动
    isNeedLink: {
      type: Boolean,
      default: false
    },
    showWechatNo: {
      type: Boolean,
      default: false
    },
    // 是否需要返回客户分组名称，好友营销新建中用到
    needGroupName: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      // 环境判断
      cloudPlatformType: this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType,
      // 员工和分群的所有数据
      allEmpData: {
        data: [],
        query: false
      },
      allGroupData: {
        data: [],
        query: false
      },
      // 全部数据
      allEmployeeData: [],
      // 左边树数据（分页后的数据）
      employeeData: [],
      // 匹配的数据
      matchEmployeeData: [],
      // 勾选的数据
      selectedData: [],
      selectCopyData: [],
      // 确认选择的数据
      // confirmData: this.value || [],
      groupName: '',
      visible: false,
      tableLoading: false,
      // 部门树相关及 选择
      departData: {
        departmentTree: [],
        allDepartments: []
      },
      model: {
        selectedDepart: {
          value: '',
          text: ''
        },
        wechatNick: '',
        wechatNo: '',
        mobile: '',
        name: '', // 搜索的员工名称
        shopArea: {}, // 选择的门店分类
        shopId: '', // 选择的门店
        employeeType: '', // 选择的员工类型
        viewId: '' // 选择的视角
      },
      groupData: {
        groupTree: [],
        allGroup: [],
        selectedGroup: {
          value: '',
          text: ''
        },
        name: ''// 搜索的分群名称
      },
      tabType: this.onlyOne || this.value.type,
      recordId: (this.onlyOne || this.value.type) === 'employee' ? 'employeeID' : 'id',
      recordName: (this.onlyOne || this.value.type) === 'employee' ? 'name' : 'subdivisionName',
      objProps: (this.onlyOne || this.value.type) === 'employee' ? 'employeeProps' : 'groupProps',
      pagination4Emp: {
        enable: true,
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      // 门店区域树
      shopAreaTree: [],
      // 门店选择option
      shopOptions: [],
      allShopOptions: [],
      initEmployeeDataFlag: false,
      initGroupDataFlag: false,
      isCheckAll: false,
      loadSelectedData: [],
      shopAreaData: [],
      deptData: [],
      viewOptions: [], // 视角列表
      isLoadShopAreaTree: false // 判断区域树是否请求完成
    }
  },
  computed: mapState({
    area: state => state.user.area
  }),
  watch: {
    tabType: function (val) {
      if (val && val === 'employee') {
        vm.recordId = 'employeeID'
        vm.recordName = 'name'
        vm.objProps = 'employeeProps'
      } else if (val && val === 'group') {
        vm.recordId = 'id'
        vm.recordName = 'subdivisionName'
        vm.objProps = 'groupProps'
      }
    },
    'model.shopArea': function (o1, o2) {
      const shopOptions = []
      if (!o1.value || o1.value !== o2.value) {
        let areaIdStr = '/' + o1.value + '/'
        this.allShopOptions.map(item => {
          if (!o1.value || (item.ext && item.ext.indexOf(areaIdStr) !== -1)) {
            this.model.shopId = ''
            shopOptions.push(item)
          }
        })
        this.shopOptions = shopOptions
      }
    },
    selectedData: function () {
      if (this.selectedData.length === 0) {
        this.loadSelectedData = []
      } else {
        const start = 0
        const end = this.selectedData.length > LOADPAGESIZE ? LOADPAGESIZE : this.selectedData.length
        this.loadSelectedData = this.selectedData.slice(start, end)
      }
    }
  },
  methods: {
    getViewList () {
      const areaId = this.$store.state.user.area.id
      // 根据选择区域查询视角列表
      this.$http.fetch(this.$api.core.common.findViewListByAreaId, { areaId })
        .then(res => {
          if (res.success) {
            if (res.result && res.result.length) {
              this.viewOptions = res.result
              this.model.viewId = res.result[0].viewId
            }
          } else {
            this.$notify.error(res.msg)
          }
        }).catch(res => {
          this.$notify.error('视角列表查询失败')
        })
    },
    chooseView (viewId) {
      this.getGroupList()
    },
    loadSelectedDataF () {
      if (this.selectedData.length > LOADPAGESIZE) {
        const start = this.loadSelectedData.length
        const end = start + LOADPAGESIZE > this.selectedData.length ? this.selectedData.length : start + LOADPAGESIZE
        this.loadSelectedData = this.loadSelectedData.concat(this.selectedData.slice(start, end))
      }
    },
    isAllSelect () {
      if (vm.value && vm.value.data && vm.value.data.length > 0 && vm.matchEmployeeData.length > 0 && vm.matchEmployeeData.length === vm.value.data.length) {
        vm.isCheckAll = true
      } else {
        vm.isCheckAll = false
      }
    },
    // 切换tab
    changeTab (tab) {
      vm.tabType = tab.name
      vm.$nextTick(function () {
        vm.getData(tab.name, 'tabChange ')
      })
    },
    // 懒加载部门树
    loadNode (node, resolve) {
      const allDepar = this.departData.departmentTree
      if (node.level === 0) { // 第一次调用
        return resolve([{ id: 0, parentId: -1, code: 0, label: '全部', checked: false, showAdd: true, showEdit: true, showDelete: true }])
      }
      if (node.level >= 1) {
        // 点击之后触发
        const filter = allDepar.filter(data => {
          return parseInt(data.parentId) === parseInt(node.data.id)
        })
        if (filter && filter.length > 0) {
          resolve(filter)
        } else {
          resolve([])
        }
      }
    },
    // 懒加载门店区域树
    loadShopAreaNode (node, resolve) {
      const shopAreaTree = this.shopAreaTree
      if (node.level === 0) { // 第一次调用
        return resolve(this.getRootTree(this.shopAreaTree, this.isNeedLink ? this.$store.state.user.area.id : null))
      }
      if (node.level >= 1) {
        // 点击之后触发
        const filter = shopAreaTree.filter(data => {
          return parseInt(data.parentId) === parseInt(node.data.id)
        })
        if (filter && filter.length > 0) {
          resolve(filter)
        } else {
          resolve([])
        }
      }
    },
    getRootTree (shopAreaTree, areaId = null) {
      const rootTree = []
      for (let item of shopAreaTree) {
        let parentId = item.parentId // 每一项的父级id
        let flag = false
        for (let item of shopAreaTree) {
          if (parentId === item.id) {
            flag = true
            break
          }
        }
        if (!flag && !areaId) {
          rootTree.push(item)
        } else if (areaId && item.id === areaId) {
          rootTree.push(item)
        }
      }
      return rootTree
    },
    filterShopArea (val) {
      if (val) {
        const nodes = this.shopAreaTree.filter(item => {
          if (item.label) {
            return item.label.indexOf(val) !== -1
          }
        })
        this.shopAreaData = nodes
      } else {
        this.shopAreaData = this.getRootTree(this.shopAreaTree)
      }
    },
    filterDept (val) {
      if (val) {
        const nodes = this.departData.departmentTree.filter(item => {
          if (item.label) {
            return item.label.indexOf(val) !== -1
          }
        })
        this.deptData = nodes
      } else {
        this.deptData = [{
          id: 0,
          parentId: -1,
          code: 0,
          label: '全部'
        }]
      }
    },
    /**
     * 获取门店区域，所有门店选项
     */
    getShopAreaAndShop: function () {
      // 设置选中
      const that = this
      that.$http.fetch(that.$api.marketing.weworkMarketing.queryEmployeeTreeAndOption4Component)
        .then((resp) => {
          that.shopAreaTree = resp.result.shopAreaTree
          that.allShopOptions = resp.result.shopOptions
          that.shopOptions = resp.result.shopOptions
          this.isLoadShopAreaTree = true
        }).catch(() => {
          that.$notify.error('加载下拉树、下拉框数据失败')
        })
        // this.reload()
    },
    /**
     * 获取部门树
     */
    getDepartmentTree () {
      const that = this
      that.$http.fetch(that.$api.marketing.weworkMarketing.queryDepartmentTreeByYun)
        .then((resp) => {
          that.departData.departmentTree = resp.result
          that.departData.allDepartments = resp.result
        }).catch(() => {
          vm.$notify.error('查询部门树失败')
        })
    },
    /**
     * 获取分群树
     */
    getGroupTree () {
      this.$http.fetch(this.$api.marketing.weworkMarketing.getSubdivisionList, { viewId: this.model.viewId })
        .then(resp => {
          vm.groupData.groupTree = vm.handleGroupList(clone(resp.result), 'onlyCatalog')
          vm.groupData.allGroup = vm.handleGroupList(clone(resp.result), 'onlyCatalog')
        }).catch(() => {
          vm.$notify.error('查询客户分群树失败')
        }).finally(() => {
          // do nothing
        })
    },
    // 懒加载分群类树
    loadNode4Group (node, resolve) {
      const allDepar = this.groupData.groupTree
      if (node.level === 0) { // 第一次调用
        return resolve([{ id: 0, parentId: -1, code: 0, label: '全部', checked: false, showAdd: true, showEdit: true, showDelete: true }])
      }
      if (node.level >= 1) {
        // 点击之后触发
        const filter = allDepar.filter(data => {
          return parseInt(data.parentId) === parseInt(node.data.id)
        })
        if (filter && filter.length > 0) {
          const resultData = []
          filter.forEach(data => {
            const data2 = {
              id: data.id, parentId: data.parentId, code: data.id, label: data.subdivisionName, checked: false, showAdd: true, showEdit: true, showDelete: true
            }
            resultData.push(data2)
          })
          resolve(resultData)
        } else {
          resolve([])
        }
      }
    },
    // 全选按钮
    onSelectAllData () {
      vm.selectedData = []
      const selectedData2 = []
      if (vm.isCheckAll) {
        vm.$refs[vm.tabType + 'Table'].clearSelection()
      } else {
        for (const item of vm.employeeData) {
          vm.$refs[vm.tabType + 'Table'].toggleRowSelection(item, true)
        }
        for (const item2 of vm.matchEmployeeData) {
          // const obj = {}
          // obj[vm.recordId] = item2[vm.recordId]
          // obj[vm.recordName] = item2[vm.recordName]
          selectedData2.push(clone(item2))
        }
      }
      vm.selectedData = selectedData2
      vm.isCheckAll = !vm.isCheckAll
    },
    // 重置搜索
    resetSearch: function () {
      if (vm.tabType === 'group') {
        vm.groupData.name = ''
        vm.groupData.selectedGroup.value = ''
        vm.groupData.selectedGroup.text = ''
        vm.$refs.groupClassTree.cleanClickHandle()
        vm.searchGroup()
      } else {
        vm.model.name = ''
        vm.model.selectedDepart.value = ''
        vm.model.selectedDepart.text = ''
        vm.model.shopArea = {} // 选择的区域分类
        vm.model.mobile = ''
        vm.model.shopId = '' // 选择的门店
        vm.model.employeeType = '' // 选择的员工类型
        vm.model.wechatNick = '' // 选择的员工类型
        vm.model.wechatNo = '' // 选择的员工类型
        vm.$refs.employeeDepartTree.cleanClickHandle()
        vm.$refs.shopAreaTree.cleanClickHandle()
        vm.searchEmployee()
      }
    },
    searchData () {
      if (vm.tabType === 'group') {
        vm.searchGroup()
      } else {
        vm.searchEmployee()
      }
    },
    // 搜索用户
    searchEmployee: function () {
      vm.tableLoading = true
      const data = vm.allEmployeeData.filter(vm.filterEmployeeTableData)
      vm.setData4Search((data || []), 'name')
      vm.tableLoading = false
    },
    /**
     *  过滤表格数据
     */
    filterEmployeeTableData: function (data) {
      const searchMap = vm.model
      let flag = true
      if (searchMap.name) {
        flag = flag && (data.name.indexOf(searchMap.name) !== -1)
      }
      if (searchMap.wechatNick) {
        flag = flag && (data.wechatNick.indexOf(searchMap.wechatNick) !== -1)
      }
      if (searchMap.wechatNo) {
        flag = flag && (data.wechatNum.indexOf(searchMap.wechatNo) !== -1)
      }
      if (searchMap.shopId) {
        if (data.shopIds) {
          flag = flag && (data.shopIds.indexOf(searchMap.shopId) !== -1)
        } else {
          flag = false
        }
      } else if (searchMap.shopArea && searchMap.shopArea.value && vm.shopOptions && vm.shopOptions.length > 0) {
        let shopAreaFlag = false
        for (let i = 0; i < vm.shopOptions.length; i++) {
          if (data.shopIds && data.shopIds.indexOf(vm.shopOptions[i].value) !== -1) {
            shopAreaFlag = true
            break
          }
        }
        flag = flag && shopAreaFlag
      }
      if (searchMap.employeeType) {
        flag = flag && (data.employeeType === parseInt(searchMap.employeeType))
      }
      if (searchMap.mobile) {
        flag = flag && (data.mobile === searchMap.mobile)
      }
      if (searchMap.selectedDepart.value) {
        const jointString = vm.jointDepartId(searchMap.selectedDepart.value, vm.departData.allDepartments)
        flag = flag && jointString.indexOf(data.positionID) >= 0
      }
      return flag
    },
    setData4Search (data, idColumn) {
      vm.matchEmployeeData = data
      vm.$nextTick(() => {
        // vm.employeeData = data
        const pageD = vm.pageingData(data, 0)
        vm.employeeData = vm.handleShowData(pageD.dataList, vm.tabType)
        // vm.employeeData = pageD.dataList
        vm.pagination4Emp.total = pageD.total
        vm.pagination4Emp.page = 1
        vm.toggleRowSelection(vm.selectedData, vm.employeeData, idColumn)
      })
    },
    // 拼接部门的id,所有子部门
    jointDepartId (departId, allDepart) {
      let _jointString = [departId]
      if (departId && allDepart && allDepart.length > 0) {
        allDepart.forEach(index => {
          if (index.parentId && index.id && parseInt(index.parentId) === parseInt(departId)) {
            _jointString = _jointString.concat(vm.jointDepartId(index.id, allDepart))
          }
        })
      }
      return _jointString
    },
    // 拼接分群的id,所有子部门
    jointGroupId (groupId, allGroup) {
      let _jointString = [groupId]
      if (groupId && allGroup && allGroup.length > 0) {
        allGroup.forEach(index => {
          if (index.parentId && index.id && parseInt(index.parentId) === parseInt(groupId)) {
            _jointString = _jointString.concat(vm.jointGroupId(index.id, allGroup))
          }
        })
      }
      return _jointString
    },
    // 搜索分群
    searchGroup: function () {
      let data = []
      if (vm.groupData.name || (vm.groupData.selectedGroup.value && parseInt(vm.groupData.selectedGroup.value) > 0)) {
        const jointString = vm.jointGroupId(vm.groupData.selectedGroup.value, vm.groupData.allGroup)
        data = vm.allEmployeeData.filter(index => {
          if (vm.groupData.name && vm.groupData.selectedGroup.value) {
            return index.subdivisionName && index.subdivisionName.toString().indexOf(vm.groupData.name) !== -1 && jointString.indexOf(index.parentId) >= 0
          } else if (vm.groupData.name) {
            return index.subdivisionName && index.subdivisionName.toString().indexOf(vm.groupData.name) !== -1
          } else {
            return jointString.indexOf(index.parentId) >= 0
          }
        }
        )
      } else {
        data = clone(vm.allEmployeeData)
      }
      vm.setData4Search(data, 'subdivisionName')
    },
    // 设置勾选状态
    toggleRowSelection (selectedData, allData, idKey) {
      vm.$nextTick(function () {
        for (const data of allData) {
          const index = selectedData.filter(index => data[idKey] === index[idKey])
          if (index.length > 0) {
            vm.$refs[vm.tabType + 'Table'].toggleRowSelection(data, true)
          }
        }
      })
    },
    selectChange (select, scope) {
      if (this.selectedData.length > 0) {
        const index = this.selectedData.findIndex(d => d[vm.recordId] === scope[vm.recordId])
        if (index > -1) {
          this.selectedData.splice(index, 1)
        } else {
          this.selectedData.push(scope)
        }
      } else {
        this.selectedData = JSON.parse(JSON.stringify(this.$refs[vm.tabType + 'Table'].selection))
      }
      if (this.selectedData.length === 0) {
        this.$refs[vm.tabType + 'Table'].clearSelection()
      }
    },
    selectAllChange (select) {
      if (select.length === 0) {
        for (const data of this.employeeData) {
          const index = this.selectedData.findIndex(d => d[vm.recordId] === data[vm.recordId])
          if (index > -1) {
            this.selectedData.splice(index, 1)
          }
        }
      } else {
        for (const data of select) {
          const index = this.selectedData.findIndex(d => d[vm.recordId] === data[vm.recordId])
          if (index === -1) {
            this.selectedData.push(data)
          }
        }
      }
    },
    // 删除已选
    removeEmp (scope) {
      this.selectedData.splice(scope.$index, 1)
      const index = this.$refs[vm.tabType + 'Table'].selection.findIndex(d => d[vm.recordId] === scope.row[vm.recordId])
      if (index > -1) {
        this.$refs[vm.tabType + 'Table'].selection.splice(index, 1)
        this.loadSelectedData.splice(index, 1)
        this.isCheckAll = false
      }
      if (this.$refs[vm.tabType + 'Table'].selection.length === 0) {
        this.$refs[vm.tabType + 'Table'].clearSelection()
      }
    },

    /**
     * 打开弹窗
     */
    onDialogOpen () {
      vm.visible = true
      this.tabType = vm.value && vm.value.type ? vm.value.type : (vm.onlyOne ? vm.onlyOne : 'employee')
      vm.$nextTick(function () {
        vm.getData(this.tabType, 'open')
      })
    },
    setFullInfo (val) {
      if (val && val.length > 0 && vm.allEmployeeData && vm.allEmployeeData.length > 0) {
        const data = []
        const mapArr = {}
        vm.allEmployeeData.map(data => {
          mapArr[data[vm.recordId]] = data[vm.recordName]
        })
        if (mapArr) {
          val.map(item => {
            item[vm.recordName] = mapArr[item[vm.recordId]]
            data.push(JSON.parse(JSON.stringify(item)))
          })
        }
        return data
      }
      return []
    },
    resetInput () {
      if (vm.tabType === 'group') {
        vm.groupData.name = ''
        vm.groupData.selectedGroup.value = ''
        vm.groupData.selectedGroup.text = ''
        vm.$refs.groupClassTree.cleanClickHandle()
      } else {
        vm.model.name = ''
        vm.model.selectedDepart.value = ''
        vm.model.selectedDepart.text = ''
        vm.model.shopArea = this.echoStore ? { // 选择的门店区域
          value: this.area.id,
          text: this.area.name
        } : {}
        vm.model.mobile = ''
        vm.model.shopId = '' // 选择的门店
        vm.model.employeeType = '' // 选择的员工类型
        vm.model.wechatNick = '' // 选择的员工类型
        vm.model.wechatNo = '' // 选择的员工类型
        vm.$refs.employeeDepartTree.cleanClickHandle()
        vm.$refs.shopAreaTree.cleanClickHandle()
      }
      vm.isAllSelect()
      vm.fileData()
    },
    // 勾选已选择的选项
    fileData () {
      if (vm.employeeData && vm.employeeData.length > 0 && vm.employeeData && vm.employeeData.length > 0) {
        if (vm.$refs[vm.tabType + 'Table']) {
          vm.$refs[vm.tabType + 'Table'].clearSelection()
        }
        vm.$nextTick(function () {
          for (const indexDat of vm.employeeData) {
            if (vm.selectedData.filter(d => d[vm.recordId] === indexDat[vm.recordId]).length > 0) {
              vm.$refs[vm.tabType + 'Table'].toggleRowSelection(indexDat, true)
            }
          }
        })
      }
    },
    getData (name, openType) {
      if (name === 'employee') {
        if (vm.allEmpData.query) {
          vm.initData(vm.allEmpData.data)
          vm.$nextTick(() => {
            vm.setSelectedDataFull()
            vm.resetInput()
          })
        } else {
          this.getEmployeeList(openType, vm.initData, vm.setSelectedDataFull)
        }
      } else {
        if (vm.allGroupData.query) {
          vm.initData(vm.allGroupData.data)
          vm.$nextTick(() => {
            vm.setSelectedDataFull()
            vm.resetInput()
          })
        } else {
          this.getGroupList(openType, vm.initData, vm.setSelectedDataFull)
        }
      }
    },
    getEmployeeList (type, initData, setSelectedDataFull) {
      this.tableLoading = true
      const param = {}
      if (this.queryType === 1 || this.queryType === 2) {
        param.queryType = this.queryType
      }
      this.$http.fetch(this.$api.marketing.weworkMarketing.queryEmployeeWechatInfoList, param)
        .then(resp => {
          // 赋值员工数据
          vm.allEmpData.query = true
          if (vm.tabType === 'employee' && resp.result) {
            initData(resp.result)
            vm.allEmpData.data = resp.result
          }
        }).catch(() => {
          vm.$notify.error('查询用户信息失败')
        }).finally(() => {
          if (type && vm.tabType === 'employee') {
            setSelectedDataFull()
          }
          vm.$nextTick(function () {
            vm.resetInput()
          })
          vm.tableLoading = false
          // vm.initEmployeeDataFlag = true
        })
    },
    // 初始化数据
    initData (result) {
      vm.allEmployeeData = vm.tabType === 'employee' ? clone(result) : vm.handleGroupList(clone(result), 'onlyGroup')
      vm.matchEmployeeData = clone(vm.allEmployeeData)
      const obj = vm.pageingData(vm.allEmployeeData, 0)
      vm.employeeData = vm.handleShowData(obj.dataList, vm.tabType)
      // vm.employeeData = obj.dataList
      vm.pagination4Emp.total = obj.total
      vm.pagination4Emp.page = 1
    },
    // 完善选中的信息
    setSelectedDataFull () {
      if (vm.value && vm.value.type === vm.tabType) {
        vm.selectedData = vm.setFullInfo(JSON.parse(JSON.stringify(vm.value.data)))
      } else {
        vm.selectedData = []
      }
    },
    // 处理员工信息
    handleEmployeeList (employeeData, departData) {
      if (employeeData && employeeData.length > 0) {
        // 设置部门名称
        if (departData) {
          employeeData.map(data => {
            const filterList = departData.filter(data2 => parseInt(data2.id) === parseInt(data.positionID))
            if (filterList && filterList.length > 0) {
              Object.assign(data, { departName: filterList[0].label })
            }
          })
        }
      }
      return employeeData
    },
    // 处理显示数据
    handleShowData (data, tabType) {
      if (data && data.length > 0) {
        if (tabType === 'employee') {
          const arr = vm.handleEmployeeList(data, vm.departData.allDepartments)
          return arr
        } else {
          return data
        }
      } else {
        return data
      }
    },
    // 修改页数
    changePage (page) {
      const obj = vm.pageingData(vm.matchEmployeeData, vm.pagination4Emp.size * (page - 1))
      vm.employeeData = vm.handleShowData(obj.dataList, vm.tabType)
      vm.pagination4Emp.total = obj.total
      vm.pagination4Emp.page = page
      vm.$nextTick(function () {
        vm.fileData()
      })
    },
    // 分页
    pageingData (data, pageIndex) {
      const pageData = {
        total: 0,
        dataList: []
      }
      if (data && data.length > 0) {
        pageData.total = data.length
        const arrObj = data.slice(pageIndex, ((pageIndex + vm.pagination4Emp.size) < data.length ? (pageIndex + vm.pagination4Emp.size) : data.length + 1))
        pageData.dataList = clone(arrObj)
      }
      return pageData
    },
    // 获取分群信息
    getGroupList (type, initData, setSelectedDataFull) {
      this.tableLoading = true
      this.$http.fetch(this.$api.marketing.weworkMarketing.getSubdivisionList, { viewId: this.model.viewId })
        .then(resp => {
          // 赋值员工数据
          vm.allGroupData.query = true
          if (vm.tabType === 'group' && resp.result) {
            this.initData(resp.result)
            vm.allGroupData.data = resp.result
          }

          this.groupData.groupTree = this.handleGroupList(clone(resp.result), 'onlyCatalog')
          this.groupData.allGroup = this.handleGroupList(clone(resp.result), 'onlyCatalog')
        }).catch((aaa) => {
          vm.$notify.error('查询客户分群加载失败')
        }).finally(() => {
          // 设置已选择的信息
          if (type && vm.tabType === 'group') {
            setSelectedDataFull()
          }
          vm.$nextTick(function () {
            vm.resetInput()
          })
          vm.tableLoading = false
          vm.initGroupDataFlag = true
        })
    },
    // 处理客户分群信息
    handleGroupList (data, type) {
      if (data && data.length > 0) {
        const onlyCat = (type === 'onlyCatalog')
        const filterList = data.filter(index => (onlyCat ? index.isCategory === '1' : index.isCategory !== '1'))
        if (filterList && filterList.length > 0 && !onlyCat) {
          filterList.map(item => {
            const filterList2 = data.filter(index => item.parentId === index.id)
            if (filterList2 && filterList2.length > 0) {
              Object.assign(item, { className: filterList2[0].subdivisionName })
            }
          })
        }
        return filterList
      }
    },
    /**
     * 关闭弹窗
     */
    onDialogClose () {
      // this.empName = ''
      this.groupName = ''
      // this.employeeData = JSON.parse(JSON.stringify(vm.copySelectedData))
      vm.visible = false
    },
    // 保存已选
    onSave () {
      if (this.selectedData.length > 0) {
        this.callbackData(JSON.parse(JSON.stringify(this.selectedData)))
        vm.visible = false
      } else {
        this.$notify.warning('请选择' + (vm.tabType === 'group' ? '分群' : '员工'))
      }
    },
    /**
     * 返回数据
     */
    callbackData: function (data) {
      const transData = this.transformData(data)
      this.$emit('input', transData)
      this.$emit('change', transData)
    },
    // 设置返回信息
    transformData (data) {
      const resultObj = {
        data: [],
        type: vm.tabType
      }
      const propsName = vm.objProps
      // employeeProps
      if (data && data.length > 0) {
        if (this[propsName] && Object.getOwnPropertyNames(this[propsName]).length > 0) {
          const result = []
          const propsSet = Object.getOwnPropertyNames(this[propsName])
          data.map(item => {
            const returnObj = {}
            propsSet.forEach(pro => {
              returnObj[this[propsName][pro]] = item[pro]
              if (this.needGroupName) {
                returnObj.targetName = item.subdivisionName
              }
            })
            result.push(returnObj)
          })
          resultObj.data = result
        }
      }
      return resultObj
    },
    $sizeChange$: function (size) {
      this.pagination4Emp.size = size
      vm.$nextTick(function () {
        return vm.changePage(1)
      })
    }
  },
  mounted: async function () {
    vm = this
    await vm.getViewList()
    vm.getDepartmentTree()
    // vm.getGroupTree()
    vm.getShopAreaAndShop()
  },
  created: function () {
    // do nothing
  }
}
</script>

<style scoped>
@import "@theme/variables.pcss";

@component-namespace code {
  @b container {
    padding: 0 var(--default-padding-small);
    @e item {
      >>> .el-scrollbar__wrap {
        height: 200px;
      }
    }
  }
  @b title {
    font-weight: bold;
    line-height: 30px;
    background: var(--theme-bg-color-base);
    padding: 0 8px;
    border-radius: var(--default-radius-mini);
  }
  @b delete {
    margin-left: var(--default-margin-small);
  }
  @b space {
    margin-top: var(--default-margin-base);
  }
  @b detail {
    display: flex;
    align-items: center;
    @e text {
      max-width: 188px;
      margin-right: var(--default-margin-small);
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .tmp-choose__result {
    .title {
      line-height: 30px;
      background: var(--theme-bg-color-base);
      padding: 0 8px;
      border-bottom: 1px solid var(--theme-base-border-color-primary);
    }
  }
  .tmp-choose__goods {
    list-style: none;
    font-size: 12px;
    padding: var(--default-padding-base);
    background: var(--default-table-strip-bg);

    li {
      display: flex;
      flex-wrap: nowrap;
      padding: 0 3px;

      .delete-icon {
        padding: 3px 5px;
        position: relative;
        top: -3px;

        &:hover {
          color: var(--theme-color-warning);
        }

      }

      .g-name {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

    }

  }
}
</style>
