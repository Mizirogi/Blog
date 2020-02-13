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
            text: '热点贴合度分析',
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
            data: ['娱乐', '体育', '外交','政治', '节日','科技', '经济', '社会']
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
              name: '娱乐',
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
              data: [709, 1917, 2455, 2610, 1719, 1433, 1544, 3285, 5208, 3372, 2484, 4078]
            },

            {
              name: '体育',
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
              data: [886, 1576, 777, 1314, 888, 821, 765, 665, 1501, 981, 381, 220]
            },
            {
              name: '政治',
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
              data: [417, 1576, 612, 1255, 666, 828, 388, 890, 1301, 911, 381, 220]
            },
            {
              name: '节日',
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
              data: [427, 1726, 599, 1451, 986, 564, 465, 399, 888, 1021, 381, 1220]
            },
            {
              name: '科技',
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
              data: [1237, 1376, 712, 1167, 761, 482, 564, 1390, 689, 951, 381, 820]
            },
            {
              name: '经济',
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
              data: [1500, 1586, 661, 1211, 822, 787, 361, 1139, 556, 1512, 381, 521]
            },
            {
              name: '社会',
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
              data: [917, 1616, 587, 1611, 932, 555, 531, 1790, 811, 891, 381, 681]
            },
            {
              name: '外交',
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
              data: [1036, 3693, 2962, 3810, 2519, 1915, 1748, 4675, 6209, 4323, 2865, 4298]
            }
          ]
        })
      }
    }
  }
</script>
