<template>
  <div class="master-drawer">
    <div class='drawer-content'>
      <div class='master-close'>
        <i class="el-icon-close" @click="handleClose"></i>
      </div>
      <div class='header-title'>
        <h3 class='header-title_text'>可见客户（总计：11人）</h3>
      </div>
      <div class='analysis-content'>
        <page-table :searchCol='24'>
          <template slot='search'>
            <el-form :inline="true" class='form-inline_top'>
              <el-form-item label="">
                <el-input v-model="seachVal" placeholder="请输入昵称"  @keyup.enter.native="handleSearch">
                  <Icon type="ns-search" slot="suffix" class='search-icon' @click="handleSearch"></Icon>
                </el-input>
              </el-form-item>
            </el-form>
          </template>
          <template slot='table'>
            <template>
              <el-table
                :data="data"
                class="new-table_border"
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
              </el-table>
            </template>
          </template>
        </page-table>
      </div>
    </div>
  </div>
</template>

<script>
import PageTable from '@/components/NewUi/PageTable'
import defaultIcon from '@/assets/defultheadPic.png'
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
        promotionMasterName: null
      },
      seachDate: [],
      seachVal: '',
      defaultIcon
    }
  },
  components: { PageTable },
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
    // 关闭弹框
    handleClose () {
      this.$emit('onClose')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
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
    flex-shrink: 0;
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
