<template>
  <div>
    <template v-if="textButton">
      <NsButton type="text" @click="onDialogOpen()"><Icon type="plus"/>{{btnTitle}}</NsButton>
    </template>
    <template v-else>
      <NsButton type="primary" @click="onDialogOpen" class="margin-lr-small"><i class="bui-select-employee"></i>{{btnTitle}}</NsButton>
    </template>
    <el-dialog :title="dialogTitle" :visible.sync="visible" :show-scroll-x="false" class="g-wrapper"
               :close-on-click-modal = "false" :before-close="onDialogClose" width="960px">
      <div>
        <div v-show="!onlyOne" style="width: 220px; margin-bottom: 10px">
          <el-tabs v-model="tabType" @tab-click="changeTab">
            <el-tab-pane label="客户分群" name="group"></el-tab-pane>
            <el-tab-pane label="员工全部好友" name="employee"></el-tab-pane>
          </el-tabs>
        </div>
        <el-form label-width="60px" :inline="true">
          <el-form-item v-show="0" label="选择门店：">
            <el-select v-model="model.shopType">
              <el-option :key="1" :value="1" label="门店类型"></el-option>
              <el-option :key="2" :value="2" label="门店分类"></el-option>
              <!--<el-option :key="3" :value="3" label="导入门店"></el-option>-->
            </el-select>
          </el-form-item>
          <el-form-item v-show="model.shopType === 1">
            <el-select v-model="model.shopType2" clearable placeholder="请选择门店类型" >
              <el-option :key="1" value="ZYD" label="直营店"></el-option>
              <el-option :key="2" value="JMD" label="加盟店"></el-option>
              <el-option :key="3" value="LYD" label="联营店"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="model.shopType === 2"  label="选择门店：" label-width="75px">
            <el-form-grid>
              <ns-droptree v-if='isLoadShopAreaTree' ref="shopAreaTree" placeholder="请选择区域" :lazy="true" :load="loadShopAreaNode" v-model="model.shopArea" clearable :defaultExpandAll='true'></ns-droptree>
            </el-form-grid>
          </el-form-item>
          <el-form-item v-show="model.shopType === 1 || model.shopType === 2" style="margin-left:0px">
            <el-form-grid size="md">
              <el-select-load v-model="model.shopId" :options="shopOptions" filterable clearable :page-sizes="20" placeholder="选择门店">
              </el-select-load>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="选择部门：" label-width="75px">
            <el-form-grid size="md">
              <ns-droptree ref="employeeDepartTree" :lazy="true" :data="deptData" :filter-lazy-nodes="filterDept" :load="loadNode" v-model="model.selectedDepart" clearable></ns-droptree>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="员工姓名：" label-width="75px">
            <el-form-grid>
              <ElInput :maxlength="20" v-model="model.empName"/>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="手机号：">
            <el-form-grid>
              <ElInput :maxlength="11" v-model="model.empMobile"/>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="员工工号：" label-width="75px">
            <el-form-grid>
              <ElInput :maxlength="20" v-model="model.guideNum"/>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="微信群：" v-show="!isqywx">
            <el-form-grid>
              <ElInput :maxlength="20" v-model="model.chatroomName"/>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="群主昵称：" v-show="isqywx" label-width="75px">
            <el-form-grid>
              <ElInput :maxlength="20" v-model="model.chatroomLeaderName"/>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="导入门店：" label-width="75px">
            <el-form-grid size="md">
              <el-input placeholder="请选择" readonly v-model="model.shopIds4Show" @focus="$refs.shopIdSelect.onOpenSearch()" :title="model.shopIds4Show">
              <span
                class="el-icon-edit el-input__icon"
                @click="$refs.shopIdSelect.onOpenSearch()"
                slot="suffix" />
              </el-input>
              <ns-shop-id-dialog v-model="model.shopIdsArr" ref="shopIdSelect" @searchAndChecked="searchAndChecked"></ns-shop-id-dialog>
            </el-form-grid>
          </el-form-item>
          <el-form-item style="margin-right: 0">
            <el-form-grid>
              <ns-button type="primary" @click="searchData">{{$t('operating.search')}}</ns-button>
              <ns-button @click="resetSearch">{{$t('operating.reset')}}</ns-button>
              <!--<ns-button @click="onSelectAllData">{{isCheckAll ? '取消全选' : '全选'}}</ns-button>-->
            </el-form-grid>
          </el-form-item>
        </el-form>
        <el-row class="tmp-choose__condition" :gutter="24" v-show="tabType === 'group'">
          <el-col :span="12">
            <ElTable v-loading="tableLoading" stripe ref="groupTable" :data="employeeData" height="260" @select="selectChange" @select-all="selectAllChange">
              <ElTableColumn type="selection" width="55" />
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="subdivision_name" label="分群名称" align="left"/>
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
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="subdivision_name" label="已选分群" align="left"/>
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
        <el-row class="tmp-choose__condition" :gutter="24" v-show="tabType === TAB_EMPLOYEE">
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
        <el-row class="tmp-choose__condition" :gutter="24" v-show="tabType === TAB_CHATROOM">
          <el-col :span="12">
            <ElTable v-if="!isqywx" v-loading="tableLoading" ref="chatroomTable" stripe :data="employeeData" height="260" @select="selectChange" @select-all="selectAllChange">
              <ElTableColumn type="selection" width="55" />
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="title" label="微信群名称" align="left">
                <template slot-scope="scope">
                  {{scope.row.title?scope.row.title:'-'}}
                </template>
              </ElTableColumn>
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="empName" label="群内员工" align="left"/>
            </ElTable>
            <ElTable v-if="isqywx" v-loading="tableLoading" ref="chatroomTable" stripe :data="employeeData" height="260" @select="selectChange" @select-all="selectAllChange">
              <ElTableColumn type="selection" width="55" />
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="empNick" label="群主昵称" align="left">
              </ElTableColumn>
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="empName" label="员工姓名" align="left"/>
            </ElTable>
            <el-pagination v-if="_data.pagination4Emp.enable" class="template-table__pagination"
                           :page-sizes="_data.pagination4Emp.sizeOpts" :total="_data.pagination4Emp.total"
                           :current-page="_data.pagination4Emp.page" :page-size="_data.pagination4Emp.size"
                           :layout="true? 'total, sizes, prev, pager, next':'total'" @size-change="$sizeChange$"
                           @current-change="changePage">
            </el-pagination>
          </el-col>
          <el-col :span="12">
            <div class="tmp-choose__result" >
              <p class="title">已选择了<span class="text-danger padding-lr-base">{{selectedData.length}}</span>个微信群</p>
              <div v-if="loadSelectedData.length>0">
                <el-scrollbar style="margin-top: 5px; height: 220px">
                  <ul class="tmp-choose__goods" v-infinite-scroll="loadSelectedDataF">
                    <li v-for="(item,index) in loadSelectedData" :key="index">
                      <span class="g-name">{{!isqywx ? (item.title ? item.title : '-'):(item.empNick ? item.empNick : '-')}}</span>
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
import NsDroptree from '../NsDroptree'
import NsShopIdDialog from '@/components/NsShopIdDialog'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { clone } from 'lodash'
import ElSelectLoad from '@nascent/nui/lib/select-load'
import InfiniteScroll from '@nascent/nui/lib/infinite-scroll'
import { mapState } from 'vuex'

