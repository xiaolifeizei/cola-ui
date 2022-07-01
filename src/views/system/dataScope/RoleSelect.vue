<template>
  <tree-select
    v-model="roleIds"
    :options="options"
    :style="treeStyle"
    :normalizer="normalizer"
    :multiple="multiple"
    :flat="flat"
    placeholder="请选择机构后再选角色"
    clear-value-text="清空已选择的数据"
    no-options-text="暂无数据"
    no-results-text="暂无数据"
    @select="select"
  />
</template>

<script>

import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import TreeSelect from '@riophae/vue-treeselect'
import { getRoleTree } from '@/api/system/role/role'

export default {
  name: 'RoleSelect',
  components: { TreeSelect },
  props: {
    selections: {
      require: true,
      type: String,
      default: ''
    },
    groupId: {
      require: true,
      type: String,
      default: '-1'
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
      roleIds: [],
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
          this.roleIds = null
          return
        }
        if (newValue.length > 0) {
          this.roleIds = []
          newValue.split(',').forEach(id => {
            this.roleIds.push(parseFloat(id))
          })
        }
      },
      immediate: true
    },
    groupId: {
      handler(newValue) {
        if (newValue && newValue.length > 0) {
          this.getRoleTreeData()
        } else {
          this.options = []
        }
      },
      immediate: true
    },
    roleIds(val) {
      if (!val) {
        this.$emit('update:selections', '')
        return
      }
      let roleId = ''
      if (val instanceof Array) {
        val.forEach((v, index) => {
          if (index === 0) {
            roleId = v + ''
          } else {
            roleId = roleId + ',' + v
          }
        })
      } else {
        roleId = val + ''
      }
      this.$emit('update:selections', roleId)
    }
  },
  mounted() {
    this.getRoleTreeData()
  },
  methods: {
    getRoleTreeData() {
      const query = {
        conditions: [
          {
            name: 'groupId',
            keyword: 'in',
            value: this.groupId && this.groupId.length > 0 ? this.groupId : '-1'
          }
        ]
      }
      getRoleTree(query).then(res => {
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
