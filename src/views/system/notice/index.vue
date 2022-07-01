<template>
  <div class="app-container">
    <table-query>
      <query :query.sync="query" />
    </table-query>
    <table-header :columns="columns">
      <template>
        <add v-permission="['admin']" />
        <edit ref="btnEdit" v-permission="['admin']" />
        <delete ref="btnDel" v-permission="['admin']" />
      </template>
    </table-header>
    <el-table
      ref="queryTable"
      v-loading="tableLoading"
      :data="list"
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
      <el-table-column v-if="columns[1].show" label="标题(点击预览)" prop="title">
        <template v-slot="scope">
          <el-link type="primary" @click="showDetail(scope.row)">{{ scope.row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column v-if="columns[2].show" label="通知类型" prop="noticeType" width="100" align="center">
        <template v-slot="scope">
          {{ $dict('noticeType',scope.row.noticeType) }}
        </template>
      </el-table-column>
      <el-table-column v-if="columns[3].show" label="通知状态" prop="state" width="100" align="center">
        <template v-slot="scope">
          {{ $dict('state',scope.row.state) }}
        </template>
      </el-table-column>
      <el-table-column v-if="columns[4].show" label="通知日期" prop="noticeDate" width="150" align="center" />
      <el-table-column v-if="columns[5].show" label="创建人" prop="creatorName" width="150" align="center" />
      <el-table-column label="操作" width="120px" align="center">
        <template v-slot="scope">
          <div style="display: flex;">
            <el-button v-permission="['admin']" type="primary" icon="el-icon-edit" size="mini" @click="toEdit(scope.row)" />
            <el-button v-permission="['admin']" type="danger" icon="el-icon-delete" size="mini" @click="toDelete(scope.row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="query.total > 0" :total="query.total" :page.sync="query.currentPage" :limit.sync="query.pageSize" @pagination="getNoticePageData" />

    <el-dialog :append-to-body="true" title="预览" :visible.sync="showDetailDialog" width="800px">
      <div v-html="noticeDetail" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDetailDialog = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getNoticePage } from '@/api/system/notice/notice'
import Pagination from '@/components/Pagination'
import Add from './add'
import Edit from './edit'
import Query from './query'
import Delete from './delete'

export default {
  name: 'Notice',
  components: { Add, Edit, Query, Delete, Pagination },
  data() {
    return {
      tableLoading: false,
      showDetailDialog: false,
      noticeDetail: '',
      list: [],
      columns: [
        { name: 'id', show: true },
        { name: '标题', show: true },
        { name: '通知类型', show: true },
        { name: '通知状态', show: true },
        { name: '通知日期', show: true },
        { name: '创建人', show: true }
      ],
      query: {
        conditions: [
          { name: 'title', keyword: 'like' }
        ],
        data: {
          title: '',
          noticeType: '',
          state: ''
        },
        total: 0,
        currentPage: 0,
        pageSize: 20
      }
    }
  },
  mounted() {
    this.$refs.queryTable.refresh = this.getNoticePageData
    this.getNoticePageData()
  },
  methods: {
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.queryTable.clearSelection()
        this.$refs.queryTable.toggleRowSelection(val.pop())
      }
    },
    getNoticePageData() {
      this.tableLoading = true
      getNoticePage(this.query).then(response => {
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
    toEdit(row) {
      this.$refs.btnEdit.showEdit(row)
    },
    toDelete(row) {
      this.$refs.btnDel.doDelete(row)
    },
    showDetail(row) {
      this.showDetailDialog = true
      this.noticeDetail = row.content
    }
  }
}
</script>

<style scoped>
.queryTable /deep/ .el-table-column--selection.is-leaf .el-checkbox {
  display: none;
}
</style>
