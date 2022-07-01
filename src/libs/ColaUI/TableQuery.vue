<template>
  <div class="table-query-container">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'TableQuery',
  props: {
    className: {
      require: false,
      type: String,
      default: 'table-query-container'
    }
  }
}
</script>

<style scoped>

.hidden-table-query {
  display: none;
}

.table-query-container{
  padding: 0 0 5px 0;
  align-items: center;
}

.table-query-container  /deep/ .el-input {
  padding-right: 10px;
}
</style>
