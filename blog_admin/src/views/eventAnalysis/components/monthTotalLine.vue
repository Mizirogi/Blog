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
            text: '每月传播总量曲线图',
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
          color: ['#9c2f32', 'orange', 'pink'],
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
              type: 'line',
              smooth: false,
              barGap: 0,
              data: [1320, 1332, 1301, 1134, 1390,1120, 1332, 1201, 1334, 1123],
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
              type: 'line',
              smooth: false,
              data: [220, 182, 191, 234, 290,320, 182, 291, 234, 90],
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
              type: 'line',
              smooth: false,
              data: [150, 232, 201, 154, 190,350, 232, 91, 154, 190],
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
