<template>
  <tree-select
    v-model="categoryIds"
    :options="options"
    :style="treeStyle"
    :normalizer="normalizer"
    :multiple="multiple"
    :flat="flat"
    placeholder="请选择客户分类"
    clear-value-text="清空已选择的数据"
    no-options-text="暂无数据"
    no-results-text="暂无数据"
    @select="select"
  />
</template>

<script>

import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import TreeSelect from '@riophae/vue-treeselect'
import { getCategoryTree } from '@/api/basics/customer/category'

export default {
  name: 'CustomerCategorySelect',
  components: { TreeSelect },
  props: {
    selections: {
      require: true,
      type: String,
      default: ''
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
      categoryIds: [],
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
          this.categoryIds = null
          return
        }
        if (newValue.length > 0) {
          this.categoryIds = []
          newValue.split(',').forEach(id => {
            this.categoryIds.push(parseFloat(id))
          })
        }
      },
      immediate: true
    },
    categoryIds(val) {
      if (!val) {
        this.$emit('update:selections', '')
        return
      }
      let categoryId = ''
      if (val instanceof Array) {
        val.forEach((v, index) => {
          if (index === 0) {
            categoryId = v + ''
          } else {
            categoryId = categoryId + ',' + v
          }
        })
      } else {
        categoryId = val + ''
      }
      this.$emit('update:selections', categoryId)
    }
  },
  mounted() {
    this.getCategoryTreeData()
  },
  methods: {
    getCategoryTreeData() {
      getCategoryTree().then(res => {
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
