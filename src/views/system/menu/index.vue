<template>
  <div class="app-container">
    <table-query>
      <query />
    </table-query>
    <table-header :columns="columns">
      <template>
        <menu-add v-permission="['administrator']" />
        <menu-edit ref="btnEdit" v-permission="['administrator']" />
        <menu-del ref="btnDel" v-permission="['administrator']" />
      </template>
    </table-header>
    <el-table
      ref="menuTreeTable"
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
      <el-table-column v-if="columns[0].show" label="名称" prop="name" width="200px" />
      <el-table-column v-if="columns[1].show" label="图标" prop="icon" align="center">
        <template v-slot="scope">
          <div v-if="scope.row.menuType === 0">
            <el-tag v-if="scope.row.icon.substr(0, 3) === 'el-'"><i :class="scope.row.icon" /></el-tag>
            <el-tag v-else><svg-icon :icon-class="scope.row.icon" /></el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="columns[2].show" label="编码" prop="code" width="160px" />
      <el-table-column v-if="columns[3].show" label="url" prop="url" width="160px" />
      <el-table-column v-if="columns[4].show" label="组件" prop="component" width="160px" />
      <el-table-column v-if="columns[5].show" label="菜单类型" prop="menuType">
        <template v-slot="scope">
          {{ $dict('menuType', scope.row.menuType) }}
        </template>
      </el-table-column>
      <el-table-column v-if="columns[6].show" label="打开方式" prop="openType">
        <template v-slot="scope">
          {{ $dict('openType', scope.row.openType) }}
        </template>
      </el-table-column>
      <el-table-column v-if="columns[7].show" label="是否隐藏" prop="hidden">
        <template v-slot="scope">
          {{ $dict('whether', scope.row.hidden) }}
        </template>
      </el-table-column>
      <el-table-column v-if="columns[8].show" label="排序" prop="orders" />
      <el-table-column v-if="columns[9].show" label="创建时间" prop="createTime" width="150px" />
      <el-table-column label="操作" width="120px" align="center">
        <template v-slot="scope">
          <div style="display: flex;">
            <el-button v-permission="['administrator']" type="primary" icon="el-icon-edit" size="mini" @click="toEdit(scope.row)" />
            <el-button v-permission="['administrator']" type="danger" icon="el-icon-delete" size="mini" @click="toDelete(scope.row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getMenuTree } from '@/api/system/menu/menu'
import MenuAdd from './add'
import MenuEdit from './edit'
import Query from './query'
import MenuDel from './delete'

export default {
  name: 'Menu',
  components: { MenuAdd, MenuEdit, Query, MenuDel },
  data() {
    return {
      tableLoading: false,
      list: [],
      columns: [
        { name: '名称', show: true },
        { name: '图标', show: true },
        { name: '编码', show: true },
        { name: 'url', show: true },
        { name: '组件', show: true },
        { name: '菜单类型', show: true },
        { name: '打开方式', show: true },
        { name: '是否隐藏', show: true },
        { name: '排序', show: true },
        { name: '创建时间', show: false }
      ]
    }
  },
  mounted() {
    this.$refs.menuTreeTable.refresh = this.getMenuTreeList
    this.getMenuTreeList()
  },
  methods: {
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.menuTreeTable.clearSelection()
        this.$refs.menuTreeTable.toggleRowSelection(val.pop())
      }
    },
    getMenuTreeList(data) {
      this.tableLoading = true
      getMenuTree(data).then(response => {
        this.list = response.data.list ? response.data.list : []
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
    }
  }
}
</script>

<style scoped>
.menuTree /deep/ .el-table-column--selection.is-leaf .el-checkbox {
  display: none;
}
</style>
