<template>
  <!-- 信息更新页面 -->
  <div class="dataCenter-content">
    <!-- <div style="padding: 7px 0px 25px;">
    </div> -->
    <!-- <el-row class="dataCenter-content__grid" :gutter="5">
      <el-col>
        <div class="interactive__item">
          <div class="interactive__icon interactive__icon--blue">
            <Icon type="kehudongcha-2"/>
          </div>
          <div class="subtance">
            <div class="subtance__title">昨日好友总数</div>
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
            <div class="subtance__title">昨日净增人数</div>
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
            <div class="subtance__title">昨日添加人数</div>
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
            <div class="subtance__title">昨日删除人数</div>
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
            <div class="subtance__title">昨日被删除数</div>
            <div class="subtance__text">
              <span>{{ this._data.rowDatas.beDeletedCount ?  this._data.rowDatas.beDeletedCount : 0 }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row> -->
    <!--/数据面板-->
    <div class="material-data">
      <div class="top-view">
        <div class="title">好友分析</div>
      </div>
      <div class="data-view">
        <!-- <el-row :gutter='5'> -->
          <template v-for='(item, index) in dataList'>
            <el-col :key='item.key'>
              <div class='row-item' :style='`background-image:${colorList[index]}`'>
                <div class='nick'>{{item.nick}}</div>
                <div class='value'>{{item.value}}</div>
              </div>
            </el-col>
          </template>
        <!-- </el-row> -->
      </div>
    </div>
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
                  :echoStore='true'
                  :isNeedLink='true'
                  :auth="true"
                  :switchAreaFlag='1'
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
                <div  v-if="echartList.length" class="dataCenter-echart__container">
                  <business-echarts :options="option" class="oscillogram" auto-resize></business-echarts>
                </div>
                <div class="no-data" v-else>
                  <ns-no-data>{{$t('prompt.noData')}}</ns-no-data>
                </div>
              </template>
            </div>
          </div>
        </el-card>
      </template>
    </ns-page-table>
    <el-card shadow="never" class="card-body--no-padding">
      <div slot="header" class="card-header clearfix">
        <span class="float-left" style="margin-right: 20px">数据报表</span>
        <el-radio-group v-model="tableRadios" @change="changeListDataType" class="float-left">
          <el-radio :label="1">按日期展示</el-radio>
          <el-radio :label="2">按员工展示</el-radio>
        </el-radio-group>
        <ns-button type="primary" v-if="tableRadios == 2" class="float-right" @click="outputClick">导&nbsp;出</ns-button>
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
        <el-table-column :show-overflow-tooltip="true" type="default" prop="newApplyCnt"
                         label="发起申请数" :sortable="false" align="right">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="contactCnt"
                         label="好友总数" :sortable="false" align="right">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="addContactCnt"
                         label="净增人数" :sortable="false" align="right">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="newContactCnt"
                         label="添加人数" :sortable="false" align="right">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="positiveFeedbackCnt"
                         label="删除人数" :sortable="false" align="right">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="negativeFeedbackCnt"
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
.material-data {
  border-radius: 4px;
  background-color: white;
  padding-bottom: 24px;
  margin-bottom: 6px;
  .top-view {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    height: 56px;
  }
  .data-view {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-left:16px;
    margin-right:16px;
  }
  .title {
    font-size: 16px;
    color: #262626;
    line-height: 56px;
    font-weight: 500;
    padding-left: 16px;
  }
  .row-item {
    padding: 27px 0;
    color: #FFFFFF;
    text-align: center;
    border-radius: 4px;
    margin-left: 5px;
    margin-right: 5px;
    .nick {
      line-height: 24px;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .value {
      line-height: 32px;
      font-size: 24px;
    }
  }
}
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
