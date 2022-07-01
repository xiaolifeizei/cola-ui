<template>
  <div class="crud-opts">
    <span class="crud-opts-left">
      <!--左侧插槽-->
      <slot />
      <!--右侧-->
      <slot name="right" />
    </span>
    <el-button-group v-show="toolbar" class="crud-opts-right">
      <el-button
        size="mini"
        plain
        type="info"
        icon="el-icon-search"
        @click="hidQuery"
      />
      <el-button
        size="mini"
        icon="el-icon-refresh"
        @click="handleRefresh()"
      />
      <el-popover
        placement="bottom-end"
        width="150"
        trigger="click"
      >
        <el-button
          slot="reference"
          size="mini"
          icon="el-icon-s-grid"
        >
          <i
            class="fa fa-caret-down"
            aria-hidden="true"
          />
        </el-button>
        <el-checkbox
          v-model="allSelected"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >
          全选
        </el-checkbox>
        <el-checkbox
          v-for="item in columns"
          :key="item.name"
          v-model="item.show"
          @change="handleCheckChange(item)"
        >
          {{ item.name }}
        </el-checkbox>
      </el-popover>
    </el-button-group>
  </div>
</template>

<script>
export default {
  name: 'TableHeader',
  props: {
    columns: {
      require: true,
      type: Array,
      default() {
        return []
      }
    },
    toolbar: {
      require: true,
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      table: {},
      allSelected: true,
      isIndeterminate: false
    }
  },
  mounted() {
    this.table = this.$parent.$children.find(vc => vc && vc.tableId)
  },
  methods: {
    hidQuery() {
      const query = document.querySelector('.table-query-container')
      if (query) {
        if (query.className.indexOf('hidden-table-query') !== -1) {
          query.className = query.className.replace('hidden-table-query', '')
        } else {
          query.className = 'hidden-table-query ' + query.className
        }
      }
    },
    handleRefresh() {
      if (this.table.refresh instanceof Function) {
        this.table.refresh()
      }
    },
    handleCheckAllChange() {
      this.columns.forEach(item => {
        item.show = this.allSelected
      })
    },
    handleCheckChange() {
      const arr_uncheck = []
      this.columns.forEach(item => {
        if (!item.show) {
          arr_uncheck.push(false)
        }
      })
      this.isIndeterminate = (arr_uncheck.length < this.columns.length) && arr_uncheck.length > 0
      this.allSelected = arr_uncheck.length === 0
    }
  }
}
</script>

<style scoped>

</style>
