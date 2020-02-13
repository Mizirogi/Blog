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
          <div class="article-content-box">
            <svg-icon icon-class="fire" class="icon-size" v-show="row.isBoom"/>
            <svg-icon icon-class="negetive"  class="icon-size" v-show="row.articleType==='negative'"/>
            <svg-icon icon-class="normal" class="icon-size" v-show="row.articleType==='neutral'"/>
            <svg-icon icon-class="positive" class="icon-size" v-show="row.articleType==='positive'"/>
            <a href="#" class="text-ellipsis"><span>&#12288;{{ row.title }}</span></a>
          </div>
          <!--<el-tag>{{ row.type }}</el-tag>-->
        </template>
      </el-table-column>

      <el-table-column  min-width="100px" align="center" label="文章链接">
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

      <el-table-column  align="center" label="发布时间" >
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>


      <el-table-column  align="center" label="阅读数">
        <template slot-scope="scope">
          <span>{{ scope.row.readCount }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="评论数">
        <template slot-scope="scope">
          <span>{{ scope.row.commentCount }}</span>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" style="margin-top:0;padding:15px 5px 10px;" :total="total" disabled />
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
            author: '太平洋汽车网',
            id: '1',
            title: '2019成都车展：起亚智跑售14.49-14.89万',
            contentUrl:'https://price.pcauto.com.cn',
            readCount:'1566',
            commentCount:'32',
            isBoom:true,
            articleType:'positive',
            timestamp: 1398222130226
          },
          {
            author: '易车',
            id: '2',
            title: '看似低调的起亚智跑为何如此受青睐 热销的原因是什么？',
            contentUrl:'http://car.bitauto.com',
            readCount:'1266',
            commentCount:'24',
            isBoom:true,
            articleType:'neutral',
            timestamp: 1397222130226
          },
          {
            author: '汽车之家',
            id: '3',
            title: 'AI看市场|数据解读智跑的产品竞争力',
            contentUrl:'https://www.autohome.com.cn/xian/',
            readCount:'166',
            commentCount:'12',
            isBoom:true,
            articleType:'negative',
            timestamp: 1396222130226
          },
          {
            author: '爱卡汽车',
            id: '4',
            title: '与中国品牌同场竞技！试驾起亚全新智跑',
            contentUrl:'http://newcar.xcar.com.cn',
            readCount:'66',
            commentCount:'5',
            isBoom:true,
            articleType:'positive',
            timestamp: 1395222130226
          },
          {
            author: '汽车江湖',
            id: '5',
            title: '自己动手/丰衣足食 智跑“沐浴”迎新年',
            contentUrl:'http://www.qc188.com/1372/article/',
            readCount:'36',
            commentCount:'3',
            isBoom:true,
            articleType:'neutral',
            timestamp: 1394222130226
          },
        ],
        listQuery: {
          page: 1,
          limit: 5,
          type: this.type,
          sort: '+id'
        },
        total:5,
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
  .icon-size {
    width:22px;
    height:22px;
  }
</style>
