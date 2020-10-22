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
                            <div style="display:flex">
                                <NsGuideDialog :auth="false" @input="NsGuideDialog()" type="primary" btnTitle="选择员工" dialogTitle="选择员工" v-model="model.guideId">
                                </NsGuideDialog>
                                <span>已选择{{model.guideId? model.guideId.split(',').length: 0}}个员工</span>
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
                        prop="guideId"
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
                        prop="employeeId"
                        label="设备MEID"
                        :sortable="false"
                    />
                    <el-table-column
                        type="default"
                        prop="downloadCount"
                        label="下载次数"
                        :sortable="true"
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
                        :sortable="true"
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
                    <el-table-column
                        type="default"
                        prop="shareCount"
                        label="分享次数"
                        :sortable="true"
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
</style>
