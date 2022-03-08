<template>
  <div class="master-drawer">
    <div class='drawer-content'>
      <div class='master-close'>
        <i class="el-icon-close" @click="handleBackFirst"></i>
      </div>
      <div class='header-title'>
        <h4 v-if='isSecondDrawer' class='header-title_text header-title_text__grey' @click='handleBackFirst'>{{secondDrawerName}}的裂变大师明细<span class='header-title_text__span'>/</span></h4>
        <h4 class='header-title_text'>{{chooseFriend.employeeName}}邀请好友的明细</h4>
        <span class='header-title_num'>共{{chooseFriend.inviteFriendNumber}}人</span>
      </div>
      <div class='analysis-content'>
        <page-table  :searchCol='24'>
          <template slot='search'>
            <el-form :inline="true" class='form-inline_top' @submit.native.prevent>
              <el-form-item label="">
                <el-input v-model="seachVal" placeholder="请输入好友昵称"  @keyup.enter.native="handleSearch">
                  <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
                </el-input>
              </el-form-item>
            </el-form>
          </template>
          <template slot='table'>
            <template>
              <el-table
                :data="_data._table.data"
                class="new-table_border"
                v-loading.lock="_data._table.loadingtable"
                @sort-change="handleSort"
                style="width: 100%">
                <el-table-column
                  prop="friendName"
                  label="好友昵称">
                  <template slot-scope="scope">
                    <div class="scope-title">
                      <img :src='scope.row.friendAvatar||defaultIcon' class="scope-title_img">
                      <div class="scope-title_text">
                        {{scope.row.friendName|| '-'}}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="friendName"
                  label="添加员工">
                  <template slot-scope="scope">
                    <div class="scope-title">
                      <div class="scope-title_text">
                        {{scope.row.addEmployeeName|| '-'}}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="addTime"
                  sortable="custom"
                  label="最近添加好友时间">
                  <template slot-scope="scope">
                    <div class="scope-title_text">
                      {{scope.row.addTime|| '-'}}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </template>
          <template slot='pagination'>
            <template v-if='!isSecondDrawer'>
              <div class='drawer-pagination'>
                <div class='pagecontent-left'>
                  <div class='content-item' @click='handlePrev'><i class="el-icon-arrow-left"></i>上一个{{nextName}}</div>
                  <div class='content-item' @click='handleNext'>下一个{{nextName}}<i class="el-icon-arrow-right"></i></div>
                </div>
                <el-pagination v-if="_data._pagination.enable"
                              class="template-table__pagination"
                              :page-sizes="_data._pagination.sizeOpts"
                              :total="_data._pagination.total"
                              :current-page="_data._pagination.page"
                              :page-size="_data._pagination.size"
                              layout="total, prev, pager, next, jumper"
                              @size-change="$sizeChange$"
                              @current-change="$pageChange$">
                </el-pagination>
              </div>
            </template>
            <template v-else>
              <el-pagination v-if="_data._pagination.enable"
                            class="template-table__pagination"
                            :page-sizes="_data._pagination.sizeOpts"
                            :total="_data._pagination.total"
                            :current-page="_data._pagination.page"
                            :page-size="_data._pagination.size"
                            layout="total, prev, pager, next, jumper"
                            @size-change="$sizeChange$"
                            @current-change="$pageChange$">
              </el-pagination>
            </template>
          </template>
        </page-table>
      </div>
    </div>
  </div>
</template>

