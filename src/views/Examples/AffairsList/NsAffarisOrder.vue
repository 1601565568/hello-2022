<template>
  <ns-page-table>

    <!-- 表格 -->
    <template slot="table">
      <el-table ref="table" :data="tableData6" class="template-table__main trade-table"
                stripe
                :span-method="arraySpanMethod"
                resizable v-loading.lock="_data._table.loadingtable"
                :element-loading-text="$t('prompt.loading')">
        <el-table-column :width="45" :render-header="renderProductId">
          <template slot-scope="scope">
            <div slot="reference">
              <div class="order-main">
                <div class="order-head">
                  <div class="order-head__checkbox">
                    <el-checkbox v-model="scope.row.isSelect"></el-checkbox>
                  </div>
                  <div class="order-head__identifier">订单编号：{{scope.row.identifier}}</div>
                  <div class="order-head__reception">接待客服：静默</div>
                  <div class="order-head__time">
                    <el-popover
                      width="240"
                      trigger="hover">
                      <div>
                        <p>成交时间：{{scope.row.orderTime}}</p>
                        <p>付款时间：{{scope.row.confirmTime}}</p>
                      </div>
                      <span slot="reference">下单时间：{{scope.row.orderTime}}</span>
                    </el-popover>
                  </div>
                  <div class="order-head__source">交易来自：{{scope.row.source}}</div>
                  <div class="order-head__icon">
                    <a target="_blank" href="#">
                      <img border="0" src="https://amos.alicdn.com/online.aw?v=2&amp;site=cntaobao&amp;s=2&amp;charset=utf-8&amp;uid=mu0116mu">
                    </a>
                    <el-tooltip content="点击名称快速筛选" effect="light">
                      <a target="_blank" href="?mu0116mu">{{scope.row.people.name}}</a>
                    </el-tooltip>
                    <el-tooltip content="2018.5.3测试" effect="light">
                      <i class="iconfont icon-mark"></i>
                    </el-tooltip>

                    <el-tooltip effect="light">
                      <div slot="content">
                        <p>姓名：周梅</p>
                        <p>手机：15990007033</p>
                        <p>城市：浙江省杭州市</p>
                        <p>区（县）：江干区</p>
                        <p>地址：九堡镇东方电子商务园 6幢四楼南讯软件</p>
                        <p>邮编：000000</p>
                      </div>
                      <i class="iconfont icon-info"></i>
                    </el-tooltip>
                  </div>
                </div>
                <div class="order-body">
                  <ul class="order-body__list">
                    <li v-for="list in scope.row.list" :key="list.index">
                      <div class="order-list">
                        <div class="order-list__img">
                          <img :src="list.imgUrl">
                        </div>
                        <div class="order-list__info">
                          <h3>{{list.title}}</h3>
                          <p>{{list.explain}}</p>
                          <p>商品编码：{{list.identifier}}</p>
                        </div>
                      </div>
                      <div class="order-price">
                        <p>¥{{list.univalent}} * {{list.number}}</p>
                      </div>
                    </li>
                  </ul>
                  <div class="order-body__info">
                    <div class="order-total">
                      <div class="order-total__price">
                        <p>¥{{scope.row.pay}}</p>
                        <span>（含快递：{{scope.row.expressFee}}）</span>
                      </div>
                    </div>
                    <div class="order-state">
                      <div class="order-state__info" v-if="scope.row.tradeState == 0">
                        <p class="close">交易关闭</p>
                      </div>
                      <div class="order-state__info" v-if="scope.row.tradeState == 1">
                        <p class="success">买家已付款</p>
                        <!--<p class="info">物流信息</p>-->
                        <!--<p>对方已评价</p>-->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品信息" align="left" ></el-table-column>
        <el-table-column label="商品单价&数量" align="center" width="180"></el-table-column>
        <el-table-column label="实付款" align="center" width="180"></el-table-column>
        <el-table-column label="订单状态" align="center" width="180"></el-table-column>
      </el-table>
    </template>
    <!-- 表格-结束 -->

    <!-- 分页 -->
    <template slot="pagination">
      <el-pagination v-if="pagination.enable" class="template-table__pagination"
                     :page-sizes="pagination.sizeOpts" :total="pagination.total"
                     :current-page="pagination.page" :page-size="pagination.size"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </template>
    <!-- 分页-结束 -->
  </ns-page-table>
</template>

<script>
import NsAffarisOrder from './src/NsAffarisOrder'

export default NsAffarisOrder
</script>

<style scoped>
  @import "../../../style/small/variables.pcss";
  .trade-table {
  >>> thead {
  tr {
  th:first-child {
    text-align: center;
  }
  }
  }
  >>> tbody {
  tr:hover >td {
    background-color: transparent;
  }
  .cell {
    padding: 0;
  }
  td {
    padding: 0;
  }
  td:not(.el-table-column--selection) {
    padding: 0;
  .cell {
    padding: 0;
  }
  }
  }
  @component-namespace order {
    @b main {
    }
    @b head {
      display: flex;
      border-bottom: 1px solid var(--theme-base-border-color-primary);
      > div {
        padding: var(--default-padding-base) var(--default-padding-larger);
        background-color: var(--theme-bg-color-base);
      }
      @e checkbox {
        text-align: center;
        width: 45px;
      }
      @e identifier {
        flex: 1;
      }
      @e reception {
        width: 180px;
      }
      @e time {
        width: 220px;
      }
      @e people {
        width: 250px;
      }
      @e source {
        width: 140px;
      }
      @e icon {
        user-select: none;
        text-align: center;
        width: 160px;
        img {
          vertical-align: sub;
        }
        .iconfont {
          cursor: pointer;
          margin: 0 3px;
        }
      }
    }
    @b body {
      display: flex;
      min-height: 110px;
      @e list {
        flex: 1;
        padding: 0;
        margin-bottom: 0;
        border-right: 1px solid var(--theme-base-border-color-primary);
        li {
          display: flex;
      &:not(:last-child) {
         border-bottom: 1px solid var(--theme-base-border-color-primary);
       }
        @b list {
          display: flex;
          flex: 1;
          padding: var(--default-padding-base);
          @e img {
            position: relative;
            width: 100px;
            min-height: 100px;
            img {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 100px;
              max-height: 100%;
              max-width: 100%;
              transform: translate(-50%,-50%);
            }
          }
          @e info {
            flex: 1;
            display: grid;
            padding: var(--default-padding-base);
            * {
              margin: 0;
            }
            h3 {
              display: -webkit-box;
              line-height: 1.8;
              max-height: 52px;
              font-size: var(--default-font-size-middle);
              overflow : hidden;
              text-overflow: ellipsis;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            p {
              color: var(--theme-font-color-secondary);
            }
          }
        }
        @b price {
          position: relative;
          width: 180px;
          p {
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%,-50%);
            transform: translate(-50%,-50%);
            margin: 0;
          }
        }
      }
    }
    @e info {
      display: flex;
      width: 360px;
      @b total {
        position: relative;
        width: 50%;
        height: 100%;
        @e price {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          text-align: center;
          p {
            margin: 0;
          }
          span {
            white-space:nowrap;
          }
        }
      }
      @b state {
        position: relative;
        width: 50%;
        height: 100%;
        @e info {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          text-align: center;
          p {
            margin: 0;
        &.success {
           color: green;
         }
        &.close {
           color: var(--theme-font-color-secondary);
         }
        &.info {
           color: var(--theme-color-primary);
         }
        }
      }
    }
  }
  }
  }
  }
  .order-popover {
    padding: var(--default-padding-base);
  p {
    margin-bottom: var(--default-margin-base);
  }
  }
</style>
