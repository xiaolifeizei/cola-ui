<template>
  <el-select
    v-model="value"
    remote
    filterable
    reserve-keyword
    placeholder="请输入物资名称或物资拼音码"
    :remote-method="remoteMethod"
    :loading="loading"
    loading-text="暂无数据"
    :clearable="true"
    style="width: 100%;"
    @change="change"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>

import { getCategoryGoodsPage } from '@/api/basics/goods/goods'

export default {
  name: 'GoodsSelect',
  props: {
    goodsId: {
      require: true,
      type: String,
      default: ''
    },
    goodsName: {
      require: false,
      type: String,
      default: ''
    },
    categoryCode: {
      require: false,
      type: String,
      default: null
    }
  },
  data() {
    return {
      value: '',
      loading: false,
      options: []
    }
  },
  watch: {
    goodsId: {
      handler(val) {
        if (!val) {
          this.value = ''
          this.options = []
        }
      },
      immediate: true
    },
    goodsName: {
      handler(val) {
        if (val && this.goodsId && val !== '') {
          this.value = this.goodsId
          this.options = []
          this.options.push({ label: this.goodsName, value: this.goodsId })
        }
      },
      immediate: true
    }
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        const data = {
          conditions: [
            { name: 'spellCode', keyword: 'like', value: query, exp: 'or' },
            { name: 'g.name', keyword: 'like', value: query }
          ],
          pageSize: 10
        }
        if (this.categoryCode && this.categoryCode.split(',').length > 0) {
          const condition = { keyword: 'and', conditions: [], value: '', name: '' }
          this.categoryCode.split(',').forEach(code => {
            if (code && code.length > 0) {
              condition.conditions.push({ name: 'gc.code', keyword: 'eq', value: code, exp: 'or' })
            }
          })
          data.conditions.push(condition)
        }
        setTimeout(() => {
          getCategoryGoodsPage(data).then(res => {
            if (res.data.page) {
              this.options = []
              this.loading = false
              res.data.page.records.forEach(item => {
                this.options.push({ label: item.name, value: item.id.toString() })
              })
            }
          })
        }, 500)
      } else {
        this.options = []
      }
    },
    change(value) {
      if (value) {
        this.$emit('update:goodsId', value)
      } else {
        this.$emit('update:goodsId', null)
      }
    }
  }
}
</script>

<style scoped>

</style>
