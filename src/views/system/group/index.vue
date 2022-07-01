<template>
  <div class="app-container">
    <table-query>
      <query />
    </table-query>
    <table-header :columns="columns">
      <template>
        <group-add v-permission="['administrator']" />
        <group-edit ref="btnEdit" v-permission="['administrator']" />
      </template>
    </table-header>
    <el-table
      ref="groupTreeTable"
      v-loading="tableLoading"
      :data="list"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      fit
      border
      highlight-current-row
      style="width: 100%"
      class="groupTree"
      size="mini"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="60" />
      <el-table-column v-if="columns[0].show" label="组织机构名称" prop="name" width="400" />
      <el-table-column v-if="columns[1].show" label="组织机构类型" prop="groupType" width="200">
        <template v-slot="scope">
          <el-tag>{{ $dict('groupType',scope.row.groupType) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="columns[2].show" label="组织机构简称" prop="shortName" width="200" />
      <el-table-column v-if="columns[3].show" label="省份" prop="province" align="center" />
      <el-table-column v-if="columns[4].show" label="市" prop="city" align="center" />
      <el-table-column v-if="columns[5].show" label="区" prop="area" align="center" />
      <el-table-column v-if="columns[6].show" label="备注" prop="remark" />
      <el-table-column label="操作" width="80px" align="center">
        <template v-slot="scope">
          <el-button v-permission="['administrator']" type="primary" icon="el-icon-edit" size="mini" @click="toEdit(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import GroupAdd from './add'
import GroupEdit from './edit'
import Query from './query'
import { getGroupTree } from '@/api/system/group/group'

export default {
  name: 'Group',
  components: { GroupAdd, GroupEdit, Query },
  data() {
    return {
      tableLoading: false,
      list: [],
      columns: [
        { name: '组织机构名称', show: true },
        { name: '组织机构类型', show: true },
        { name: '组织机构简称', show: true },
        { name: '省份', show: true },
        { name: '市', show: true },
        { name: '区', show: true },
        { name: '备注', show: false }
      ]
    }
  },
  mounted() {
    this.$refs.groupTreeTable.refresh = this.getGroupTreeList
    this.getGroupTreeList()
  },
  methods: {
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.groupTreeTable.clearSelection()
        this.$refs.groupTreeTable.toggleRowSelection(val.pop())
      }
    },
    getGroupTreeList(data) {
      this.tableLoading = true
      getGroupTree(data).then(response => {
        this.list = response.data.list ? response.data.list : []
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    toEdit(row) {
      this.$refs.btnEdit.showEdit(row)
    }
  }
}
</script>

<style scoped>
.groupTree /deep/ .el-table-column--selection.is-leaf .el-checkbox {
  display: none;
}
</style>
