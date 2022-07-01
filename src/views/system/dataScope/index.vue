<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-input
          v-model="menuFilterText"
          prefix-icon="el-icon-search"
          placeholder="输入菜单名称搜索"
          :clearable="true"
        />
        <el-tree
          ref="menuTree"
          class="menuTree"
          :data="menuData"
          :props="menuProps"
          :expand-on-click-node="false"
          :filter-node-method="filterMenu"
          :highlight-current="true"
          @node-click="handleMenuTreeClick"
        />
      </el-col>
      <el-col :span="19">
        <table-query>
          <query :query.sync="query" />
        </table-query>
        <table-header :columns="columns">
          <template>
            <data-scope-add v-permission="['administrator']" :menu-id.sync="query.data.menuId" />
            <data-scope-edit ref="btnEdit" v-permission="['administrator']" />
            <data-scope-del ref="btnDel" v-permission="['administrator']" />
          </template>
        </table-header>
        <el-table
          ref="dataScopeTable"
          v-loading="tableLoading"
          :data="list"
          row-key="id"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          fit
          border
          highlight-current-row
          style="width: 100%"
          class="dataScopeTable"
          size="mini"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection" width="60" />
          <el-table-column v-if="columns[0].show" label="权限名称" prop="name" width="200" />
          <el-table-column v-if="columns[1].show" label="全局生效" prop="globalized" width="70">
            <template v-slot="scope">
              {{ $dict("whether", scope.row.globalized) }}
            </template>
          </el-table-column>
          <el-table-column v-if="columns[2].show" label="权限类型" prop="scopeType" width="120">
            <template v-slot="scope">
              {{ $dict('scopeType', scope.row.scopeType) }}
            </template>
          </el-table-column>
          <el-table-column v-if="columns[3].show" label="所属机构" prop="groupName" />
          <el-table-column v-if="columns[4].show" label="所属角色" prop="roleNames" />
          <el-table-column v-if="columns[5].show" label="是否禁用" prop="noUse" width="70">
            <template v-slot="scope">
              {{ $dict("whether", scope.row.noUse) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px" align="center">
            <template v-slot="scope">
              <div style="display: flex;">
                <el-button v-permission="['administrator']" type="primary" icon="el-icon-edit" size="mini" @click="toEdit(scope.row)" />
                <el-button v-permission="['administrator']" type="danger" icon="el-icon-delete" size="mini" @click="toDelete(scope.row)" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDataScopeList } from '@/api/system/datascope/datascope'
import { getMenuTree } from '@/api/system/menu/menu'
import DataScopeAdd from './add'
import DataScopeEdit from './edit'
import Query from './query'
import DataScopeDel from './delete'

export default {
  name: 'Role',
  components: { DataScopeAdd, DataScopeEdit, Query, DataScopeDel },
  data() {
    return {
      menuFilterText: '',
      menuData: [{ id: '', name: '全部菜单' }],
      menuProps: { children: 'children', label: 'name' },
      tableLoading: false,
      list: [],
      columns: [
        { name: '名称', show: true },
        { name: '全局生效', show: true },
        { name: '权限类型', show: true },
        { name: '所属机构', show: true },
        { name: '所属角色', show: true },
        { name: '是否禁用', show: true }
      ],
      query: {
        conditions: [{
          name: 'name',
          keyword: 'like'
        }],
        data: {
          menuId: '',
          name: ''
        }
      }
    }
  },
  watch: {
    menuFilterText(val) {
      this.$refs.menuTree.filter(val)
    }
  },
  mounted() {
    this.$refs.dataScopeTable.refresh = this.getDataScopeListData
    this.getMenuTreeData()
    this.getDataScopeListData()
  },
  methods: {
    filterMenu(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleMenuTreeClick(data) {
      this.query.data.menuId = data.id.toString()
      this.getDataScopeListData()
    },
    getMenuTreeData() {
      getMenuTree().then(res => {
        if (res.data.list) {
          res.data.list.forEach(item => {
            this.menuData.push({ id: item.id, name: item.name, children: item.children })
          })
        }
      })
    },
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.dataScopeTable.clearSelection()
        this.$refs.dataScopeTable.toggleRowSelection(val.pop())
      }
    },
    getDataScopeListData() {
      this.tableLoading = true
      getDataScopeList(this.query).then(response => {
        if (response.data.list) {
          this.list = response.data.list
        } else {
          this.list = []
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
    }
  }
}
</script>

<style scoped>
.dataScopeTable /deep/ .el-table-column--selection.is-leaf .el-checkbox {
  display: none;
}
.menuTree /deep/ .el-tree-node__label {
  font-size: 13px;
}
</style>
