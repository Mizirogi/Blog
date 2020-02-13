<template>
  <div   :class="className" :style="{height:height,width:width}" style="background: #fff;" ></div>
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
        this.chart.setOption({
          title: {
            text: '视频发布总数统计',
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
            data: ['新车介绍', '测评', '搞笑/剧情','用车知识', '车主口碑','驾乘活动', '产品力解析']
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
            data: ['快手','抖音']
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
          dataZoom: [
            {
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
              name: '新车介绍',
              type: 'bar',
              stack: 'total',
              barMaxWidth:150,
              barGap: '10%',
              itemStyle: {
                normal: {
                  // color: '#4b28ff',
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
              data: [709, 1917, 455, 610, 1719, 1433, 1544, 328, 208, 372, 2484, 478]
            },
            {
              name: '测评',
              type: 'bar',
              stack: 'total',
              itemStyle: {
                normal: {
                  // color: '#e896ff',
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    formatter(p) {
                      return p.value > 0 ? p.value : ''
                    }
                  }
                }
              },
              data: [672, 1511, 507, 1200, 800, 482, 204, 1390, 1001, 951, 381, 220]
            },
            {
              name: '搞笑/剧情',
              type: 'bar',
              stack: 'total',
              itemStyle: {
                normal: {
                  // color: '#ff334b',
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    formatter(p) {
                      return p.value > 0 ? p.value : ''
                    }
                  }
                }
              },
              data: [765, 1633, 507, 1200, 800, 482, 204, 1390, 1001, 951, 381, 220]
            },
            {
              name: '用车知识',
              type: 'bar',
              stack: 'total',
              itemStyle: {
                normal: {
                  // color: '#9eff25',
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    formatter(p) {
                      return p.value > 0 ? p.value : ''
                    }
                  }
                }
              },
              data: [556, 1612, 507, 1200, 800, 482, 204, 1390, 1001, 951, 381, 220]
            },
            {
              name: '车主口碑',
              type: 'bar',
              stack: 'total',
              itemStyle: {
                normal: {
                  // color: '#ff2798',
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    formatter(p) {
                      return p.value > 0 ? p.value : ''
                    }
                  }
                }
              },
              data: [661, 1776, 507, 1200, 800, 482, 204, 1390, 1001, 951, 381, 220]
            },
            {
              name: '驾乘活动',
              type: 'bar',
              stack: 'total',
              itemStyle: {
                normal: {
                  // color: '#4fe4ff',
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    formatter(p) {
                      return p.value > 0 ? p.value : ''
                    }
                  }
                }
              },
              data: [441, 1551, 507, 1200, 800, 482, 204, 1390, 1001, 951, 381, 220]
            },
            {
              name: '产品力解析',
              type: 'bar',
              stack: 'total',
              itemStyle: {
                normal: {
                  // color: '#ff5d69',
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    formatter(p) {
                      return p.value > 0 ? p.value : ''
                    }
                  }
                }
              },
              data: [357, 1276, 507, 1200, 800, 482, 204, 1390, 1001, 951, 381, 220]
            },
          ]
        })
      }
    }
  }
</script>
