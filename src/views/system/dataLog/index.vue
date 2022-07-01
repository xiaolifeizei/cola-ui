<template>
  <div class="app-container">
    <table-query>
      <query :query.sync="query" />
    </table-query>
    <table-header :columns="columns">
      <template>
        <delete ref="del" v-permission="['administrator']" />
        <clear v-permission="['administrator']" />
      </template>
    </table-header>
    <el-table
      ref="dataLogTable"
      v-loading="tableLoading"
      :data="list"
      row-key="id"
      fit
      border
      highlight-current-row
      style="width: 100%"
      class="userTable"
      size="mini"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="60" />
      <el-table-column v-if="columns[0].show" label="id" prop="id" width="60" />
      <el-table-column v-if="columns[1].show" label="操作人" prop="creatorName" width="200" />
      <el-table-column v-if="columns[2].show" label="动作" prop="operation" width="200" />
      <el-table-column v-if="columns[3].show" label="表名" prop="tableName" width="200" />
      <el-table-column v-if="columns[4].show" label="操作时间" prop="createTime" width="280" />
      <el-table-column v-if="columns[5].show" label="所属机构" prop="groupName" />
      <el-table-column label="操作" width="120px" align="center">
        <template v-slot="scope">
          <div style="display: flex;">
            <el-button v-permission="['administrator']" type="danger" icon="el-icon-delete" size="mini" @click="toDelete(scope.row)" />
            <el-button v-permission="['administrator']" type="primary" icon="el-icon-document" size="mini" @click="toDetail(scope.row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="query.total > 0" :total="query.total" :page.sync="query.currentPage" :limit.sync="query.pageSize" @pagination="getErrorLogPageData" />
    <el-dialog :append-to-body="true" title="详细信息" :visible.sync="detailShow" width="900px">
      <div style="margin-bottom: 15px">修改前的数据</div>
      <json-editor v-model="beforeData" :read-only="true" />
      <div style="margin-top: 15px;margin-bottom: 15px">修改后的数据</div>
      <json-editor v-model="afterData" :read-only="true" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailShow = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDataLogPage } from '@/api/system/datalog/datasLog'
import Pagination from '@/components/Pagination'
import JsonEditor from '@/components/JsonEditor'
import Query from './query'
import Delete from './delete'
import Clear from './clear'

export default {
  name: 'DataLog',
  components: { Delete, Clear, Query, Pagination, JsonEditor },
  data() {
    return {
      tableLoading: false,
      detailShow: false,
      beforeData: '',
      afterData: '',
      list: [],
      columns: [
        { name: 'id', show: true },
        { name: '操作人', show: true },
        { name: '动作', show: true },
        { name: '表名', show: true },
        { name: '操作时间', show: true },
        { name: '所属机构', show: true }
      ],
      query: {
        conditions: [
          {
            name: 'tableName',
            keyword: 'like'
          },
          {
            name: 'createTime',
            keyword: 'between',
            value1: '',
            value2: ''
          }
        ],
        orderBy: [
          {
            name: 'id',
            asc: false
          }
        ],
        data: {
          tableName: '',
          createTimeRange: []
        },
        total: 0,
        currentPage: 0,
        pageSize: 20
      }
    }
  },
  mounted() {
    this.$refs.dataLogTable.refresh = this.getErrorLogPageData
    this.getErrorLogPageData()
  },
  methods: {
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.dataLogTable.clearSelection()
        this.$refs.dataLogTable.toggleRowSelection(val.pop())
      }
    },
    getErrorLogPageData() {
      this.tableLoading = true
      getDataLogPage(this.query).then(response => {
        if (response.data.page) {
          this.list = response.data.page.records
          this.query.total = response.data.page.total
        } else {
          this.list = []
          this.query.total = 0
        }
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    toDetail(row) {
      this.beforeData = row.beforeData
      this.afterData = row.afterData
      this.detailShow = true
    },
    toDelete(row) {
      this.$refs.del.doDelete(row)
    }
  }
}
</script>

<style scoped>
.dataLogTable /deep/ .el-table-column--selection.is-leaf .el-checkbox {
  display: none;
}
</style>

