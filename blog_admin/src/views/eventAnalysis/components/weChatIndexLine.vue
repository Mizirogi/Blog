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
            text: '微信指数',
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
          color: ['blue', 'orange', 'red'],
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
              // magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
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
              smooth: false,
              type: 'line',
              barGap: 0,
              data: [320, 332, 301, 134, 390,120, 332, 201, 334, 390],
              itemStyle:{
                normal:{
                  label:{
                    show:true
                  }
                }
              }
            },
            {
              name: '逍客',
              smooth: false,
              type: 'line',
              data: [22, 82, 91, 34, 90,32, 82, 91, 34, 90],
              itemStyle:{
                normal:{
                  label:{
                    show:true
                  }
                }
              }
            },
            {
              name: 'RX5',
              smooth: false,
              type: 'line',
              data: [50, 32, 20, 54, 90,50, 22, 91, 54, 90],
              itemStyle:{
                normal:{
                  label:{
                    show:true
                  }
                }
              }
            },
          ]
        })
      }
    }
  }
</script>
