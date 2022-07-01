<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-input
          v-model="categoryFilterText"
          prefix-icon="el-icon-search"
          placeholder="输入客户分类名称搜索"
          :clearable="true"
        />
        <el-tree
          ref="categoryTree"
          class="categoryTree"
          :data="categoryData"
          :props="categoryProps"
          :expand-on-click-node="false"
          :filter-node-method="filterCategory"
          :highlight-current="true"
          @node-click="handleCategoryTreeClick"
        />
      </el-col>
      <el-col :span="19">
        <table-query>
          <query :query.sync="query" />
        </table-query>
        <table-header :columns="columns">
          <template>
            <customer-add :category-id.sync="query.data.categoryId" />
            <customer-edit ref="btnEdit" />
            <customer-delete ref="btnDel" />
          </template>
        </table-header>
        <el-table
          ref="customerTable"
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
          <el-table-column v-if="columns[0].show" label="名称" prop="name" width="200px" />
          <el-table-column v-if="columns[1].show" label="拼音码" prop="spellCode" align="center" />
          <el-table-column v-if="columns[2].show" label="客户分类" prop="categoryName" align="center" />
          <el-table-column v-if="columns[3].show" label="创建时间" prop="createTime" align="center" width="150px" />
          <el-table-column label="操作" width="120px" align="center">
            <template v-slot="scope">
              <div style="display: flex;">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="toEdit(scope.row)" />
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="toDelete(scope.row)" />
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="query.total > 0" :total="query.total" :page.sync="query.currentPage" :limit.sync="query.pageSize" @pagination="getCategoryGoodsPageData" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Query from './query'
import CustomerAdd from './add'
import CustomerEdit from './edit'
import CustomerDelete from './delete'
import { getCategoryTree } from '@/api/basics/customer/category'
import { getCategoryCustomerPage } from '@/api/basics/customer/customer'

import Pagination from '@/components/Pagination'

export default {
  name: 'Customer',
  components: { Query, CustomerDelete, CustomerEdit, CustomerAdd, Pagination },
  data() {
    return {
      categoryFilterText: '',
      categoryData: [{ id: null, name: '全部分类' }],
      categoryProps: { children: 'children', label: 'name' },
      columns: [
        { name: '名称', show: true },
        { name: '拼音码', show: true },
        { name: '物资分类', show: true },
        { name: '创建时间', show: true }
      ],
      tableLoading: false,
      list: [],
      query: {
        conditions: [
          { name: 'name', keyword: 'like' },
          { name: 'spellCode', keyword: 'like' }
        ],
        data: {
          name: '',
          categoryId: null,
          spellCode: ''
        },
        total: 0,
        currentPage: 0,
        pageSize: 20
      }
    }
  },
  watch: {
    categoryFilterText(val) {
      this.$refs.categoryTree.filter(val)
    }
  },
  mounted() {
    this.$refs.customerTable.refresh = this.getCategoryGoodsPageData
    this.getGoodsCategoryTreeData()
    this.getCategoryGoodsPageData()
  },
  methods: {
    filterCategory(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleCategoryTreeClick(data) {
      this.query.data.categoryId = data.id
      this.getCategoryGoodsPageData()
    },
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.customerTable.clearSelection()
        this.$refs.customerTable.toggleRowSelection(val.pop())
      }
    },
    getGoodsCategoryTreeData() {
      getCategoryTree().then(res => {
        if (res.data.list) {
          res.data.list.forEach(item => {
            this.categoryData.push({ id: item.id, name: item.name, children: item.children })
          })
        }
      })
    },
    getCategoryGoodsPageData() {
      getCategoryCustomerPage(this.query).then(res => {
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
.customerTable /deep/ .el-table-column--selection.is-leaf .el-checkbox {
  display: none;
}
</style>
