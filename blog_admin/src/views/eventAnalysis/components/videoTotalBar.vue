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
        default: '550px'
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
        this.chart.setOption( {
          title: {
            text: '视频类型总量数据',
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
            dataset: {
              source: [
                ['score', 'amount', 'product'],
                [89.3, 58212, '产品力解析'],
                [57.1, 78254, '驾乘活动'],
                [74.4, 41032, '车主口碑'],
                [50.1, 12755, '用车知识'],
                [89.7, 20145, '搞笑/剧情'],
                [68.1, 79146, '测评'],
                [19.6, 91852, '新车介绍'],
              ]
            },
            grid: {containLabel: true},
            xAxis: {name: ''},
            yAxis: {type: 'category'},
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
            tooltip:{
              show:true
           },
            visualMap: {
              orient: 'horizontal',
              left: 'center',
              min: 10,
              max: 100,
              text: ['最高', '最低'],
              // Map the score column to color
              dimension: 0,
              inRange: {
                color: ['#459fda', '#9028e1']
              }
            },
            series: [
              {
                type: 'bar',
                // label:{
                //   show:true
                // },
                encode: {
                  // Map the "amount" column to X axis.
                  x: 'amount',
                  // Map the "product" column to Y axis
                  y: 'product'
                }
              }
            ]
          }
        )
      }
    }
  }
</script>
