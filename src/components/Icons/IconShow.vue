<template>
  <el-tag v-if="icon && icon.substring(0, 3) === 'el-'">
    <i :class="icon" style="height: 14px;width: 14px;" />
  </el-tag>
  <el-tag v-else width="20px">
    <svg-icon :icon-class="icon" style="height: 14px;width: 14px;" />
  </el-tag>
</template>

<script>
export default {
  name: 'IconShow',
  props: {
    icon: {
      require: true,
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
