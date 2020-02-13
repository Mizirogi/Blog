<template>
  <div class="dashboard-editor-container">

    <!-- <el-tabs v-model="titleTime" style="margin-top:15px;margin-bottom:15px;position:relative" type="card">
      <el-tab-pane v-for="item in titleTimeOptions" :key="item.key" :label="item.label" :name="item.key">
        <panel-group v-if="titleTime===item.key" :type="item.key" :start-time="startTitleTime" :end-time="endTitleTime" />
      </el-tab-pane>
    </el-tabs> -->

    <div class="header-time-box">

      <!--<div style="margin-right:10px;">时间：</div>-->

      <el-select v-model="dateQuickPick" placeholder="" style="width:100px;margin-right:20px" size="small" @change="dateSelect">
        <el-option v-for="item in dateOptionsList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>

      <el-date-picker
        ref="dateTimePick"
        v-model="titleTimeValue"
        type="daterange"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        range-separator="~"
        size="small"
        style="width: 260px;margin-right:20px"
        @change="selectHeaderDate"
      />
      <!--<el-date-picker v-model="startTitleTime" type="datetime" default-time="['00:00:00']" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间"-->
      <!--style="height: 35px;border: none;width: 250px" />-->
      <!--至-->
      <!--<el-date-picker v-model="endTitleTime" type="datetime" default-time="['23:59:59']" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间"-->
      <!--style="height: 35px;border: none;width: 250px" />-->

    </div>

    <panel-group :start-time="startTitleTime" :end-time="endTitleTime" :type="timeType" />

    <div class="table-title-box">舆论效果上升最快(24小时内)</div>
    <div class="best-up-box">
      <el-radio-group v-model="bestUpType" style="margin-top:10px;">
        <el-radio-button label="1">文章</el-radio-button>
        <el-radio-button label="2">视频</el-radio-button>
      </el-radio-group>
      <el-tabs v-model="activeName" style="margin-top:10px;">
        <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
          <tab-pane v-if="activeName===item.key" :type="item.key" :header-type="bestUpType" />
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-row :gutter="20" class="margin-top-2">
      <el-col :span="12">
        <div class="table-title-box">爆文雷达</div>
        <div class="articleList" style="height:480px;position:relative">
          <div class="boom-select-box">
            <el-select v-model="boomType" placeholder="请选择" size="mini" style="width:95px;z-index:999;margin-right:5px">
              <el-option v-for="item in optionsBoomList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="boomIndex" placeholder="请选择" size="mini" style="width:80px;z-index:999">
              <el-option v-for="item in optionsBoomIndex" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <el-tabs v-model="boomName" @tab-click="handleClick">
            <el-tab-pane v-for="item in boomOptions" :key="item.key" :label="item.label" :name="item.key">
              <keep-alive>
                <boom-article-pane v-if="boomName===item.key" :type="item.key" :fire="'fire'" :filter-boom-read="boomType" :filter-boom-index="boomIndex" />
              </keep-alive>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="table-title-box">负面警示</div>
        <div class="articleList" style="height:480px;position:relative">
          <div class="boom-select-box">
            <el-select v-model="negType" placeholder="请选择" size="mini" style="width:95px;z-index:999;margin-right:5px">
              <el-option v-for="item in optionsNegList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="negIndex" placeholder="请选择" size="mini" style="width:80px;z-index:999">
              <el-option v-for="item in optionsNegIndex" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <el-tabs v-model="negativeName" @tab-click="handleClick">
            <el-tab-pane v-for="item in boomOptions" :key="item.key" :label="item.label" :name="item.key">
              <keep-alive>
                <boom-article-pane v-if="negativeName===item.key" :type="item.key" :fire="'nofire'" :filter-neg-read="negType" :filter-neg-index="negIndex" />
              </keep-alive>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>

    <!--
    <div class="table-title-box margin-top-2">高危页面</div>
    <el-tabs v-model="boomName" @tab-click="handleClick" style="border-bottom: 0;margin:0 0 10px 0">
        <keep-alive>
          <tab-pane/>
        </keep-alive>
    </el-tabs>-->

    <el-row :gutter="20" class="margin-top-2">
      <el-col :span="12">
        <div class="table-title-box">月发布量统计</div>
        <div class="articleList">
          <rank-line />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="table-title-box">传播负面的文章类型</div>
        <div class="articleList">
          <el-select v-model="selectVal" placeholder="请选择" size="mini" style="width: 85px;float: right;z-index:999">
            <el-option
              v-for="item in optionsList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <negaArticleBar />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="margin-top-2">
      <el-col :span="12">
        <div class="table-title-box">同质化文章分析</div>
        <div class="articleList">
          <articleAddBar />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="table-title-box">热点贴合度分析</div>
        <div class="articleList">
          <hotAdd-bar />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import tabPane from './components/homeTabTable'
import boomArticlePane from './components/boomArticle'

import rankLine from './components/rankingLine'
import hotAddBar from './components/hotAnalysisBar'
import articleAddBar from './components/articleAnalysisBar'
import negaArticleBar from './components/negaArticleBar'

