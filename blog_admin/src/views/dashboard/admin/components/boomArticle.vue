<template>
<div>
  <div style="height:350px">
    <div class="list">
      <div v-for="(item,index) in list " :key="'row'+index" class="news-row">
        <el-row>
          <el-col :span="24">
            <div class="article-content-box">
              <svg-icon v-show="fire==='fire'" icon-class="fire" />
              <svg-icon v-show="fire!=='fire'" icon-class="blank" />
              <svg-icon v-show="item.property==='1'" icon-class="positive" />
              <svg-icon v-show="item.property==='0'" icon-class="normal" />
              <svg-icon v-show="item.property==='2'" icon-class="negetive" />
              <!-- <img src="./icon/negative.png" alt v-show="item.articleType==='negative'" />
            <img src="./icon/neutral.png" alt v-show="item.articleType==='neutral'" />
              <img src="./icon/positive.png" alt v-show="item.articleType==='positive'" />-->
              <a
                :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
                style="margin-left: 9px;"
                class="text-ellipsis"
              >{{ item.title }}</a>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 8px;">
          <el-col :span="8" class="time">
            <span>{{ item.pubtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </el-col>
          <el-col :span="8" class="count">
            <span v-show="item.readnum < 10000">阅读数：{{ item.readnum }}</span>
            <span v-show="item.readnum >= 10000">阅读数：{{(item.readnum / 10000).toFixed(2)}}w</span>
            <span v-show="item.commentnum < 10000">评论数：{{ item.commentnum }}</span>
            <span v-show="item.commentnum >= 10000">评论数：{{(item.commentnum / 10000).toFixed(2)}}w</span>
          </el-col>
          <el-col :span="8" class="media-name">
            <span>{{ item.author || '暂无' }}</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- <el-table :data="tableData" border style="width: 100%">
    <el-table-column  label="序号"  align="center" width="65">
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>
    <el-table-column  label="文章名"  align="center" min-width="180px">
      <template slot-scope="scope">
        <div class="article-content-box">
          <img src="./icon/negative.png" alt="" v-show="scope.row.articleType==='negative'">
          <img src="./icon/neutral.png" alt=""  v-show="scope.row.articleType==='neutral'">
          <img src="./icon/positive.png" alt=""  v-show="scope.row.articleType==='positive'">
          <span>{{ scope.row.title }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column  label="文章链接" align="center" width="300px">
      <template slot-scope="scope">
        <span>{{ scope.row.contentUrl }}</span>
      </template>
    </el-table-column>
    <el-table-column  label="媒体名" align="center" width="160px">
      <template slot-scope="scope">
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>
    <el-table-column  label="发布时间" align="center" width="160px">
      <template slot-scope="scope">
        <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </template>
    </el-table-column>
    <el-table-column  align="center" label="阅读数(万次)" width="120px">
      <template slot-scope="scope">
        <span>{{ scope.row.readCount }}</span>
      </template>
    </el-table-column>
    <el-table-column  align="center" label="评论数(万次)" width="120px">
      <template slot-scope="scope">
        <span>{{ scope.row.commentCount }}</span>
      </template>
    </el-table-column>
    </el-table>-->
  </div>
    <pagination
      small
      style="margin-top:0;padding:16px 8px 0;"
      :total="total"
      :pager-count="5"
      :page.sync="listQuery.page_num"
      :limit.sync="listQuery.page_size"
      layout="prev, pager, next"
      :auto-scroll="false"
      @pagination="getList(fire)"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { dashboard } from "@/api/dashboard";
import md5 from "js-md5";

export default {
  components: {
    Pagination
  },
  props: {
    type: {
      type: String,
      default: "1"
    },
    fire: {
      type: String,
      default: "fire"
    },
    filterBoomRead: {
      type: String,
      default: "6"
    },
    filterBoomIndex: {
      type: String,
      default: "1"
    },
    filterNegRead: {
      type: String,
      default: "6"
    },
    filterNegIndex: {
      type: String,
      default: "1"
    }
  },
  data() {
    return {
      list: null,
      listQuery: {
        method: "FirstYuqingListReadMax",
        page_num: 1,
        page_size: 5,
        timetype: this.type,
        ordertype: "2,1"
      },
      total: 0
    };
  },
  created() {
    this.getList(this.fire);
  },
  watch: {
    filterBoomRead(val) {
      this.getList("fire");
    },
    filterBoomIndex(val) {
      this.getList("fire");
    },
    filterNegRead(val) {
      this.getList("nofire");
    },
    filterNegIndex(val) {
      this.getList("nofire");
    }
  },
  methods: {
    getList(fire) {
      if (fire === "nofire") {
        this.listQuery.method = "FirstYuqingListNegativeMax";
        this.listQuery.ordertype =
          this.filterNegRead + "," + this.filterNegIndex;
      } else {
        this.listQuery.ordertype =
          this.filterBoomRead + "," + this.filterBoomIndex;
      }

      this.listQuery.timestamp = +new Date();
      this.listQuery.sign = md5(
        this.listQuery.method + this.listQuery.timestamp
      );
      // params.sign = md5(
      //   params.method + params.timestamp
      // )
      dashboard(this.listQuery).then(response => {
        this.list = response.data.list;
        this.total = parseInt(response.data.total);
      });
    }
  }
};
</script>

<style scoped>
.article-content-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #606266;
}
.article-content-box img {
  margin-right: 20px;
}
/* .news-row + .news-row {
  margin-top: 5px;
} */
.time {
  font-size: 12px;
  color: #acacac;
  padding: 0 0 0 55px;
}
.count {
  font-size: 12px;
  color: #acacac;
  text-align: center;
}
.media-name {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  padding-right: 55px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.list {
  font-size: 14px;
}
.list .news-row {
  padding: 15px 10px 10px 10px;
  border-bottom: 1px dashed #dfe6ec;
  transition: background-color 0.25s ease;
}
.news-row:hover {
  background-color: #f5f7fa;
}
.list > :nth-last-child(1) {
  border: none;
}
.svg-icon {
  width: 1.6em;
  height: 1.6em;
}
</style>
