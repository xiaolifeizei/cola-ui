<template>
  <div>
    <el-button
      class="filter-item"
      size="mini"
      type="info"
      icon="el-icon-refresh"
      :disabled="resetDisabled"
      @click="doResetPassword(table.selection[0])"
    >
      重置密码
    </el-button>
  </div>
</template>

<script>
import { resetPassword } from '@/api/system/user/user'

export default {
  name: 'ResetPassword',
  data() {
    return {
      table: {},
      resetDisabled: true
    }
  },
  watch: {
    'table.selection'() {
      this.resetDisabled = this.table.selection.length <= 0
    }
  },
  mounted() {
    this.table = this.$parent.$parent.$children.find(vc => vc && vc.tableId)
  },
  methods: {
    doResetPassword(row) {
      if (!row) {
        this.$alert('您未选择记录', '失败', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$confirm('此操作会将该用户的密码重置为默认密码 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPassword(row).then(response => {
          this.$notify.success({
            title: '成功',
            message: '密码重置成功'
          })
          this.table.refresh()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
