<template>
  <div class="icon-body">
    <div class="icon-list">
      <div v-for="(item, index) in iconList" :key="index" @click="selectedIcon(item)">
        <i v-if="item.substring(0, 3) === 'el-'" :class="item" style="height: 14px;width: 14px;" />
        <svg-icon v-else :icon-class="item" style="height: 14px;width: 14px;" />
      </div>
    </div>
  </div>
</template>

<script>

import svgIcons from '@/components/Icons/svg-icons'
import elementIcons from '@/components/Icons/element-icons'

export default {
  name: 'IconSelect',
  data() {
    return {
      iconList: elementIcons.concat(svgIcons)
    }
  },
  methods: {
    selectedIcon(icon) {
      this.$emit('select', icon)
      document.body.click()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .icon-body {
    width: 100%;
    padding: 10px;
    .icon-list {
      height: 200px;
      overflow-y: scroll;
      div {
        height: 30px;
        line-height: 30px;
        margin-bottom: -5px;
        cursor: pointer;
        width: 30px;
        float: left;
      }
      span {
        display: inline-block;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
      }
  }
}
</style>
