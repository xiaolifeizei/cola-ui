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
    <el-dialog :append-to-body="true" title="修改通知" :visible.sync="dialogShow" width="800px" @close="cancelEdit">
      <el-form ref="editForm" :inline="true" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="标题" prop="title" style="width: 100%;">
          <el-input v-model="form.title" autocomplete="off" maxlength="10" style="width: 585px" />
        </el-form-item>
        <el-form-item label="通知类型" prop="noticeType" style="width: 50%;">
          <el-select v-model="form.noticeType" style="width: 195px">
            <el-option v-for="item in this.$data.$dictValues['noticeType']" :key="item.value" :value="item.value" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="通知状态" prop="state">
          <el-select v-model="form.state" style="width: 195px">
            <el-option v-for="item in this.$data.$dictValues['state']" :key="item.value" :value="item.value" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="通知日期" prop="noticeDate">
          <el-date-picker v-model="form.noticeDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" style="width: 195px" />
        </el-form-item>
        <el-form-item label="通知内容" prop="content" style="width: 100%">
          <Tinymce v-if="dialogShow" id="editor" ref="editor" v-model="form.content" :height="400" />
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
import { updateNotice } from '@/api/system/notice/notice'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'NoticeEdit',
  components: { Tinymce },
  data() {
    return {
      table: {},
      editDisabled: true,
      dialogShow: false,
      editLoading: false,
      form: {
        title: '',
        noticeType: '',
        noticeDate: '',
        state: '',
        content: ''
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        noticeType: [{ required: true, message: '请选择通知类型', trigger: 'blur' }],
        state: [{ required: true, message: '请选择通知状态', trigger: 'blur' }],
        noticeDate: [{ required: true, message: '请选择通知日期', trigger: 'blur' }],
        content: [{ required: true, message: '通知内容不能为空', trigger: 'blur' }]
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
          updateNotice(this.form).then(() => {
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
