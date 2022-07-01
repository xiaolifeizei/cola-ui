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
    <el-dialog :append-to-body="true" title="修改客户" :visible.sync="dialogShow" width="600px" @close="cancelEdit">
      <el-form ref="editForm" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="客户分类" prop="categoryId">
          <customer-category-select :selections.sync="form.categoryId" :multiple="true" :flat="true" tree-style="width: 100%" />
        </el-form-item>
        <el-form-item label="客户名称" prop="name">
          <el-input v-model="form.name" autocomplete="off" maxlength="30" />
        </el-form-item>
        <el-form-item label="备注" prop="code">
          <el-input v-model="form.remark" autocomplete="off" maxlength="100" />
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
import { updateCustomer } from '@/api/basics/customer/customer'
import { getCategoryByCustomerId } from '@/api/basics/customer/category'
import CustomerCategorySelect from '@/components/Selectors/CustomerCategorySelect'

export default {
  name: 'CustomerEdit',
  components: { CustomerCategorySelect },
  data() {
    return {
      table: {},
      editDisabled: true,
      dialogShow: false,
      editLoading: false,
      form: {
        id: null,
        name: '',
        code: '',
        remark: '',
        categoryId: null
      },
      rules: {
        name: [{ required: true, message: '请输入物资名称', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请输入物资名称', trigger: 'blur' }]
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
      if (!this.form.id) {
        this.$notify.warning({
          title: '无效',
          message: '请选择要修改的记录'
        })
        return
      }
      // 获取该物资的分类
      getCategoryByCustomerId(this.form.id).then(res => {
        if (res.data.list) {
          let categoryId = ''
          res.data.list.forEach(item => {
            categoryId = categoryId + item.categoryId + ','
          })
          this.form.categoryId = categoryId.substring(0, categoryId.length - 1)
          this.dialogShow = true
        }
      })
    },
    doEdit() {
      this.editLoading = true
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updateCustomer(this.form).then(() => {
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
