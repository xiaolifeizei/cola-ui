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
    <el-dialog :append-to-body="true" title="修改字典" :visible.sync="dialogShow" width="600px">
      <el-form ref="editForm" :model="form" :rules="rules">
        <el-form-item label="字典编号" prop="id">
          <el-input v-model="form.id" autocomplete="off" :disabled="true" />
        </el-form-item>
        <el-form-item label="字典编码" prop="code">
          <el-input v-model="form.code" autocomplete="off" :disabled="form.parentId !== 0" maxlength="30" />
        </el-form-item>
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="form.name" autocomplete="off" maxlength="30" />
        </el-form-item>
        <el-form-item label="字典键值" prop="dicValue">
          <el-input v-model="form.dicValue" autocomplete="off" maxlength="10" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="doEdit">修 改</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { updateDict } from '@/api/system/dict/dict'

export default {
  name: 'DictEdit',
  data() {
    return {
      table: {},
      editDisabled: true,
      dialogShow: false,
      form: {
        id: 0,
        parentId: 0,
        name: '',
        code: '',
        dicValue: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        dicValue: [{ required: true, message: '请输入键值', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'table.selection'() {
      this.editDisabled = this.table.selection.length <= 0
    }
  },
  mounted() {
    this.table = this.$parent.$parent.$children.find(vc => vc && vc.tableId)
  },
  methods: {
    showEdit(row) {
      this.form = { ...row }
      this.dialogShow = true
    },
    doEdit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          updateDict(this.form).then(() => {
            this.$refs.editForm.resetFields()
            this.dialogShow = false
            this.table.refresh()
            this.$notify.success({
              title: '成功',
              message: '修改成功'
            })
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
