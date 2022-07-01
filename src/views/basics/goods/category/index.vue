<template>
  <div class="app-container">
    <table-query>
      <query />
    </table-query>
    <table-header>
      <template>
        <goods-category-add />
        <goods-category-edit ref="btnEdit" />
        <goods-category-delete ref="btnDel" />
      </template>
    </table-header>
    <el-table
      ref="categoryTable"
      v-loading="tableLoading"
      :data="list"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      fit
      border
      highlight-current-row
      style="width: 100%"
      class="menuTree"
      size="mini"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="60" />
      <el-table-column label="物资分类名称" prop="name" align="center" />
      <el-table-column label="物资分类编码" prop="code" align="center" />
      <el-table-column label="添加时间" prop="createTime" align="center" />
      <el-table-column label="操作" width="120px" align="center">
        <template v-slot="scope">
          <div style="display: flex;">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="toEdit(scope.row)" />
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="toDelete(scope.row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import GoodsCategoryAdd from './add'
import GoodsCategoryEdit from './edit'
import GoodsCategoryDelete from './delete'
import Query from './query'
import { getCategoryTree } from '@/api/basics/goods/category'

export default {
  name: 'GoodsCategory',
  components: { Query, GoodsCategoryDelete, GoodsCategoryEdit, GoodsCategoryAdd },
  data() {
    return {
      tableLoading: false,
      list: []
    }
  },
  mounted() {
    this.$refs.categoryTable.refresh = this.getCategoryTreeData
    this.getCategoryTreeData()
  },
  methods: {
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.categoryTable.clearSelection()
        this.$refs.categoryTable.toggleRowSelection(val.pop())
      }
    },
    getCategoryTreeData(query) {
      getCategoryTree(query).then(res => {
        if (res.data.list) {
          this.list = res.data.list
        } else {
          this.list = []
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
.categoryTable /deep/ .el-table-column--selection.is-leaf .el-checkbox {
  display: none;
}
</style>
