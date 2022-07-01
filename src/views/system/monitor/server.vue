<template>
  <el-tabs>
    <el-tab-pane :label="data.name">
      <el-row>
        <el-col :span="4">
          <div class="title">系统信息</div>
          <div style="font-size: 12px;">
            <div style="padding: 3px;color: #2ac06d">
              操作系统：
            </div>
            <div style="padding: 6px;">
              {{ data.sys.os }}
            </div>
            <div style="padding: 3px;color: #2ac06d">
              Java版本：
            </div>
            <div style="padding: 6px;">
              {{ data.jvm.javaVersion }}
            </div>
            <div style="padding: 3px;color: #2ac06d">
              累计运行：
            </div>
            <div style="padding: 6px;">
              {{ data.sys.day }}
            </div>
            <div style="padding: 3px;color: #2ac06d">
              IP地址
            </div>
            <div style="padding: 6px">
              {{ data.sys.ip }}
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="title">CPU利用率</div>
          <el-tooltip placement="top-end">
            <div slot="content" style="font-size: 12px;">
              <div style="padding: 3px;">
                {{ data.cpu.name }}
              </div>
              <div style="padding: 3px">
                {{ data.cpu.packages }}
              </div>
              <div style="padding: 3px">
                {{ data.cpu.core }}
              </div>
              <div style="padding: 3px">
                {{ data.cpu.logic }}
              </div>
            </div>
            <div class="content">
              <el-progress type="dashboard" :percentage="parseFloat(data.cpu.used)" />
            </div>
          </el-tooltip>
          <div class="footer">{{ data.cpu.coreNumber }} 核心</div>
        </el-col>
        <el-col :span="4">
          <div class="title">JVM内存利用率</div>
          <div class="content">
            <el-tooltip placement="top-end">
              <div slot="content" style="font-size: 12px;">
                <div style="padding: 3px">
                  JVM版本：{{ data.jvm.jvmVersion }}
                </div>
                <div style="padding: 3px">
                  最大可用内存：{{ data.jvm.usableMemory }}
                </div>
                <div style="padding: 3px">
                  已分配的内存：{{ data.jvm.totalMemory }}
                </div>
              </div>
              <div class="content">
                <el-progress type="dashboard" :percentage="parseFloat(data.jvm.usedRate)" />
              </div>
            </el-tooltip>
          </div>
          <div class="footer">{{ data.jvm.totalMemory }} / {{ data.jvm.usableMemory }}</div>
        </el-col>
        <el-col :span="4">
          <div class="title">JVM空闲率</div>
          <div class="content">
            <el-tooltip placement="top-end">
              <div slot="content" style="font-size: 12px;">
                <div style="padding: 3px">
                  JVM版本：{{ data.jvm.jvmVersion }}
                </div>
                <div style="padding: 3px">
                  已分配内存：{{ data.jvm.totalMemory }}
                </div>
                <div style="padding: 3px">
                  剩余的空间：{{ data.jvm.freeMemory }}
                </div>
              </div>
              <div class="content">
                <el-progress type="dashboard" :percentage="parseFloat(data.jvm.freeRate)" />
              </div>
            </el-tooltip>
          </div>
          <div class="footer">{{ data.jvm.freeMemory }} / {{ data.jvm.totalMemory }}</div>
        </el-col>
        <el-col :span="4">
          <div class="title">主内存利用率</div>
          <el-tooltip placement="top-end">
            <div slot="content" style="font-size: 12px;">
              <div style="padding: 3px;">
                总量：{{ data.memory.total }}
              </div>
              <div style="padding: 3px">
                已使用：{{ data.memory.used }}
              </div>
              <div style="padding: 3px">
                空闲：{{ data.memory.available }}
              </div>
            </div>
            <div class="content">
              <el-progress type="dashboard" :percentage="parseFloat(data.memory.usageRate)" />
            </div>
          </el-tooltip>
          <div class="footer">{{ data.memory.used }} / {{ data.memory.total }}</div>
        </el-col>
        <el-col :span="4">
          <div class="title">硬盘利用率</div>
          <div class="content">
            <el-tooltip placement="top-end">
              <div slot="content" style="font-size: 12px;">
                <div style="padding: 3px">
                  总量：{{ data.disk.total }}
                </div>
                <div style="padding: 3px">
                  空闲：{{ data.disk.available }}
                </div>
              </div>
              <div class="content">
                <el-progress type="dashboard" :percentage="parseFloat(data.disk.usageRate)" />
              </div>
            </el-tooltip>
          </div>
          <div class="footer">{{ data.disk.used }} / {{ data.disk.total }}</div>
        </el-col>
      </el-row>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: 'Server',
  props: {
    data: {
      require: true,
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style scoped>
.title {
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  color: rgb(66,185,131);
  margin-bottom: 16px;
}
.footer {
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  color: #999;
  margin-top: -5px;
  margin-bottom: 10px;
}
.content {
  text-align: center;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
