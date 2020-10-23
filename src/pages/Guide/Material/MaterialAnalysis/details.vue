<template>
    <div>
        <ns-page-table :colButton="14">
            <!-- 高级搜索 -->
            <template
                slot="advancedSearch"
            >
                <div class="detailsWarpper">
                    <el-form
                        :model="model"
                        :inline="true"
                        @submit.native.prevent
                        class="pull-right"
                    >
                        <el-form-item label="日期：">
                            <el-date-picker
                                v-model="time"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="datetimerange"
                                :picker-options="pickerOptions"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                align="left"
                                @change="formatTime()"
                            >
                            <!-- v-model="model.startTime" -->
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="选择员工：">
                            <div class="template-search__box">
                            <span v-if="model.guideId&&model.guideId.length>0">
                                已选择{{model.guideId.length}}个
                            </span>
                            <span v-if="model.guideId.length<=0">全部</span>
                            <div style="float: right;">
                                <NsGuideDialog
                                    :isButton="false"
                                    :validNull="true"
                                    :auth="false"
                                    type="primary"
                                    btnTitle="选择"
                                    dialogTitle="选择员工"
                                    v-model="model.guideId"
                                    @input="NsGuideDialog()"
                                ></NsGuideDialog>
                            </div>
                        </div>
                        </el-form-item>
                    </el-form>
                    <ns-button @click="exportData('/materialAnalysis/listDetailExcelById')">导出员工明细CSV文件</ns-button>
                    <ns-button @click="exportData('/materialAnalysis/listExcelById')">导出CSV文件</ns-button>
                </div>
            </template>
            <template slot="table">
                <el-table
                    ref="table"
                    :data="_data._table.data"
                    class="template-table__main"
                    stripe
                    resizable
                    v-loading.lock="_data._table.loadingtable"
                    :element-loading-text="$t('prompt.loading')"
                    @sort-change="sortChange"
                    row-key="id"
                    @selection-change="$selectionChange"
                >
                    <el-table-column
                        type="default"
                        prop="name"
                        label="员工"
                        :sortable="false"
                    />
                     <el-table-column
                        type="default"
                        prop="outWorkId"
                        label="工号"
                        :sortable="false"
                    />
                    <el-table-column
                        type="default"
                        prop="workShopName"
                        label="门店名称"
                        :sortable="false"
                    />
                    <el-table-column
                        v-if="employeeIdShow === 2"
                        type="default"
                        prop="deviceId"
                        label="设备MEID"
                        :sortable="false"
                    />
                    <el-table-column
                        type="default"
                        prop="downloadCount"
                        label="下载次数"
                        sortable="custom"
                    >
                    <template slot='header' scope='header'>
                    <span>
                        <span>{{header.column.label}}</span>
                        <el-tooltip content="员工在小程序下载素材的次数">
                        <Icon style="margin-left:3px" type="question-circle"/>
                        </el-tooltip>
                    </span>
                    </template>
                    </el-table-column>
                     <el-table-column
                        type="default"
                        prop="sendCount"
                        label="发送次数"
                        sortable="custom"
                    >
                    <template slot='header' scope='header'>
                    <span>
                        <span>{{header.column.label}}</span>
                        <el-tooltip content="员工在导购手机菜单发送素材库的次数">
                         <Icon style="margin-left:3px" type="question-circle"/>
                        </el-tooltip>
                    </span>
                    </template>
                    </el-table-column>
                    <el-table-column
                        type="default"
                        prop="shareCount"
                        label="分享次数"
                        sortable="custom"
                    >
                    <template slot='header' scope='header'>
                        <span>
                            <span>{{header.column.label}}</span>
                            <el-tooltip content="员工在小程序上转发文章素材的次数">
                             <Icon style="margin-left:3px" type="question-circle"/>
                            </el-tooltip>
                        </span>
                    </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="pagination">
                <el-pagination
                    v-if="_data._pagination.enable"
                    class="template-table__pagination"
                    :page-sizes="_data._pagination.sizeOpts"
                    :total="_data._pagination.total"
                    :current-page="_data._pagination.page"
                    :page-size="_data._pagination.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="$sizeChange$"
                    @current-change="$pageChange$"
                >
                </el-pagination>
            </template>
        </ns-page-table>
    </div>
</template>
<script>
import Index from './src/details'
export default Index
</script>

<style scoped>
.detailsWarpper {
    display: flex;
    width: 100%;
}
.template-search__box {
  width: 182px;
  height: 28px;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  border-radius: 3px;
  display: flex;
}
.template-search__box span{
  width: 141px;
  height: 27px;
  margin-left: 10px;
  border-right: 1px solid #dcdfe6;
}
.template-search__box > div + span {
    margin-left: var(--default-margin-small);
  }
</style>
