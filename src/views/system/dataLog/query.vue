<template>
  <div class="query-content">
    <el-form ref="queryForm" :model="query.data" :inline="true">
      <el-form-item prop="tableName">
        <el-input v-model="query.data.tableName" :clearable="true" placeholder="请输入表名" />
      </el-form-item>
      <el-form-item prop="createTimeRange">
        <el-date-picker
          v-model="query.data.createTimeRange"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00','23:59:59']"
        />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="doQuery"> 查 询 </el-button>
      <el-button type="success" icon="el-icon-refresh-right" @click="doReset"> 重 置 </el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'UserQuery',
  props: {
    query: {
      require: true,
      type: Object,
      default() {
        return {
          data: {
            tableName: '',
            createTimeRange: []
          },
          currentPage: 0
        }
      }
    }
  },
  data() {
    return {
      table: {}
    }
  },
  watch: {
    'query.data.createTimeRange'() {
      const dateRange = this.query.data.createTimeRange
      if (dateRange.length === 2) {
        this.query.conditions[1].value1 = dateRange[0]
        this.query.conditions[1].value2 = dateRange[1]
      } else {
        this.query.conditions[1].value1 = ''
        this.query.conditions[1].value2 = ''
      }
    }
  },
  mounted() {
    this.table = this.$parent.$parent.$children.find(vc => vc && vc.tableId)
  },
  methods: {
    doQuery() {
      this.query.currentPage = 0
      this.table.refresh()
    },
    doReset() {
      this.query.currentPage = 0
      this.$refs.queryForm.resetFields()
      this.table.refresh()
    }
  }
}
</script>

<style scoped>

</style>
