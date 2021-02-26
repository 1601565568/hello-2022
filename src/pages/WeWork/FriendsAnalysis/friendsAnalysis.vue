<template>
  <!-- 信息更新页面 -->
  <div class="dataCenter-content">
    <div style="padding: 7px 0px 25px;">
    </div>
    <el-row class="dataCenter-content__grid" :gutter="5">
      <el-col>
        <div class="interactive__item">
          <div class="interactive__icon interactive__icon--blue">
            <Icon type="kehudongcha-2"/>
          </div>
          <div class="subtance">
            <div class="subtance__title">当前好友总数</div>
            <div class="subtance__text">
              <span>{{ this._data.rowDatas.customerTotal ?  this._data.rowDatas.customerTotal : 0 }}</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col>
        <div class="interactive__item">
          <div class="interactive__icon interactive__icon--red">
            <Icon type="user-add-2" />
          </div>
          <div class="subtance">
            <div class="subtance__title">今日净增人数</div>
            <div class="subtance__text">
              <span>{{ this._data.rowDatas.increaseCount ?  this._data.rowDatas.increaseCount : 0 }}</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col>
        <div class="interactive__item">
          <div class="interactive__icon interactive__icon--green">
            <Icon type="user-add-2" />
          </div>
          <div class="subtance">
            <div class="subtance__title">今日添加人数</div>
            <div class="subtance__text">
              <span>{{ this._data.rowDatas.addCount ?  this._data.rowDatas.addCount : 0 }}</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col>
        <div class="interactive__item">
          <div class="interactive__icon interactive__icon--orange">
            <Icon type="user-delete-2" />
          </div>
          <div class="subtance">
            <div class="subtance__title">今日删除人数</div>
            <div class="subtance__text">
              <span>{{ this._data.rowDatas.deleteCount ?  this._data.rowDatas.deleteCount : 0 }}</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col>
        <div class="interactive__item">
          <div class="interactive__icon interactive__icon--purple">
            <Icon type="user-be-deleted" />
          </div>
          <div class="subtance">
            <div class="subtance__title">今日被删除数</div>
            <div class="subtance__text">
              <span>{{ this._data.rowDatas.beDeletedCount ?  this._data.rowDatas.beDeletedCount : 0 }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--/数据面板-->

    <ns-page-table :colButton="0">
      <template slot="searchSearch">
        <el-form label-width="100px"
                 :inline="true">
          <el-form-item label="时间：" class="el-inline-block">
            <el-date-picker
              v-model="model.TheDate"
              type="daterange"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <!--导购员工组件 -->
          <el-form-item label="选择员工：">
            <div class="template-search__box">
          <span v-if="model.guideIds&&model.guideIds.length>0">
              已选择{{model.guideIds.length}}个
          </span>
              <span v-else>全部</span>
              <div style="float: right;">
                <NsGuideDialog
                  :isButton="false"
                  :validNull="true"
                  :auth="false"
                  type="primary"
                  btnTitle="选择"
                  dialogTitle="选择员工"
                  v-model="model.guideIds"
                ></NsGuideDialog>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <ns-button type="primary" @click="$searchAction$()">{{$t('operating.search')}}</ns-button>
            <ns-button @click="resetInputAction()">{{$t('operating.reset')}}</ns-button>
          </el-form-item>
        </el-form>
      </template>
      <template slot="table">
        <el-card shadow="never" class="dataCenter-content__echart card-body--no-padding">
          <div class="dataCenter-echart__item">
            <div :element-loading-text="$t('prompt.loading')">
              <template>
                <div class="dataCenter-echart__container">
                  <business-echarts :options="option" class="oscillogram" auto-resize></business-echarts>
                </div>
              </template>
            </div>
          </div>
        </el-card>
      </template>
    </ns-page-table>
    <el-card shadow="never" class="card-body--no-padding">
      <div slot="header" class="card-header clearfix">
        <span>数据报表</span>
        <el-radio-group v-model="tableRadios" @change="changeListDataType" class="float-right">
          <el-radio :label="1">按日期展示</el-radio>
          <el-radio :label="2">按员工展示</el-radio>
        </el-radio-group>
      </div>
      <el-table ref="table" :data="_data._table.data"
                class="template-table__main" stripe roll-click
                resizable v-loading.lock="_data._table.loadingtable" @selection-change="onHandleSelectChange"
                :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
        <el-table-column :show-overflow-tooltip="true" type="default" :prop="tableRadios === 1 ? 'TheDate' : 'UserID'"
                         :label="tableRadios === 1 ? '日期':'员工'" :sortable="false" align="center">
          <template slot-scope="scope">
            {{formateTheDate(scope.row)}}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="customerTotal"
                         label="好友总数" :sortable="false" align="right">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="increaseCount"
                         label="净增人数" :sortable="false" align="right">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="addCount"
                         label="添加人数" :sortable="false" align="right">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="deleteCount"
                         label="删除人数" :sortable="false" align="right">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="beDeletedCount"
                         label="被删除数" :sortable="false" align="right">
        </el-table-column>
      </el-table>

      <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                     :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                     :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                     layout="total, sizes, prev, pager, next, jumper" @size-change="analysisSizeChange"
                     @current-change="analysisPageChange">
      </el-pagination>
    </el-card>
  </div>
  <!-- /信息更新页面 -->
</template>

<script>
import TableAnalysis from './src/TableAnalysis'
export default TableAnalysis
</script>

<style scoped>
  @import "@theme/variables.pcss";
  @b interactive {
    @e item {
      /*height: 130px;*/
      padding: var(--default-margin-xlarger) var(--default-margin-xlarger);
      display: flex;
      align-items: center;
      background-color: var(--theme-color-white);
      border-radius: var(--default-radius-mini);
      box-shadow: var(--default-box-shadow-base);
    }

    @e icon {
      width: 42px;
      height: 42px;
      line-height: 42px;
      text-align: center;
      border-radius: var(--default-radius-small);
      color: white;
      font-size: 20px;
      @m blue {
        background-color: var(--theme-color-primary);
      }
      @m red {
        background-color: var(--theme-color-danger);
      }
      @m green {
        background-color: var(--theme-color-success);
      }
      @m orange {
        background-color: var(--theme-color-warning);
      }
      @m purple {
        background-color: #9977FF;
      }
    }
  }
  @b subtance {
    margin-left: 20px;
    @e title {
      font-size: var(--default-font-size-base);
      color: var(--theme-font-color-regular);
    }
    @e text {
      font-weight: bold;
      font-size: 22px;
      margin-top: var(--default-margin-base);
      @m hidden {
        color: var(--theme-color-white);
      }
    }
  }

  @component-namespace dataCenter {
    @b content {
      >>> .el-row {
    & + .el-row {
        margin-top: var(--default-margin-base);
      }
    }
    @e grid {
      margin-bottom:  var(--default-margin-base);
      >>> .el-col {
        width: 20%;
        overflow: hidden;
      }
    }
    @e echart {
      box-shadow: var(--default-box-shadow-base);

      @b echart {
        @e item {
          background-color:  var(--theme-color-white);
          >>> .el-form {
            padding: var(--default-padding-base);

          .el-form-item {
            margin: 0;
          }

          .spacing-button {
            display: block;
            margin-top: var(--default-margin-larger);
            text-align: center;

          .el-radio-button {
            margin: 0 var(--default-margin-larger);

          .el-radio-button__inner {
            padding: var(--default-padding-base) var(--default-padding-larger);
            border-radius: 12px;
            border: 1px solid var(--theme-base-border-color-primary);
            box-shadow: none;
          }
        }
      }
    }
    >>> .echarts {
      padding-left: var(--default-padding-larger);
      width: 100%;
    }

    .no-data {
      width: 100%;
      height: 360px;
      background: url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QONaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YWJmOTRjYmQtN2UwZi0xZDQ1LWFhNDItZGZhNDc2NzJkZjRmIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg1NkQwQTM1Q0I5NDExRTg5Mzc4ODNFQTg0M0YyQzY2IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg1NkQwQTM0Q0I5NDExRTg5Mzc4ODNFQTg0M0YyQzY2IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmZjMjI1OGRlLWNlMDAtZjc0OC1hZTdiLTExNTc3N2FmNWFiYiIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmJlNWVjZDE3LWNiNjctMTFlOC05MmFjLWNlNDA1NzdlZjMxNyIvPiA8L3Jk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) center center no-repeat;
    }

  }
  }
  >>> .el-col {
  .echarts {
    height: 360px;
  }
  }
  }
  }
  }

  @component-namespace card {
    @b header {
      line-height: 28px;
    }
    @b body {
      @m no-padding {
        >>> .el-card__body {
          padding: 0;
        }
      }
    }
  }
  >>> .el-card {
    border: none;
    margin-bottom: var(--default-padding-base);
    border-radius: var(--default-radius-mini);

  .el-card__header {
    padding-left: var(--default-margin-larger);
    padding-right: var(--default-margin-larger);
  }
  }
</style>
