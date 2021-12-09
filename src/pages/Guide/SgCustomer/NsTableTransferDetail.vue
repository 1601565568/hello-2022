<template>
  <div>
    <div class="top-title-view">转移明细</div>
    <div class="top-search-view">
      <div class="seach-left-view">
        <div class="no-input-view base-view">
          <el-input v-model="searchData.mobile" placeholder="请输入手机号">
            <Icon
              type="ns-search"
              slot="suffix"
              style="font-size: 30px;"
              @click="inputClick"
            ></Icon>
          </el-input>
        </div>
        <div class="no-input-view base-view">
          <el-input
            v-model="searchData.customerName"
            placeholder="请输入会员姓名"
          >
            <Icon
              type="ns-search"
              slot="suffix"
              style="font-size: 30px;"
              @click="inputClick"
            ></Icon>
          </el-input>
        </div>
        <div class="no-input-view base-view">
          <el-input
            v-model="searchData.friendNick"
            placeholder="请输入好友昵称"
          >
            <Icon
              type="ns-search"
              slot="suffix"
              style="font-size: 30px;"
              @click="inputClick"
            ></Icon>
          </el-input>
        </div>
        <div class="no-input-view base-view">
          <el-input
            v-model="searchData.operatorName"
            placeholder="请输入操作人"
          >
            <Icon
              type="ns-search"
              slot="suffix"
              style="font-size: 30px;"
              @click="inputClick"
            ></Icon>
          </el-input>
        </div>
        <div class="date-view base-view">
          <span style="font-size:13px">转移时间：</span>
          <el-date-picker
            v-model="datePickerValue"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="center"
            value-format="yyyy-MM-dd"
            prefix-icon=""
            @change="dataPickerChange"
          >
          </el-date-picker>
        </div>
        <div class="operation-view  base-view" style="width:220px">
          <div class="name" style="width:100px">会员转移状态：</div>
          <div class="item-select">
            <el-select
              v-model="searchData.customerStatus"
              :default-first-option="true"
              @change="inputClick"
            >
              <el-option
                v-for="item in memberStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="icon-view">
            <Icon type="ns-arrow-drowdown" style="color: #8C8C8C;" />
          </div>
        </div>
        <div class="operation-view base-view" style="width:220px">
          <div class="name" style="width:100px">好友转移状态：</div>
          <div class="item-select">
            <el-select
              v-model="searchData.friendStatus"
              :default-first-option="true"
              @change="inputClick"
            >
              <el-option
                v-for="item in friendStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="icon-view">
            <Icon type="ns-arrow-drowdown" style="color: #8C8C8C;" />
          </div>
        </div>
      </div>
      <div class="output-file" @click="outputFile">导出文件</div>
    </div>
    <div class="trans-table-view">
      <page-table style="padding-top:0">
        <template slot="table">
          <el-table
            :data="listData"
            class="new-table_border drawer-table"
            :row-style="{ height: '96px' }"
            :border="false"
            :cell-style="{ borderRight: 'none' }"
          >
            <el-table-column label="会员信息">
              <el-table-column prop="customerName" label="会员" width="170px">
                <template slot-scope="scope">
                  <div class="user-info">
                    <img
                      :src="scope.row.customerHeadImage"
                      class="header-img"
                    />
                    <span>{{ scope.row.customerName }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="sex" label="性别" width="72px">
                <template slot-scope="scope">
                  <span>{{ scope.row.sex === 1 ? '男' : '女' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="customerMobile"
                label="手机号"
                width="120px"
              >
              </el-table-column>
              <el-table-column prop="memberCard" label="会员卡号" width="120px">
              </el-table-column>
              <el-table-column
                prop="oldGuideName"
                label="原专属导购"
                width="290px"
              >
                <template slot-scope="scope">
                  <div>
                    <div>{{ scope.row.oldGuideName }}</div>
                    <el-popover
                      placement="bottom"
                      width="300"
                      trigger="hover"
                      :title="scope.row.oldShopName"
                    >
                      <div slot="reference" class="shop-name-view">
                        {{ scope.row.oldShopName }}
                      </div>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="receiveGuideName"
                label="新专属导购"
                width="290px"
              >
                <template slot-scope="scope">
                  <div>
                    <div>{{ scope.row.receiveGuideName }}</div>
                    <el-popover
                      placement="bottom"
                      width="300"
                      trigger="hover"
                      :title="scope.row.receiveShopName"
                    >
                      <div slot="reference" class="shop-name-view">
                        {{ scope.row.receiveShopName }}
                      </div>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="customerStatus"
                label="会员转移状态"
                width="125px"
              >
                <template slot-scope="scope">
                  <span
                    class="trans-status-view"
                    :class="
                      scope.row.customerStatus !== 1
                        ? 'trans-status-view-fail'
                        : ''
                    "
                    >{{ customerStatusText(scope.row.customerStatus) }}</span
                  >
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="好友信息">
              <el-table-column prop="friendNick" label="好友" width="170px">
                <template slot-scope="scope">
                  <div class="user-info">
                    <img :src="scope.row.friendHeadImage" class="header-img" />
                    <span>{{ scope.row.friendNick }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="friendMobile" label="手机号" width="120px">
              </el-table-column>
              <el-table-column
                prop="oldGuideName"
                label="原添加人"
                width="120px"
              >
              </el-table-column>
              <el-table-column
                prop="friendStatus"
                label="好友转移状态"
                width="150px"
              >
                <template slot-scope="scope">
                  <span
                    class="trans-status-view"
                    :class="
                      scope.row.friendStatus === 2
                        ? 'trans-status-view-wait'
                        : scope.row.friendStatus === 5
                        ? 'trans-status-view-none'
                        : scope.row.friendStatus === 1
                        ? ''
                        : 'trans-status-view-fail'
                    "
                    >{{ friendStatusText(scope.row.friendStatus) }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="friendFailureMsg"
                label="备注"
                width="120px"
              >
              </el-table-column>
              <el-table-column prop="operatorName" label="操作人" width="120px">
              </el-table-column>
              <el-table-column
                prop="transferTime"
                label="转移时间"
                width="160px"
              >
              </el-table-column>
            </el-table-column>
          </el-table>
        </template>
        <template slot="pagination">
          <el-pagination
            background
            class="label-dialog__pagination"
            :page-sizes="paginationToPerson.sizeOpts"
            :total="paginationToPerson.total"
            :current-page.sync="paginationToPerson.page"
            :page-size="paginationToPerson.size"
            layout="total, sizes, prev, pager, next, jumper"
          >
          </el-pagination>
        </template>
      </page-table>
    </div>
  </div>
</template>
<script>
import PageTable from '@/components/NewUi/PageTable'
export default {
  components: {
    PageTable
  },
  data () {
    return {
      listData: [
        {
          customerMobile: '13185092609',
          memberCard: '890217389273',
          oldGuideName: '刘楚涵',
          oldShopName: '杭州下沙线下体验店杭州下沙线下体验店…',
          receiveGuideName: '1刘楚涵',
          receiveShopName: '1杭州下沙线下体验店杭州下沙线下体验店…',
          friendMobile: '18257978226',
          addPerson: 'addPerson',
          friendFailureMsg: '可显示接替失败原因',
          operatorName: 'admin',
          transferTime: '2021-03-31 13:54:19',
          sex: 'sex',
          customerName: '周景琛',
          customerStatus: 0,
          customerHeadImage:
            'https://tse1-mm.cn.bing.net/th/id/R-C.0e725652b27c4585e3b16564b6085c93?rik=%2fttc%2bMl0ichBJg&riu=http%3a%2f%2fwww.desktx.com%2fd%2ffile%2fwallpaper%2fanimals%2f20170217%2fc7bbeb3f8bb7ed4d0424a7daeb422016.jpg&ehk=6gc%2fhM15lFOasw5fL7Zm5XLxDpFfTVfFJuI%2bKnx3NIk%3d&risl=&pid=ImgRaw&r=0',
          friendHeadImage:
            'https://tse1-mm.cn.bing.net/th/id/R-C.0e725652b27c4585e3b16564b6085c93?rik=%2fttc%2bMl0ichBJg&riu=http%3a%2f%2fwww.desktx.com%2fd%2ffile%2fwallpaper%2fanimals%2f20170217%2fc7bbeb3f8bb7ed4d0424a7daeb422016.jpg&ehk=6gc%2fhM15lFOasw5fL7Zm5XLxDpFfTVfFJuI%2bKnx3NIk%3d&risl=&pid=ImgRaw&r=0',
          friendNick: '周景琛1',
          friendStatus: 1
        }
      ],
      friendStatus: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '接替完毕'
        },
        {
          value: 2,
          label: '等待接替'
        },
        {
          value: 3,
          label: '客户拒绝'
        },
        {
          value: 4,
          label: '接替成员客户达到上限'
        },
        {
          value: 5,
          label: '无接替记录'
        }
      ],
      memberStatus: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '转移成功'
        },
        {
          value: 2,
          label: '转移失败'
        }
      ],
      datePickerValue: '',
      paginationToPerson: {
        size: 10,
        sizeOpts: [5, 10, 15],
        page: 1,
        total: 0
      },
      searchData: {
        mobile: '',
        customerName: '',
        friendNick: '',
        transferStartTime: '',
        transferEndTime: '',
        operatorName: '',
        taskId: '',
        customerStatus: 0,
        friendStatus: 0
      }
    }
  },
  methods: {
    friendStatusText (status) {
      if (status === 0) {
        return '未处理'
      } else if (status === 1) {
        return '接替完毕'
      } else if (status === 2) {
        return '等待接替'
      } else if (status === 3) {
        return '客户拒绝'
      } else if (status === 4) {
        return '接替成员客户达到上限'
      } else if (status === 5) {
        return '无接替记录'
      }
    },
    customerStatusText (status) {
      if (status === 0) {
        return '未转移'
      } else if (status === 1) {
        return '转移成功'
      } else if (status === -1) {
        return '转移失败'
      } else if (status === 2) {
        return '转移中'
      }
    },
    outputFile () {
      let that = this
      that.$notify.info('导出中，请稍后片刻')
      this.$http
        .fetch(this.$api.guide.guide.exportTaskDetailList, {})
        .then(resp => {
          that.$notify.success('下载完成')
        })
        .catch(resp => {
          if (!resp.size === 0) {
            that.$notify.error('导出报错，请联系管理员')
          } else {
            let url = window.URL.createObjectURL(new Blob([resp]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            let curDate = moment().format('YYYYMMDDHHmmss')
            let fileName = '转移明细数据统计' + '.xlsx'
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
          }
        })
    },
    dataPickerChange () {
      if (this.datePickerValue == null) {
        this.searchData.transferStartTime = ''
        this.searchData.transferEndTime = ''
      } else {
        this.searchData.transferStartTime = this.datePickerValue[0]
        this.searchData.transferEndTime = this.datePickerValue[1]
      }
      this.loadListData()
    },
    inputClick () {
      this.loadListData()
    },
    loadListData () {
      this.$http
        .fetch(
          this.$api.guide.guide.findCustomerTransferLogDetailList,
          this.searchData
        )
        .then(resp => {
          if (resp.success) {
            // this.listData = resp.result.data || []
          }
        })
        .catch(resp => {})
    }
  },
  mounted () {
    this.loadListData()
  }
}
</script>

<style scoped lang="scss">
@import '@components/NewUi/styles/reset.css';
@import './styles/index.css';
.drawer-table {
  padding: 0;
  font-size: 14px;
  font-weight: 400;
  border: none;
  .user-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    .header-img {
      width: 50px;
      height: 50px;
      margin-right: 20px;
    }
  }
  .trans-status-view {
    background: #edfae1;
    border: 1px solid #c2f099;
    border-radius: 2px;
    padding: 2px 8px;
    display: inline-block;
    font-size: 12px;
    text-align: center;
  }
  .trans-status-view-fail {
    background: #fff1f0;
    border: 1px solid #ffc5c2;
  }
  .trans-status-view-wait {
    background: #e6f2ff;
    border: 1px solid #bddcff;
  }
  .trans-status-view-none {
    background: #fff4e6;
    border: 1px solid #ffd8a8;
  }
}
.top-title-view {
  background-color: white;
  width: 100%;
  font-size: 16px;
  color: #262626;
  line-height: 24px;
  font-weight: 500;
  padding: 8px 16px;
  margin-bottom: 16px;
}
.top-search-view {
  width: 100%;
  background: white;
  border-radius: 4px;
  padding: 16px 16px 0 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  .seach-left-view {
    width: 80%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .output-file {
    background: #ffffff;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    text-align: center;
    font-size: 14px;
    color: #595959;
    cursor: pointer;
    width: 116px;
    height: 32px;
    line-height: 30px;
  }
  .base-view {
    margin-right: 16px;
    margin-bottom: 16px;
  }
  .operation-view {
    width: 163px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    display: flex;
    flex-direction: row;
    font-size: 14px;
    align-items: center;
    .name {
      width: 70px;
      margin-left: 8px;
    }
  }
  .trans-menmber {
    width: 200px;
  }
}
.icon-view {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.date-view {
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  padding: 0px 12px;
}

.el-icon-search {
  border: none;
}
.trans-table-view {
  margin-top: 16px;
  background-color: white;
}
.shop-name-view {
  width: 266px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  word-break: break-all;
}
</style>
