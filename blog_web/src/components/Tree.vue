<!--
 * @Description: 
 * @Author: Li
 * @Date: 2019-11-08 17:38:26
 * @LastEditors: Li
 * @LastEditTime: 2019-11-08 18:38:16
 -->


<template>
  <!-- <el-tree
    :data="data"
    node-key="id"
    :default-expanded-keys="[1,2,3]"
    :props="defaultProps"
    @node-click="handleNodeClick"
  ></el-tree>-->
  <div style="width:100%;height:600px" ref="chart"></div>
</template>
<script>
const echarts = require("echarts");
import data from "../assets/data";
export default {
  name: "component_name",
  data() {
    return {
      data: []
    };
  },
  mounted() {
    console.log(data);

    this.draw(data);
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
    // myChart.showLoading();
    draw(data) {
      let myChart = echarts.init(this.$refs.chart);

      myChart.setOption({
          title: {
                text: '博客使用的技术',
                left: 'center',
                top: 5,
                textStyle: {
                    color: '#aaa',
                    fontWeight: 'normal',
                    fontSize: 26
                }
            },
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove"
        },
        series: [
          {
            type: "tree",
            data: [data],
            top: '1%',
                left: '13%',
                bottom: '1%',
                right: '17%',

                symbolSize: 7,
            symbol: "emptyCircle",
            
            //orient: "vertical",
            expandAndCollapse: true,
            label: {
              normal: {
                position: "left",
                rotate: 0,
                verticalAlign: "middle",
                align: "right",
                fontSize: 26
              }
            },
            leaves: {
              label: {
                normal: {
                  position: "right",
                  rotate: 0,
                  verticalAlign: 'middle',
                            align: 'left'
                }
              }
            },
            animationDurationUpdate: 750
          }
        ]
      });
    }
  }
};
</script>