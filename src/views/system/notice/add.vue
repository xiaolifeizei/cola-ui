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
    <el-dialog :append-to-body="true" title="添加通知" :visible.sync="dialogShow" width="800px" @close="cancelAdd">
      <el-form ref="addForm" :inline="true" :rules="rules" :model="form" label-width="80px">
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
        <el-button type="primary" :loading="addLoading" @click="doAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { addNotice } from '@/api/system/notice/notice'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'NoticeAdd',
  components: { Tinymce },
  data() {
    return {
      table: {},
      dialogShow: false,
      addLoading: false,
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
          addNotice(this.form).then(response => {
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
