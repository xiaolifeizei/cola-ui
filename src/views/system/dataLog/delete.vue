<template>
  <div>
    <el-button
      class="filter-item"
      size="mini"
      type="warning"
      icon="el-icon-delete"
      :disabled="delDisabled"
      @click="doDelete(table.selection[0])"
    >
      删除
    </el-button>
  </div>
</template>

<script>
import { deleteDataLog } from '@/api/system/datalog/datasLog'

export default {
  name: 'DataLogDelete',
  data() {
    return {
      table: {},
      delDisabled: true
    }
  },
  watch: {
    'table.selection'() {
      if (this.table.selection.length > 0) {
        this.delDisabled = false
      } else {
        this.delDisabled = true
      }
    }
  },
  mounted() {
    this.table = this.$parent.$parent.$children.find(vc => vc && vc.tableId)
  },
  methods: {
    doDelete(row) {
      this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDataLog(row).then(response => {
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
