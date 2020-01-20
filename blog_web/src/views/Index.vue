<!--
 * @Description: 
 * @Author: Li
 * @Date: 2019-10-22 17:31:14
 * @LastEditors: Li
 * @LastEditTime: 2019-11-08 17:46:50
 -->
<template>
  <Tree></Tree>
</template>
<script>
import Tree from "@/components/Tree.vue";
export default {
  data() {
    return {
      pageHeader: "首页"
    };
  },
  methods: {
    goBack() {
      console.log("go back");
    },
    getMsgFormSon(data) {
      this.pageHeader = data;
      console.log(this.pageHeader);
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
      console.log(this.$route.name);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  components: {
    Tree
  }
};
</script>
<style>
.index {
  border-right: solid 1px #e6e6e6;
  color: #fff;
  line-height: 60px;
  height: 60px;
  font-size: 20px;
  font-weight: 500;
  background-color: #3a3f51;
}
.el-container {
  height: 100%;
}
.main {
  margin: 0 10% 0 10%;
}
</style>
