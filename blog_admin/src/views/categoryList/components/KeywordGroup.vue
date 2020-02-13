<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        :disabled="deletedNum()"
        @click="deleteDatas(multipleSelection)"
      >批量删除</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="handleCreate"
      >添加分组</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="分组名称" align="center">
        <template slot-scope="{row}">
          <span
            v-if="row.name"
            class="link-type"
            @click="handleFetchPv(row.pageviews)"
          >{{ row.name }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" min-width="200px" align="center">
        <template slot-scope="{row}">
          <el-input v-model="row.weight" type="number" @change=" (val)=> weightOrder(val,row)" />
        </template>
      </el-table-column>
      <el-table-column label="分组类型" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type==0 ?'本品组':'竞品组' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="添加时间" align="center" min-width="200px">
        <template slot-scope="{row}">
          <span>{{ row.addtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

    <!--  <el-table-column
        label="操作"
        align="center"
        width="140px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          &lt;!&ndash; <el-button v-throttle="{callback:()=>deleteDatas(row.id),time:3000}" size="mini" type="danger">删除</el-button> &ndash;&gt;
          <el-button size="mini" type="danger" @click="deleteDatas(row.id)">删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page_num"
      :limit.sync="listQuery.page_size"
      :scroll-location="110"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" destroy-on-close >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="分组名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="分组类型" prop="type">
          <el-radio-group v-model="temp.type">
            <el-radio label="0">本品组</el-radio>
            <el-radio label="1">竞品组</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <!-- <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" :disabled="disabled">提交</el-button> -->
        <el-button v-throttle="{callback:createData,time:2000}" type="primary">提交</el-button>
        <!-- <el-button  v-throttle="{callback:dialogStatus==='create'?print:,time:2000}" >提交</el-button> -->
      </div>
    </el-dialog>

  </div>
</template>

<script>
// import { fetchList, fetchPv, createSettings, updateSettings } from '@/api/settings'
import { keyWordList, keywordGroupAdd } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { isZNum } from '@/utils/validate'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import md5 from 'js-md5'

export default {
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
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      disabled: false,
      total: 0,
      listLoading: true,
      listQuery: {
        page_num: 1,
        page_size: 10,
        method: 'KeywordGroupList',
        timestamp: '',
        sign: '',
        name: undefined,
        type: undefined
      },
      temp: {
        name: undefined,
        type: undefined
      },
      multipleSelection: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加分组'
      },
      dialogDelVisible: false,
      rules: {
        type: [{ required: true, message: '请选择组别', trigger: 'change' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // print(val) {
    //   console.log(val)
    // },
    // printwww() {
    //   console.log('1111111111')
    // },
    getList() {
      this.listLoading = true
      this.listQuery.timestamp = +new Date()
      this.listQuery.sign = md5(
        this.listQuery.method + this.listQuery.timestamp
      )
      keyWordList(this.listQuery).then(response => {
        console.log(response)
        this.list = response.data.list
        this.total = parseInt(response.data.total)
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },

    weightOrder(val, row) {
      if (isZNum(val)) {
        const params = {
          method: 'KeywordGroupOrder',
          timestamp: +new Date(),
          gid: row.id,
          order: val
        }
        params.sign = md5(params.method + params.timestamp)
        keywordGroupAdd(params).then(response => {
          console.log(response)
          if (response.message === 'success') {
            this.$notify({
              message: '排序提交成功',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
          }
          this.getList()
        })
      } else {
        console.log(row)
        this.$message({
          message: '请填写正确排序数字',
          type: 'error',
          duration: 2 * 1000
        })
      }
    },

    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //
    deletedNum() {
      if (this.multipleSelection.length === 0) {
        return true
      } else {
        return false
      }
    },
    // 数据初始化
    resetTemp() {
      this.temp = {
        method: 'KeywordGroupAdd',
        timestamp: +new Date(),
        name: undefined,
        type: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.disabled = true
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.sign = md5(this.temp.method + this.temp.timestamp)
          keywordGroupAdd(this.temp).then(response => {
            console.log(response)
            if (response.message === 'success') {
              this.$notify({
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.dialogFormVisible = false
              this.disabled = false
            }
            this.getList()
          })
        } else {
          this.disabled = false
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      console.log(this)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    deleteDatas(data) {
      console.log('123123')
      console.log(data)
      let params = []
      let str
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          params.push(data[i].id)
        }
        str = params.join('|')
      } else {
        str = data
      }
      console.log(str)
      this.$confirm('是否删除选中数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          var loadingInstance = this.$loading({
            fullscreen: true,
            lock: true,
            text: '删除中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          params = {
            method: 'KeywordGroupDelete',
            timestamp: +new Date(),
            gid: str
          }
          params.sign = md5(params.method + params.timestamp)
          keywordGroupAdd(params).then(response => {
            console.log(response)
            if (response.code === 200) {
              this.$nextTick(() => {
                loadingInstance.close()
              })
              this.$notify({
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              this.$message.error(response.message)
              this.$nextTick(() => {
                loadingInstance.close()
              })
            }
          }).catch(err => {
            console.log(err)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-container {
  display: flex;
  justify-content: flex-end;
}
.el-table{
.el-input {
  width: 120px;
  text-align: center;
}
}
</style>
