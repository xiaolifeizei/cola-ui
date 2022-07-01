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
    <el-dialog :append-to-body="true" title="添加物资" :visible.sync="dialogShow" width="600px" @close="cancelAdd">
      <el-form ref="addForm" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="物资分类" prop="categoryId">
          <goods-category-select :selections.sync="form.categoryId" :multiple="true" :flat="true" tree-style="width: 100%" />
        </el-form-item>
        <el-form-item label="物资名称" prop="name">
          <el-input v-model="form.name" autocomplete="off" maxlength="30" />
        </el-form-item>
        <el-form-item label="物资编码" prop="code">
          <el-input v-model="form.code" autocomplete="off" maxlength="30" />
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
import { addGoods } from '@/api/basics/goods/goods'
import GoodsCategorySelect from '@/components/Selectors/GoodsCategorySelect'

export default {
  name: 'GoodsAdd',
  components: { GoodsCategorySelect },
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
        code: '',
        remark: '',
        categoryId: null
      },
      rules: {
        name: [{ required: true, message: '请输入物资名称', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择物资分类', trigger: 'blur' }]
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
          message: '请先选择物资分类后再添加'
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
          addGoods(this.form).then(response => {
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
