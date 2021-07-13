<template>
  <el-dialog
    class="room-dialog"
    title="选择群聊"
    width="940px"
    :visible="visible"
    @close="close"
    @open="open"
    modal-append-to-body
    append-to-body
  >
    <el-form class="room-search el-form-reset" label-width="80px" inline>
      <el-form-item label="群名称：">
        <el-input v-model="model.name" :maxlength="20" placeholder="请输入群名称"/>
      </el-form-item>
      <el-form-item label="工作门店：">
        <el-form-grid >
          <ns-droptree
            ref="shopCateTree"
            :defaultExpandAll='true'
            placeholder="请选择区域"
            :lazy="true"
            :load="loadAreaTree"
            :multiple="false"
            v-model="shopAreaId"
            clearable
          />
        </el-form-grid>
        <el-form-grid>
          <el-select-load v-model="model.workShopId" :options="shops"  filterable clearable :page-sizes="20" placeholder="请选择门店">
          </el-select-load>
        </el-form-grid>
      </el-form-item>
      <el-form-item label="群主部门：">
        <ns-droptree
          ref="employeeDepartTree"
          :lazy="true"
          :load="loadDepartments"
          :multiple="false"
          v-model="model.departmentId"
          clearable
        />
      </el-form-item>
      <el-form-item label="群主：">
        <el-input :maxlength="20"  placeholder="请输入群主姓名" v-model="model.ownerName"/>
      </el-form-item>
      <el-form-item style="margin-left: 20px">
        <ns-button type="primary" @click="search">搜索</ns-button>
        <ns-button @click="resetSearch">重置</ns-button>
        <ns-button @click="selectAll">全部选择</ns-button>
        <ns-button @click="clearAll">清空</ns-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="24" class="room-content">
      <el-col :span="12">
        <el-table
          v-loading="_data._table.loadingtable"
          ref="ChatRoomTable"
          height="260"
          :data="_data._table.data"
          @select="selectOne"
          @select-all="selectPageAll"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="name" label="群名称"/>
          <el-table-column :show-overflow-tooltip="true"  label="群主">
            <template slot-scope="scope">
              {{ scope.row.owner_name}}{{scope.row.owner_work_num ? '('+ scope.row.owner_work_num +')' : ''}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="person_num" label="群成员"/>
          <el-table-column :show-overflow-tooltip="true" prop="workShopName" label="群主工作门店" width="100"/>
        </el-table>
        <el-pagination
          v-if="_data._pagination.enable"
          :page-sizes="_data._pagination.sizeOpts"
          :total="_data._pagination.total"
          :current-page="_data._pagination.page"
          :page-size="_data._pagination.size"
          layout="total, sizes, prev, pager, next"
          @size-change="pageSizeChange"
          @current-change="pageChange"
        />
      </el-col>
      <el-col :span="12">
        <el-table
          v-loading="_data._table.loadingtable"
          v-el-table-infinite-scroll="load"
          infinite-scroll-immediate="false"
          ref="employeeTable"
          height="260"
          :data="selectedChatRooms"
        >
          <el-table-column :show-overflow-tooltip="true" prop="name" :label="selectedTip"/>
          <el-table-column :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.owner_name}}{{scope.row.owner_work_num ? '('+ scope.row.owner_work_num +')' : ''}}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="person_num"/>
          <el-table-column :show-overflow-tooltip="true" prop="workShopName"/>
          <el-table-column  prop="select" align="center" width="55" >
            <template slot-scope="scope">
              <ns-button
                :disabled="auth && scope.row.auth"
                type="text"
                size="mini"
                @click="removeOneSelection(scope)"
                class="el-table__btn--font"
              >
                <Icon type="delete" className="code-delete"/>
              </ns-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <NsButton @click="close" size="medium">取 消</NsButton>
      <NsButton type="primary" size="medium" @click="confirm">保 存</NsButton>
    </span>
  </el-dialog>
</template>

<script>
import NsDroptree from '@nascent/ecrp-ecrm/src/components/NsDroptree'
import ElSelectLoad from '@nascent/nui/lib/select-load'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import infiniteScroll from 'vue-infinite-scroll'

