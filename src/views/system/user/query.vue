<template>
  <div class="query-content">
    <el-form ref="queryForm" :model="query.data" :inline="true">
      <el-form-item prop="name">
        <el-input v-model="query.data.name" :clearable="true" placeholder="请输入用户名称" />
      </el-form-item>
      <el-form-item prop="loginName">
        <el-input v-model="query.data.loginName" :clearable="true" placeholder="请输入登录名" />
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
            name: '',
            loginName: ''
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
  mounted() {
    this.table = this.$parent.$parent.$children.find(vc => vc && vc.tableId)
  },
  methods: {
    doQuery() {
      this.table.refresh()
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
