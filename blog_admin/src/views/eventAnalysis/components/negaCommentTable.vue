<template>
  <div>
    <el-table :data="testList" border fit highlight-current-row style="width: 100%"
              @sort-change="sortChange">
      <el-table-column v-loading="loading" align="center" label="序号" width="65" element-loading-text="请给我点时间！">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="150px" align="center" label="文章名">
        <template slot-scope="{row}">
            <span>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="文章类型">
        <template slot-scope="{row}">
          <span>{{ row.contentUrl }}</span>
          <!--<el-tag>{{ row.type }}</el-tag>-->
        </template>
      </el-table-column>

      <el-table-column  align="center" label="媒体名">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="总评论数">
        <template slot-scope="scope">
          <span>{{ scope.row.readCount }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="负面评论数">
        <template slot-scope="scope">
          <span>{{ scope.row.commentCount }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.media }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="发布时间" >
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" style="margin-top:0;padding:16px 8px 0;" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
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
            author: '新浪网',
            id: '1',
            title: '原来这才是领克的真面目',
            contentUrl:'新车上市',
            readCount:'1566',
            commentCount:'32',
            isBoom:true,
            articleType:'positive',
            timestamp: 1398222130226,
            media:'汽车解说',
          },
          {
            author: '搜狐汽车',
            id: '2',
            title: '领克，一个只能说好，不敢说不好的汽车品牌？',
            contentUrl:'新车上市',
            readCount:'1266',
            commentCount:'24',
            isBoom:true,
            articleType:'neutral',
            timestamp: 1397222130226,
            media:'小叶子',
          },
          {
            author: '爱卡汽车论坛',
            id: '3',
            title: '闲扯几句关于EXEED星途、领克、WEY的看法',
            contentUrl:'新车上市',
            readCount:'166',
            commentCount:'12',
            isBoom:false,
            articleType:'negative',
            timestamp: 1396222130226,
            media:'汽车解说',
          },
          {
            author: '汽车之家',
            id: '4',
            title: '原创 不再为充电而烦恼，领克01推混动版车型 ',
            contentUrl:'新车上市',
            readCount:'66',
            commentCount:'5',
            isBoom:false,
            articleType:'positive',
            timestamp: 1395222130226,
            media:'小辣椒',
          },
        ],
        listQuery: {
          page: 1,
          limit: 5,
          type: this.type,
          sort: '+id'
        },
        total:30,
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
        this.list = this.testList.items
        this.total = this.testList.total
        // this.list = response.data.items
        this.loading = false
        // fetchList(this.listQuery).then(response => {
        //   this.list = this.testList.items
        //   this.total = this.testList.total
        //   // this.list = response.data.items
        //   this.loading = false
        // })
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
