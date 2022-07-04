<template>
  <tree-select
    v-model="groupIds"
    :options="options"
    :style="treeStyle"
    :normalizer="normalizer"
    :multiple="multiple"
    :flat="flat"
    :disabled="isDisabled"
    placeholder="请选择所属机构"
    clear-value-text="清空已选择的数据"
    no-options-text="暂无数据"
    no-results-text="暂无数据"
    @select="select"
  />
</template>

<script>

import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import TreeSelect from '@riophae/vue-treeselect'
import { getGroupTreeByCurrentUser } from '@/api/system/group/group'

export default {
  name: 'GroupSelect',
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
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      groupIds: [],
      options: [],
      normalizer(node) {
        return {
          id: node.id,
          label: node.shortName
        }
      }
    }
  },
  watch: {
    selections: {
      handler(newValue) {
        if (!newValue) {
          this.groupIds = null
          return
        }
        if (newValue.length > 0) {
          this.groupIds = []
          newValue.split(',').forEach(id => {
            this.groupIds.push(parseFloat(id))
          })
        }
      },
      immediate: true
    },
    groupIds(val) {
      if (!val) {
        this.$emit('update:selections', '')
        return
      }
      let groupId = ''
      if (val instanceof Array) {
        val.forEach((v, index) => {
          if (index === 0) {
            groupId = v + ''
          } else {
            groupId = groupId + ',' + v
          }
        })
      } else {
        groupId = val + ''
      }
      this.$emit('update:selections', groupId)
    }
  },
  mounted() {
    this.getGroupTreeData()
  },
  methods: {
    getGroupTreeData() {
      getGroupTreeByCurrentUser().then(res => {
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
