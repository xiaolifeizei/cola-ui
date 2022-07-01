<template>
  <div>
    <el-button
      class="filter-item"
      size="mini"
      type="danger"
      icon="el-icon-delete"
      @click="doDelete(table.selection[0])"
    >
      清空日志
    </el-button>
  </div>
</template>

<script>
import { clearErrorLog } from '@/api/system/errorLog/errorLog'

export default {
  name: 'ErrorLogDelete',
  data() {
    return {
      table: {}
    }
  },
  mounted() {
    this.table = this.$parent.$parent.$children.find(vc => vc && vc.tableId)
  },
  methods: {
    doDelete() {
      this.$confirm('此操作将删除全部数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        clearErrorLog().then(response => {
          this.$notify.success({
            title: '成功',
            message: '清空成功'
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
