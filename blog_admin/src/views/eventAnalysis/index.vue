<template>
  <div class="app-container">
    <EventTotalView class="transition-box" />
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="传播效果分析" name="first">
        <comm-effect v-if="resizeFirTabWidth" />
      </el-tab-pane>
      <el-tab-pane label="传播声量分析" name="second">
        <voice-tab v-if="resizeSecTabWidth" />
      </el-tab-pane>
      <el-tab-pane label="传播指数分析" name="third">
        <index-tab v-if="resizeThrTabWidth" />
      </el-tab-pane>
      <el-tab-pane label="负面舆情分析" name="fourth">
        <negative-Tab v-if="resizeFouTabWidth" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Select from "./components/select.vue";
import Chart from "./components/chartBoomBar.vue";
import IndexChart from "./components/indexChart.vue";
import EventTotalView from "./components/EventTotalView";
import commEffect from "./components/commEffect";
import voiceTab from './components/voiceStatistics';
import indexTab from './components/indexAnalysis';
import negativeTab from './components/negativeAnalysis'
export default {
  name: "RealTimeDetails",
  components: {
    Select,
    Chart,
    IndexChart,
    EventTotalView,
    commEffect,
    voiceTab,
    indexTab,
    negativeTab
  },
  data() {
    return {
      activeNames: ["1", "2"],
      activeName: "first",
      resizeSecTabWidth:false,
      resizeThrTabWidth:false,
      resizeFouTabWidth:false,
      resizeFirTabWidth:true
    };
  },
  methods: {
    handleClick(tab, event) {
      let tabName = tab.name;
      switch (tabName) {
        case 'first' :
          this.resizeFirTabWidth = true;
          this.resizeSecTabWidth = false;
          this.resizeThrTabWidth = false;
          this.resizeFouTabWidth = false;
          break;
        case 'second' :
          this.resizeSecTabWidth = true;
          this.resizeThrTabWidth = false;
          this.resizeFouTabWidth = false;
          this.resizeFirTabWidth = false;
          break;
        case 'third' :
          this.resizeThrTabWidth = true;
          this.resizeSecTabWidth = false;
          this.resizeFouTabWidth = false;
          this.resizeFirTabWidth = false;
          break;
        case 'fourth' :
          this.resizeFouTabWidth = true;
          this.resizeSecTabWidth = false;
          this.resizeThrTabWidth = false;
          this.resizeFirTabWidth = false;
          break
      }
    },
    handleChange(val) {
      console.log(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 40px;
}
.chart-group {
  display: flex;
  flex-wrap: wrap;
}
.chart-container {
  position: relative;
  width: 48%;
  height: calc(100vh - 84px);
}

.transition-box {
  margin-bottom: 10px;
}
</style>
