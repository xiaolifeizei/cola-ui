<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-input
          v-model="groupFilterText"
          prefix-icon="el-icon-search"
          placeholder="输入机构名称搜索"
          :clearable="true"
        />
        <el-tree
          ref="groupTree"
          class="groupTree"
          :data="groupData"
          :props="groupProps"
          :expand-on-click-node="false"
          :filter-node-method="filterGroup"
          :highlight-current="true"
          @node-click="handleGroupTreeClick"
        />
      </el-col>
      <el-col :span="19">
        <table-query>
          <query :query.sync="query" />
        </table-query>
        <table-header :columns="columns">
          <template>
            <role-add v-permission="['admin']" :group-id.sync="query.data.groupId" />
            <role-edit ref="btnEdit" v-permission="['admin']" />
            <role-del ref="btnDel" v-permission="['admin']" />
            <grant-menu v-permission="['admin']" />
          </template>
        </table-header>
        <el-table
          ref="roleTreeTable"
          v-loading="tableLoading"
          :data="list"
          row-key="id"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          fit
          border
          highlight-current-row
          style="width: 100%"
          class="roleTree"
          size="mini"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection" width="60" />
          <el-table-column v-if="columns[0].show" label="角色名称" prop="name" width="200px" />
          <el-table-column v-if="columns[1].show" label="角色编码" prop="code" />
          <el-table-column v-if="columns[2].show" label="所属机构" prop="groupName" />
          <el-table-column v-if="columns[3].show" label="创建时间" prop="createTime" width="150px" />
          <el-table-column label="操作" width="120px" align="center">
            <template v-slot="scope">
              <div style="display: flex;">
                <el-button v-permission="['admin']" type="primary" icon="el-icon-edit" size="mini" @click="toEdit(scope.row)" />
                <el-button v-permission="['admin']" type="danger" icon="el-icon-delete" size="mini" @click="toDelete(scope.row)" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getRoleTree } from '@/api/system/role/role'
import { getGroupTree } from '@/api/system/group/group'
import RoleAdd from './add'
import RoleEdit from './edit'
import Query from './query'
import RoleDel from './delete'
import GrantMenu from './grantMenu'

export default {
  name: 'Role',
  components: { RoleAdd, RoleEdit, Query, RoleDel, GrantMenu },
  data() {
    return {
      groupFilterText: '',
      groupData: [{ id: '', name: '全部机构' }],
      groupProps: { children: 'children', label: 'name' },
      tableLoading: false,
      list: [],
      columns: [
        { name: '名称', show: true },
        { name: '编码', show: true },
        { name: '所属机构', show: true },
        { name: '创建时间', show: true }
      ],
      query: {
        conditions: [
          {
            name: 'name',
            keyword: 'like'
          },
          {
            name: 'code',
            keyword: 'like'
          }
        ],
        data: {
          groupId: '',
          name: '',
          code: ''
        }
      }
    }
  },
  watch: {
    groupFilterText(val) {
      this.$refs.groupTree.filter(val)
    }
  },
  mounted() {
    this.$refs.roleTreeTable.refresh = this.getRoleTreeList
    this.getRoleTreeList()
    this.getGroupTreeData()
  },
  methods: {
    filterGroup(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleGroupTreeClick(data) {
      this.query.data.groupId = data.id.toString()
      this.getRoleTreeList()
    },
    getGroupTreeData() {
      getGroupTree().then(res => {
        if (res.data.list) {
          res.data.list.forEach(item => {
            this.groupData.push({ id: item.id, name: item.name, children: item.children })
          })
        }
      })
    },
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.roleTreeTable.clearSelection()
        this.$refs.roleTreeTable.toggleRowSelection(val.pop())
      }
    },
    getRoleTreeList() {
      this.tableLoading = true
      getRoleTree(this.query).then(response => {
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
.roleTree /deep/ .el-table-column--selection.is-leaf .el-checkbox {
  display: none;
}
.groupTree /deep/ .el-tree-node__label {
  font-size: 13px;
}
</style>
