<template>
  <div class="query-content">
    <el-form ref="queryForm" :model="form.data" :inline="true">
      <el-form-item prop="code">
        <el-input v-model="form.data.code" :clearable="true" placeholder="请输入编码" />
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="form.data.name" :clearable="true" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item prop="createTimeRange">
        <el-date-picker
          v-model="form.data.createTimeRange"
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
  data() {
    return {
      table: {},
      form: {
        conditions: [
          {
            name: 'name',
            keyword: 'like'
          },
          {
            name: 'code',
            keyword: 'like'
          },
          {
            name: 'createTime',
            keyword: 'between',
            value1: '',
            value2: ''
          }
        ],
        data: {
          code: '',
          name: '',
          createTimeRange: []
        }
      }
    }
  },
  watch: {
    'form.data.createTimeRange'() {
      const dateRange = this.form.data.createTimeRange
      if (dateRange.length === 2) {
        this.form.conditions[2].value1 = dateRange[0]
        this.form.conditions[2].value2 = dateRange[1]
      } else {
        this.form.conditions[2].value1 = ''
        this.form.conditions[2].value2 = ''
      }
    }
  },
  mounted() {
    this.table = this.$parent.$parent.$children.find(vc => vc && vc.tableId)
  },
  methods: {
    doQuery() {
      this.table.refresh(this.form)
    },
    doReset() {
      this.$refs.queryForm.resetFields()
      this.table.refresh()
    }
  }
}
</script>

<style scoped>

</style>
