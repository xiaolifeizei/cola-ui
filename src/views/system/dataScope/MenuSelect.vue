<template>
  <tree-select
    v-model="menuIds"
    :options="options"
    :style="treeStyle"
    :normalizer="normalizer"
    :multiple="multiple"
    :flat="flat"
    placeholder="请选择菜单"
    clear-value-text="清空已选择的数据"
    no-options-text="暂无数据"
    no-results-text="暂无数据"
    @select="select"
  />
</template>

<script>

import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import TreeSelect from '@riophae/vue-treeselect'
import { getMenuTree } from '@/api/system/menu/menu'

export default {
  name: 'MenuSelect',
  components: { TreeSelect },
  props: {
    selections: {
      require: true,
      type: Number,
      default: null
    },
    treeStyle: {
      require: false,
      type: String,
      default: 'width: 178px'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    flat: {
      type: Boolean,
      default: false
    },
    select: {
      type: Function,
      default() {
        return () => {}
      }
    }
  },
  data() {
    return {
      menuIds: [],
      options: [],
      normalizer(node) {
        return {
          id: node.id,
          label: node.name
        }
      }
    }
  },
  watch: {
    selections: {
      handler(newValue) {
        if (!newValue) {
          this.menuIds = null
          return
        }
        this.menuIds = [newValue]
      },
      immediate: true
    },
    menuIds(val) {
      if (!val) {
        this.$emit('update:selections', null)
        return
      }
      if (val instanceof Array) {
        this.$emit('update:selections', val[0])
      } else {
        this.$emit('update:selections', val)
      }
    }
  },
  mounted() {
    this.getMenuTreeData()
  },
  methods: {
    getMenuTreeData() {
      getMenuTree().then(res => {
        if (res.data.list) {
          this.options = res.data.list
          this.options.forEach(node => {
            this.normalizerNode(node)
          })
        }
      })
    },
    normalizerNode(node) {
      if (node.children.length === 0) {
        delete node.children
      } else {
        node.children.forEach(item => {
          this.normalizerNode(item)
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control {
  height: 0;
}
::v-deep .vue-treeselect__multi-value {
  line-height: 14px;
}
</style>
