<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="deleteDatas(multipleSelection)"
      >批量删除</el-button> -->
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="handleCreate"
      >添加分类</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="文章类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文章类型" align="center" width="170px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="排序" align="center" width="140px">
        <template slot-scope="{row}">
          <el-input v-model="row.weight" type="number" @change=" (val)=> weightOrder(val,row)" />
        </template>
      </el-table-column> -->

      <!-- <el-table-column label="特征词" align="center">
        <template slot-scope="{row}">
          <el-tag
            v-for="(tag,index) in row.words.split('|')"
            v-if="tag ? tag : '' "
            :key="'tag'+index"
            disable-transitions
          >{{ tag }}</el-tag>
        </template>
      </el-table-column> -->

      <el-table-column
        label="操作"
        align="center"
      
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteDatas(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page_num"
      :limit.sync="listQuery.page_size"
      :scroll-location="110"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" destroy-on-close>
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="150px"
        style="width: 500px; margin-left:50px;"
      >
        <el-form-item label="分类名称：" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createCategory():updateCategory()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { fetchRuleList, fetchPv, createSettings, updateSettings } from '@/api/settings'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import { isZNum } from '@/utils/validate'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getCategory ,create,update} from '@/api/category'
import md5 from 'js-md5'
import qs from 'qs'

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    var validateKeyword = (rule, value, callback) => {
      if (this.keywordArray.length === 0) {
        callback(new Error('请输入关键字'))
      } else {
        if (this.keywordArray.length !== 0) {
          this.$refs.dataForm.validateField('name')
        }
        callback()
      }
    }
    return {
      list: null,
      total: 0,
      listLoading: true,
      inputVisible: false,
      inputValue: '',
      keywordArray: [],
      listQuery: {
        page_num: 1,
        page_size: 10,
       author:'Li2'
        },
      temp: {
        id: undefined,
        name: undefined,
        author:'Li2'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加分类'
      },
      rules: {
        keywordArray: [
          { required: true, validator: validateKeyword, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getCategory(qs.stringify(this.listQuery)).then(response => {
        this.list = response.data.data
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    /**
     * @description:
     * @param {type}
     * @return:
     */
    handleClose(tag, karry) {
      karry.splice(karry.indexOf(tag), 1)
    },
    // 关键词添加
    handleInputConfirm(val, karry) {
      // const inputValue = this.inputValue
      if (val) {
        this.keywordArray.push(val)
      }
      this.inputVisible = false
      this.inputValue = ''
      console.log(karry)
    },

    // 表单数据初始化
    resetTemp() {
      this.temp = {
        id: undefined,
        name: undefined,
        author:'Li2'
      }
      this.keywordArray = []
    },
    // 创建数据初始化
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑数据初始化
    handleUpdate(row) {
      console.log(row);
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp);
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新建和编辑数据
    createCategory() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = this.temp
          console.log(tempData);
          create(qs.stringify(tempData)).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              message: '分组创建成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    updateCategory() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = this.temp
          update(qs.stringify(tempData)).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              message: '数据更新成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },

    // 删除
    deleteDatas(data) {
      console.log(data)
      let params = []
      let str
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          params.push(data[i].id)
        }
        str = params.join('|')
      } else {
        str = data.id
      }
      console.log(params)
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
            method: 'ArticleVideoClassifyDelete',
            timestamp: +new Date(),
            cid: str
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
            } else {
              this.$nextTick(() => {
                loadingInstance.close()
              })
            }
            this.getList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 权重排序
  }
}
</script>
<style lang="scss" scoped>
.filter-container {
  display: flex;
  justify-content: flex-end;
}
.el-dialog {
  p {
    margin: 0;
    font-size: 12px;
    color: #cccccc;
  }
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.el-table{
.el-input {
  width: 120px;
  text-align: center
}
}
</style>