import { parseTime } from '@/utils'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    tabPane,
    boomArticlePane,
    rankLine,
    hotAddBar,
    articleAddBar,
    negaArticleBar
  },
  data() {
    return {
      startTitleTime: '',
      endTitleTime: '',
      tabMapOptions: [
        { label: '负面', key: '2' },
        { label: '正面', key: '1' },
        { label: '中性', key: '0' }
      ],
      boomOptions: [{ label: '昨日', key: '0' }, { label: '本周', key: '1' }],
      negativeOptions: [
        { label: '昨日', key: '0' },
        { label: '本周', key: '1' }
      ],
      titleTimeOptions: [
        { label: '昨日', key: '0' },
        { label: '本周', key: '1' }
      ],
      titleTime: '0',
      titleTimeValue: [],
      bestUpType: '1',
      activeName: '2',
      boomName: '1',
      negativeName: '1',
      createdTimes: 0,
      nowTime: +new Date(),
      menuKey: 1,
      timeType:'',
      dateQuickPick: '1', // 默认为本周
      dateOptionsList: [
        {
          value: '1',
          label: '本周'
        }, {
          value: '2',
          label: '昨日'
        }, {
          value: '3',
          label: '自定义'
        }],
      optionsList: [
        {
          value: '选项1',
          label: '近7天'
        }, {
          value: '选项2',
          label: '近30天'
        }, {
          value: '选项5',
          label: '全部'
        }],
      selectVal: '近7天',
      optionsBoomList: [
        {
          value: '6',
          label: '阅读数'
        }, {
          value: '4',
          label: '评论数'
        }, {
          value: '2',
          label: '发布时间'
        }],
      boomType: '6',
      optionsBoomIndex: [
        {
          value: '2',
          label: '升序'
        }, {
          value: '1',
          label: '降序'
        }
      ],
      boomIndex: '1',
      optionsNegList: [
        {
          value: '6',
          label: '阅读数'
        }, {
          value: '4',
          label: '评论数'
        }, {
          value: '2',
          label: '发布时间'
        }],
      negType: '2',
      optionsNegIndex: [
        {
          value: '2',
          label: '升序'
        }, {
          value: '1',
          label: '降序'
        }
      ],
      negIndex: '1'
    }
  },
  watch: {
    // activeName(val) {
    //   this.$router.push(`${this.$route.path}?tab=${val}`);
    // },
    // dateQuickPick(val) {
    //   console.log('asdasdasd')
    // },
    menuTree() {
      ++this.menuKey
      this.nowTime = +new Date()
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab

    this.dateSelect()
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    titleHandleClick(tab, event) {
      console.log(tab, event)
    },
    selectHeaderDate(e) {
      if (e) {
       this.startTitleTime = e[0]
      this.endTitleTime = e[1] + ' 23:59:59' //后台时间处理
      console.log(this.endTitleTime);
      console.log(this.titleTimeValue)
      this.timeType = '2'
      this.dateQuickPick='3' 
      }
    },
    dateSelect() {
      const a = new Date(); const b = new Date(); let weekDay; let monthDay
      weekDay = a.getDay()
      if (a.getDay()===0) {
        weekDay = 7
      }
      if (this.dateQuickPick != '3') {
        switch (this.dateQuickPick) {
          case '1':
            console.log('本周')
            this.timeType= '1'
            monthDay = a.getDate()
            // 获取本周第一天
            a.setDate(monthDay - (weekDay - 1))
            a.setHours(0)
            a.setMinutes(0)
            a.setSeconds(0)
            
            break
          case '2':
            console.log('昨日')
            this.timeType= '0'
            monthDay = a.getDate()
            // 获取昨日
            a.setDate(monthDay - 1)
            a.setHours(0)
            a.setMinutes(0)
            a.setSeconds(0)
            b.setDate(monthDay - 1)
            b.setHours(23)
            b.setMinutes(59)
            b.setSeconds(59)    
            break
          case '3':
            console.log('3')
            this.timeType= '2'
            break

          default:
            break
        }
        // 赋值
        this.titleTimeValue = []
        this.startTitleTime = parseTime(a)
        this.endTitleTime = parseTime(b)
        this.titleTimeValue.push(parseTime(a, '{y}-{m}-{d}'))
        this.titleTimeValue.push(parseTime(b, '{y}-{m}-{d}'))
      } else {
        console.log(this.$refs.dateTimePick)
        this.$refs.dateTimePick.$el.click()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
  .articleList {
    margin: 15px 0 0 0;
    background: #fff;
    padding: 16px 16px 0;
  }
}
.table-title-box {
  padding: 1%;
  border-left: 3px solid lightblue;
}
.margin-top-2 {
  margin-top: 2%;
}
@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

/*@media screen and(max-width: 1440px){*/
  /*.header-time-box {*/
    /*position: absolute;*/
    /*top: 2%;*/
    /*left: 15%!important;*/
  /*}*/
/*}*/
// .header-time-box {
//   position: absolute;
//   top: 47px;
//   /*left: 170px;*/
//   right:32px;
// }

.header-time-box {
display: flex;
align-items: center;
padding: 4px 0 4px 20px;
    background-color: #fff
}

.best-up-box {
  background: #fff;
  padding: 15px;
  margin-top: 15px;
}
.boom-select-box{
  position: absolute;
  right: 15px;
  top: 22px;
  }
.el-range-editor--small .el-range-separator {
    line-height: 34px;
    font-size: 13px;
}




</style>
