<template>
  <div v-loading.fullscreen.lock="!show" element-loading-text="正在加载数据..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" class="app-container">
    <div v-if="show">
      <div v-for="(sysData, index) in applicationNames" :key="index">
        <server :data.sync="monitorData[sysData]" />
      </div>
    </div>
  </div>
</template>

<script>

import { getSystemMonitor, getApplicationNames } from '@/api/system/monitor/monitor'
import Server from './server'

export default {
  name: 'Monitor',
  components: { Server },
  data() {
    return {
      timer: 0,
      show: false,
      data: {},
      applicationNames: [],
      monitorData: {}
    }
  },
  watch: {
    monitorData(val) {
      if (val.length > 0) {
        this.show = true
      }
    }
  },
  mounted() {
    this.getSystemMonitorData()
    this.timer = setInterval(this.getSystemMonitorData, 5000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    getSystemMonitorData() {
      getApplicationNames().then(res => {
        return new Promise((resolve) => {
          if (res.data.list) {
            this.applicationNames = res.data.list
            resolve()
          }
        })
      }).then(() => {
        this.applicationNames.forEach((item, index) => {
          getSystemMonitor('applicationName=' + item).then(res => {
            if (res.data.monitor) {
              this.monitorData[item] = res.data.monitor
              if (Object.keys(this.monitorData).length === this.applicationNames.length) {
                this.show = true
              }
            }
          })
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
