<template>
  <div>
  <el-table :data="testList" border fit highlight-current-row
            style="width: 100%;padding-left: 1px;padding-top: 1px;" @sort-change="sortChange">

    <el-table-column  align="center" label="品牌">
      <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        <!--<el-tag>{{ row.type }}</el-tag>-->
      </template>
    </el-table-column>

    <el-table-column  align="center" label="文章发布数量">
      <template slot-scope="{row}">
        <span>{{ row.readSend }}</span>
        <!--<el-tag>{{ row.type }}</el-tag>-->
      </template>
    </el-table-column>

    <el-table-column  align="center" label="阅读数量">
      <template slot-scope="scope">
        <span>{{ scope.row.readCount }}</span>
      </template>
    </el-table-column>

    <el-table-column  align="center" label="评论总量" >
      <template slot-scope="scope">
        <span>{{ scope.row.commentTotal }}</span>
      </template>
    </el-table-column>


    <el-table-column  align="center" label="评论正面">
    <template slot-scope="scope">
      <span>{{ scope.row.commentPos }}</span>
    </template>
    </el-table-column>

    <el-table-column  align="center" label="评论中性">
      <template slot-scope="scope">
        <span>{{ scope.row.commentNeu }}</span>
      </template>
    </el-table-column>

    <el-table-column  align="center" label="评论负面">
      <template slot-scope="scope">
            <span>{{ scope.row.commentNeg }}</span>
      </template>
    </el-table-column>
  </el-table>
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
      default: 'negative'
    }
  },
  data() {
    return {
      list: null,
      testList: [
          {
            author: '智跑',
            id: '1',
            readSend:'2565',
            readCount:'8.5w',
            commentTotal:'3.9w',
            commentPos:'1.5w',
            commentNeg:'1.3w',
            commentNeu:'1.1w',
          },
          {
            author: '逍客',
            id: '2',
            readSend:'2365',
            readCount:'6.6w',
            commentTotal:'2.9w',
            commentPos:'1.6w',
            commentNeg:'8000',
            commentNeu:'5000',
          },
          {
            author: 'RX5',
            id: '3',
            readSend:'3565',
            readCount:'9.3w',
            commentTotal:'3.3w',
            commentPos:'2.1w',
            commentNeg:'8551',
            commentNeu:'3449',
          },
        ],

      listQuery: {
        page: 1,
        limit: 5,
        type: this.type,
        sort: '+id'
      },
      total:3,
      loading: false,
      showIcon:'negative'
    }
  },
  created() {
    //this.getList()
  },
  methods: {
    getList() {
      this.showIcon = this.listQuery.type
      this.loading = true
      this.$emit('create') // for test
      fetchList(this.listQuery).then(response => {
        this.list = this.testList.items
        this.total = this.testList.total
        // this.list = response.data.items
        this.loading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'read') {
        this.sortByRead(order)
      }else{
        this.sortByComment(order)
      }
    },
    sortByRead(order) { //阅读量升降
      if (order === 'ascending') { //如果为上升
        console.log('请求阅读量上升排序')
      } else {
        console.log('请求阅读量下降排序')
      }
      this.handleFilter()
    },
    sortByComment(order) { //评论数升降
      if (order === 'ascending') { //如果为上升
        console.log('请求评论数上升排序')
      } else {
        console.log('请求评论数下降排序')
      }
      this.handleFilter()
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
  .comment-hour-box img {
    width: 16px;
    height: 20px;
  }
  .up-box {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
</style>
