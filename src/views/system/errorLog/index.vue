<template>
  <div class="app-container">
    <table-query>
      <query :query.sync="query" />
    </table-query>
    <table-header :columns="columns">
      <template>
        <error-log-delete v-permission="['administrator']" />
      </template>
    </table-header>
    <el-table
      ref="errorLogTable"
      v-loading="tableLoading"
      :data="list"
      row-key="id"
      fit
      border
      highlight-current-row
      style="width: 100%"
      class="userTable"
      size="mini"
    >
      <el-table-column v-if="columns[0].show" label="id" prop="id" width="60" />
      <el-table-column v-if="columns[1].show" label="请求IP" prop="ip" width="100" />
      <el-table-column v-if="columns[2].show" label="请求方法" prop="method" width="100" />
      <el-table-column v-if="columns[3].show" label="请求地址" prop="url" />
      <el-table-column v-if="columns[4].show" label="错误标题" prop="title" />
      <el-table-column v-if="columns[5].show" label="操作用户" prop="creatorName" width="100" align="center" />
      <el-table-column v-if="columns[6].show" label="时间" prop="createTime" width="140" align="center" />
      <el-table-column label="操作" width="60px" align="center">
        <template v-slot="scope">
          <div style="display: flex;">
            <el-button v-permission="['administrator']" type="primary" icon="el-icon-document" size="mini" @click="toDetail(scope.row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="query.total > 0" :total="query.total" :page.sync="query.currentPage" :limit.sync="query.pageSize" @pagination="getErrorLogPageData" />
    <el-dialog :append-to-body="true" title="详细信息" :visible.sync="detailShow" width="900px">
      <el-input
        v-model="errorDetail"
        type="textarea"
        :rows="20"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailShow = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getErrorLogPage } from '@/api/system/errorLog/errorLog'
import Pagination from '@/components/Pagination'
import Query from './query'
import ErrorLogDelete from './delete'

export default {
  name: 'ErrorLog',
  components: { ErrorLogDelete, Query, Pagination },
  data() {
    return {
      tableLoading: false,
      detailShow: false,
      errorDetail: '',
      list: [],
      columns: [
        { name: 'id', show: true },
        { name: '请求IP', show: true },
        { name: '请求方法', show: true },
        { name: '请求地址', show: true },
        { name: '错误标题', show: true },
        { name: '操作用户', show: true },
        { name: '时间', show: true }
      ],
      query: {
        conditions: [
          {
            name: 'ip',
            keyword: 'like'
          },
          {
            name: 'method',
            keyword: 'like'
          },
          {
            name: 'url',
            keyword: 'like'
          },
          {
            name: 'title',
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
          ip: '',
          method: '',
          url: '',
          title: '',
          createTimeRange: []
        },
        total: 0,
        currentPage: 0,
        pageSize: 20
      }
    }
  },
  mounted() {
    this.$refs.errorLogTable.refresh = this.getErrorLogPageData
    this.getErrorLogPageData()
  },
  methods: {
    getErrorLogPageData() {
      this.tableLoading = true
      getErrorLogPage(this.query).then(response => {
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
      this.errorDetail = row.message
      this.detailShow = true
    }
  }
}
</script>

<style scoped>

</style>
