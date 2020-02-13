<template>
  <div>
    <el-table :data="list" border fit highlight-current-row style="width: 100%"
              @sort-change="sortChange" class="scale-zoom">

      <el-table-column
        align="center"
        label="序号"
        type="index"
        :index="articleIndexSetting"
        width="65"
      />

      <el-table-column min-width="150px" align="center" label="文章名">
        <template slot-scope="{row}">
          <div class="article-content-box">
            <svg-icon v-show="type==='2'" icon-class="negetive" />
            <svg-icon v-show="type==='0'" icon-class="normal" />
            <svg-icon v-show="type==='1'" icon-class="positive" />
            <a class="text-ellipsis" :href="row.url" target="_blank">{{ row.title }}</a>
          </div>
        <!--<el-tag>{{ row.type }}</el-tag>-->
        </template>
      </el-table-column>

      <!-- <el-table-column width="280px" align="center" label="文章链接">
        <template slot-scope="{row}">
          <a :href="row.url" target="_blank" style="color:#79BBFF">{{ row.url }}</a>
        </template>
      </el-table-column> -->

      <el-table-column  align="center" label="媒体名">
        <template slot-scope="scope">
          <span>{{ scope.row.monitorname || '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="发布时间" sortable="true" prop="releaseTime">
        <template slot-scope="scope">
          <span>{{ scope.row.pubtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" :label="headerType=='1'?'阅读数':'点赞数'" sortable="true" prop="readNum">
        <template slot-scope="scope">
          <div v-if="headerType=='1'">
          <span v-show="scope.row.readnum < 10000">{{ scope.row.readnum }}</span>
          <span v-show="scope.row.readnum >= 10000">{{(scope.row.readnum / 10000).toFixed(2)}}w</span>
          </div>
           <div v-if="headerType=='2'">
          <span v-show="scope.row.likenum < 10000">{{ scope.row.likenum }}</span>
          <span v-show="scope.row.likenum >= 10000">{{(scope.row.likenum / 10000).toFixed(2)}}w</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="评论数" sortable="true" prop="commentNum">
        <template slot-scope="scope">
          <span v-show="scope.row.commentnum < 10000">{{ scope.row.commentnum }}</span>
          <span v-show="scope.row.commentnum >= 10000">{{(scope.row.commentnum / 10000).toFixed(2)}}w</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" :label="headerType=='1'?'24小时阅读数增量':'24小时点赞数增量'" sortable="custom" prop="timeRead">  <!-- 增减功能暂时注释 sortable="custom"-->
        <template slot-scope="scope">
          <div class="comment-hour-box">
            <div v-if="headerType=='1'">
              <span v-show="scope.row.readnum_inc < 10000">{{ scope.row.readnum_inc }}</span>
              <span v-show="scope.row.readnum_inc >= 10000">{{(scope.row.readnum_inc / 10000).toFixed(2)}}w</span>
              <img v-show="scope.row.readnum_inc > 0" src="./icon/up.png" alt="">
              <img v-show="scope.row.readnum_inc < 0" src="./icon/down.png" alt="">
            </div>
            <div v-if="headerType=='2'">
              <span v-show="scope.row.likenum_inc < 10000">{{ scope.row.likenum_inc }}</span>
              <span v-show="scope.row.likenum_inc >= 10000">{{(scope.row.likenum_inc / 10000).toFixed(2)}}w</span>
              <img v-show="scope.row.likenum_inc > 0" src="./icon/up.png" alt="">
              <img v-show="scope.row.likenum_inc < 0" src="./icon/down.png" alt="">
            </div>
            <div v-if="headerType=='1'">
              昨日 ：
              <span v-show="scope.row.readnums < 10000">{{ scope.row.readnums }}</span>
              <span v-show="scope.row.readnums >= 10000">{{(scope.row.readnums / 10000).toFixed(2)}}w</span>
            </div>
            <div v-if="headerType=='2'">
              昨日 ：
              <span v-show="scope.row.likenums < 10000">{{ scope.row.likenums }}</span>
              <span v-show="scope.row.likenums >= 10000">{{(scope.row.likenums / 10000).toFixed(2)}}w</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="24小时评论数增量" sortable="custom" prop="timeComment"> <!-- 增减功能暂时注释 sortable="custom"-->
        <template slot-scope="scope">
          <div class="comment-hour-box">
            <div>
              <span v-show="scope.row.commentnum_inc < 10000">{{ scope.row.commentnum_inc }}</span>
              <span v-show="scope.row.commentnum_inc >= 10000">{{(scope.row.commentnum_inc / 10000).toFixed(2)}}w</span>
              <img v-show="scope.row.commentnum_inc > 0" src="./icon/up.png" alt="">
              <img v-show="scope.row.commentnum_inc < 0" src="./icon/down.png" alt="">
            </div>
            <div>
              昨日 ：
              <span v-show="scope.row.commentnums < 10000">{{ scope.row.commentnums }}</span>
              <span v-show="scope.row.commentnums >= 10000">{{(scope.row.commentnums / 10000).toFixed(2)}}w</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      small
      style="margin-top:0;padding:16px 8px 0;"
      :total="total"
      :page.sync="listQuery.page_num"
      :limit.sync="listQuery.page_size"
      :scroll-location="255"
       layout="prev, pager, next"
      :auto-scroll="false"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

import { dashboard } from '@/api/dashboard'
import md5 from 'js-md5'

export default {
  components: {
    Pagination
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    headerType: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      list: null,
      listQuery: {
        method: 'FirstYuqingListByInc',
        page_num: 1,
        page_size: 5,
        property: this.type,
        ordertype: '',
        type:this.headerType
      },
      total: 0,
      loading: false,
      showIcon: 'negative'
    }
  },
  created() {
    this.getList()
  },
  watch: {
    headerType(val,old){
      
      this.getList()
    },
  },
  methods: {
    getList() {
      if (this.headerType == '1') {
        this.listQuery.ordertype = '106,1'
      } else if(this.headerType == '2') {
        this.listQuery.ordertype = '103,1'
      }
      this.listQuery.type = this.headerType;
      this.listLoading = true
      this.listQuery.timestamp = +new Date()
      this.listQuery.sign = md5(
        this.listQuery.method + this.listQuery.timestamp
      )
      dashboard(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = parseInt(response.data.total)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 表格内索引
    articleIndexSetting(index) {
      return (this.listQuery.page_num - 1) * this.listQuery.page_size + index + 1
    },
    sortChange(data) {
      let type = data.prop;
      switch (type) {
        case 'readNum' :
          this.sort = data.order === 'ascending' ? 2 : 1;
          this.listQuery.ordertype = '6,' + this.sort;
          break;
        case 'commentNum' :
          this.sort = data.order === 'ascending' ? 2 : 1;
          this.listQuery.ordertype = '4,' + this.sort;
          break;
        case 'releaseTime' :
          this.sort = data.order === 'ascending' ? 2 : 1;
          this.listQuery.ordertype = '2,' + this.sort;
          break;
        case 'timeRead' :
          this.sort = data.order === 'ascending' ? 2 : 1;
          this.listQuery.ordertype = '106,' + this.sort;
          break;
        case 'timeComment' :
          this.sort = data.order === 'ascending' ? 2 : 1;
          this.listQuery.ordertype = '104,' + this.sort;
          break;
      }
      this.getList()
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
  .svg-icon{
  width: 1.6em;
  height: 1.6em;
  margin-right: 20px;
}

  /*@media screen and (-webkit-device-pixel-ratio: 0.75) {*/
    /*.scale-zoom{*/

    /*}*/
  /*}*/
  @media screen and (-webkit-device-pixel-ratio: 0.8) {
    .scale-zoom{
      width: 99.9%!important;
      padding-left: 1px;
    }
  }
  @media screen and (-webkit-device-pixel-ratio: 0.9) {
    .scale-zoom{
      padding-top: 2px;
    }
  }
  /*@media screen and (-webkit-device-pixel-ratio: 1.1) {*/
    /*.scale-zoom{*/

    /*}*/
  /*}*/

</style>
