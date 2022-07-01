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
    <el-dialog :append-to-body="true" title="修改角色" :visible.sync="dialogShow" width="600px" @close="cancelEdit">
      <el-form ref="editForm" :inline="true" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" autocomplete="off" maxlength="10" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="form.code" autocomplete="off" maxlength="10" />
        </el-form-item>
        <el-form-item label="所属机构" prop="groupId">
          <group-select :selections.sync="form.groupId" />
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
import { updateRole } from '@/api/system/role/role'
import GroupSelect from '@/components/Selectors/GroupSelect'

export default {
  name: 'RoleEdit',
  components: { GroupSelect },
  data() {
    return {
      table: {},
      editDisabled: true,
      dialogShow: false,
      editLoading: false,
      form: {
        name: '',
        code: '',
        groupId: ''
      },
      rules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入菜单编码', trigger: 'blur' }],
        groupId: [{ required: true, message: '选择所属机构', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'table.selection'() {
      this.editDisabled = this.table.selection.length !== 1
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
          updateRole(this.form).then(() => {
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
