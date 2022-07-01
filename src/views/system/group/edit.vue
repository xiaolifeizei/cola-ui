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
    <el-dialog :append-to-body="true" title="修改组织机构" :visible.sync="dialogShow" width="600px" @close="cancelEdit">
      <el-form ref="editForm" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="机构类型" prop="groupType">
          <el-select v-model="form.groupType" style="width: 445px">
            <el-option v-for="item in this.$data.$dictValues['groupType']" :key="item.value" :value="item.value" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="form.name" autocomplete="off" maxlength="40" style="width: 445px" />
        </el-form-item>
        <el-form-item label="机构简称" prop="shortName">
          <el-input v-model="form.shortName" autocomplete="off" maxlength="20" style="width: 445px" />
        </el-form-item>
        <el-form-item label="省/市/区">
          <el-cascader
            v-model="selectedOptions"
            :options="options"
            :value="form.area"
            style="width: 445px"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" autocomplete="off" maxlength="100" style="width: 445px" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :row="3" autocomplete="off" maxlength="100" style="width: 445px" />
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
import { updateGroup } from '@/api/system/group/group'
import { regionData, TextToCode, CodeToText } from 'element-china-area-data'

export default {
  name: 'GroupEdit',
  data() {
    return {
      table: {},
      editDisabled: true,
      dialogShow: false,
      editLoading: false,
      options: regionData,
      selectedOptions: [],
      form: {
        name: '',
        groupType: 0,
        shortName: '',
        province: '',
        city: '',
        area: '',
        address: '',
        remark: ''
      },
      rules: {
        name: [{ required: true, message: '请输入组织机构名称', trigger: 'blur' }],
        shortName: [{ required: true, message: '请输入组织机构简称', trigger: 'blur' }],
        groupType: [{ required: true, message: '请选择组织机构简称', trigger: 'blur' }]
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
      this.selectedOptions = []
      if (TextToCode[this.form.province] && TextToCode[this.form.province][this.form.city] && TextToCode[this.form.province][this.form.city][this.form.area]) {
        this.selectedOptions.push(TextToCode[this.form.province].code)
        this.selectedOptions.push(TextToCode[this.form.province][this.form.city].code)
        this.selectedOptions.push(TextToCode[this.form.province][this.form.city][this.form.area].code)
      }
      this.dialogShow = true
    },
    handleChange(value) {
      if (value instanceof Array && value.length === 3) {
        this.form.province = CodeToText[value[0]]
        this.form.city = CodeToText[value[1]]
        this.form.area = CodeToText[value[2]]
      }
    },
    doEdit() {
      this.editLoading = true
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updateGroup(this.form).then(() => {
            this.$refs.editForm.resetFields()
            this.selectedOptions = []
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
