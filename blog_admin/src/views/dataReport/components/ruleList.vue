<template>
  <div>
    <div class="report-box" v-show="type === 'report'">
    <el-button type="primary">批量删除</el-button>
    <el-button type="primary">批量下载</el-button>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;margin-top: 1%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="85"></el-table-column>
      <el-table-column label="报告名称">
        <template slot-scope="scope">{{ scope.row.reportName }}</template>
      </el-table-column>
      <el-table-column prop="name" label="分析时间段" min-width="240">
        <template slot-scope="scope">{{ scope.row.timeThink }}</template>
      </el-table-column>
      <el-table-column prop="address" label="下载次数" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.downloadCount }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="280">
        <template slot-scope="{row}">
          <el-button type="success" size="small" icon="el-icon-view" @click="seeTable(row)">
            查看
          </el-button>
          <el-button type="success" size="small" icon="el-icon-download" @click="downLoadDetail(row)">
            下载
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-remove" @click="deleteReportList(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" style="margin-top:0;padding:16px 8px 0;" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="reportTitle" :visible.sync="dialogVisible" width="60%" >
      <img src="./img/report.png" alt="report" width="100%" height="100%">
    </el-dialog>
    </div>

    <div class="report-box" v-show="type !== 'report'">
      <el-button type="primary">批量删除</el-button>
      <el-button type="primary"  style="margin-bottom: 1%;float:right" @click="addReport">添加报告</el-button>
      <el-table
        ref="multipleTable"
        :data="ruleData"
        tooltip-effect="dark"
        style="width: 100%;"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="85"></el-table-column>
        <el-table-column label="报告名称" >
          <template slot-scope="scope">{{ scope.row.reportName }}</template>
        </el-table-column>
        <el-table-column label="报告类型" >
          <template slot-scope="scope">{{ scope.row.reportType }}</template>
        </el-table-column>
        <el-table-column  label="分析时间段" min-width="240" >
          <template slot-scope="scope">{{ scope.row.timeThink }}</template>
        </el-table-column>
        <el-table-column  label="报告方式" show-overflow-tooltip  align="center">
          <template slot-scope="scope">{{ scope.row.reportStyle }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="240">
          <template slot-scope="{row}">
            <el-button type="success" size="small" icon="el-icon-edit" @click="editReport(row)">
              编辑
            </el-button>
            <el-button type="primary" size="small" icon="el-icon-remove" @click="deleteReportList(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" style="margin-top:0;padding:16px 8px 0;" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
      <el-dialog :title="reportTitle" :visible.sync="dialogVisible" width="60%" >
        <img src="./img/report.png" alt="report" width="100%" height="100%">
      </el-dialog>
      <el-dialog title="报告生成方式" :visible.sync="editReportFlag" width="30%" >
        <div>
          <span  class="demonstration">报告方式：</span>
          <el-radio v-model="reportRadio" label="1">单次生成报告</el-radio>
          <el-radio v-model="reportRadio" label="2">定期生成报告</el-radio>
        </div>
        <div style="margin-top: 5%">
          <div v-show="reportRadio==='2'">
            <span  class="demonstration">选择报告类型：</span>
            <el-radio v-model="timeReport" label="dayR">日报</el-radio>
            <el-radio v-model="timeReport" label="weekR">周报</el-radio>
            <el-radio v-model="timeReport" label="monthR">月报</el-radio>
          </div>
          <p  class="demonstration">生成报告时间：</p>
          <el-date-picker
            v-model="reportTime"
            type="datetimerange"
            :default-value="new Date()"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editReportFlag = false">取 消</el-button>
          <el-button type="primary" @click="editReportFlag = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="选择报告的生成条件：" :visible.sync="addReportFlag" width="65%" >
        <el-form ref="form" :model="form" align label-width="100px" size="medium" label-position="right">

          <el-form-item label="报告名称:" style="margin-bottom: 1%">
            <el-row style="margin-bottom:10px;">
              <el-input v-model="form.searchKeyword1" style="width:200px;margin-right:10px;" placeholder="请为所选报告模板命名" />
            </el-row>
          </el-form-item>

          <el-form-item label="关键词:" style="margin-bottom: 1%">
              <el-col :span="3">
                <el-checkbox v-model="form.allCarIsTrue" @change="allIsTrue()">本车车型：</el-checkbox>
              </el-col>
              <el-checkbox-group v-model="checkedCars" >
                <el-col :span="18">
                  <el-checkbox v-for="item in cars" :key="item.name" :label="item.name" @change="carItemChange()">{{ item.name }}</el-checkbox>
                </el-col>
              </el-checkbox-group>

            <el-row v-for="(carItem,index) in cars" v-show="checkedCars.includes(carItem.name)" :key="carItem.name">
                <el-col :span="3">
                  <el-checkbox v-model="carComPro[carItem.name]" @change="carComProChange(carItem.name)">{{carItem.name}}竞品：</el-checkbox>
                </el-col>
                <el-checkbox-group v-model="form.carIds[carItem.name]" @change="carComProItemChange(carItem.name)">
                  <el-col :span="18">
                    <el-checkbox v-for="item in carItem.children" :key="item" :label="item">{{ item }}</el-checkbox>
                  </el-col>
                </el-checkbox-group>
              </el-row>
          </el-form-item>

       <div style="display:flex; align-items: center;">
          <el-form-item label="文章调性:" style="margin-bottom: 1%" >
            <el-checkbox-group v-model="form.articleEvaluation">
              <el-checkbox border label="0" @change="form.articleEvaluation = ['0']">全部</el-checkbox>
              <el-checkbox border label="1" @change="form.articleEvaluation.includes('0') && form.articleEvaluation.shift()">正面</el-checkbox>
              <el-checkbox border label="2" @change="form.articleEvaluation.includes('0') && form.articleEvaluation.shift()">中性</el-checkbox>
              <el-checkbox border label="3" @change="form.articleEvaluation.includes('0') && form.articleEvaluation.shift()">负面</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="是否去重:" style="margin-left: 5%;margin-bottom: 1%">
            <el-radio-group v-model="form.deduplication">
              <el-radio border label="false">不去重</el-radio>
              <el-radio border label="true">去重</el-radio>
            </el-radio-group>
          </el-form-item>
       </div>


          <div style="display:flex; align-items: center">
            <el-form-item label="文章状态:" style="margin-bottom: 1%">
              <el-checkbox-group v-model="form.articleEvaluation">
                <el-checkbox border label="0" @change="form.articleEvaluation = ['0']">全部</el-checkbox>
                <el-checkbox border label="1" @change="form.articleEvaluation.includes('0') && form.articleEvaluation.shift()">未审核</el-checkbox>
                <el-checkbox border label="2" @change="form.articleEvaluation.includes('0') && form.articleEvaluation.shift()">已审核</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="文章类型:" style="margin-left: 5%;margin-bottom: 1%">
              <el-radio-group v-model="form.deduplication">
                <el-radio border label="false">非经销商发稿</el-radio>
                <el-radio border label="true">经销商发稿</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <el-form-item label="媒体等级:" style="margin-bottom: 1%">
            <el-checkbox-group v-model="form.mediaRank">
              <el-checkbox border label="0" @change="form.mediaRank = ['0']">全部</el-checkbox>
              <el-checkbox border label="1" @change="form.mediaRank.includes('0') && form.mediaRank.shift()">A级</el-checkbox>
              <el-checkbox border label="2" @change="form.mediaRank.includes('0') && form.mediaRank.shift()">B级</el-checkbox>
              <el-checkbox border label="3" @change="form.mediaRank.includes('0') && form.mediaRank.shift()">C级</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="文章分类:" style="margin-bottom: 1%">
            <el-checkbox-group v-model="form.articleType">
              <el-checkbox border label="0"  @change="form.articleType = ['0']">全部</el-checkbox>
              <el-checkbox border label="1"  @change="form.articleType.includes('0') && form.articleType.shift()">新闻</el-checkbox>
              <el-checkbox border label="2"  @change="form.articleType.includes('0') && form.articleType.shift()">论坛</el-checkbox>
              <el-checkbox border label="3"  @change="form.articleType.includes('0') && form.articleType.shift()">博客</el-checkbox>
              <el-checkbox border label="4"  @change="form.articleType.includes('0') && form.articleType.shift()">微博</el-checkbox>
              <el-checkbox border label="5"  @change="form.articleType.includes('0') && form.articleType.shift()">视频</el-checkbox>
              <el-checkbox border label="6"  @change="form.articleType.includes('0') && form.articleType.shift()">微信</el-checkbox>
              <el-checkbox border label="7"  @change="form.articleType.includes('0') && form.articleType.shift()">知道</el-checkbox>
              <el-checkbox border label="8"  @change="form.articleType.includes('0') && form.articleType.shift()">APP</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="时间选择:" style="margin-bottom: 1%">
            <el-col>
              <el-date-picker v-model="form.date1" type="datetime" placeholder="选择开始时间" style="width: 200px;" />
              至
              <el-date-picker v-model="form.date2" type="datetime" :default-value="new Date()" placeholder="选择结束时间" style="width: 200px;" />
            </el-col>
          </el-form-item>
          <el-form-item label="内容筛选:" style="margin-bottom: 1%">
            <el-radio-group v-model="form.contentFilter">
              <el-radio border label="0">不限位置</el-radio>
              <el-radio border label="1">仅在标题中</el-radio>
              <el-radio border label="2">仅在内容中</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关键词设置:" style="margin-bottom: 1%">
            <el-row style="margin-bottom:10px;">
              包含以下全部关键词：<el-input v-model="form.searchKeyword1" style="width:200px;margin-right:10px;" placeholder="关键词请以空格分开" />
              包含以下任一关键词：<el-input v-model="form.searchKeyword2" style="width:200px;margin-right:10px;" placeholder="关键词请以空格分开" />
              不包含以下关键词：<el-input v-model="form.searchKeyword3" style="width:200px;margin-right:10px;" placeholder="关键词请以空格分开" />
            </el-row>
          </el-form-item>
         <el-form-item label="报告展示内容" style="margin-bottom: 1%">
           <el-checkbox-group v-model="reportChecked" >
             <el-col :span="18">
               <el-checkbox v-for="item in reportContent" :key="item.name" :label="item.name" @change="carItemChange()">{{ item.name }}</el-checkbox>
             </el-col>
           </el-checkbox-group>
         </el-form-item>

          <el-form-item label="报告方式" style="margin-bottom: 1%">
            <div>
              <el-radio v-model="reportRadio" label="1">单次生成报告</el-radio>
              <el-radio v-model="reportRadio" label="2">定期生成报告</el-radio>
            </div>
            <div style="margin-top: 2%">
              <div v-show="reportRadio==='2'">
                <span  class="demonstration">选择报告类型：</span>
                <el-radio v-model="timeReport" label="dayR">日报</el-radio>
                <el-radio v-model="timeReport" label="weekR">周报</el-radio>
                <el-radio v-model="timeReport" label="monthR">月报</el-radio>
              </div>
              <p  class="demonstration">生成报告时间：</p>
              <el-date-picker
                v-model="reportTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </el-form-item>
          <div class="flex-box">
            <el-button @click="addReportFlag = false">取 消</el-button>
            <el-button size="middle" type="primary" style="" @click="submitReport">生 成</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { fetchList } from '@/api/article'
  import Pagination from '@/components/Pagination'
  export default {
    components: {
      Pagination
    },
    props: {
      type: {
        type: String,
        default: 'report'
      }
    },
    data() {
      return {
        listQuery: {
          page: 1,
          limit: 5,
          type: this.type,
        },
        tableData: [
          {
            reportName:'智跑月报',
            timeThink:'2018-10-29 17:18_2018-12-12 17:18',
            downloadCount:'5',
            id:'1',
          },
          {
            reportName:'智跑年报',
            timeThink:'2018-10-29 17:18_2018-12-12 17:18',
            downloadCount:'2',
            id:'2',
          },
        ],
        ruleData:[
          {
            reportName:'智跑月报',
            reportType:'日报',
            reportStyle:'单次报告',
            timeThink:'2018-10-29 17:18_2018-12-12 17:18',
            downloadCount:'5',
            id:'1',
          },
          {
            reportName:'智跑年报',
            reportType:'周报',
            reportStyle:'定期报告',
            timeThink:'2018-10-29 17:18_2018-12-12 17:18',
            downloadCount:'2',
            id:'2',
          },
        ],
        total:2,
        reportRadio:'1',
        timeReport:'dayR',
        dialogVisible: false,
        editReportFlag:false,
        addReportFlag:false,
        reportTitle:'数据报告',
        reportTime: [],
        form: {
          allCarIsTrue:false,
          carIds: {}, // 维护的参数对象
          mediaRank: ['0'], // 媒体等级：全部/A/B/C
          mediaType: ['0'],
          articleType: ['0'],
          videoType: ['0'], // 短视频分类：全部/剧情/评测/旅游/用车/说车
          articleEvaluation: ['0'], // 文章调性：全部/正面/中性/负面
          sortType: ['0'], // 排序方式0/1
          deduplication: 'false', // 是否去重
          date1: '', // 日期范围选择start
          date2: new Date(), // 日期范围选择end
          contentFilter: '0', // 内容筛选
          searchKeyword1: '', // 包含全部关键词
          searchKeyword2: '', // 包含以下任一关键词
          searchKeyword3: '', // 不包含以下关键词
          searchKeyword4: '', // 标题/链接搜索
          selfMediaType:['0'], // 自媒体类型
          videoMediaType:['0'] // 短视频类型
        },
        cars: [
          {
            name: "智跑",
            children: [
              "福特领界",
              "日产逍客"
            ]
          },
          {
            name: "起亚K3",
            children: [
              "日产逸轩",
              "日产逍客"
            ]
          },
          {
            name: "起亚K5",
            children: [
              "日产逸轩",
              "日产逍客"
            ]
          },
          {
            name: "起亚KX3傲跑",
            children: [
              "日产逸轩",
              "日产逍客"
            ]
          },
          {
            name: "亦跑",
            children: [
              "福特领界",
              "日产逸轩",
              "日产逍客"
            ]
          },
          {
            name: "迈腾",
            children: [
              "福特领界",
              "日产逸轩",
              "日产逍客"
            ]
          },
          {
            name: "狮跑",
            children: [
              "福特领界",
              "日产逸轩",
              "日产逍客",
              "宝马X5"
            ]
          },
          {
            name: "起亚K2",
            children: [
              "福特领界",
              "日产逸轩",
              "日产逍客",
              "奥迪A8"
            ]
          },
          {
            name: "起亚K15",
            children: [
              "宝马X5",
              "日产逸轩",
              "奥体A8"
            ]
          },
          {
            name: "起亚K6",
            children: [
              "福特领界",
              "日产逸轩",
              "日产逍客",
              "宝马X5"
            ]
          }
        ],
        reportContent:[
          {
            name:'事件简介',
            id:'1'
          },
          {
            name:'舆论趋势',
            id:'2'
          },
          {
            name:'媒体类型',
            id:'3'
          },
          {
            name:'媒体趋势',
            id:'4'
          },
          {
            name:'媒体来源',
            id:'5'
          },
          {
            name:'媒体占比',
            id:'6'
          },
          {
            name:'正负面占比',
            id:'7'
          },
          {
            name:'区域分布图',
            id:'8'
          },
          {
            name:'关键词云',
            id:'9'
          },
          {
            name:'热点信息',
            id:'10'
          },
        ],
        reportChecked:[],
        checkedCars: [],
        carName:[], // 所有汽车的名字，用于全选赋值
        carComPro:[], // key:value->竞品：boolean，竞品中元素选中状态
        carComProIndex:[], // key:value->竞品：竞品元素名字
      }
    },
    created() {
     // this.getList()
      // 新建checkedCars对象，默认选中前三项
      // for (let i = 0; i < 3; i++) {
      //   this.$set(this.checkedCars, i, this.cars[i].name)
      // }
      // reportContent，默认选中前三项
      for (let i = 0; i < 3; i++) {
        this.$set(this.reportChecked, i, this.reportContent[i].name)
      }
      // 新建carName对象，存储全选时的车名
      for (let i = 0; i < this.cars.length; i++) {
        this.$set(this.carName, i, this.cars[i].name)
      }
      // 新建竞品选择对象carComPro
      for (let i = 0; i < this.cars.length; i++) {
        this.$set(this.carComPro, this.cars[i].name, false)
      }
      // 新建竞品选择对象carComProIndex
      for (let i = 0; i < this.cars.length; i++) {
        this.$set(this.carComProIndex, this.cars[i].name, this.cars[i].children)
      }
      // 新建carIds对象
      for (let i = 0; i < this.cars.length; i++) {
        this.$set(this.form.carIds, this.cars[i].name, [])
      }
    },
    methods:{
      getList() {
        this.loading = true
        this.$emit('create') // for test
        fetchList(this.listQuery).then(response => {
          this.list = this.testList.items
          this.total = this.testList.total
          // this.list = response.data.items
          this.loading = false
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      downLoadDetail(row){

      },
      seeTable(row) {
      this.reportTitle = row.reportName;
      this.dialogVisible = true
      },
      confirmDelete(row) {
        console.log(row)
      },
      addReport(){
        this.addReportFlag = true
      },
      editReport(){
        this.editReportFlag = true
      },
      deleteReportList(id) {
        console.log(id);
        this.$confirm('是否删除当前数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      allIsTrue(){
        if(this.$data.form.allCarIsTrue){
          this.$data.checkedCars = this.$data.carName;
        } else {
          this.$data.checkedCars = [];
        }
      },
      // 本车车型选项变动时，检测是否已满，改变全部和
      carItemChange(){
        this.$data.form.allCarIsTrue = this.$data.checkedCars.length === this.$data.carName.length
      },
      // 汽车竞品被点击
      carComProChange(name){
        let carName = name;
        if(this.$data.carComPro[carName]){
          this.$data.form.carIds[carName] = this.$data.carComProIndex[carName];
        } else {
          this.$data.form.carIds[carName] = [];
        }
      },
      // 竞品项元素被点击
      carComProItemChange(name){
        let carComProName = name;
        this.$data.carComPro[carComProName] = this.$data.form.carIds[carComProName].length === this.$data.carComProIndex[carComProName].length
      },
      // 舆情概况按钮，显示搜索条件设置面板
      showSearchCond() {
        this.headerSettingIsShow = !this.headerSettingIsShow
      },
      // 表单提交
      submitReport() {
        this.addReportFlag = false;
        this.$message({
          type: 'success',
          message: '报告正在制作中，请到数据中心-报告列表中查看详情!'
        });
      },
    }
  }
</script>

<style scoped>
  .article-content-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .article-content-box img {
    margin-right: 3%;
  }
  .float-right{
    float: right;
  }
  .flex-box{
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