<script>
import PageTable from '../PageTable'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import defaultIcon from '@/assets/defultheadPic.png'
const originModel = {
  friendName: null,
  guideId: null,
  promotionMasterIds: null
}
export default {
  data () {
    return {
      model: {
        guestCodeId: this.$route.query.guestCodeId,
        friendName: null,
        guideId: null,
        promotionMasterIds: null
      },
      url: this.$api.guide.customerCode.getFriendListByParam,
      seachDate: [],
      seachVal: '',
      isSecondDrawer: false, // 是否是二级drawer
      secondDrawerName: null, // 一级drawer名称
      secondDrawerId: null, // 一级drawerguideId
      defaultIcon
    }
  },
  components: { PageTable },
  mixins: [tableMixin],
  computed: {
    nextName () {
      return this.chooseFriend && this.chooseFriend.nextName ? this.chooseFriend.nextName : '员工'
    }
  },
  props: {
    chooseFriend: {
      default () {
        return {}
      }
    }
  },
  methods: {
    // 修改请求参数
    changeSearchfrom (obj = {}) {
      this.model = Object.assign(this.model, obj)
      this.$searchAction$()
    },
    handleSearch () {
      this.changeSearchfrom({ friendName: this.seachVal })
    },
    handleSort (data) {
      const order = data.order
      const prop = data.prop
      const sortData = {
        addTime: 'addTimeOrder',
        descending: 'desc',
        ascending: 'asc'
      }
      this.changeSearchfrom(Object.assign({}, { [sortData[prop]]: sortData[order] }))
    },
    // 关闭弹框
    handleClose () {
      this.$emit('onClose')
    },
    // 回到一级drawe
    handleBackFirst () {
      if (this.isSecondDrawer) {
        this.$emit('showMaster', { guideId: this.secondDrawerId, employeeName: this.secondDrawerName, promotionMasterNumber: this.chooseFriend.promotionMasterNumber })
      } else {
        this.handleClose()
      }
    },
    handlePrev () {
      this.$emit('onPrev')
    },
    handleNext () {
      this.$emit('onNext')
    },
    resetModel () {
      this.model = { ...JSON.parse(JSON.stringify(originModel)),
        guestCodeId: this.$route.query.guestCodeId,
        guideId: this.model.guideId,
        promotionMasterIds: this.model.promotionMasterIds }
      this.seachVal = ''
    }
  },
  watch: {
    // 切换导购触发
    chooseFriend: {
      handler (newVal) {
        if (newVal.guideId) {
          if (newVal.oldGuideId) {
            this.isSecondDrawer = true
            this.secondDrawerName = newVal.oldName
            this.secondDrawerId = newVal.oldGuideId
          } else {
            this.isSecondDrawer = false
          }
          this.changeSearchfrom({ guideId: newVal.guideId, promotionMasterIds: newVal.promotionMasterId })
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../styles/reset.css";
.master-drawer {
  height: 100vh;
  overflow-y: auto;
}
.drawer-content {
   position: relative;
  padding: 12px 16px;
  min-height: 100vh;
  padding-bottom: 50px;
}
.master-close {
  font-size: 16px;
  padding: 16px 16px 32px 16px;
  .el-icon-close {
    cursor: pointer;
  }
}
.header-title {
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 16px;
  color: #262626;
  line-height: 24px;
  .header-title_num {
    font-size: 16px;
    color: #595959;
    line-height: 24px;
    margin-left:16px;
  }
  .header-title_text__span {
    padding: 0 10px;
  }
}
.header-title_text__grey {
  color: #8C8C8C;
  cursor: pointer;
  &:hover {
    color: #40AEFC;
  }
}
.scope-title {
  display: flex;
  align-items: center;
}
.scope-title_img {
  height: 32px;
  width: 32px;
  margin-right: 8px;
}
.drawer-pagination {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .pagecontent-left {
    width: 300px;
    height: 32px;
    border: 1px solid #D9D9D9;
    border-radius: 2px;
    border-radius: 2px;
    display: flex;
    position: relative;
    user-select:none;
    cursor: pointer;
    &:after {
      content: ' ';
      position: absolute;
      left: 50%;
      top: 4px;
      bottom: 4px;
      width: 1px;
      background-color: #E8E8E8;
    }
    .content-item {
      width: 50%;
      font-size: 14px;
      color: #595959;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.search-icon {
  font-size: 22px;
  margin-top: 2px;
}
</style>
