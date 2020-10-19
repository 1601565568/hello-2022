<template>
    <div>
        <ns-page-table :colButton="14">
            <!-- 快捷搜索 -->
            <template slot="searchSearch">
                <el-form
                    :model="searchform"
                    :inline="true"
                    @submit.native.prevent
                    class="pull-right"
                >
                    <el-form-item v-if="!quickObj.expanded">
                        <el-input
                            v-model="searchform.materialTitle"
                            placeholder="请输入素材标题"
                            @keyup.enter.native="handleSearch"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <ns-button
                            type="text"
                            @click="handleSearchType"
                        >
                            {{quickObj.collapseText}}
                            <Icon :type="quickObj.expanded ? 'up' : 'down'" />
                        </ns-button>
                    </el-form-item>
                </el-form>
            </template>
            <!-- 高级搜索 -->
            <template
                slot="advancedSearch"
                v-if="quickObj.expanded"
            >
                <el-form
                    :model="searchform"
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
                        <!-- v-model="searchform.startTime" -->
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="选择员工：">

                    </el-form-item>
                    <el-form-item label="素材类型：">
                        <el-select
                            v-model="searchform.value"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文件夹：">
                        <el-select
                            v-model="searchform.value"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标签：">
                        <el-select
                            v-model="searchform.value"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="素材标题：">
                        <el-input
                            v-model="searchform.materialTitle"
                            placeholder="请输入素材标题"
                            @keyup.enter.native="handleSearch"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                      <ns-button>导出CSV文件</ns-button>
                    </el-form-item>
                </el-form>
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
                    <!-- <el-table-column
                        type="selection"
                        align="right"
                        :width="50"
                    ></el-table-column> -->
                    <el-table-column
                        type="default"
                        prop="title"
                        label="素材标题"
                        :sortable="false"
                    />
                     <el-table-column
                        type="default"
                        prop="type"
                        label="素材类型"
                        :sortable="false"
                    />
                    <el-table-column
                        type="default"
                        prop="downLoad"
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
                        prop="send"
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
                        prop="share"
                        label="转发次数"
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
                     <el-table-column
                        type="default"
                        prop="title"
                        label="操作"
                        :sortable="false"
                    >
                    <template slot-scope="scope">
                        <ns-button type="text" @click="toggleLabel(scope.row)">查看明细</ns-button>
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

</style>
