<template>
  <div class="dashboard-editor-container">

    <el-tabs v-model="defaultName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in reportMenu" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <rule-list v-if="defaultName===item.key" :type="item.key" @create="showCreatedTimes" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  import ruleList from './components/ruleList'
  export default {
  name: 'DataReport',
  components: {
    ruleList
  },
  data() {
    return {
      reportMenu: [
        { label: '报告列表', key: 'report' },
        { label: '规则列表', key: 'rule' },
      ],
      defaultName:'report',
      multipleSelection: [],
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab;
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    },
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
  .table-title-box {
    border-bottom: 1px solid #d9d9d9;
    padding: 1%;
    border-left: 3px solid lightblue;
  }
  .margin-top-2{
    margin-top: 2%;
  }
  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
