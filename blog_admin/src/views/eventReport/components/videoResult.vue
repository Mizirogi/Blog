<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row type="flex" align="middle">
        <el-button class="filter-item" type="primary" @click="deleteDatas(multipleSelection)">
          批量删除
        </el-button>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary"  @click="handleDownload">
          批量下载
        </el-button>
        <span style="font-size:16px;margin-left:auto;">共{{ total }}条，其中负面</span><span style="color:red;font-size:16px;font-weight:700;">{{ total/2 }}</span><span style="font-size:16px;margin-right:30px;">条</span>
      </el-row>

      <el-row type="flex" align="middle" style="margin-top:10px;">
        <div style="padding-bottom:10px;"><span>车型：</span></div>
        <el-select v-model="listQuery.carType" style="width: 100px;margin-right:20px;" class="filter-item">
          <!-- 车型数据需要从从后台返回 -->
          <el-option v-for="item in carType" :key="item" :label="item" :value="item"/>
        </el-select>

        <el-input v-model="listQuery.title" placeholder="媒体" style="width: 120px;margin-right:20px;" class="filter-item"/>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" >
          搜索
        </el-button>
      </el-row>
    </div>

    <el-table :key="tableKey" :data="listTest" border fit highlight-current-row lazy style="width: 100%;" @selection-change="handleSelectionChange">
      <!-- 选择栏 -->
      <el-table-column type="selection" align="center" >
      </el-table-column>
      <!-- 序号 -->
      <el-table-column label="序号" prop="id" align="center" width="55">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容标题" min-width="100px" max-width="200px;" align="center">
        <template slot-scope="{row}">
          <div class="article-content-box">
          <svg-icon icon-class="negetive"  class="icon-size" v-show="row.contentType==='负'"/>
          <svg-icon icon-class="normal" class="icon-size" v-show="row.contentType==='中'"/>
          <svg-icon icon-class="positive" class="icon-size" v-show="row.contentType==='正'"/>
          <!-- 此处需要添加一个跳转 -->
          <a class="text-ellipsis">&#12288;{{ row.title }}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="媒体名称" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.mediaName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="车型"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.carType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容调性" align="center" >
        <template slot-scope="{row}">
          <span :class="row.contentType === '正'?'text-emphasize':''">正</span>
          <span :class="row.contentType === '中'?'text-emphasize':''">中</span>
          <span :class="row.contentType === '负'?'text-emphasize':''">负</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.sendTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送状态"  align="center">
        <template slot-scope="{row}">
          <span :class="row.sendType === '已发送'?'text-emphasize':''">{{ row.sendType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="success" size="small" icon="el-icon-news" @click="seeEmail(row)">
            邮箱
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-message">
            短信
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination v-show="total>0" :total="total" prev-text="上一页" next-text="下一页" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                style="text-align: right" />

    <el-dialog title="发送邮件" :visible.sync="dialogDelVisible" width="30%">
      <el-form  label-width="80px" :model="formLabelAlign" >
        <el-form-item label="收件人">
          <el-input v-model="formLabelAlign.name" placeholder="请输入收件人"></el-input>
        </el-form-item>
        <el-form-item label="邮件标题">
          <el-input v-model="formLabelAlign.region"></el-input>
        </el-form-item>
        <el-form-item label="邮件正文">
          <el-input type="textarea" rows="4" v-model="formLabelAlign.type"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;margin-top: -6%;">
        <el-button type="primary" @click="dialogDelVisible = false">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from './Pagination' // secondary package based on el-pagination
  import { getList, deleteItem } from "@/api/articleResult";

  const calendarTypeOptions = [
    { key: 'CN', display_name: 'China' },
    { key: 'US', display_name: 'USA' },
    { key: 'JP', display_name: 'Japan' },
    { key: 'EU', display_name: 'Eurozone' }
  ]

  // arr to obj, such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'ArticleResult',
    components: { Pagination },
    directives: { waves },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    data() {
      return {
        formLabelAlign: {
          name: '',
          region: '',
          type: ''
        },
        tableKey: 0,
        list: null,
        total: 4,
        listTest:[
          {
            id:'1',
            title:'10月新能源汽车销量达11.7万辆哪些车型销量最高?  (标题搜索)',
            mediaName:'东方财富网',
            carType:'智跑',
            contentType:'负',
            sendTime:'2018.12.12   12:36',
            sendType: '未发送',
          },
          {
            id:'2',
            title:'江淮iEVA50最高优惠9万元 现车热销 (标题搜索)',
            mediaName:'东方财富网',
            carType:'智跑',
            contentType:'中',
            sendTime:'2018.11.11   11:36',
            sendType: '已发送',
          },
          {
            id:'3',
            title:'小鹏汽车发布临近,江淮新能源汽车召回,缘由自己去体会(标题搜索)',
            mediaName:'网易',
            carType:'智跑',
            contentType:'正',
            sendTime:'2018.12.13   08:36',
            sendType: '未发送',
          },
          {
            id:'4',
            title:'存自燃风险 召回江淮汽车新能源豪赌的至暗时刻-爱金融',
            mediaName:'东方财富网',
            carType:'智跑',
            contentType:'中',
            sendTime:'2018.12.10   07:36',
            sendType: '已发送',
          },
        ],
        listLoading: false,
        // 请求参数列表
        listQuery: {
          page: 1,
          limit: 20,
          carType:'',
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        carType:['智跑', '逍客', 'RX5'],
        calendarTypeOptions,
        sortOptions: [{ label: '领克', key: '+id' }, { label: '智跑', key: '-id' }],
        dialogFormVisible: false,
        dialogDelVisible: false,
        downloadLoading: false,
        form:{}
      }
    },
    created() {
      //this.getList()
    },
    methods: {
      seeEmail(row){
        this.dialogDelVisible = true;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      deleteData(row) {
        this.$confirm('是否删除数据', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      // dialog
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      // dialog
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            this.temp.author = 'vue-element-admin'
            createArticle(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },

      // 点击内容标题，更新内容
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      // 更新数据
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateArticle(tempData).then(() => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      // 处理删除
      handleDelete(row) {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      },
      // 处理下载
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['序号', '内容标题', '媒体名称', '车型', '内容调性', '发布时间', '内容分类']
          const filterVal = ['id', 'title', 'author','car_type','article_type', 'display_time', 'article_type']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '文章数据批量下载'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      getSortClass: function(key) {
        const sort = this.listQuery.sort
        return sort === `+${key}`
          ? 'ascending'
          : sort === `-${key}`
            ? 'descending'
            : ''
      },
      delConfirm() {
        this.$confirm('是否删除所选内容?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    }
  }
</script>

<style scoped>
  .text-emphasize{
    color:red;
  }

  .evaluation{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    line-height: 1rem;
    border-radius: 0.2rem;
    color: #ffffff;
  }

  .good{
    background-color: #e86d6d;
  }

  .normal{
    background-color: #f29b22;
  }

  .bad{
    background-color: #0079ff;
  }
  .icon-size {
    width: 22px;
    height: 22px;
  }
  .article-content-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
</style>
