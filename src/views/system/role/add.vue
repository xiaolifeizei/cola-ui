<template>
  <div>
    <el-button
      class="filter-item"
      size="mini"
      type="primary"
      icon="el-icon-plus"
      @click="showAdd"
    >
      新增
    </el-button>
    <el-dialog :append-to-body="true" title="添加角色" :visible.sync="dialogShow" width="600px" @close="cancelAdd">
      <el-form ref="addForm" :inline="true" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="父节点" width="130" prop="parentId">
          <el-input v-model="form.parentName" autocomplete="off" :disabled="true" style="width: 445px" />
        </el-form-item>
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
        <el-button type="primary" :loading="addLoading" @click="doAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { addRole } from '@/api/system/role/role'
import GroupSelect from '@/components/Selectors/GroupSelect'

export default {
  name: 'RoleAdd',
  components: { GroupSelect },
  props: {
    groupId: {
      require: true,
      type: String,
      default: ''
    }
  },
  data() {
    return {
      table: {},
      dialogShow: false,
      addLoading: false,
      form: {
        name: '',
        code: '',
        parentId: 0,
        parentName: '根节点',
        groupId: ''
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
        groupId: [{ required: true, message: '选择机构', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'table.selection'() {
      if (this.table.selection.length > 0) {
        const row = this.table.selection[0]
        this.form.parentId = row.id
        this.form.parentName = row.name
      } else {
        this.form.parentName = '根节点'
        this.form.parentId = 0
      }
    },
    'groupId': {
      handler(val) {
        this.form.groupId = this.groupId
      },
      immediate: true
    }
  },
  mounted() {
    this.table = this.$parent.$parent.$children.find(vc => vc && vc.tableId)
  },
  methods: {
    showAdd() {
      this.dialogShow = true
    },
    cancelAdd() {
      this.$refs.addForm.resetFields()
    },
    doAdd() {
      this.addLoading = true
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addRole(this.form).then(response => {
            this.$refs.addForm.resetFields()
            this.dialogShow = false
            this.addLoading = false
            this.table.refresh()
            this.$notify.success({
              title: '成功',
              message: '添加成功'
            })
          }).catch(() => {
            this.addLoading = false
          })
        }
        this.addLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
