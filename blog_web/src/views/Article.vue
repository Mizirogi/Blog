<!--
 * @Description: 
 * @Author: Li
 * @Date: 2019-11-04 15:50:35
 * @LastEditors  : Li
 * @LastEditTime : 2020-01-14 14:43:50
 -->
<template>
  <div>
    <el-row :gutter="40">
      <el-col :span="16">
        <div v-for="(item,idx) in tableData" :key="idx">
          <router-link :to="'detail?id='+item.id" style="text">
            <el-card class="box-card">
              <div slot="header" class="title">
                <div><span>{{item.title}}</span></div>
                <div><ArticleDate :date="item.createdAt"></ArticleDate></div>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
              </div>
              <div>
                <div>
                  <el-tag v-for="item in item.categories" :key="item.id">{{ item.name }}</el-tag>
                </div>
                <div>{{item.introduction}}</div>
              </div>
            </el-card>
          </router-link>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="category">
          <div class="aside-box">
            <h3 class="aside-title">文章分类</h3>
            <ul class="aside-content">
              <li
                class="aside-item pointer"
                @click="getCategoryArticlLeist(item.id)"
                v-for="item in cateData"
                :key="item.id"
              >
                <div class="aside-name">{{item.name}}</div>
                <div class="aside-count">{{item.number}}篇</div>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ArticleDate from "@/components/ArticleDate.vue";
export default {
  methods: {
    handleClick(row) {
      console.log(row);
    },
    sendHeader() {
      //func: 是父组件指定的传数据绑定的函数，this.msg:子组件给父组件传递的数据
      this.$emit("func", this.$route.name);
    },
    nextClick(val) {
      this.params.pageIndex = val;
      this.getist(this.params);
      console.log("下一页");
    },
    handleCurrentChange(val) {
      this.params.pageIndex = val;
      this.currentPage = val;
      this.getist(this.params);
      console.log(`当前页: ${val}`);
    },
    getist(params) {
      this.$api.article.getArticleList(params).then(res => {
        console.log(res.data.data);
        this.pageCount = res.data.data.totalCount;
        this.tableData = res.data.data.data;
      });
    },
    resetParams(){
      this.params = {
      author: this.author,
      pageIndex: this.currentPage,
      pageSize: 10,
      keyword: this.keyword
      }
    },
    getCategoryArticlLeist(id) {
      this.currentPage = 1
      this.resetParams()
      this.params.categoryId = id
      this.$api.article.getArticleList(this.params).then(res => {
        console.log(res.data);
        this.pageCount = res.data.data.totalCount;
        this.tableData = res.data.data.data;
      });
    },
    async getCategory() {
      let params = {
        page_num: 1,
        page_size : 0,
        author: "Li2"
      };
      var data = {};
      await this.$api.article.getCategory(params).then(res => {
        console.log(res.data);
        data = res.data.data;
      });
      data.forEach(item => {
        let i = 0;
        this.tableData.forEach(code => {
          if (item.id == code["categories.id"]) {
            i++;
          }
        });
        item.number = i;
      });
      this.cateData = data;
    }
  },
  mounted() {
    this.sendHeader();
    this.params = {
      author: this.author,
      pageIndex: this.currentPage,
      pageSize: 10,
      keyword: this.keyword
    };
    console.log(this.params);
    this.getist(this.params);
    this.getCategory();
  },

  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      pageCount: 0,
      keyword: "",
      author: "Li2",
      params: {
        author: "",
        pageIndex: "",
        pageSize: "",
        keyword: this.keyword
      },
      tableData: [],
      cateData: [],
      author: "Li2"
    };
  },
  components: {
    ArticleDate
    }
};
</script>
<style>
a {
  text-decoration: none;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
.title{
display: flex;
align-items: center;
}
.title>:nth-child(1){
  flex: 1;
  font-size: 28px;
}
.title:before,
.title:after {
  display: table;
  content: "";
}
.title:after {
  clear: both;
}

.box-card {
  width: 580px;
  text-align: left;
  margin: 10px;
}
.el-card__body {
    padding: 1px 20px 20px 20px;
}
.el-card__body  div{
    margin: 10px 0px;
}

.category {
  width: 300px;
  height: 200px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  border-radius: 10px;
}
h3.aside-title {
  padding: 0 15px;
  height: 38px;
  border-bottom: 1px solid #EBEEF5;
  color: #3d3d3d;
  font-size: 16px;
  line-height: 38px;
}
.aside-content {
  padding: 15px 15px 20px 15px;
  background: #fff;
}
.aside-box {
  margin-bottom: 20px;
}
.aside-item {
  display: flex;
  padding: 7px 0;
  color: #333;
  font-size: 14px;
}
.aside-item:hover {
  color: #6bc30d;
}
.aside-item-article {
  padding: 7px 0;
  color: #333;
  font-size: 14px;
}
.aside-name {
  font-size: 12px;
  flex: 1;
  text-align: left;
}
.aside-count {
  font-size: 12px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>