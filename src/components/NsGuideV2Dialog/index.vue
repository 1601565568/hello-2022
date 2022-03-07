<template>
  <el-dialog
    :visible="visible"
    width="1250px"
    :modal-append-to-body='appendToBody'
    :append-to-body='appendToBody'
    :before-close="close"
    @open="open"
  >
    <div slot="title">
      {{dialogTitle}}
      <el-tooltip v-if="titleTip" :content="titleTip">
        <Icon type="question-circle"></Icon>
      </el-tooltip>
    </div>
    <div
      v-loading="openLoading || mapLoading"
      :element-loading-text="mapLoading ? `${((Object.keys(selectedGuideIdMap).length / _data._pagination.total) * 100).toFixed(2)}%` : ''"
    >
      <el-form class="el-form-reset" label-width="85px" inline>
        <el-form-item label="工作门店：">
          <ns-droptree
            placeholder="请选择区域"
            :multiple="false"
            :data="shopAreaTree"
            v-model="shopArea"
            :clearable='false'
            @current-change="shopAreaChange"
          />
        </el-form-item>
        <el-form-item label="工作门店：">
          <el-select-load
            placeholder="选择门店"
            v-model="model.shopId"
            :options="shopOptions"
            filterable
            clearable
            :page-sizes="20"
          />
        </el-form-item>
        <el-form-item label="选择部门：">
          <ns-droptree
            :data="departmentTree"
            :multiple="false"
            v-model="department"
            @input="(item) => { model.empDepar = item.value }"
            clearable
          />
        </el-form-item>
        <el-form-item label="员工类型：">
          <el-select v-model="model.job" clearable >
            <el-option label="全部" :value="null"></el-option>
            <el-option label="店长" :value="1"></el-option>
            <el-option label="导购" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工状态：">
          <el-select v-model="model.status" clearable >
            <el-option label="全部" :value="3"></el-option>
            <el-option label="在职" :value="1"></el-option>
            <el-option label="离职" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工姓名：">
          <el-input :maxlength="20" v-model="model.empName"/>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input :maxlength="20" v-model="model.mobile"/>
        </el-form-item>
        <el-form-item>
          <ns-button type="primary" @click="search">搜索</ns-button>
          <ns-button @click="reset">重置</ns-button>
          <ns-button @click="selectAllPage">全部选择 </ns-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="12">
          <el-table
            ref="GuideTable"
            height="260"
            v-loading="_data._table.loadingtable"
            :data="_data._table.data"
            @select="selectOne"
            @select-all="selectAll"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="员工姓名" align="left"/>
            <el-table-column :show-overflow-tooltip="true" prop="shopNames" label="工作门店" align="left"/>
            <el-table-column :show-overflow-tooltip="true" type="default" prop="status" label="员工状态" align="left">
              <template slot-scope="scope">
                <span>{{scope.row.status === 1 ? '在职': '离职' }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="_data._pagination.enable"
            :page-sizes="_data._pagination.sizeOpts"
            :total="_data._pagination.total"
            :current-page="_data._pagination.page"
            :page-size="_data._pagination.size"
            layout="total, sizes, prev, pager, next"
            @size-change="sizeChange"
            @current-change="pageChange"
          />
        </el-col>
        <el-col :span="12">
          <el-table
            v-loading="_data._table.loadingtable"
            v-el-table-infinite-scroll="loadMore"
            infinite-scroll-immediate="false"
            ref="employeeTable"
            height="260"
            :data="showSelectedList"
          >
            <el-table-column :show-overflow-tooltip="true" prop="name" :label="`已选${Object.keys(selectedGuideIdMap).length}个员工`">
            </el-table-column>
            <el-table-column  prop="select" align="center" width="55" >
              <template slot="header">
                <span @click="clearAllPage">清空</span>
              </template>
              <template v-slot="scope">
                <ns-button
                  type="text"
                  size="mini"
                  @click="removeOneSelection(scope.row)"
                  class="el-table__btn--font"
                >
                  <Icon type="delete" className="code-delete"/>
                </ns-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <ns-button @click="close">取消</ns-button>
      <ns-button type="primary" @click="confirm" :disabled="openLoading || mapLoading">确定</ns-button>
    </div>
  </el-dialog>
</template>

<script>
import NsDroptree from '../NsDroptree'
import ElSelectLoad from '@nascent/nui/lib/select-load'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'

/**
 * 选择员工组件重构
 */
export default {
  name: 'NsGuideDialog',
  mixins: [tableMixin],
  components: {
    NsDroptree,
    ElSelectLoad
  },
  model: {
    prop: 'guideIds'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    guideIds: { // 选中的导购id数组
      type: Array,
      default: function () {
        return []
      }
    },
    guideUrl: {
      type: Object,
      default: function () {
        return this.$api.core.sysUser.queryGuidePage
      }
    },
    guideFindUrl: {
      type: Object,
      default: function () {
        return this.$api.core.sysUser.findByGuideIds
      }
    },
    switchAreaFlag: { // 是否支持按区域选中 0 不支持 1 支持
      type: Number,
      default: function () {
        return 0
      }
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    dialogTitle: String, // 标题
    titleTip: String, // 标题ns-help提示
    rawInput: {
      /**
       * 保存时 触发是否触发回调 rawList 事件 暴露选中的原数据 可指定最多暴露条数
       *  Boolean: true 全部数据 false 不触发
       *  Number 指定条数
       * 默认不触发
       */
      type: [Boolean, Number],
      default: false
    }
  },
  data () {
    return {
      shopOptions: [], // 门店options
      allShopOptions: [], // 所有门店
      shopAreaTree: [], // 区域树
      departmentTree: [], // 部门树

      openLoading: false,
      mapLoading: false,
      selectedGuideIdMap: {},
      showSelectedList: [],
      unShowSelectedList: [],

      shopArea: {}, // 选择的区域，筛选门店
      department: {}, // 选择的部门
      model: {
        empName: '', // 员工姓名
        job: null, // 导购类型 0 导购 1 店长
        mobile: '', // 手机号
        empDepar: null, // 部门id 如 1,2,3,4,5
        areaId: '', // 区域ID
        auth: false, // 是否添加登录账号默认权限
        shopId: '', // 店铺id
        // userIds: '', // 员工guideId集合
        switchAreaFlag: 0, // 标识是否支持区域切换 1：支持 0：不支持
        fileImportKey: '', // 文件导入的解析结果映射 redisKey
        manualInputKey: '', // 手工输入的解析结果映射 redisKey
        status: 3
      }
    }
  },
  computed: {},
  methods: {
    async open () {
      this.openLoading = true
      this.url = this.guideUrl
      // 查询部门列表
      await this.getDepartmentList()
      // 查询区域列表 以及 门店列表
      await this.getShopAreaAndShopList()
      // 查询待选择数据
      await this.$reload()
      // 已选中勾选
      await this.initSelectedData(this.guideIds.length, 'open')
      this.openLoading = false
    },
    close () {
      this.openLoading = false
      this.mapLoading = false
      this.resetDialog()
      this.$emit('update:visible', false)
    },
    confirm () {
      this.$emit('input', Object.keys(this.selectedGuideIdMap))

      if (this.rawInput) {
        // 暴露选中的list
        if (this.rawInput === true) {
          this.$emit('rawList', [ ...this.showSelectedList, ...this.unShowSelectedList ])
        }

        if (typeof this.rawInput === 'number') {
          let rawList
          if (this.showSelectedList.length >= this.rawInput) {
            rawList = this.showSelectedList.slice(0, this.rawInput)
          } else {
            rawList = [...this.showSelectedList, ...this.unShowSelectedList.slice(0, this.rawInput - this.showSelectedList.length)]
          }
          this.$emit('rawList', rawList)
        }
      }

      this.close()
    },
    // 加载更多
    loadMore () {
      if (this.unShowSelectedList.length) {
        const showSelectedList = this.unShowSelectedList.slice(0, 30)
        this.unShowSelectedList = this.unShowSelectedList.slice(30)
        this.showSelectedList.push(...showSelectedList)
      }
    },
    // 改变区域 过滤门店列表
    shopAreaChange (data) {
      this.shopOptions = this.allShopOptions.filter(item => item.ext.indexOf(data.id) > -1)
      this.model.shopId = ''
    },
    // 搜索
    async search () {
      this.reload({ page: 1 })
    },
    // 重置
    reset () {
      this.resetDialog()
      this.reload({ page: 1 })
    },
    resetDialog () {
      this.shopArea = {}
      this.department = {}
      this.shopOptions = this.allShopOptions

      this.model = {
        empName: '',
        job: null,
        mobile: '',
        empDepar: null,
        areaId: '',
        auth: false,
        shopId: '',
        switchAreaFlag: 0,
        fileImportKey: '',
        manualInputKey: '',
        status: 3
      }
    },
    // 勾选一个
    selectOne (_, row) {
      if (this.selectedGuideIdMap[row.id]) {
        this.makeMap('del', row)
      } else {
        this.makeMap('set', row)
      }
    },
    // 勾选当前页
    selectAll (selection) {
      if (selection.length) {
        selection.forEach(item => {
          this.makeMap('set', item)
        })
      } else {
        this._data._table.data.forEach(item => {
          this.makeMap('del', item)
        })
      }
    },
    // 选中项中操作删除一个
    removeOneSelection (removeItem) {
      this.makeMap('del', removeItem)

      this._data._table.data.forEach(iten => {
        if (iten.id === removeItem.id) {
          this.$refs.GuideTable.toggleRowSelection(iten, false)
        }
      })
    },
    // 全选所有
    async selectAllPage () {
      await this.initSelectedData(this._data._pagination.total, 'allcheck')
    },
    // 清空全选
    clearAllPage () {
      this.showSelectedList = []
      this.unShowSelectedList = []
      this.selectedGuideIdMap = {}
      this.$refs.GuideTable.clearSelection()
    },
    // 翻页
    async pageChange (page) {
      await this.reload({ page })
    },
    // 改pageSize
    async sizeChange (size) {
      await this.reload({ page: 1, size })
    },
    // 勾选当前页
    checkCurrentPageAll () {
      this._data._table.data.forEach(item => {
        if (this.selectedGuideIdMap[item.id]) {
          this.$refs.GuideTable.toggleRowSelection(item, true)
        }
      })
    },
    async reload ({ page, size }) {
      this._data._pagination.page = page
      if (size) this._data._pagination.size = size
      await this.$reload()
      this.checkCurrentPageAll()
    },
    async $reload () { // overwrite $reload
      const { page: pageNo, size: pageSize } = this._data._pagination
      await this.$queryList$({ pageNo, pageSize, ...this.model })
    },
    // 勾选时，生成选择数据的Map
    makeMap (type, item) { // type: 'set' | 'del'
      if (type === 'set') {
        this.$set(this.selectedGuideIdMap, item.id, item.name)

        const showIndex = this.showSelectedList.findIndex(iten => iten.id === item.id)
        if (showIndex === -1) this.showSelectedList.push(item)

        const unShowIndex = this.unShowSelectedList.findIndex(iten => iten.id === item.id)
        if (unShowIndex !== -1) this.unShowSelectedList.splice(unShowIndex, 1)
      } else if (type === 'del') {
        if (this.selectedGuideIdMap[item.id]) this.$delete(this.selectedGuideIdMap, item.id, item.name)

        const showIndex = this.showSelectedList.findIndex(iten => iten.id === item.id)
        if (showIndex !== -1) this.showSelectedList.splice(showIndex, 1)

        const unShowIndex = this.unShowSelectedList.findIndex(iten => iten.id === item.id)
        if (unShowIndex !== -1) this.unShowSelectedList.splice(unShowIndex, 1)
      }
    },
    // 全选 或 打开 初始化
    async initSelectedData (total, type) {
      if (type !== 'allcheck' && type !== 'open') return
      if (!total) return

      this.mapLoading = true

      const selectedList = []
      this.showSelectedList = []
      this.unShowSelectedList = []
      this.selectedGuideIdMap = {}

      const pageSize = 5000
      const pageNum = Math.ceil(total / pageSize)

      const itePageNum = Array(pageNum).fill(1)
      let i = 1
      for (const item of itePageNum) {
        let res
        let list = []
        if (type === 'allcheck') {
          res = await this.$http.fetch(this.url, { pageSize, pageNo: i, ...this.model })
          list = res.result.data
        } else {
          res = await this.$http.fetch(this.guideFindUrl, { userIds: this.guideIds.slice((i - 1) * pageSize, i * pageSize).join(',') })
          list = res.result
        }

        selectedList.push(...list)

        list.forEach(item => {
          this.$set(this.selectedGuideIdMap, item.id, item.name)
        })

        if (!this.showSelectedList.length && list) {
          this.showSelectedList = selectedList.slice(0, 30)
        }

        if (itePageNum.length === i) {
          this.unShowSelectedList = selectedList.slice(30)
        }

        i++
      }

      // 选中当前页
      this.checkCurrentPageAll()

      this.mapLoading = false
    },
    // API 获取所有区域 和 门店
    async getShopAreaAndShopList () {
      const resp = await this.$http.fetch(this.$api.core.sysShop.getShopTree)
      if (resp.success) {
        this.shopAreaTree = this.getTree(resp.result.shopAreaTree, '0')
        this.allShopOptions = resp.result.shopOptions
        this.shopOptions = resp.result.shopOptions
      } else {
        this.$notify.error('查询部门树失败')
      }
    },
    // API 获取所有部门
    async getDepartmentList () {
      const resp = await this.$http.fetch(this.$api.core.department.queryDepartmentTreeByYun)
      if (resp.success) {
        this.departmentTree = [{ id: '0', parentId: '-1', label: '全部', children: this.getTree(resp.result, '0') }]
      } else {
        this.$notify.error('查询部门树失败')
      }
    },
    getTree (list, parentId) {
      const parent = []
      const child = []
      for (const item of list) {
        if (item.parentId === parentId) {
          parent.push(item)
        } else {
          child.push(item)
        }
      }

      if (parent.length) {
        for (const item of parent) {
          if (child.length) {
            item.children = this.getTree(child, item.id)
          } else {
            item.children = []
          }
        }
      }

      return parent
    }
  }
}
</script>

<style scoped>
</style>
