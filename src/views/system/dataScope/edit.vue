<template>
  <div>
    <el-button
      class="filter-item"
      size="mini"
      type="success"
      icon="el-icon-edit"
      :disabled="editDisabled"
      @click="showEdit(table.selection[0])"
    >
      修改
    </el-button>
    <el-dialog :append-to-body="true" title="修改数据权限" :visible.sync="dialogShow" top="5vh" width="600px" @close="cancelEdit">
      <el-form ref="editForm" :inline="true" :rules="rules" :model="form" top="5vh" label-width="80px">
        <el-form-item label="关联菜单" prop="menuId" style="width: 100%">
          <menu-select :selections.sync="form.menuId" tree-style="width: 445px" />
        </el-form-item>
        <el-form-item label="全局生效" prop="globalized" style="width: 100%">
          <el-select v-model="form.globalized" style="width: 177px">
            <el-option v-for="item in this.$data.$dictValues['whether']" :key="item.value" :value="item.value" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.globalized === 0" label="所属机构" prop="groupId" style="width: 100%">
          <group-select :selections.sync="form.groupId" :multiple="true" :flat="true" tree-style="width: 445px" />
        </el-form-item>
        <el-form-item v-if="form.globalized === 0" label="所属角色" prop="roleIds" style="width: 100%">
          <role-select :selections.sync="form.roleIds" :group-id.sync="form.groupId" :multiple="true" :flat="true" tree-style="width: 445px" />
        </el-form-item>
        <el-form-item label="权限名称" prop="name" style="width: 100%">
          <el-input v-model="form.name" autocomplete="off" maxlength="20" style="width: 445px" />
        </el-form-item>
        <el-form-item label="权限类型" prop="scopeType">
          <el-select v-model="form.scopeType" style="width: 177px">
            <el-option v-for="item in this.$data.$dictValues.scopeType" :key="item.value" :value="item.value" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否禁用" prop="noUse">
          <el-select v-model="form.noUse" style="width: 177px">
            <el-option v-for="item in this.$data.$dictValues.whether" :key="item.value" :value="item.value" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="拦截方法" prop="method" style="width: 100%">
          <el-input v-model="form.method" placeholder="请输入要拦截的mapper方法全限定名" autocomplete="off" maxlength="350" style="width: 455px" />
        </el-form-item>
        <el-form-item v-if="form.scopeType === 4" label="自定义" prop="scopeSql" style="width: 100%">
          <el-input
            v-model="form.scopeSql"
            autocomplete="off"
            maxlength="400"
            style="width: 455px"
            type="textarea"
            :rows="3"
            placeholder="参数：${userId}当前用户id，${userName}当前用户的用户名，${loginName}当前用户的登陆名，${phone}当前用户的手机号，${ids}当前用户的身份证号，${groupId}当前用户的所属机构"
          />
        </el-form-item>

        <el-form-item label="备注" prop="remark" style="width: 100%">
          <el-input v-model="form.remark" autocomplete="off" maxlength="100" style="width: 455px" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" :loading="editLoading" @click="doEdit">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateDataScope } from '@/api/system/datascope/datascope'
import MenuSelect from './MenuSelect'
import RoleSelect from './RoleSelect'
import GroupSelect from '@/components/Selectors/GroupSelect'

export default {
  name: 'DataScopeEdit',
  components: { MenuSelect, RoleSelect, GroupSelect },
  data() {
    return {
      table: {},
      editDisabled: true,
      dialogShow: false,
      editLoading: false,
      form: {
        method: '',
        name: '',
        menuId: null,
        roleIds: '',
        scopeType: 0,
        noUse: '0',
        groupId: '',
        scopeSql: '',
        remark: '',
        globalized: 1
      },
      rules: {
        menuId: [{ required: true, message: '请选择菜单', trigger: 'blur' }],
        name: [{ required: true, message: '请输入权限名', trigger: 'blur' }],
        loginName: [{ required: true, message: '请输入登陆名', trigger: 'blur' }],
        globalized: [{ required: true, message: '全局生效不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'table.selection'() {
      this.editDisabled = this.table.selection.length !== 1
      if (this.table.selection[0]) {
        this.globalSwitch = this.table.selection[0].globalized === 1
      }
    },
    'form.groupId'(val) {
      if (!val || val.length === 0) {
        this.form.roleIds = ''
      }
    }
  },
  mounted() {
    this.table = this.$parent.$parent.$children.find(vc => vc && vc.tableId)
  },
  methods: {
    cancelEdit() {
      this.dialogShow = false
      this.$refs.editForm.resetFields()
    },
    showEdit(row) {
      this.form = { ...row }
      this.dialogShow = true
    },
    doEdit() {
      this.editLoading = true
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.form.globalized === 0 && (this.form.groupId === null || this.form.groupId.length === 0)) {
            this.$msgbox({
              title: '错误',
              message: '组织机构不能为空',
              type: 'error'
            })
            this.editLoading = false
            return
          }
          if (this.form.scopeType === 4 && (this.form.scopeSql === null || this.form.scopeSql.length === 0)) {
            this.$msgbox({
              title: '错误',
              message: '自定义SQL不能为空',
              type: 'error'
            })
            this.addLoading = false
            return
          }
          updateDataScope(this.form).then(() => {
            this.$refs.editForm.resetFields()
            this.editLoading = false
            this.dialogShow = false
            this.table.refresh()
            this.$notify.success({
              title: '成功',
              message: '修改成功'
            })
          }).catch(() => {
            this.editLoading = false
          })
        } else {
          this.editLoading = false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
