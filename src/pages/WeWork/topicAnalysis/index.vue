<template>
  <div id="chatRecordPage">
    <div class="template-page">
      <div class="page-header fl_between">
        <div class="page-header__text">
          话题分析
        </div>
        <div class="page-header__search">
          <el-date-picker v-model="value1" type="date" placeholder="选择日期">
          </el-date-picker>
          <el-input
            style="width:240px;margin-left:16px;"
            :placeholder="placeholder"
            v-model="input1"
          ></el-input>
        </div>
      </div>
    </div>
    <div class="template-content">
      <div class="template-content__l">
        <div class="template-content__list">
          <div class="content_header">
            话题列表
            <div @click="handlerUnfoldAndStow" v-if="activeName !== '2'">
              <img v-if="unfoldAndStow" :src="packup" />
              <img v-if="!unfoldAndStow" :src="unfold" />
            </div>
          </div>
          <div class="loadMoreWarpper">
            <LoadMore @scroll="changeScroll" :scrollDistance="50">
              <ul class="user_list">
                <li
                  v-for="(i, index) in count"
                  :key="index"
                  @click="selectUser(i)"
                  :class="i === select ? 'user_list_select' : ''"
                >
                  <div class="topic-text">
                    {{ i }}这是一个话题系列哈哈哈哈啊哈哈哈哈哈哈哈啊
                  </div>
                  <div class="topic-Number">
                    10
                  </div>
                  <span class="del"><Icon type="delete"/></span>
                </li>
              </ul>
            </LoadMore>
          </div>
        </div>
        <div
          class="customer_list"
          :class="!unfoldAndStow ? 'customer_list__width' : ''"
        >
          <div class="content_header">存货咨询</div>
          <div class="loadMoreWarpper">
            <LoadMore @scroll="changeScroll" :scrollDistance="50">
              <div class="customer_list__warpper">
                <div
                  class="customer_list__item"
                  v-for="(i, index) in count"
                  :key="index"
                >
                  <div class="topic-text">
                    {{ i }}这是一个话题系列哈哈哈哈啊哈哈哈哈哈哈哈啊
                  </div>
                  <span class="del"><Icon type="delete"/></span>
                </div>
              </div>
            </LoadMore>
          </div>
        </div>
      </div>
      <div class="template-content__r">
        <div class="content_header">关键词命中明细</div>
        <div class="chat_record">
          <el-scrollbar ref="fullScreen" class="nmsl-padding">
            <el-table
              ref="multipleTable"
              :data="table.tableData"
              :element-loading-text="$t('prompt.loading')"
              v-loading.lock="table.loading"
              stripe
              resizable
              ><el-table-column prop="date" label="日期"> </el-table-column>
              <el-table-column prop="name" label="姓名"> </el-table-column>
              <el-table-column prop="address" label="地址"> </el-table-column>
              <el-table-column label="操作" fixed="right" :width="150">
                <ns-button type="text" @click="drawer = true">查看</ns-button>
                <!-- <template slot-scope="scope">
                  <ns-table-column-operate-button
                    :buttons="table.operate_buttons"
                    :prop="scope"
                  ></ns-table-column-operate-button>
                </template>  -->
              </el-table-column></el-table
            >
          </el-scrollbar>
          <el-pagination
            :page-sizes="pagination.sizeOpts"
            :total="pagination.total"
            :current-page="pagination.page"
            :page-size="pagination.size"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
            class="template-table__pagination"
            layout="total, sizes, prev, pager, next, jumper"
          ></el-pagination>
          <!-- <ChatRecordList /> -->
        </div>
      </div>
    </div>
    <el-drawer
      size="720px"
      :modal="false"
      :visible.sync="drawer"
      :with-header="false"
    >
      <ItemDrawer />
    </el-drawer>
    <el-dialog title="添加话题" :visible.sync="visible" width="35%">
      <div style="height: 250px;padding-right:10px">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="话题分析：" prop="aaa">
            <el-input type="text" v-model="ruleForm.aaa"></el-input>
          </el-form-item>
          <el-form-item label="关键词：">
            <el-input
              type="textarea"
              v-model="ruleForm.desc"
              :rows="6"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <span class="text-primary">
              <i>
                <Icon type="exclamation-circle" />
              </i>
              <span
                >多敏感词用“，”隔开，且每个敏感词不得超过10个字符，如敏感词1，敏感词2</span
              >
            </span>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="visible = false">取 消</ns-button>
        <ns-button type="primary" @click="visible = false">确 定</ns-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Index from './src/index'
