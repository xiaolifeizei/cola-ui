<template>
  <div class="query-content">
    <el-form ref="queryForm" :model="form.data" :inline="true">
      <el-form-item prop="name">
        <el-input v-model="form.data.name" :clearable="true" placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="form.data.code" :clearable="true" placeholder="请输入菜单编码" />
      </el-form-item>
      <el-form-item prop="menuType">
        <el-select v-model="form.data.menuType" :clearable="true" placeholder="请选择菜单类型">
          <el-option label="菜单" :value="0" />
          <el-option label="按钮" :value="1" />
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="doQuery"> 查 询 </el-button>
      <el-button type="success" icon="el-icon-refresh-right" @click="doReset"> 重 置 </el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'MenuQuery',
  data() {
    return {
      table: {},
      form: {
        conditions: [
          { name: 'name', keyword: 'like' },
          { name: 'code', keyword: 'like' }
        ],
        data: {
          name: '',
          code: '',
          menuType: ''
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
