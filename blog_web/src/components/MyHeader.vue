<!--
 * @Description: 
 * @Author: Li
 * @Date: 2019-11-07 21:37:03
 * @LastEditors: Li
 * @LastEditTime: 2019-11-08 17:42:55
 -->
<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
   
    router
    @select="handleSelect"
  >
    <el-menu-item index="1" class="nav-item">后台</el-menu-item>
    <el-menu-item index="1" class="nav-item">关于我</el-menu-item>
    <el-submenu index="2" class="nav-item">
      <template slot="title">我的工作台</template>
      <el-menu-item index="2-1">选项1</el-menu-item>
      <el-menu-item index="2-2">选项2</el-menu-item>
      <el-menu-item index="2-3">选项3</el-menu-item>
    </el-submenu>
    <el-menu-item index="article" class="nav-item">
      <span slot="title">文章列表</span>
    </el-menu-item>
    <el-menu-item index="index" class="nav-item">
      <span slot="title">首页</span>
    </el-menu-item>
  </el-menu>
</template>
<script>
export default {
  name: "component_name",
  data() {
    return {
      activeIndex: this.$route.path,
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeIndex = key
      console.log(key, keyPath);
    }
  },
  mounted(){
    this.activeIndex = this.$route.path;
  }
};
</script>

<style scoped>
.nav-item {
  float: right !important;
}
</style>