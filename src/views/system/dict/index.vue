<template>
  <div class="app-container">
    <table-query>
      <query />
    </table-query>
    <table-header :columns="columns">
      <template>
        <dict-add v-permission="['administrator']" />
        <dict-edit ref="btnEdit" v-permission="['administrator']" />
        <dict-del ref="btnDel" v-permission="['administrator']" />
      </template>
    </table-header>
    <el-table
      ref="dictTreeTable"
      v-loading="listLoading"
      :data="list"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      fit
      border
      highlight-current-row
      style="width: 100%"
      class="dictTree"
      size="mini"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="60" />
      <el-table-column v-if="columns[0].show" label="编码">
        <template v-slot="scope">
          <el-tag>{{ scope.row.code }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="columns[1].show" label="名称" prop="name" />
      <el-table-column v-if="columns[2].show" label="键值">
        <template v-slot="scope">
          <span v-show="scope.row.children.length === 0">{{ scope.row.dicValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px" align="center">
        <template v-slot="scope">
          <div style="display: flex;">
            <el-button v-permission="['administrator']" type="primary" icon="el-icon-edit" size="mini" @click="$refs.btnEdit.showEdit(scope.row)" />
            <el-button v-permission="['administrator']" size="mini" type="danger" icon="el-icon-delete" @click="$refs.btnDel.doDelete(scope.row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getDictTree } from '@/api/system/dict/dict'
import DictEdit from './edit'
import DictAdd from './add'
import DictDel from './delete'
import Query from '@/views/system/dict/query'

export default {
  name: 'Dict',
  components: { Query, DictEdit, DictAdd, DictDel },
  data() {
    return {
      columns: [
        { name: '编码', show: true },
        { name: '名称', show: true },
        { name: '键值', show: true }
      ],
      list: [],
      listLoading: false
    }
  },
  mounted() {
    this.$refs.dictTreeTable.refresh = this.getTreeList
    this.getTreeList()
  },
  methods: {
    // 多选变单选
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.dictTreeTable.clearSelection()
        this.$refs.dictTreeTable.toggleRowSelection(val.pop())
      }
    },
    // 加载数据
    getTreeList(query) {
      this.listLoading = true
      getDictTree(query).then(response => {
        this.list = response.data.list ? response.data.list : []
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
.dictTree /deep/ .el-table-column--selection.is-leaf .el-checkbox {
  display: none;
}

</style>
