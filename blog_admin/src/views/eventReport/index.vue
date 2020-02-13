<template>
  <div class="dashboard-editor-container">
    <div class="page-header-tab">
      &#12288;
      <span @click="textReport()" :class="{ 'bgActive': bgTextFlag }">正文舆情警报</span>
      &#12288;
      <span @click="commentReport()" :class="{ 'bgActive': bgCommentFlag }">评论舆情警报</span>
    </div>
    <div class="table-title-box margin-top-2">预警通报</div>
    <div class="table-title-button margin-top-2">
      <el-button type="primary">批量删除</el-button>
      <el-button type="primary" @click="dialogVisible = true">新增预警</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;margin-top: 1%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="80"></el-table-column>
      <el-table-column label="预警名称" min-width="150">
        <template slot-scope="scope">{{ scope.row.warningName }}</template>
      </el-table-column>
      <el-table-column prop="name" label="预警名称" min-width="150">
        <template slot-scope="scope">{{ scope.row.warningStyle }}</template>
      </el-table-column>
      <el-table-column prop="address" label="发送频率" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">{{ scope.row.sendRate }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="200">
        <template slot-scope="{row}">
          <el-button type="success" size="small" icon="el-icon-view" @click="seeTable(row)">
            查看
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-remove" @click="confirmDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination style="margin-top: 0" v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="提示" :visible.sync="dialogVisible" width="60%">
      <el-form ref="form" :model="form" align label-width="100px" size="medium" label-position="right">

        <el-form-item label="预警名称:">
          <el-row style="margin-bottom:10px;">
            <el-input v-model="form.searchKeyword1" style="width:200px;margin-right:10px;" placeholder="请为您定制的预警输入名称" />
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

        <div style="display:flex; align-items: center">
          <el-form-item label="文章调性:" style="margin-bottom: 1%">
            <el-checkbox-group v-model="form.articleEvaluation">
              <el-checkbox border label="0" @change="form.articleEvaluation = ['0']">全部</el-checkbox>
              <el-checkbox border label="1" @change="form.articleEvaluation.includes('0') && form.articleEvaluation.shift()">正面</el-checkbox>
              <el-checkbox border label="2" @change="form.articleEvaluation.includes('0') && form.articleEvaluation.shift()">中性</el-checkbox>
              <el-checkbox border label="3" @change="form.articleEvaluation.includes('0') && form.articleEvaluation.shift()">负面</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="是否去重:" style="margin-left: 5%;margin-bottom: 1%" >
            <el-radio-group v-model="form.deduplication">
              <el-radio border label="false">不去重</el-radio>
              <el-radio border label="true">去重</el-radio>
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

        <el-form-item label="媒体类型:" style="margin-bottom: 1%">
          <el-checkbox-group v-model="form.articleType">
            <el-checkbox border label="0"  @change="form.articleType = ['0']">全部</el-checkbox>
            <el-checkbox border label="1"  @change="form.articleType.includes('0') && form.articleType.shift()">门户</el-checkbox>
            <el-checkbox border label="5"  @change="form.articleType.includes('0') && form.articleType.shift()">垂直</el-checkbox>
            <el-checkbox border label="2"  @change="form.articleType.includes('0') && form.articleType.shift()">论坛</el-checkbox>
            <el-checkbox border label="3"  @change="form.articleType.includes('0') && form.articleType.shift()">博客</el-checkbox>
            <el-checkbox border label="4"  @change="form.articleType.includes('0') && form.articleType.shift()">问答</el-checkbox>
            <el-checkbox border label="6"  @change="form.articleType.includes('0') && form.articleType.shift()">自媒体</el-checkbox>
            <el-checkbox border label="7"  @change="form.articleType.includes('0') && form.articleType.shift()">短视频</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="内容筛选:" style="margin-bottom: 1%">
          <el-radio-group v-model="form.contentFilter">
            <el-radio border label="0">不限位置</el-radio>
            <el-radio border label="1">仅在标题中</el-radio>
            <el-radio border label="2">仅在内容中</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="包含关键词:" style="margin-bottom: 1%">
          <el-row style="margin-bottom:10px;">
            <el-select v-model="valueAdd" multiple filterable allow-create default-first-option
              placeholder="多个关键词之间进行组合。“+”表示同时包含，“|”表示包含任意一个即可">
              <el-option v-for="item in optionsAdd" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-row>
        </el-form-item>

        <el-form-item label="排除关键词:" style="margin-bottom: 1%">
          <el-row style="margin-bottom:10px;">
            <el-input v-model="form.searchKeyword1" style="width:200px;margin-right:10px;" placeholder="多个关键词之间用“|”隔开即可" />
          </el-row>
        </el-form-item>

        <el-form-item label="更新频率:" style="margin-bottom: 1%">
          <el-row style="margin-bottom:10px;">
            <el-select v-model="defaultValues" placeholder="请选择" value="">
              <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-row>
        </el-form-item>

        <el-form-item label="发送方式:" style="margin-bottom: 1%">
          <el-row style="margin-bottom:10px;">
            <el-tabs v-model="sendType" >
              <el-tab-pane label="即时发送" name="first">
                  <el-form-item label="发送方式">
                    <el-checkbox-group v-model="formSend.type">
                      <el-checkbox label="短信发送" name="type"></el-checkbox>
                      <el-checkbox label="邮箱发送" name="type"></el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="联系方式">
                    <el-input v-model="formSend.name" style="width: 200px"></el-input>
                  </el-form-item>
                  <el-form-item label="联系邮箱" class="margin-top-2">
                    <el-input v-model="formSend.name"  style="width: 200px"></el-input>
                  </el-form-item>
                  <el-form-item label="夜间免打扰" label-width="100px" class="margin-top-2">
                    <el-select v-model="formSend.region" placeholder="请选择活动区域" value="">
                      <el-option label="是" value="shanghai"></el-option>
                      <el-option label="否" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="免打扰时间" label-width="100px" class="margin-top-2">
                    <el-col :span="5">
                      <el-date-picker type="date" placeholder="选择日期" v-model="formSend.date1" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col :span="5">
                      <el-time-picker placeholder="选择时间" v-model="formSend.date2" style="width: 100%;"></el-time-picker>
                    </el-col>
                  </el-form-item>
                  <el-form-item class="margin-top-2">
                    <el-button style="margin-left: 12%">取消</el-button>
                    <el-button type="primary">确认</el-button>
                  </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="定时发送" name="second">
                <el-form-item label="预警时间">
                  <el-radio-group v-model="form.resource">
                    <el-radio  label="工作日"></el-radio>
                    <el-radio  label="自然日"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="" label-width="100px" style="margin-top: 1%">
                  <el-select v-model="formSend.time"  value="">
                    <el-option label="无" value="shanghai"></el-option>
                    <el-option label="08:00" value="beijing"></el-option>
                    <el-option label="09:00" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="发送频率" label-width="100px" style="margin-top: 1%">
                  <el-select v-model="formSend.region" placeholder="请选择活动区域" value="">
                    <el-option label="无" value="shanghai"></el-option>
                    <el-option label="10分钟" value="beijing"></el-option>
                    <el-option label="20分钟" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="发送方式">
                  <el-checkbox-group v-model="formSend.type">
                    <el-checkbox label="短信发送" name="type"></el-checkbox>
                    <el-checkbox label="邮箱发送" name="type"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="联系方式">
                  <el-input v-model="formSend.name" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="联系邮箱"  style="margin-top: 1%">
                  <el-input v-model="formSend.name"  style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item class="margin-top-2">
                  <el-button style="margin-left: 12%">取消</el-button>
                  <el-button type="primary">确认</el-button>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-row>
        </el-form-item>

        <div class="flex-box">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button size="middle" type="primary" style="" @click="submitReport">确 认</el-button>
        </div>
      </el-form>
    </el-dialog>

    <div v-show="showTableFlag && !bgCommentFlag">
      <article-result />
    </div>

    <div v-show="bgCommentFlag">
      <video-result />
    </div>

  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import articleResult from './components/articleResult'
  import videoResult from './components/videoResult'
  export default {
    components: { Pagination , articleResult , videoResult},
    data() {
      return {
        tableData: [
          {
          warningName:'智跑',
          warningStyle:'短信预警',
          sendRate:'半小时',
          id:'1',
        },
          {
            warningName:'起亚K3',
            warningStyle:'邮箱预警',
            sendRate:'自然日',
            id:'2',
          },
          {
            warningName:'起亚KX3傲跑',
            warningStyle:'短信预警',
            sendRate:'工作日',
            id:'3',
          },
        ],
        multipleSelection: [],
        total: 3,
        dialogVisible: false,
        listLoading: true,
        bgTextFlag:true,
        bgCommentFlag:false,
        showTableFlag:false,
        commentFlag:false,
        sendType:'first',
        listQuery: {
          page: 1,
          limit: 10
        },
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
        selectOptions: [
          {
          value: '选项1',
          label: '30分钟'
        }, {
          value: '选项2',
          label: '1小时'
        }, {
          value: '选项3',
          label: '2小时'
        }],
        defaultValues: '30分钟',
        optionsAdd: [
          {
          value: '第八+代',
          label: '第八+代'
        }, {
          value: '第八代',
          label: '第八代'
        }, {
          value: '八代|第八代',
          label: '八代|第八代'
        }],
        valueAdd: [
          {
          value: '第八+代',
          label: '第八+代'
        }],
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
        formSend: {
          name: '',
          region: '无',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          time:'08:00',
        }
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
    methods: {
      getList(){

      },

      textReport(e){
        this.bgTextFlag = true;
        this.bgCommentFlag = false;
      },
      commentReport(e){
        this.bgTextFlag = false;
        this.bgCommentFlag = true;
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val;
      },
      handleSendClick(tab, event) {
        console.log(tab, event);
      },
      seeTable(row) {
        console.log(row)
        this.showTableFlag = true
        // row.title = row.originalTitle
        // row.edit = false
        // this.$message({
        //   message: 'The title has been restored to the original value',
        //   type: 'warning'
        // })
      },
      confirmDelete(row) {
        console.log(row)
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
        this.dialogVisible = false;
        this.$message({
          type: 'success',
          message: '新增预警成功!'
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;
    padding-top: 10px;

    .github-corner {
      position: absolute;
      top: 0;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
  .table-title-box {
    border-bottom: 1px solid #d9d9d9;
    padding: 1%;
    border-left: 3px solid lightblue;
  }
  .margin-top-2{
    margin-top: 2%;
  }
  .margin-bottom-2{
    margin-top: 2%;
  }

  .table-title-button {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .page-header-tab{
    height: 70px;
    background: aliceblue;
    display: flex;
    align-items: center;
    font-size: 18px;
  }
  .page-header-tab span {
    cursor: pointer;
  }

  .bgActive {
    color: cornflowerblue;
    font-weight: 600;
  }
  .flex-box{
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>
