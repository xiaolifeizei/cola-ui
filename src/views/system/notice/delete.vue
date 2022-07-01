<template>
  <div>
    <el-button
      class="filter-item"
      size="mini"
      type="danger"
      icon="el-icon-delete"
      :disabled="delDisabled"
      @click="doDelete(table.selection[0])"
    >
      删除
    </el-button>
  </div>
</template>

<script>
import { deleteNotice } from '@/api/system/notice/notice'

export default {
  name: 'UserDelete',
  data() {
    return {
      table: {},
      delDisabled: true
    }
  },
  watch: {
    'table.selection'() {
      this.delDisabled = this.table.selection.length <= 0
    }
  },
  mounted() {
    this.table = this.$parent.$parent.$children.find(vc => vc && vc.tableId)
  },
  methods: {
    doDelete(row) {
      if (!row) {
        this.$alert('您未选择记录', '删除失败', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteNotice(row).then(response => {
          this.$notify.success({
            title: '成功',
            message: '删除成功'
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
