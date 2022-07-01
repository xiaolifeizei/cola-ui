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
    <el-dialog :append-to-body="true" title="添加物资分类" :visible.sync="dialogShow" width="600px" @close="cancelAdd">
      <el-form ref="addForm" :rules="rules" :model="form">
        <el-form-item label="父节点" prop="parentId">
          <el-input v-model="form.parentName" autocomplete="off" maxlength="30" disabled />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" autocomplete="off" maxlength="30" />
        </el-form-item>
        <el-form-item label="分类编码" prop="code">
          <el-input v-model="form.code" autocomplete="off" maxlength="30" />
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
import { addCategory } from '@/api/basics/goods/category'

export default {
  name: 'GoodsCategoryAdd',
  data() {
    return {
      table: {},
      dialogShow: false,
      addLoading: false,
      form: {
        parentId: 0,
        parentName: '根节点',
        name: '',
        code: ''
      },
      rules: {
        name: [{ required: true, message: '请输入物资名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入分类编码', trigger: 'blur' }]
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
          addCategory(this.form).then(response => {
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
