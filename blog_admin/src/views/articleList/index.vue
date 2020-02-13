<!--
 * @Description:
 * @Author: Li
 * @Date: 2019-11-20 12:55:49
 * @LastEditors  : Li
 * @LastEditTime : 2020-01-11 18:04:54
 -->
<template>
  <div class="tab-container">
    
        <List  />

  </div>
</template>

<script>

import List from './components/List'

export default {
  name: 'Tab',
  components: {  List  },
  data() {
    return {
      
     
    }
  },
  watch: {
    // activeName(val) {
    //   this.$router.push(`${this.$route.path}?tab=${val}`)
    // }
  },
  created() {
    
    // const tab = this.$route.query.tab
    // if (tab) {
    //   this.activeName = tab
    // }
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
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
  .rule-active {
    color: #1890ff;
    background-color: #fff;
    border-right-color: #DCDFE6;
    border-left-color: #DCDFE6;
}
</style>
