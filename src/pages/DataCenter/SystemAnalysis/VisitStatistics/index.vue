<template>
    <div>
        <div class="VisitStatistics fixbox">
            <el-form
                class="fixbox"
                ref="form"
                :model="model"
                label-width="80px"
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
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="选择员工：">
                    <div class="template-search__box">
                        <span v-if="model.guideId&&model.guideId.length>0">
                            已选择{{model.guideId.length}}个
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
                                v-model="model.guideId"
                                @input="NsGuideDialog()"
                            ></NsGuideDialog>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="使用系统端：">
                    <el-select
                        v-model="model.systemFrom"
                        placeholder="请选择"
                        @change="systemFromSearch()"
                    >
                        <el-option
                            v-for="item in systemFrom"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="访问页面：">
                    <el-select
                        v-model="model.pageForm"
                        placeholder="请选择"
                        multiple
                        collapse-tags
                        @change="(data) => {handlepageFormSearch(data)}"
                    >
                        <el-option
                            v-for="item in pageList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div class="datawarpper top21">
            <div class="title-box">
                <div class="survey_title">访问概况</div>
            </div>
            <div class="content-box survey-box">
                <div class="survey-box_list buleColor">
                    <div class="survey-box_list_title">访问用户数
                        <el-tooltip content="筛选周期内，一个用户访问多次仅计算为一个用户">
                            <Icon type="question-circle" />
                        </el-tooltip>
                    </div>
                    <div class="survey-box_list_number">{{overviewdata.guideNum || 0}}</div>
                </div>
                <div class="survey-box_list greenColor">
                    <div class="survey-box_list_title">页面访问次数
                        <el-tooltip content="筛选周期内，用户访问多次计算为多次访问">
                            <Icon type="question-circle" />
                        </el-tooltip>
                    </div>
                    <div class="survey-box_list_number">{{overviewdata.visitNum || 0}}</div>
                </div>
                <div class="survey-box_list yellowColor">
                    <div class="survey-box_list_title">平均访问时长
                        <el-tooltip content="筛选周期内，页面访问总时长/页面访问次数，进入页面的开始时间至结束时间即为页面访问时长">
                            <Icon type="question-circle" />
                        </el-tooltip>
                    </div>
                    <div class="survey-box_list_number">{{overviewdata.avgtime || '---'}}</div>
                </div>
            </div>
        </div>
        <div class="datawarpper top16">
            <div class="title-box">
                <div class="survey_title">员工访问统计</div>
                <div>
                    <ns-button @click="exportData('/staffVisitStatistics/listExcelForGuide')">导出员工明细CSV文件</ns-button>
                    <ns-button @click="exportData('/staffVisitStatistics/listExcel')">导出CSV文件</ns-button>
                </div>
            </div>
            <!-- @selection-change="handleSelectionChange" -->
            <div class="content-box" style="padding-top:12px">
                <el-table
                    class="template-table__main"
                    :data="_data._table.data"
                    stripe
                    ref="table"
                    resizable
                    v-loading.lock="_data._table.loadingtable"
                    :element-loading-text="$t('prompt.loading')"
                    @sort-change="sortChange"
                    @selection-change="$selectionChange"
                >
                    <el-table-column
                        prop="name"
                        label="员工"
                        align="left"
                        :sortable="false"
                    >
                        <template slot-scope="scope">
                            {{scope.row.name}}<span v-if="scope.row.status&&scope.row.status == 2" style="color:red">(已离职)</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                        prop="outWorkId"
                        label="工号"
                        align="left"
                        :sortable="false"
                    >
                     <template slot-scope="scope">
                            {{scope.row.outWorkId || '-'}}
                      </template>
                    </el-table-column>
                    <el-table-column
                        prop="workShopName"
                        label="门店名称"
                        :show-overflow-tooltip="true"
                        align="left"
                        :sortable="false"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="countNum"
                        label="页面访问次数"
                        align="right"
                        sortable="custom"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="avgVisitTime"
                        label="平均访问时长"
                        align="right"
                        sortable="custom"
                    >
                    </el-table-column>
                </el-table>
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
            </div>
        </div>
    </div>
</template>
<script>
import index from './src/index'
export default index
</script>
<style scoped lang="scss">
@import "./style/index.scss";
</style>
