<template>
  <div  :id="id"  :class="className" :style="{height:height,width:width}" style="background: #fff;" ></div>
</template>

<script>
  import echarts from 'echarts'
  import resize from './mixins/resize'

  export default {
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      id: {
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
      this.initChart()
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
        const xData = (function() {
          const data = []
          for (let i = 1; i < 11; i++) {
            data.push(i + '月')
          }
          return data
        }())
        this.chart.setOption({
          title: {
            text: '同质化文章分析',
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
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              textStyle: {
                color: '#fff'
              }
            }
          },
          grid: {
            left: '5%',
            right: '5%',
            borderWidth: 0,
            top: 80,
            bottom: 95,
            textStyle: {
              color: '#fff'
            }
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
          legend: {
            bottom:'0',
            textStyle: {
              color: '#90979c'
            },
            data: ['QQ看点', '百家号', '大鱼号','公众号', '企鹅号','头条号', '网易号', '小红书', '一点号']
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitArea: {
              show: false
            },
            axisLabel: {
              interval: 0

            },
            data: xData
          }],
          yAxis: [{
            type: 'value',
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0
            },
            splitArea: {
              show: false
            }
          }],
          dataZoom: [{
            show: true,
            height: 30,
            xAxisIndex: [
              0
            ],
            bottom: 30,
            start: 10,
            end: 80,
            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
              color: '#d3dee5'
            },
            textStyle: {
              color: '#fff' },
            borderColor: '#90979c'

          }, {
            type: 'inside',
            show: true,
            height: 15,
            start: 1,
            end: 35
          }],
          series: [
            {
              name: 'QQ看点',
              type: 'bar',
              stack: 'total',
              barMaxWidth: 35,
              barGap: '10%',
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    textStyle: {
                      color: '#fff'
                    },
                    formatter(p) {
                      return p.value > 0 ? p.value : ''
                    }
                  }
                }
              },
              data: [709, 1917, 455, 610, 1719, 1433, 1544, 328, 1208, 372, 2484, 478]
            },

            {
              name: '百家号',
              type: 'bar',
              stack: 'total',
              itemStyle: {
                normal: {
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    formatter(p) {
                      return p.value > 0 ? p.value : ''
                    }
                  }
                }
              },
              data: [447, 1276, 407, 1321, 986, 541, 1254, 290, 1312, 888, 381, 220]
            },
            {
              name: '小红书',
              type: 'bar',
              stack: 'total',
              itemStyle: {
                normal: {
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    formatter(p) {
                      return p.value > 0 ? p.value : ''
                    }
                  }
                }
              },
              data: [767, 377, 527, 1255, 768, 456, 284, 554, 1566, 722, 381, 261]
            },
            {
              name: '大鱼号',
              type: 'bar',
              stack: 'total',
              itemStyle: {
                normal: {
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    formatter(p) {
                      return p.value > 0 ? p.value : ''
                    }
                  }
                }
              },
              data: [467, 526, 537, 1121, 671, 654, 314, 665, 988, 1155, 381, 251]
            },
            {
              name: '公众号',
              type: 'bar',
              stack: 'total',
              itemStyle: {
                normal: {
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    formatter(p) {
                      return p.value > 0 ? p.value : ''
                    }
                  }
                }
              },
              data: [557, 556, 456, 1312, 821, 667, 324, 323, 1671, 878, 381, 241]
            },
            {
              name: '企鹅号',
              type: 'bar',
              stack: 'total',
              itemStyle: {
                normal: {
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    formatter(p) {
                      return p.value > 0 ? p.value : ''
                    }
                  }
                }
              },
              data: [767, 416, 561, 1511, 832, 876, 334, 876, 1333, 999, 381, 251]
            },
            {
              name: '头条号',
              type: 'bar',
              stack: 'total',
              itemStyle: {
                normal: {
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    formatter(p) {
                      return p.value > 0 ? p.value : ''
                    }
                  }
                }
              },
              data: [357, 521, 533, 1231, 811, 654, 264, 343, 1451, 789, 381, 320]
            },
            {
              name: '小红书',
              type: 'bar',
              stack: 'total',
              symbolSize: 10,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    formatter(p) {
                      return p.value > 0 ? p.value : ''
                    }
                  }
                }
              },
              data: [303, 369, 296, 1381, 251, 321, 874, 467, 620, 432, 586, 398]
            },
            {
              name: '一点号',
              type: 'bar',
              stack: 'total',
              symbolSize: 10,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    formatter(p) {
                      return p.value > 0 ? p.value : ''
                    }
                  }
                }
              },
              data: [1036, 558, 962, 810, 519, 915, 1748, 675, 609, 423, 865, 333]
            }
          ]
        })
      }
    }
  }
</script>
