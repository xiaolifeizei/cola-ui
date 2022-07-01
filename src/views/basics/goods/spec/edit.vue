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
    <el-dialog :append-to-body="true" title="修改规格" :visible.sync="dialogShow" width="600px" @close="cancelEdit">
      <el-form ref="editForm" :rules="rules" :model="form">
        <el-form-item label="所属物资" prop="goodsId">
          <goods-select :goods-id="form.goodsId" :goods-name="form.goodsName" />
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
        <el-button type="primary" :loading="editLoading" @click="doEdit">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateSpec } from '@/api/basics/goods/spec'
import GoodsSelect from '@/components/Selectors/GoodsSelect'

export default {
  name: 'GoodsEdit',
  components: { GoodsSelect },
  data() {
    return {
      table: {},
      editDisabled: true,
      dialogShow: false,
      editLoading: false,
      form: {
        name: '',
        goodsId: null,
        goodsName: '',
        remark: ''
      },
      rules: {
        name: [{ required: true, message: '请输入物资名称', trigger: 'blur' }],
        goodsId: [{ required: true, message: '请选择物资', trigger: 'blur' }]
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
          updateSpec(this.form).then(() => {
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
