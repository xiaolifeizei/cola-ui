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
    <el-dialog :append-to-body="true" title="添加客户" :visible.sync="dialogShow" width="600px" @close="cancelAdd">
      <el-form ref="addForm" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="客户分类" prop="categoryId">
          <customer-category-select :selections.sync="form.categoryId" :multiple="true" :flat="true" tree-style="width: 100%" />
        </el-form-item>
        <el-form-item label="客户名称" prop="name">
          <el-input v-model="form.name" autocomplete="off" maxlength="30" />
        </el-form-item>
        <el-form-item label="备注" prop="code">
          <el-input v-model="form.remark" type="textarea" :row="3" autocomplete="off" maxlength="100" />
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
import { addCustomer } from '@/api/basics/customer/customer'
import CustomerCategorySelect from '@/components/Selectors/CustomerCategorySelect'

export default {
  name: 'CustomerAdd',
  components: { CustomerCategorySelect },
  props: {
    categoryId: {
      require: true,
      type: Number,
      default: null
    }
  },
  data() {
    return {
      table: {},
      dialogShow: false,
      addLoading: false,
      form: {
        name: '',
        remark: '',
        categoryId: null
      },
      rules: {
        name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择客户分类', trigger: 'blur' }]
      }
    }
  },
  watch: {
    categoryId: {
      handler(val) {
        this.form.categoryId = val ? val.toString() : ''
      },
      immediate: true
    }
  },
  mounted() {
    this.table = this.$parent.$parent.$children.find(vc => vc && vc.tableId)
  },
  methods: {
    showAdd() {
      if (!this.categoryId) {
        this.$notify.warning({
          title: '无效',
          message: '请先选择客户分类后再添加'
        })
        return
      }
      this.dialogShow = true
    },
    cancelAdd() {
      this.$refs.addForm.resetFields()
    },
    doAdd() {
      this.addLoading = true
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addCustomer(this.form).then(response => {
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
