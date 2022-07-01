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
            <user-add v-permission="['admin']" :group-id.sync="selectGroupId" />
            <user-edit ref="btnEdit" v-permission="['admin']" />
            <user-del ref="btnDel" v-permission="['admin']" />
            <grant-role v-permission="['admin']" />
            <reset-password v-permission="['admin']" />
          </template>
        </table-header>
        <el-table
          ref="userTable"
          v-loading="tableLoading"
          :data="list"
          row-key="id"
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
          <el-table-column v-if="columns[1].show" label="姓名" prop="name" width="100" />
          <el-table-column v-if="columns[2].show" label="登陆名" prop="loginName" width="100" />
          <el-table-column v-if="columns[3].show" label="手机号" prop="phone" />
          <el-table-column v-if="columns[4].show" label="身份证" prop="ids" />
          <el-table-column v-if="columns[5].show" label="是否禁用" prop="noUse">
            <template v-slot="scope">
              {{ $dict("whether", scope.row.noUse) }}
            </template>
          </el-table-column>
          <el-table-column v-if="columns[6].show" label="所属机构" prop="groupName" width="200" />
          <el-table-column v-if="columns[7].show" label="创建人" prop="creatorName" width="100" />
          <el-table-column v-if="columns[8].show" label="创建时间" prop="createTime" width="140" />
          <el-table-column v-if="columns[9].show" label="备注" prop="remark" />
          <el-table-column label="操作" width="120px" align="center">
            <template v-slot="scope">
              <div style="display: flex;">
                <el-button v-permission="['admin']" type="primary" icon="el-icon-edit" size="mini" @click="toEdit(scope.row)" />
                <el-button v-permission="['admin']" type="danger" icon="el-icon-delete" size="mini" @click="toDelete(scope.row)" />
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="query.total > 0" :total="query.total" :page.sync="query.currentPage" :limit.sync="query.pageSize" @pagination="getUserPageData" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getUserPage } from '@/api/system/user/user'
import { getGroupTreeByCurrentUser } from '@/api/system/group/group'
import Pagination from '@/components/Pagination'
import UserAdd from './add'
import UserEdit from './edit'
import Query from './query'
import UserDel from './delete'
import GrantRole from './grantRole'
import ResetPassword from './resetPassword'

export default {
  name: 'User',
  components: { ResetPassword, UserAdd, UserEdit, Query, UserDel, GrantRole, Pagination },
  data() {
    return {
      groupFilterText: '',
      groupData: [{ id: null, name: '全部机构' }],
      groupProps: { children: 'children', label: 'name' },
      tableLoading: false,
      list: [],
      selectGroupId: '',
      columns: [
        { name: 'id', show: true },
        { name: '姓名', show: true },
        { name: '登陆名', show: true },
        { name: '手机号', show: true },
        { name: '身份证', show: false },
        { name: '是否禁用', show: true },
        { name: '所属机构', show: true },
        { name: '创建人', show: false },
        { name: '创建时间', show: true },
        { name: '备注', show: false }
      ],
      query: {
        conditions: [
          { name: 'name', keyword: 'like' },
          { name: 'loginName', keyword: 'like' },
          { name: 'groupId', keyword: 'ignore' }
        ],
        data: {
          name: '',
          loginName: '',
          groupId: ''
        },
        total: 0,
        currentPage: 0,
        pageSize: 20
      }
    }
  },
  watch: {
    groupFilterText(val) {
      this.$refs.groupTree.filter(val)
    }
  },
  mounted() {
    this.$refs.userTable.refresh = this.getUserPageData
    this.getUserPageData()
    this.getGroupTreeData()
  },
  methods: {
    filterGroup(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleGroupTreeClick(data) {
      this.selectGroupId = data.id ? data.id.toString() : null
      this.query.data.groupId = data.id ? data.id.toString() : null
      this.getUserPageData()
    },
    getGroupTreeData() {
      getGroupTreeByCurrentUser().then(res => {
        if (res.data.list) {
          res.data.list.forEach(item => {
            this.groupData.push({ id: item.id, name: item.name, children: item.children })
          })
        }
      })
    },
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.userTable.clearSelection()
        this.$refs.userTable.toggleRowSelection(val.pop())
      }
    },
    getUserPageData() {
      this.tableLoading = true
      getUserPage(this.query).then(response => {
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
    }
  }
}
</script>

<style scoped>
.userTable /deep/ .el-table-column--selection.is-leaf .el-checkbox {
  display: none;
}
.groupTree /deep/ .el-tree-node__label {
  font-size: 13px;
}
</style>
