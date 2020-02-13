<template>
  <div    :class="className" :style="{height:height,width:width}" style="background: #fff;" ></div>
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
            text: '自媒体文章发布总数统计',
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
            data: ['经销店信息', '新车上市', '产品力解析评测','导购对比', '车主口碑','行业资讯', '被竞品狙击', '狙击竞品', '驾乘活动', '负面/质疑']
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
            data:  ['QQ看点', '百家号', '大鱼号','公众号', '企鹅号','头条号', '网易号', '小红书', '一点号']
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
              name: '经销店信息',
              type: 'bar',
              stack: 'total',
              barMaxWidth: 35,
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
              data: [9, 6, 13, 10, 19, 14, 15, 8, 8, 13, 11, 7]
            },
            {
              name: '新车上市',
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
              data: [22, 8, 9, 13, 8, 25, 24, 13, 10, 9, 15, 16]
            },
            {
              name: '产品力解析评测',
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
              data: [25, 12, 17, 12, 8, 24, 32, 13, 10, 9, 33, 22]
            },
            {
              name: '导购对比',
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
              data: [14, 23, 25, 14, 18, 24, 23, 13, 11, 9, 31, 12]
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
              data: [21, 15, 15, 16, 8, 34, 22, 13, 10, 19, 31, 6]
            },
            {
              name: '行业资讯',
              type: 'bar',
              stack: 'total',
              itemStyle: {
                normal: {
                  // color: '#34ff34',
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    formatter(p) {
                      return p.value > 0 ? p.value : ''
                    }
                  }
                }
              },
              data: [23, 17, 15, 21, 8, 4, 27, 13, 10, 9, 13, 9]
            },
            {
              name: '被竞品狙击',
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
              data: [31, 10, 6, 13, 8, 14, 22, 10, 11, 9, 8, 20]
            },
            {
              name: '狙击竞品',
              type: 'bar',
              stack: 'total',
              symbolSize: 10,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  // color: '#96ff83',
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    formatter(p) {
                      return p.value > 0 ? p.value : ''
                    }
                  }
                }
              },
              data: [10,8, 26, 10, 25, 19, 17, 14, 20, 24, 28, 8]
            },
            {
              name: '驾乘活动',
              type: 'bar',
              stack: 'total',
              symbolSize: 10,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  // color: '#ffc095',
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    formatter(p) {
                      return p.value > 0 ? p.value : ''
                    }
                  }
                }
              },
              data: [10, 26, 11, 10, 19, 15, 17, 15, 20, 23, 8, 29]
            },
            {
              name: '负面/质疑',
              type: 'bar',
              stack: 'total',
              symbolSize: 10,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  // color: '#e21dff',
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    formatter(p) {
                      return p.value > 0 ? p.value : ''
                    }
                  }
                }
              },
              data: [10, 13, 9, 8, 19, 15, 27, 13, 20, 23, 8, 22]
            }
          ]
        })
      }
    }
  }
</script>
