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
    <el-dialog :append-to-body="true" title="添加规格" :visible.sync="dialogShow" width="600px" @close="cancelAdd">
      <el-form ref="addForm" :rules="rules" :model="form">
        <el-form-item label="所属物资" prop="goodsId">
          <goods-select :goods-id.sync="form.goodsId" />
        </el-form-item>
        <el-form-item label="规格名称" prop="name">
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
import { addSpec } from '@/api/basics/goods/spec'
import GoodsSelect from '@/components/Selectors/GoodsSelect'

export default {
  name: 'GoodsSpecAdd',
  components: { GoodsSelect },
  data() {
    return {
      table: {},
      dialogShow: false,
      addLoading: false,
      form: {
        goodsId: '',
        name: '',
        remark: ''
      },
      rules: {
        name: [{ required: true, message: '请输入物资名称', trigger: 'blur' }],
        goodsId: [{ required: true, message: '请选择物资', trigger: 'blur' }]
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
          addSpec(this.form).then(response => {
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
