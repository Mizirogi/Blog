<template>

  <div>

    <div class="table-title-box title-time-box">
      <span>传播指数分析</span>
      <div>
        <span>时间选择:</span>&#12288;
        <el-date-picker
          v-model="timeSelect"
          type="daterange"
          range-separator="至"
          start-placeholder="2019-01-01"
          end-placeholder="2019-12-01">
        </el-date-picker>
      </div>
    </div>

    <div class="dashboard-editor-container">


      <el-tabs>
        <keep-alive>
          <bai-du-line  width="100%"  />
        </keep-alive>
      </el-tabs>

      <el-tabs>
        <keep-alive>
          <we-chat-line  width="100%"  />
        </keep-alive>
      </el-tabs>

      <!--<el-tabs>-->
        <!--<keep-alive>-->
          <!--<month-total-line  width="100%"  />-->
        <!--</keep-alive>-->
      <!--</el-tabs>-->
    </div>

  </div>
</template>

<script>
  import BaiDuLine from  './baiduIndexLine'
  import weChatLine from  './weChatIndexLine'
  import monthTotalLine from  './monthTotalLine'
  export default {
    name: 'DashboardAdmin',
    components: {
      BaiDuLine,
      weChatLine,
      monthTotalLine
    },
    data() {
      return {
        tabMapOptions: [
          { label: '负面', key: 'negative' },
          { label: '正面', key: 'positive' },
          { label: '中性', key: 'neutral' }
        ],
        boomOptions: [
          { label: '昨日', key: 'lastDay' },
          { label: '本周', key: 'nowWeek' },
        ],
        activeName: 'negative',
        boomName:'nowWeek',
        createdTimes: 0,
        timeSelect:'',
        optionsList: [{
          value: '选项1',
          label: '智跑'
        }, {
          value: '选项2',
          label: '逍客'
        }, {
          value: '选项5',
          label: 'RX5'
        }],
        selectVal: '智跑'
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
    width:100%;
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
  .title-time-box {
    border-bottom:0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 32px;
    background: aliceblue;
  }
  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