const LOADPAGESIZE = 50
export default {
  name: 'NsChatrommSelectDialog',
  mixins: [tableMixin],
  components: {
    NsDroptree,
    ElSelectLoad,
    NsShopIdDialog
  },
  directives: {
    InfiniteScroll
  },
  props: {
    value: {
      type: Object,
      default () {
        return {
          data: [],
          type: 'group'
        }
      }
    },
    // 判断是否需要门店回显
    echoStore: {
      default () {
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
      default () {
        return {
          employeeID: 'employeeID'
        }
      }
    },
    chatroomProps: {
      type: Object,
      default () {
        return {
          outRooms: 'outRooms'
        }
      }
    },
    chatroomPropsEnt: {
      type: Object,
      default () {
        return {
          empId: 'empId'
        }
      }
    },
    // 配置选择分群返回属性,属性名不可更改，属性值可配置为需要设置的值
    groupProps: {
      type: Object,
      default () {
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
    //
    isqywx: {
      type: Boolean,
      default: false
    },
    // 是否需要和右上角区域联动
    isNeedLink: {
      type: Boolean,
      default: false
    },
    textButton: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      TAB_EMPLOYEE: 'employee',
      TAB_CHATROOM: 'chatroom',
      // 员工和分群的所有数据
      allEmpData: {
        data: [],
        query: false
      },
      allChatroomData: {
        data: [],
        query: false
      },
      allGroupData: {
        data: [],
        query: false
      },
      // 全部数据-不特指员工，所有tab都使用
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
        mobile: '',
        name: '', // 搜索的员工名称
        shopArea: {}, // 选择的门店区域
        shopId: '', // 选择的门店
        employeeType: '', // 选择的员工类型
        // 微信群筛选使用 start
        // 门店类型 默认按门店分类，其他选项隐藏
        shopType: 2,
        chatroomName: '',
        chatroomLeaderName: '',
        empId: '',
        // 员工工号
        guideNum: '',
        empMobile: '',
        empName: '',
        // 直营店，加盟店...
        shopType2: '',
        // 门店分类
        shopType3: '',
        shopIds: '',
        shopIds4Show: '',
        // 导入门店时接收导入的数据
        shopIdsArr: []
        // 微信群筛选使用 end
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
      recordId: (this.onlyOne || this.value.type) === 'employee' ? 'employeeID' : (this.onlyOne || this.value.type) === 'chatroom' ? (this.isqywx ? 'empId' : 'outRooms') : 'id',
      recordName: (this.onlyOne || this.value.type) === 'employee' ? 'name' : (this.onlyOne || this.value.type) === 'chatroom' ? (this.isqywx ? 'empNick' : 'title') : 'subdivision_name',
      objProps: (this.onlyOne || this.value.type) === 'employee' ? 'employeeProps' : (this.onlyOne || this.value.type) === 'chatroom' ? (this.isqywx ? 'chatroomPropsEnt' : 'chatroomProps') : 'groupProps',
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
      allEmployees: [],
      isLoadShopAreaTree: false // 判断区域树是否请求完成
    }
  },
  computed: mapState({
    area: state => state.user.area
  }),
  watch: {
    tabType (val) {
      if (val && val === this.TAB_EMPLOYEE) {
        this.recordId = 'employeeID'
        this.recordName = 'name'
        this.objProps = 'employeeProps'
      } else if (val && val === 'group') {
        this.recordId = 'id'
        this.recordName = 'subdivision_name'
        this.objProps = 'groupProps'
      } else if (val && val === this.TAB_CHATROOM && this.isqywx) {
        this.recordId = 'empId'
        this.recordName = 'empNick'
        this.objProps = 'chatroomPropsEnt'
      } else if (val && val === this.TAB_CHATROOM) {
        this.recordId = 'outRooms'
        this.recordName = 'title'
        this.objProps = 'chatroomProps'
      }
    },
    'model.shopArea' (o1, o2) {
      const shopOptions = []
      if (!o1.value || o1.value !== o2.value) {
        this.allShopOptions.map(item => {
          if (!o1.value || (item.ext && item.ext.indexOf(o1.value) !== -1)) {
            this.model.shopId = ''
            shopOptions.push(item)
          }
        })
        this.shopOptions = shopOptions
      }
    },
    'model.shopType2' (o1, o2) {
      const shopOptions = []
      if (!o1 || o1 !== o2) {
        this.allShopOptions.map(item => {
          if (!o1 || (item.ext1 && item.ext1 === o1)) {
            this.model.shopId = ''
            shopOptions.push(item)
          }
        })
        this.shopOptions = shopOptions
      }
    },
    'model.shopType' (o1, o2) {
      if (!o1 || o1 !== o2) {
        this.model.shopId = ''
        // this.model.shopIds = ''
        this.model.shopType2 = ''
        this.model.shopArea = {}
        this.shopOptions = clone(this.allShopOptions)
      }
    },
    selectedData () {
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
    searchAndChecked () {
      if (this.model.shopIdsArr.length > 0) {
        const idsArr = this.model.shopIdsArr.map(item => item.shopId).join(',')
        this.model.shopIds4Show = idsArr
      }
      // console.log('false0: ' + JSON.stringify(this.model.shopIdsArr))
      let transferArr = this.model.shopIdsArr.filter(item => item.type === 2)
      // 是否输入外部店铺编号
      let inputOutShop = false
      if (this.model.shopIdsArr && this.model.shopIdsArr.length > 0) {
        // 外部店铺编号处理
        const filterArr = this.model.shopIdsArr.filter(item => item.type === 1)
        if (filterArr.length > 0) {
          inputOutShop = true
          for (const outShop of filterArr) {
            const fiterArr2 = this.allShopOptions.filter(item => item.remark === outShop.shopId)
            if (fiterArr2.length > 0) {
              transferArr.push({ type: 2, shopId: fiterArr2[0].value })
            }
          }
        }
      }
      // 排重
      if (transferArr.length > 0) {
        transferArr = [...new Set(transferArr.map(item => { return item.shopId }))]
      }
      if (transferArr.length > 0) {
        this.model.shopIds = transferArr.join(',')
      } else if (inputOutShop) {
        // 说明输入的外部店铺编号匹配不到店铺
        this.model.shopIds = '-999999'
      } else if (transferArr.length < 1) {
        this.model.shopIds = ''
        this.model.shopIds4Show = ''
      }
      this.searchData()
    },
    loadSelectedDataF () {
      if (this.selectedData.length > LOADPAGESIZE) {
        const start = this.loadSelectedData.length
        const end = start + LOADPAGESIZE > this.selectedData.length ? this.selectedData.length : start + LOADPAGESIZE
        this.loadSelectedData = this.loadSelectedData.concat(this.selectedData.slice(start, end))
      }
    },
    isAllSelect () {
      if (this.value && this.value.data && this.value.data.length > 0 && this.matchEmployeeData.length > 0 && this.matchEmployeeData.length === this.value.data.length) {
        this.isCheckAll = true
      } else {
        this.isCheckAll = false
      }
    },
    // 切换tab
    changeTab (tab) {
      this.tabType = tab.name
      this.$nextTick(() => {
        this.getData(tab.name, 'tabChange ')
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
    getShopAreaAndShop () {
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
          this.$notify.error('查询部门树失败')
        })
    },
    // 部门树 end
    // 懒加载分群类树
    loadNode4Group (node, resolve) {
      const allDepar = this.groupData.groupTree
      if (node.level === 0) { // 第一次调用
        return resolve([{ id: 0, parentId: -1, code: 0, label: '全部', checked: false, showAdd: true, showEdit: true, showDelete: true }])
      }
      if (node.level >= 1) {
        // 点击之后触发
        const filter = allDepar.filter(data => {
          return parseInt(data.parent_id) === parseInt(node.data.id)
        })
        if (filter && filter.length > 0) {
          const resultData = []
          filter.forEach(data => {
            const data2 = {
              id: data.id, parentId: data.parent_id, code: data.id, label: data.subdivision_name, checked: false, showAdd: true, showEdit: true, showDelete: true
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
      this.selectedData = []
      const selectedData2 = []
      if (this.isCheckAll) {
        this.$refs[this.tabType + 'Table'].clearSelection()
      } else {
        for (const item of this.employeeData) {
          this.$refs[this.tabType + 'Table'].toggleRowSelection(item, true)
        }
        for (const item2 of this.matchEmployeeData) {
          const obj = {}
          obj[this.recordId] = item2[this.recordId]
          obj[this.recordName] = item2[this.recordName]
          selectedData2.push(obj)
        }
      }
      this.selectedData = selectedData2
      this.isCheckAll = !this.isCheckAll
    },
    // 重置搜索
    resetSearch () {
      if (this.tabType === 'group') {
        this.groupData.name = ''
        this.groupData.selectedGroup.value = ''
        this.groupData.selectedGroup.text = ''
        this.$refs.groupClassTree.cleanClickHandle()
        this.searchGroup()
      } else if (this.tabType === this.TAB_EMPLOYEE) {
        this.model.name = ''
        this.model.selectedDepart.value = ''
        this.model.selectedDepart.text = ''
        this.model.shopArea = {} // 选择的门店区域
        this.model.mobile = ''
        this.model.shopId = '' // 选择的门店
        this.model.employeeType = '' // 选择的员工类型
        this.$refs.employeeDepartTree.cleanClickHandle()
        this.$refs.shopAreaTree.cleanClickHandle()
        this.searchEmployee()
      } else {
        this.model.name = ''
        this.model.selectedDepart.value = ''
        this.model.selectedDepart.text = ''
        this.model.shopArea = {} // 选择的门店区域
        this.model.shopId = '' // 选择的门店
        this.model.employeeType = '' // 选择的员工类型
        this.model.shopIds = ''
        this.model.shopIds4Show = ''
        this.model.shopIdsArr = []
        this.model.shopType = 2
        this.model.shopType2 = ''
        this.model.empId = ''
        this.model.guideNum = ''
        this.model.empName = ''
        this.model.empMobile = ''
        this.model.chatroomName = ''
        this.model.chatroomLeaderName = ''
        this.$refs.employeeDepartTree.cleanClickHandle()
        this.$refs.shopAreaTree.cleanClickHandle()
        this.searchChatroom()
      }
    },
    searchData () {
      if (this.tabType === 'group') {
        this.searchGroup()
      } else if (this.tabType === this.TAB_CHATROOM) {
        this.searchChatroom()
      } else {
        this.searchEmployee()
      }
    },
    // 搜索微信群
    searchChatroom () {
      this.tableLoading = true
      let filterEmpFlag = false
      // 筛选的员工
      let filterEmpArr = []
      if (this.model.guideNum || this.model.empMobile || this.model.empName) {
        if (this.model.guideNum) {
          const arr = this.allEmployees.filter(item => this.model.guideNum === item.guideNum)
          filterEmpArr = arr || []
          filterEmpFlag = true
        }
        if (this.model.empMobile) {
          const allEmployees = filterEmpFlag ? filterEmpArr : this.allEmployees
          const arr = allEmployees.filter(item => this.model.empMobile === item.mobile)
          filterEmpArr = arr || []
          filterEmpFlag = true
        }
        if (this.model.empName) {
          const allEmployees = filterEmpFlag ? filterEmpArr : this.allEmployees
          const arr = allEmployees.filter(item => this.model.empName === item.name)
          filterEmpArr = arr || []
          filterEmpFlag = true
        }
      }
      // 选择了部门
      if (this.model.selectedDepart.value && this.allEmployees && this.allEmployees.length > 0) {
        const jointString = this.jointDepartId(this.model.selectedDepart.value, this.departData.allDepartments)
        const allEmployees = filterEmpFlag ? filterEmpArr : this.allEmployees
        const arr = allEmployees.filter(item => jointString.indexOf(item.positionID) >= 0)
        filterEmpArr = arr || []
        filterEmpFlag = true
      }
      // 选择了门店
      if (this.model.shopId || this.model.shopType === 1 || this.model.shopType === 2 || this.model.shopIds) {
        if (!this.model.shopType2 && !this.model.shopIds && ((!this.model.shopArea || !this.model.shopArea.value) && !this.model.shopId)) {
        } else {
          const shopIdArr = this.model.shopId ? [this.model.shopId] : (this.model.shopIds && this.model.shopIds.length > 0 ? this.model.shopIds.split(',') : this.shopOptions.map(item => { return item.value }))
          const allEmployees = filterEmpFlag ? filterEmpArr : this.allEmployees
          if (allEmployees.length > 0) {
            const arr = allEmployees.filter(item => {
              if (!item.shopIds) {
                return false
              } else {
                for (const sid of item.shopIds.split(',')) {
                  if (shopIdArr.indexOf(sid) >= 0) {
                    return true
                  }
                }
              }
            })
            filterEmpArr = arr || []
          } else {
            filterEmpArr = []
          }
          filterEmpFlag = true
        }
      }
      if (filterEmpArr.length > 0) {
        if (!this.isqywx) {
          const newArr = filterEmpArr.map(item => { return item.wechatId })
          filterEmpArr = newArr
        } else {
          const newArr = filterEmpArr.map(item => { return item.employeeID })
          filterEmpArr = newArr
        }
      }
      const empId = this.isqywx ? 'empId' : 'empWechatWxid'
      const data = this.allEmployeeData.filter(data => this.filterChatroomTableData(data, filterEmpFlag, filterEmpArr, empId))
      this.setData4Search((data || []), this.recordId)
      this.tableLoading = false
    },
    // 搜索用户
    searchEmployee () {
      this.tableLoading = true
      const data = this.allEmployeeData.filter(this.filterEmployeeTableData)
      this.setData4Search((data || []), 'name')
      this.tableLoading = false
    },
    /**
     *  过滤表格数据
     */
    filterEmployeeTableData (data) {
      const searchMap = this.model
      let flag = true
      if (searchMap.name) {
        flag = flag && (data.name.indexOf(searchMap.name) !== -1)
      }
      if (searchMap.shopId) {
        if (data.shopIds) {
          flag = flag && (data.shopIds.indexOf(searchMap.shopId) !== -1)
        } else {
          flag = false
        }
      } else if (searchMap.shopArea && searchMap.shopArea.value && this.shopOptions && this.shopOptions.length > 0) {
        let shopAreaFlag = false
        for (let i = 0; i < this.shopOptions.length; i++) {
          if (data.shopIds && data.shopIds.indexOf(this.shopOptions[i].value) !== -1) {
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
        const jointString = this.jointDepartId(searchMap.selectedDepart.value, this.departData.allDepartments)
        flag = flag && jointString.indexOf(data.positionID) >= 0
      }
      return flag
    },
    /**
     *  过滤表格数据
     */
    filterChatroomTableData (data, filterEmpFlag, filterEmpArr, empId) {
      const searchMap = this.model
      let flag = true
      if (searchMap.chatroomName) {
        if (!data.title) {
          flag = false
        } else {
          flag = flag && (data.title.indexOf(searchMap.chatroomName) >= 0)
        }
      }
      if (searchMap.chatroomLeaderName) {
        flag = flag && (data.empNick.indexOf(searchMap.chatroomLeaderName) >= 0)
      }
      // 员工过滤
      if (filterEmpFlag && !this.isqywx) {
        if (filterEmpArr && filterEmpArr.length > 0 && data[empId] && data[empId].split(',')) {
          const filterArr = data[empId].split(',').filter(item => {
            return filterEmpArr.indexOf(item) >= 0
          })
          if (filterArr && filterArr.length > 0) {
            flag = flag && true
          } else {
            flag = false
          }
        } else {
          flag = false
        }
      } else if (filterEmpFlag && this.isqywx) {
        if (filterEmpArr && filterEmpArr.length > 0 && data[empId]) {
          flag = flag && filterEmpArr.indexOf(data[empId]) >= 0
        } else {
          flag = false
        }
      }
      return flag
    },
    setData4Search (data, idColumn) {
      this.matchEmployeeData = data
      this.$nextTick(() => {
        // this.employeeData = data
        const pageD = this.pageingData(data, 0)
        this.employeeData = this.handleShowData(pageD.dataList, this.tabType)
        // this.employeeData = pageD.dataList
        this.pagination4Emp.total = pageD.total
        this.pagination4Emp.page = 1
        this.toggleRowSelection(this.selectedData, this.employeeData, idColumn)
      })
    },
    // 拼接部门的id,所有子部门
    jointDepartId (departId, allDepart) {
      let _jointString = [departId]
      if (departId && allDepart && allDepart.length > 0) {
        allDepart.forEach(index => {
          if (index.parentId && index.id && parseInt(index.parentId) === parseInt(departId)) {
            _jointString = _jointString.concat(this.jointDepartId(index.id, allDepart))
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
          if (index.parent_id && index.id && parseInt(index.parent_id) === parseInt(groupId)) {
            _jointString = _jointString.concat(this.jointGroupId(index.id, allGroup))
          }
        })
      }
      return _jointString
    },
    // 搜索分群
    searchGroup () {
      let data = []
      if (this.groupData.name || (this.groupData.selectedGroup.value && parseInt(this.groupData.selectedGroup.value) > 0)) {
        const jointString = this.jointGroupId(this.groupData.selectedGroup.value, this.groupData.allGroup)
        data = this.allEmployeeData.filter(index => {
          if (this.groupData.name && this.groupData.selectedGroup.value) {
            return index.subdivision_name && index.subdivision_name.toString().indexOf(this.groupData.name) !== -1 && jointString.indexOf(index.parent_id) >= 0
          } else if (this.groupData.name) {
            return index.subdivision_name && index.subdivision_name.toString().indexOf(this.groupData.name) !== -1
          } else {
            return jointString.indexOf(index.parent_id) >= 0
          }
        }
        )
      } else {
        data = clone(this.allEmployeeData)
      }
      this.setData4Search(data, 'subdivision_name')
    },
    // 设置勾选状态
    toggleRowSelection (selectedData, allData, idKey) {
      this.$nextTick(() => {
        for (const data of allData) {
          const index = selectedData.filter(index => data[idKey] === index[idKey])
          if (index.length > 0) {
            this.$refs[this.tabType + 'Table'].toggleRowSelection(data, true)
          }
        }
      })
    },
    selectChange (select, scope) {
      if (this.selectedData.length > 0) {
        const index = this.selectedData.findIndex(d => d[this.recordId] === scope[this.recordId])
        if (index > -1) {
          this.selectedData.splice(index, 1)
        } else {
          this.selectedData.push(scope)
        }
      } else {
        this.selectedData = JSON.parse(JSON.stringify(this.$refs[this.tabType + 'Table'].selection))
      }
      if (this.selectedData.length === 0) {
        this.$refs[this.tabType + 'Table'].clearSelection()
      }
    },
    selectAllChange (select) {
      if (select.length === 0) {
        for (const data of this.employeeData) {
          const index = this.selectedData.findIndex(d => d[this.recordId] === data[this.recordId])
          if (index > -1) {
            this.selectedData.splice(index, 1)
          }
        }
      } else {
        for (const data of select) {
          const index = this.selectedData.findIndex(d => d[this.recordId] === data[this.recordId])
          if (index === -1) {
            this.selectedData.push(data)
          }
        }
      }
    },
    // 删除已选
    removeEmp (scope) {
      this.selectedData.splice(scope.$index, 1)
      const index = this.$refs[this.tabType + 'Table'].selection.findIndex(d => d[this.recordId] === scope.row[this.recordId])
      if (index > -1) {
        this.$refs[this.tabType + 'Table'].selection.splice(index, 1)
        this.loadSelectedData.splice(index, 1)
        this.isCheckAll = false
      }
      if (this.$refs[this.tabType + 'Table'].selection.length === 0) {
        this.$refs[this.tabType + 'Table'].clearSelection()
      }
    },

    /**
     * 打开弹窗
     */
    onDialogOpen () {
      this.visible = true
      this.tabType = this.value && this.value.type ? this.value.type : (this.onlyOne ? this.onlyOne : this.TAB_CHATROOM)
      this.$nextTick(() => {
        this.getData(this.tabType, 'open')
      })
    },
    setFullInfo (val) {
      if (val && val.length > 0 && this.allEmployeeData && this.allEmployeeData.length > 0) {
        const data = []
        const mapArr = {}
        this.allEmployeeData.map(data => {
          mapArr[data[this.recordId]] = data[this.recordName]
        })
        if (mapArr) {
          val.map(item => {
            item[this.recordName] = mapArr[item[this.recordId]]
            data.push(JSON.parse(JSON.stringify(item)))
          })
        }
        return data
      }
      return []
    },
    resetInput () {
      if (this.tabType === 'group') {
        this.groupData.name = ''
        this.groupData.selectedGroup.value = ''
        this.groupData.selectedGroup.text = ''
        this.$refs.groupClassTree.cleanClickHandle()
      } else {
        this.model.name = ''
        this.model.selectedDepart.value = ''
        this.model.selectedDepart.text = ''
        this.model.shopArea = this.echoStore ? { // 选择的门店区域
          value: this.area.id,
          text: this.area.name
        } : {}
        this.model.shopId = '' // 选择的门店
        this.model.employeeType = '' // 选择的员工类型
        this.model.shopIds = ''
        this.model.shopIds4Show = ''
        this.model.shopIdsArr = ''
        this.model.shopType2 = ''
        this.model.shopType = 2
        this.model.empId = ''
        this.model.guideNum = ''
        this.model.empName = ''
        this.model.empMobile = ''
        this.model.chatroomName = ''
        this.model.chatroomLeaderName = ''
        this.$refs.employeeDepartTree.cleanClickHandle()
        this.$refs.shopAreaTree.cleanClickHandle()
      }
      this.isAllSelect()
      this.fileData()
    },
    // 勾选已选择的选项
    fileData () {
      if (this.employeeData && this.employeeData.length > 0 && this.employeeData && this.employeeData.length > 0) {
        if (this.$refs[this.tabType + 'Table']) {
          this.$refs[this.tabType + 'Table'].clearSelection()
        }
        this.$nextTick(() => {
          for (const indexDat of this.employeeData) {
            if (this.selectedData.filter(d => d[this.recordId] === indexDat[this.recordId]).length > 0) {
              this.$refs[this.tabType + 'Table'].toggleRowSelection(indexDat, true)
            }
          }
        })
      }
    },
    getData (name, openType) {
      if (name === this.TAB_EMPLOYEE) {
        if (this.allEmpData.query) {
          this.initData(this.allEmpData.data)
          this.$nextTick(() => {
            this.setSelectedDataFull()
            this.resetInput()
          })
        } else {
          this.getEmployeeList(openType, this.initData, this.setSelectedDataFull)
        }
      } else if (name === this.TAB_CHATROOM) {
        if (this.allChatroomData.query) {
          this.initData(this.allChatroomData.data)
          this.$nextTick(() => {
            this.setSelectedDataFull()
            this.resetInput()
          })
        } else {
          this.getChatrooms(openType, this.initData, this.setSelectedDataFull)
        }
      } else {
        if (this.allGroupData.query) {
          this.initData(this.allGroupData.data)
          this.$nextTick(() => {
            this.setSelectedDataFull()
            this.resetInput()
          })
        } else {
          this.getGroupList(openType, this.initData, this.setSelectedDataFull)
        }
      }
    },
    getChatrooms (type, initData, setSelectedDataFull) {
      const map = { }
      const url = this.isqywx ? this.$api.marketing.weworkMarketing.queryGroupEntRoomsLeaderList : this.$api.marketing.wechat.queryGroupRooms
      this.$http.fetch(url, map)
        .then(resp => {
          // 赋值员工数据
          this.allChatroomData.query = true
          if (this.tabType === this.TAB_CHATROOM && resp.result) {
            initData(resp.result)
            this.allChatroomData.data = resp.result
          }
        }).catch(() => {
          this.$notify.error('查询用户信息失败')
        }).finally(() => {
          if (type && this.tabType === this.TAB_CHATROOM) {
            setSelectedDataFull()
          }
          this.$nextTick(() => {
            this.resetInput()
          })
          this.tableLoading = false
        })
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
          this.allEmpData.query = true
          if (this.tabType === this.TAB_EMPLOYEE && resp.result) {
            initData(resp.result)
            this.allEmpData.data = resp.result
          }
        }).catch(() => {
          this.$notify.error('查询用户信息失败')
        }).finally(() => {
          if (type && this.tabType === this.TAB_EMPLOYEE) {
            setSelectedDataFull()
          }
          this.$nextTick(() => {
            this.resetInput()
          })
          this.tableLoading = false
          // this.initEmployeeDataFlag = true
        })
    },
    getAllEmployeeList () {
      // this.tableLoading = true
      const param = {}
      if (this.queryType === 1 || this.queryType === 2) {
        param.queryType = this.queryType
      }
      this.$http.fetch(this.$api.marketing.weworkMarketing.queryEmployeeWechatInfoList, param)
        .then(resp => {
          // 赋值员工数据
          if (resp.result) {
            // initData(resp.result)
            this.allEmployees = resp.result
          }
        }).catch(() => {
          this.$notify.error('查询用户信息失败')
        }).finally(() => {
        })
    },
    // 初始化数据
    initData (result) {
      this.allEmployeeData = (this.tabType === this.TAB_EMPLOYEE || this.tabType === this.TAB_CHATROOM) ? clone(result) : this.handleGroupList(clone(result), 'onlyGroup')
      this.matchEmployeeData = clone(this.allEmployeeData)
      const obj = this.pageingData(this.allEmployeeData, 0)
      this.employeeData = this.handleShowData(obj.dataList, this.tabType)
      this.pagination4Emp.total = obj.total
      this.pagination4Emp.page = 1
    },
    // 完善选中的信息
    setSelectedDataFull () {
      if (this.value && this.value.type === this.tabType) {
        this.selectedData = this.setFullInfo(JSON.parse(JSON.stringify(this.value.data)))
      } else {
        this.selectedData = []
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
        if (tabType === this.TAB_EMPLOYEE) {
          const arr = this.handleEmployeeList(data, this.departData.allDepartments)
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
      const obj = this.pageingData(this.matchEmployeeData, this.pagination4Emp.size * (page - 1))
      this.employeeData = this.handleShowData(obj.dataList, this.tabType)
      this.pagination4Emp.total = obj.total
      this.pagination4Emp.page = page
      this.$nextTick(() => {
        this.fileData()
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
        const arrObj = data.slice(pageIndex, ((pageIndex + this.pagination4Emp.size) < data.length ? (pageIndex + this.pagination4Emp.size) : data.length + 1))
        pageData.dataList = clone(arrObj)
      }
      return pageData
    },
    // 获取分群信息
    getGroupList (type, initData, setSelectedDataFull) {
      this.tableLoading = true
      this.$http.fetch(this.$api.marketing.weworkMarketing.getSubdivisionList)
        .then(resp => {
          // 赋值员工数据
          this.allGroupData.query = true
          if (this.tabType === 'group' && resp.result) {
            initData(resp.result)
            this.allGroupData.data = resp.result
          }
        }).catch(() => {
          this.$notify.error('查询客户分群加载失败')
        }).finally(() => {
          // 设置已选择的信息
          if (type && this.tabType === 'group') {
            setSelectedDataFull()
          }
          this.$nextTick(() => {
            this.resetInput()
          })
          this.tableLoading = false
          this.initGroupDataFlag = true
        })
    },
    // 处理客户分群信息
    handleGroupList (data, type) {
      if (data && data.length > 0) {
        const onlyCat = (type === 'onlyCatalog')
        const filterList = data.filter(index => (onlyCat ? index.is_category === 1 : index.is_category !== 1))
        if (filterList && filterList.length > 0 && !onlyCat) {
          filterList.map(item => {
            const filterList2 = data.filter(index => item.parent_id === index.id)
            if (filterList2 && filterList2.length > 0) {
              Object.assign(item, { className: filterList2[0].subdivision_name })
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
      // this.employeeData = JSON.parse(JSON.stringify(this.copySelectedData))
      this.visible = false
    },
    // 保存已选
    onSave () {
      if (this.selectedData.length > 0) {
        this.callbackData(JSON.parse(JSON.stringify(this.selectedData)))
        this.visible = false
      } else {
        this.$notify.warning('请选择' + (this.tabType === 'group' ? '分群' : '员工'))
      }
    },
    /**
     * 返回数据
     */
    callbackData (data) {
      const transData = this.transformData(data)
      this.$emit('input', transData)
      this.$emit('change', transData)
    },
    // 设置返回信息
    transformData (data) {
      const resultObj = {
        data: [],
        type: this.tabType
      }
      const propsName = this.objProps
      if (data && data.length > 0) {
        if (this[propsName] && Object.getOwnPropertyNames(this[propsName]).length > 0) {
          const result = []
          const propsSet = Object.getOwnPropertyNames(this[propsName])
          data.map(item => {
            const returnObj = {}
            propsSet.forEach(pro => {
              returnObj[this[propsName][pro]] = item[pro]
            })
            result.push(returnObj)
          })
          resultObj.data = result
        }
      }
      return resultObj
    },
    $sizeChange$ (size) {
      this.pagination4Emp.size = size
      this.$nextTick(() => {
        return this.changePage(1)
      })
    }
  },
  mounted () {
    this.getDepartmentTree()
    this.getShopAreaAndShop()
    this.getAllEmployeeList()
    this.shopArea = this.area
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
