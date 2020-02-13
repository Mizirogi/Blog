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
        chart: null,
        xData: ['经销店信息', '新车上市', '产品力解析评测', '导购对比', '车主口碑', '行业资讯', '被竞品狙击', '狙击竞品', '驾乘活动', '负面/质疑'],
        yData:[10, 52, 200, 334, 390, 330, 220,125,231,88],
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
            text: '传播负面的文章类型',
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
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)",
          },
          legend: {
            // orient: 'vertical',
            // type: 'scroll',
            // right: 10,
            // top: 150,
            bottom:'0',
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
              radius: ['50%', '75%'],
              label: {
                normal: {
                  formatter: ' {b|{b}：}{c}  {per|{d}%}  ',
                  backgroundColor: 'transparent',
                  borderColor: '#aaa',
                  borderWidth: 1,
                  borderRadius: 4,
                  // shadowBlur:3,
                  // shadowOffsetX: 2,
                  // shadowOffsetY: 2,
                  // shadowColor: '#999',
                  // padding: [0, 7],
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
                      fontSize: 16,
                      lineHeight: 33
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
                {value:161, name:'经销店信息'},
                {value:152, name:'新车上市'},
                {value:200, name:'产品力解析评测'},
                {value:334, name:'导购对比'},
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
