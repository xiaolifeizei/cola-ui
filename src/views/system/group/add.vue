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
    <el-dialog :append-to-body="true" title="添加组织机构" :visible.sync="dialogShow" width="600px" @close="cancelAdd">
      <el-form ref="addForm" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="父节点" width="130" prop="parentId">
          <el-input v-model="form.parentName" autocomplete="off" :disabled="true" style="width: 445px" />
        </el-form-item>
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
        <el-form-item label="省/市/区" style="width: 100%">
          <el-cascader
            v-model="selectedOptions"
            :options="options"
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
        <el-button type="primary" :loading="addLoading" @click="doAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { addGroup } from '@/api/system/group/group'
import { regionData, CodeToText } from 'element-china-area-data'

export default {
  name: 'RoleAdd',
  data() {
    return {
      table: {},
      dialogShow: false,
      addLoading: false,
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
        remark: '',
        parentId: 0,
        parentName: '根节点'
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
    handleChange(value) {
      if (value instanceof Array && value.length === 3) {
        this.form.province = CodeToText[value[0]]
        this.form.city = CodeToText[value[1]]
        this.form.area = CodeToText[value[2]]
      }
    },
    doAdd() {
      this.addLoading = true
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addGroup(this.form).then(response => {
            this.$refs.addForm.resetFields()
            this.selectedOptions = []
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
