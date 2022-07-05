<template>
  <div>
    <el-button
      class="filter-item"
      size="mini"
      type="primary"
      icon="el-icon-plus"
      :disabled="addDisabled"
      @click="showAdd"
    >
      新增
    </el-button>
    <el-dialog :append-to-body="true" title="添加字典" :visible.sync="dialogShow" width="600px" @close="cancelAdd">
      <el-form ref="addForm" :rules="rules" :model="form">
        <el-form-item label="父节点" width="130" prop="parentId">
          <el-input v-model="form.parentName" autocomplete="off" :disabled="true" />
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
        <el-button type="primary" @click="doAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>

import { addDict } from '@/api/system/dict/dict'

export default {
  name: 'DictAdd',
  data() {
    return {
      table: {},
      addDisabled: false,
      dialogShow: false,
      form: {
        parentId: 0,
        parentName: '根节点',
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
      if (this.table.selection.length > 0) {
        this.form.parentId = this.table.selection[0].id
        this.form.parentname = this.table.selection[0].name
        this.form.code = this.table.selection[0].code
        if (this.table.selection[0].parentId !== 0) {
          this.addDisabled = true
        } else {
          this.addDisabled = false
        }
      } else {
        this.form.parentId = 0
        this.form.parentName = '根节点'
        this.form.code = ''
        this.addDisabled = false
      }
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
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addDict(this.form).then(() => {
            this.$refs.addForm.resetFields()
            this.dialogShow = false
            this.table.refresh()
            this.$notify.success({
              title: '成功',
              message: '添加成功'
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
