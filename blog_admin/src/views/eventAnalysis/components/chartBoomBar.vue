<template>
  <div :class="className" :style="{height:height,width:width}" style="background: #fff;" ></div>
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'

  const animationDuration = 6000

  export default {
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '500px'
      }
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart()
      })
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.chart.setOption({
          title: {
            text: '自媒体爆款视频统计',
            x: '20',
            top: '20',
            textStyle: {
              color: '#000',
              fontSize: '14'
            },
            subtextStyle: {
              color: '#90979c',
              fontSize: '14'
            }
          },
          color: ['#4472C4', '#ED7D31', '#A5A5A5'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['智跑', '逍客', 'RX5'],
            bottom:'0'
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              // mark: {show: true},
              // magicType: {show: true, type: ['bar','line',  'stack', 'tiled']},
              // restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              axisTick: {show: false},
              data: ['1月','2月',  '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '智跑',
              type: 'bar',
              barGap: 0,
              data: [520, 33, 301, 334, 390,32, 532, 301, 334, 147]
            },
            {
              name: '逍客',
              type: 'bar',
              data: [220, 182, 91, 234, 690,22, 182, 191, 234, 258]
            },
            {
              name: 'RX5',
              type: 'bar',
              data: [50, 22, 201, 154, 190,150, 232, 201, 154, 369]
            },
          ]
        })
      }
    }
  }
</script>
