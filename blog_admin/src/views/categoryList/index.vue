<!--
 * @Description:
 * @Author: Li
 * @Date: 2019-11-20 12:55:49
 * @LastEditors  : Li
 * @LastEditTime : 2020-01-11 22:58:47
 -->
<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane :label="tabMapOptions[0].label" :name="tabMapOptions[0].key">
        <keep-alive>
          <post-category v-if="activeName==tabMapOptions[0].key" :type="tabMapOptions[0].key" />
        </keep-alive>
      </el-tab-pane>

      <el-tab-pane :label="tabMapOptions[1].label" :name="tabMapOptions[1].key">
        <keep-alive>
          <keyword-group v-if="activeName==tabMapOptions[1].key" :type="tabMapOptions[1].key" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import keywordGroup from "./components/KeywordGroup";

import postCategory from "./components/Category";

export default {
  name: "Tab",
  components: { keywordGroup, postCategory },
  data() {
    return {
      tabMapOptions: [
        { label: "文章分类", key: "postCategory" },
        { label: "关键词分组", key: "keywordGroup" }
      ],
      activeName: "postCategory"
    };
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`);
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab;
    if (tab) {
      this.activeName = tab;
    }
  },
  methods: {
    // toRuleAdmin(tab) {
    //   // childValue就是子组件传过来的值
    //   this.activeName = tab
    //   console.log('qweqweqwe' + tab)
    //   console.log(document.getElementById('tab-keywordAdmin'))
    //   var a = document.getElementById('tab-keywordAdmin')
    //   a.classList.add('.rule-active')
    //   a.classList.remove('.is-top')
    //   console.log(a)
    // },
  }
};
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
.rule-active {
  color: #1890ff;
  background-color: #fff;
  border-right-color: #dcdfe6;
  border-left-color: #dcdfe6;
}
</style>
