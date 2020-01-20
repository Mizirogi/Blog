<!--
 * @Description: 
 * @Author: Li
 * @Date: 2019-10-19 17:30:21
 * @LastEditors: Li
 * @LastEditTime: 2019-11-08 14:42:12
 -->
<template>
  <div id="app">
    <el-container>
    <el-header style="padding:0">
      <MyHeader></MyHeader>
    </el-header>
        <el-main class="main">
            <router-view></router-view>
        </el-main>
    </el-container>
  </div>
</template>

<script>
import MyHeader from "@/components/MyHeader.vue";
export default {
  name: "App",
  components: {
     MyHeader
  }
};
</script>

<style>
html{
  width: 100%;
  height: 100%;
  background: #f1f1f1;
}
body{
  width: 100%;
  height: 100%;
  margin: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.main {
  margin: 0 10% 0 10%;
}
</style>
