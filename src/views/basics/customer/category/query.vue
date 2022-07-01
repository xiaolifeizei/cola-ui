<template>
  <div class="query-content">
    <el-form ref="queryForm" :model="form.data" :inline="true">
      <el-form-item prop="name">
        <el-input v-model="form.data.name" :clearable="true" placeholder="请输入客户分类名称" />
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="form.data.code" :clearable="true" placeholder="请输入客户分类编码" />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="doQuery"> 查 询 </el-button>
      <el-button type="success" icon="el-icon-refresh-right" @click="doReset"> 重 置 </el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CustomerCategoryQuery',
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
          }
        ],
        data: {
          name: '',
          code: ''
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