export default {
  components: {
    NsDroptree,
    ElSelectLoad
  },
  directives: { infiniteScroll },
  mixins: [tableMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 是否添加登录账号店铺数据权限
    auth: {
      type: Boolean,
      default: true
    },
    chatIds: {
      type: Array,
      default: function () {
        return []
      }
    },
    rooms: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      // 区域
      areaTree: [],
      shopAreaId: '',
      // 门店
      allShops: [],
      shops: [],
      // 部门
      allDepartments: [],
      departments: [],
      url: this.$api.guide.chatRoomConfig.chatRoomCanJoinList,
      model: {
        workShopId: '',
        departmentId: '',
        name: '',
        ownerName: ''
      },
      selectedChatRooms: [], // 选中的群
      showChatRoomIds: [],
      unShowChatRoomIds: []
    }
  },
  computed: {
    selectedTip () {
      return `已选${this.showChatRoomIds.length + this.unShowChatRoomIds.length}个群`
    }
  },
  watch: {
    shopAreaId: function (o1, o2) {
      let shopOptions = []
      this.shopId = ''
      if (!o1.value || o1.value !== o2.value) {
        if (o1.value === 0) {
          this.shops = this.allShops
          return
        }
        this.allShops.map(item => {
          if (!o1.value || (item.ext && item.ext.indexOf(o1.value) !== -1)) {
            shopOptions.push(item)
          }
        })
        this.shops = shopOptions
      }
    }
  },
  mounted () {
    this.getAreasAndShops()
    this.getDepartmentTree()
    this.$searchAction$()
  },
  methods: {
    async load () {
      if (this.unShowChatRoomIds.length) {
        const showChatRoomIds = this.unShowChatRoomIds.slice(0, 30)
        this.unShowChatRoomIds = this.unShowChatRoomIds.slice(30)
        this.showChatRoomIds.push(...showChatRoomIds)
        const roomList = await this.findChatRoomsByRoomId(showChatRoomIds)
        this.selectedChatRooms.push(...roomList)
      }
    },
    close () {
      this.model = {
        workShopId: '',
        departmentId: '',
        name: '',
        ownerName: ''
      }
      this.$emit('update:visible', false)
    },
    async open () {
      this._data._table.searchMap = this.model
      await this.$reload()

      // 根据id查询已选择的
      if (this.chatIds.length > 0) {
        this.showChatRoomIds = this.chatIds.slice(0, 30)
        this.unShowChatRoomIds = this.chatIds.slice(30)
        const roomList = await this.findChatRoomsByRoomId(this.showChatRoomIds)
        this.selectedChatRooms = roomList
        this.selectItem()
      }
    },
    confirm () {
      if (this.selectedChatRooms.length < 1) {
        this.$notify.warning('请选择群组')
        return
      }

      // 群id
      this.$emit('update:chatIds', [ ...this.showChatRoomIds, ...this.unShowChatRoomIds ])

      this.close()
    },
    async search () {
      // await this.$searchAction$()
      this._data._table.searchMap = this.model
      this._data._pagination.page = 1
      await this.$reload()

      this.selectItem()
    },
    async resetSearch () {
      this.model = {
        workShopId: '',
        departmentId: '',
        name: '',
        ownerName: ''
      }
      this._data._table.searchMap = this.model
      this._data._pagination.page = 1
      await this.$reload()

      this.selectItem()
    },
    async selectAll () {
      this._data._table.data.forEach(item => {
        this.$refs.ChatRoomTable.toggleRowSelection(item, true)
      })

      // 查询所有条件下所有的群id数据
      const allRoomIds = await this.findAllChatRoomIds()
      // 与已选中的所有id取并集
      const sumAllRoomIds = Array.from(new Set([ ...allRoomIds, ...this.showChatRoomIds, ...this.unShowChatRoomIds ]))

      this.showChatRoomIds = sumAllRoomIds.slice(0, 30)
      this.unShowChatRoomIds = sumAllRoomIds.slice(30)

      const roomList = await this.findChatRoomsByRoomId(this.showChatRoomIds)
      this.selectedChatRooms = roomList
    },
    clearAll () {
      this.$refs.ChatRoomTable.clearSelection()
      this.selectedChatRooms = []
      this.showChatRoomIds = []
      this.unShowChatRoomIds = []
    },
    selectOne (selection, row) {
      if (this.selectedChatRooms.findIndex(item => item.chat_id === row.chat_id) > -1) {
        // 取消选中
        this.showChatRoomIds = this.showChatRoomIds.filter(roomId => roomId !== row.chat_id)
        this.selectedChatRooms = this.selectedChatRooms.filter(item => item.chat_id !== row.chat_id)
      } else {
        // 选中
        this.showChatRoomIds.push(row.chat_id)
        this.selectedChatRooms.push(row)
      }
      this.unShowChatRoomIds = this.unShowChatRoomIds.filter(roomId => roomId !== row.chat_id)
    },
    selectPageAll (selection) {
      if (selection.length === 0) {
        // 取消全选当前页
        for (let data of this._data._table.data) {
          const index = this.selectedChatRooms.findIndex(item => item.chat_id === data.chat_id)
          if (index > -1) {
            this.showChatRoomIds = this.showChatRoomIds.filter(roomId => roomId !== data.chat_id)
            this.unShowChatRoomIds = this.unShowChatRoomIds.filter(roomId => roomId !== data.chat_id)
            this.selectedChatRooms.splice(index, 1)
          }
        }
        if (!this.selectedChatRooms.length < 15) {
          this.load()
        }
      } else {
        // 全选当前页
        for (let data of selection) {
          const index = this.selectedChatRooms.findIndex(item => item.chat_id === data.chat_id)
          if (index === -1) {
            this.showChatRoomIds.push(data.chat_id)
            this.unShowChatRoomIds.filter(roomId => roomId !== data.chat_id)
            this.selectedChatRooms.push(data)
          }
        }
      }
    },
    removeOneSelection (scope) {
      this.selectedChatRooms.splice(scope.$index, 1)
      this.showChatRoomIds = this.showChatRoomIds.filter(roomId => roomId !== scope.row.chat_id)
      this.unShowChatRoomIds = this.unShowChatRoomIds.filter(roomId => roomId !== scope.row.chat_id)
      this._data._table.data.forEach(item => {
        if (item.chat_id === scope.row.chat_id) {
          this.$refs.ChatRoomTable.toggleRowSelection(item, false)
        }
      })
      if (!this.selectedChatRooms.length < 15) {
        this.load()
      }
    },
    async pageChange (page) {
      await this.$pageChange$(page)
      // 勾选选中的
      this.selectItem()
    },
    async pageSizeChange (size) {
      await this.$sizeChange$(size)
      // 勾选选中的
      this.selectItem()
    },
    selectItem () {
      if (!this.selectedChatRooms.length) {
        this.load()
      }

      this._data._table.data.forEach(item => {
        this.showChatRoomIds.forEach(roomId => {
          if (roomId === item.chat_id) {
            this.$refs.ChatRoomTable.toggleRowSelection(item, true)
          }
        })

        this.unShowChatRoomIds.forEach(roomId => {
          if (roomId === item.chat_id) {
            this.$refs.ChatRoomTable.toggleRowSelection(item, true)
          }
        })
      })
    },
    /**
     * 根据查询条件获取全选的id集合
     */
    async findAllChatRoomIds () {
      try {
        const res = await this.$http.fetch(this.$api.guide.chatRoomConfig.canJoinChatIdList, { searchMap: this.model })
        return res.result
      } catch (error) {
        this.$notify.error('查询群集合失败')
      }
    },
    /**
     * 根据群id数组查询对应的群数据
     */
    async findChatRoomsByRoomId (roomIds) {
      try {
        const res = await this.$http.fetch(this.$api.guide.chatRoomConfig.findByChatIds, { chatIds: roomIds })
        return res.result
      } catch (error) {
        this.$notify.error('查询已选群失败')
      }
    },
    /**
     * 获取区域树和门店列表
     */
    getAreasAndShops () {
      this.$http.fetch(this.$api.core.sysShop.getShopTree)
        .then((resp) => {
          this.areas = resp.result.shopAreaTree
          this.allShops = resp.result.shopOptions
          this.shops = resp.result.shopOptions
        }).catch(() => {
          this.$notify.error('加载下拉树、下拉框数据失败')
        })
    },
    /**
     * 获取部门树
     */
    getDepartmentTree () {
      this.$http.fetch(this.$api.core.department.queryDepartmentTreeByYun)
        .then((resp) => {
          this.allDepartments = resp.result
          this.departments = resp.result
        }).catch(() => {
          vm.$notify.error('查询部门树失败')
        })
    },
    /**
     * 加载区域树数据
     */
    loadAreaTree (node, resolve) {
      if (node.level === 0) {
        // 初次加载
        const rootTree = []
        for (let item of this.areas) {
          let parentId = item.parentId // 每一项的父级id
          let flag = false
          for (let item of this.areas) {
            if (parentId === item.id) {
              flag = true
              break
            }
          }
          if (!flag) {
            rootTree.push(item)
          }
        }
        return resolve(rootTree)
      }

      if (node.level >= 1) {
        // 点击之后触发
        const filter = this.areas.filter(data => parseInt(data.parentId) === parseInt(node.data.id))
        return resolve(filter)
      }
    },
    /**
     * 加载部门
     */
    loadDepartments (node, resolve) {
      if (node.level === 0) { // 第一次调用
        return resolve([{ id: 0, parentId: -1, code: 0, label: '全部', checked: false, showAdd: true, showEdit: true, showDelete: true }])
      }
      if (node.level >= 1) {
        // 点击之后触发
        let filter = this.allDepartments.filter(data => parseInt(data.parentId) === parseInt(node.data.id))
        return resolve(filter)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./reset.css";

.room-dialog {
  .room-content {
    width: 100%;
  }
}
</style>
