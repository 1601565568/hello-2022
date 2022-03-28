<template>
  <div class="master-drawer">
    <div class='drawer-content'>
      <div class='master-close'>
        <i class="el-icon-close" @click="handleClose"></i>
      </div>
      <div class='header-title'>
        <h4 class='header-title_text'>{{chooseMaster.employeeName}}的裂变大师明细</h4>
        <span class='header-title_num'>共{{chooseMaster.promotionMasterNumber}}人</span>
      </div>
      <div class='analysis-content'>
        <page-table :searchCol='24'>
          <template slot='search'>
            <el-form :inline="true" class='form-inline_top'>
              <el-form-item label="活动码状态：" class='el-form__change'>
                <el-select v-model="model.promotionCodeStatus" placeholder="请选择" @change='(value)=>{changeSearchfrom({promotionCodeStatus:value})}'>
                  <el-option
                    v-for="item in promotionCodeStatusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="好友添加时间：" class='el-form__change'>
                <el-date-picker
                  v-model="seachDate"
                  type="datetimerange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="请选择开始日期"
                  end-placeholder="请选择结束日期"
                  :default-time="['00:00:00','23:59:59']"
                  align="right">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="">
                <el-input v-model="seachVal" placeholder="请输入裂变大师昵称"  @keyup.enter.native="handleSearch">
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
                  prop="name"
                  label="裂变大师">
                  <template slot-scope="scope">
                    <div class="scope-title">
                      <img :src='scope.row.avatar || defaultIcon' class="scope-title_img">
                      <div class="scope-title_text">
                        {{scope.row.promotionMasterName||'-'}}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="inviteFriendNumber"
                  sortable="custom"
                  label="邀请好友数">
                  <template slot-scope="scope">
                    <ns-button type='text' @click='handleOpen(scope.row)'>{{scope.row.inviteFriendNumber}}</ns-button>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="lastFriendAddTime"
                  sortable="custom"
                  label="最近添加好友时间">
                  <template slot-scope="scope">
                    <div class="scope-title_text">
                      {{scope.row.lastFriendAddTime|| '-'}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="promotionCodeStatus"
                  align='center'
                  label="活动码状态">
                  <template slot-scope="scope">
                    <el-tag :type="statusTableList[scope.row.promotionCodeStatus].color" class='scope-name_tag'>{{statusTableList[scope.row.promotionCodeStatus].value}}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </template>
          <template slot='pagination'>
            <div class='drawer-pagination'>
              <div class='pagecontent-left'>
                <div class='content-item' @click='handlePrev'><i class="el-icon-arrow-left"></i>上一个{{employeeEnv}}</div>
                <div class='content-item' @click='handleNext'>下一个{{employeeEnv}}<i class="el-icon-arrow-right"></i></div>
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
        </page-table>
      </div>
    </div>
  </div>
</template>

<script>
import PageTable from '../PageTable'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import defaultIcon from '@/assets/defultheadPic.png'
import { mapState } from 'vuex'
const originModel = {
  timeStart: null,
  timeEnd: null,
  guideId: null,
  promotionMasterName: null,
  promotionCodeStatus: null,
  defaultIcon
}
export default {
  data () {
    return {
      model: {
        guestCodeId: this.$route.query.guestCodeId,
        timeStart: null,
        timeEnd: null,
        guideId: null,
        promotionMasterName: null,
        promotionCodeStatus: null
      },
      url: this.$api.guide.customerCode.getPromotionMasterInfoList,
      promotionCodeStatusList: [{
        label: '全部',
        value: null
      }, {
        label: '已失效',
        value: 0
      }, {
        label: '正常',
        value: 2
      }],
      seachDate: [],
      seachVal: '',
      // 状态列表
      statusTableList: {
        0: {
          value: '已失效',
          color: 'info'
        },
        1: {
          value: '未生成',
          color: 'info'
        },
        2: {
          value: '正常',
          color: 'success'
        }
      },
      defaultIcon
    }
  },
  components: { PageTable },
  mixins: [tableMixin],
  computed: {
    ...mapState({
      // 环境判断
      cloudPlatformType: state => state.user.remumber.remumber_login_info.productConfig.cloudPlatformType
    }),
    employeeEnv () {
      return this.cloudPlatformType === 'ecrp' ? '员工' : '成员'
    }
  },
  props: {
    chooseMaster: {
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
      this.changeSearchfrom({ promotionMasterName: this.seachVal })
    },
    handleSort (data) {
      const order = data.order
      const prop = data.prop
      const sortData = {
        inviteFriendNumber: 'friendOrder',
        lastFriendAddTime: 'lastFriendAddTimeOrder',
        descending: 'desc',
        ascending: 'asc'
      }
      this.changeSearchfrom(Object.assign({}, { friendOrder: null, lastFriendAddTimeOrder: null }, { [sortData[prop]]: sortData[order] }))
    },
    // 关闭弹框
    handleClose () {
      this.$emit('onClose')
    },
    handleOpen (item) {
      const { guideId } = this.model
      this.$emit('openFriend', { ...item, oldGuideId: guideId, guideId, oldName: this.chooseMaster.employeeName, employeeName: item.promotionMasterName, promotionMasterNumber: this.chooseMaster.promotionMasterNumber })
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
        guideId: this.model.guideId }
      this.seachDate = []
      this.seachVal = ''
    }
  },
  watch: {
    seachDate (newVal) {
      const date = newVal || [null, null]
      this.changeSearchfrom({ timeStart: date[0], timeEnd: date[1] })
    },
    // 切换导购触发
    chooseMaster: {
      handler (newVal) {
        if (newVal.guideId) {
          this.changeSearchfrom({ guideId: newVal.guideId })
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
.scope-name_tag.el-tag {
  border-radius: 2px;
  &.el-tag--success {
    background: #F7FFF0;
    border: 1px solid #53BF1D;
    color: #262626;
  }
  &.el-tag--info {
    background: #F5F5F5;
    border: 1px solid #D9D9D9;
    color: #262626;
  }
  &.el-tag--warning {
    background: #FFFBE6;
    border: 1px solid #FFAE0D;
    color: #262626;
  }
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
    width: 223px;
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