export default Index
</script>
<style lang="scss" scoped>
.fl_between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.page-header {
  background: #ffffff;
  margin: -10px -10px 0;
  padding: 0px 16px;
  min-height: 66px;
  margin-bottom: 16px;
}
.page-header__text {
  font-size: 16px;
  color: #262626;
  font-weight: bold;
}
.page-header__search {
  display: flex;
  justify-content: space-between;
}
.template-content {
  display: flex;
  overflow: hidden;
  height: calc(100vh - 183px);
  .template-content__l {
    background: #fff;
    display: flex;
    // width: 30%;
    .template-content__list {
      // width: 60%;
      min-width: 223px;
      .user_list {
        // margin-top: 16px;
        overflow: auto;
        scrollbar-width: none;
        list-style: none;
        padding: 0px;
        li {
          position: relative;
          display: flex;
          align-items: center;
          height: 48px;
          padding: 0px 16px;
          border-radius: 2px;
          user-select: none;
          font-size: 14px;
          color: #262626;
          .topic-text {
            max-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .topic-Number {
            margin-left: 16px;
          }
          .del {
            display: none;
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translate(-50%, -50%);
          }
          &:hover {
            background: #d9effe;
            .del {
              display: block;
            }
          }
        }
      }
      .user_list_select {
        background: #d9effe;
      }
    }
    .content_header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      padding: 0px 16px;
      height: 60px;
      line-height: 60px;
      font-size: 16px;
      color: #262626;
      img {
        width: 16px;
        height: 16px;
        image-rendering: -moz-crisp-edges;
        image-rendering: -o-crisp-edges;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
        -ms-interpolation-mode: nearest-neighbor;
      }
    }
    .content_search {
      margin-top: 4px;
      padding: 0px 16px;
    }
    .loadMoreWarpper {
      position: relative;
      //   margin-top: 16px;
      padding-bottom: 16px;
      overflow: hidden;
      height: calc(100vh - 240px);
      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 16px;
        left: 0px;
        bottom: 0px;
        background: #fff;
        z-index: 2;
      }
    }
    .customer_list {
      width: 193px;
      border-left: 1px solid #e8e8e8;
    }
    .customer_list__width {
      width: 0px;
    }
    .customer_list__warpper {
      padding: 0 16px;
      .customer_list__item {
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 8px;
        font-size: 14px;
        color: #262626;
        border-radius: 2px;
        line-height: 48px;
        height: 48px;
        .topic-text {
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .del {
          display: none;
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        &:hover {
          background: #f5f5f5;
          .del {
            display: block;
          }
        }
      }
    }
  }
  .template-content__r {
    margin-left: 16px;
    flex: 1;
    .content_header {
      border-radius: 4px 4px 0px 0px;
      font-weight: bold;
      padding: 0px 16px;
      height: 56px;
      line-height: 56px;
      font-size: 16px;
      background: #fff;
      color: #262626;
    }
    .chat_record {
      position: relative;
      //   border-left: 1px solid #e8e8e8;
      //   border-right: 1px solid #e8e8e8;
      //   border-bottom: 1px solid #e8e8e8;
      //   background: #f5f5f5;
      border-radius: 0px 0px 4px 0px;
      overflow: hidden;
      height: calc(100vh - 238px);
      //   &::before {
      //     content: '';
      //     position: absolute;
      //     width: 100%;
      //     height: 16px;
      //     left: 0px;
      //     bottom: 0px;
      //     background: #f5f5f5;
      //     border-bottom: 1px solid #e8e8e8;
      //     z-index: 3;
      //   }
    }
  }
}
@media screen and (max-width: 1625px) {
  .template-content {
    height: calc(100vh - 163px) !important;
  }
  .loadMoreWarpper {
    height: calc(100vh - 220px) !important;
  }
  .chat_record {
    height: calc(100vh - 218px) !important;
  }
}
</style>
<style scoped>
.nmsl-padding >>> .el-scrollbar__wrap {
  padding-bottom: 17px;
}
</style>
