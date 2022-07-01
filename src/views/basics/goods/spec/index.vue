<template>
  <div class="app-container">
    <table-query>
      <query :query.sync="query" />
    </table-query>
    <table-header :columns="columns">
      <template>
        <goods-spec-add />
        <goods-spec-edit ref="btnEdit" />
        <goods-spec-delete ref="btnDel" />
      </template>
    </table-header>
    <el-table
      ref="specTable"
      v-loading="tableLoading"
      :data="list"
      fit
      border
      highlight-current-row
      style="width: 100%"
      class="menuTree"
      size="mini"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="60" />
      <el-table-column v-if="columns[0].show" label="物资" prop="goodsName" width="200px" />
      <el-table-column v-if="columns[1].show" label="名称" prop="name" align="center" />
      <el-table-column v-if="columns[2].show" label="备注" prop="remark" align="center" />
      <el-table-column v-if="columns[3].show" label="创建时间" prop="createTime" align="center" width="150px" />
      <el-table-column v-if="columns[4].show" label="创建人" prop="creatorName" align="center" width="120px" />
      <el-table-column v-if="columns[5].show" label="所属机构" prop="groupName" align="center" width="220px" />
      <el-table-column label="操作" width="120px" align="center">
        <template v-slot="scope">
          <div style="display: flex;">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="toEdit(scope.row)" />
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="toDelete(scope.row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="query.total > 0" :total="query.total" :page.sync="query.currentPage" :limit.sync="query.pageSize" @pagination="getSpecPageData" />
  </div>
</template>

<script>
import Query from './query'
import GoodsSpecAdd from './add'
import GoodsSpecEdit from './edit'
import GoodsSpecDelete from './delete'
import { getSpecPage } from '@/api/basics/goods/spec'
import Pagination from '@/components/Pagination'
export default {
  name: 'GoodsSpec',
  components: { Query, GoodsSpecDelete, GoodsSpecEdit, GoodsSpecAdd, Pagination },
  data() {
    return {
      columns: [
        { name: '物资', show: true },
        { name: '名称', show: true },
        { name: '备注', show: false },
        { name: '创建时间', show: true },
        { name: '创建人', show: true },
        { name: '所属机构', show: true }
      ],
      tableLoading: false,
      list: [],
      query: {
        conditions: [
          { name: 'name', keyword: 'like' }
        ],
        data: {
          name: '',
          goodsId: null
        },
        total: 0,
        currentPage: 0,
        pageSize: 20
      }
    }
  },
  mounted() {
    this.$refs.specTable.refresh = this.getSpecPageData
    this.getSpecPageData()
  },
  methods: {
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.specTable.clearSelection()
        this.$refs.specTable.toggleRowSelection(val.pop())
      }
    },
    getSpecPageData() {
      getSpecPage(this.query).then(res => {
        if (res.data.page) {
          this.list = res.data.page.records
          this.query.total = res.data.page.total
        } else {
          this.list = []
          this.query.total = 0
        }
      })
    },
    toEdit(row) {
      this.$refs.btnEdit.showEdit(row)
    },
    toDelete(row) {
      this.$refs.btnDel.doDelete(row)
    }
  }
}
</script>

<style scoped>
.specTable /deep/ .el-table-column--selection.is-leaf .el-checkbox {
  display: none;
}
</style>
