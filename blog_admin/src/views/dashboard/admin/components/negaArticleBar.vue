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
        default: '586px'
      }
    },
    data() {
      return {
        chart: null,
        xData: ['经销店信息', '新车上市', '产品力解析评测', '导购对比', '车主口碑', '行业资讯', '被竞品狙击', '狙击竞品', '驾乘活动', '负面/质疑'],
        yData:[50, 52, 200, 334, 390, 330, 220,125,231,88],
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
          // title: {
          //   text: '传播负面的文章类型',
          //   x: '20',
          //   top: '20',
          //   textStyle: {
          //     color: '#000',
          //     fontSize: '22',
          //     fontWeight: 'normal'
          //   },
          // },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)",
          },
          grid: {
            y: 0,
            // width: {totalWidth} - x - x2,
            // height: {totalHeight} - y - y2,
            backgroundColor: 'rgba(0,0,0,0)',
            borderWidth: 1,
            borderColor: '#ccc'
          },
          legend: {
            // orient: 'vertical',
            // type: 'scroll',
            // right: 10,
            // top: 150,
            bottom:'50',
            data:['经销店信息', '新车上市', '产品力解析评测', '导购对比', '车主口碑', '行业资讯', '被竞品狙击', '狙击竞品', '驾乘活动', '负面/质疑'],
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              saveAsImage: {show: true}
            }
          },
          series: [
            {
              name:'访问来源',
              type:'pie',
              radius: ['50%', '66%'],
              center:['50%', '45%'],
              label: {
                normal: {
                  formatter: ' {b|{b}：}{c}  {per|{d}%}  ',
                  backgroundColor: 'transparent',
                  borderColor: '#aaa',
                  borderWidth: 1,
                  borderRadius: 4,
                  padding: [0, 3],
                  rich: {
                    a: {
                      color: '#999',
                      lineHeight: 22,
                      align: 'center'
                    },
                    // abg: {
                    //     backgroundColor: '#333',
                    //     width: '100%',
                    //     align: 'right',
                    //     height: 22,
                    //     borderRadius: [4, 4, 0, 0]
                    // },
                    hr: {
                      borderColor: '#aaa',
                      width: '100%',
                      borderWidth: 0.5,
                      height: 0
                    },
                    b: {
                      lineHeight:25
                    },
                    per: {
                      color: '#eee',
                      backgroundColor: '#334455',
                      padding: [2, 4],
                      borderRadius: 2
                    }
                  }
                }
              },
              labelLine: {
                normal: {
                  show: true
                }
              },
              data:[
                {value:150, name:'经销店信息'},
                {value:152, name:'新车上市'},
                {value:200, name:'产品力解析评测'},
                {value:414, name:'导购对比'},
                {value:390, name:'车主口碑'},
                {value:335, name:'行业资讯'},
                {value:220, name:'被竞品狙击'},
                {value:125, name:'狙击竞品'},
                {value:231, name:'驾乘活动'},
                {value:188, name:'负面/质疑'}
              ]
            }
          ]
        })
      }
    }
  }
</script>
