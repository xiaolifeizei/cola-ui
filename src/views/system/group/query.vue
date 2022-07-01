<template>
  <div class="query-content">
    <el-form ref="queryForm" :model="form.data" :inline="true">
      <el-form-item prop="name">
        <el-input v-model="form.data.name" :clearable="true" placeholder="请输入机构名称" />
      </el-form-item>
      <el-form-item prop="shortName">
        <el-input v-model="form.data.shortName" :clearable="true" placeholder="请输入机构简称" />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="doQuery"> 查 询 </el-button>
      <el-button type="success" icon="el-icon-refresh-right" @click="doReset"> 重 置 </el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'GroupQuery',
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
            name: 'shortName',
            keyword: 'like'
          }
        ],
        data: {
          name: '',
          shortName: ''
        }
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
      this.table.refresh(this.form)
    }
  }
}
</script>

<style scoped>

</style>
