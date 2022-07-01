<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>简介</span>
          </div>
          <div class="content">
            目前微服务开发正在如火如荼地进行着，目前比较火热的算是Spring Cloud系列了。
            很多项目希望从单体架构转向微服务架构，Spring Cloud对于中小型项目感觉过于繁琐了，找遍全网也没有找到合脚的解决方案，于是动手撸了一个。
            Cola-Admin是一款基于SpringBoot+Dubbo的微服务后台权限管理系统。采用RBAC的权限管理框架实现，集成了SpringSecurity，同时实现了灵活的数据权限管理功能。
            可根据组织机构、角色、自定义数据权限。
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>技术栈</span>
          </div>
          <div class="content">
            后端<br>
            --Alibaba Nacos 2.1.0<br>
            --SpringBoot 2.6.6<br>
            --SpringSecurity 2.6.6<br>
            --Apache Dubbo 3.0.7<br>
            --Mybatis-Plus 3.5.2<br>
            --Alibaba Druid 1.2.8<br>
            --Hutool 5.8.0.M2<br>
            缓存<br>
            --redis<br>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
    }
  }
}
</script>

<style scoped>

 .content {
   font-size: 14px;
 }
</style>
