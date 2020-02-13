<template>
  <div class="app-container">
    <div v-show="mainTableIsShow" class="filter-container">
      <el-row type="flex" align="middle">
        <el-button
          class="filter-item"
          type="primary"
          :disabled="multipleSelection.length == 0"
          @click="deleteDatas(multipleSelection)"
        >批量删除</el-button>
        <span style="font-size:16px;margin-left:auto;">共{{ total }}条视频，其中</span>
        <span style="color:red;font-size:16px;font-weight:700;">{{ negaitveTotal }}</span>
        <span  style="font-size:16px;margin-right:30px;">
          篇文有负面评论
          <span v-if="total != 0" >
            ，占比
          </span>
          <span  v-if="total != 0"
            style="color:red;font-size:16px;font-weight:700;"
          >{{Math.floor(negaitveTotal/total*10000)/100}}%</span>。
        </span>
      </el-row>

      <el-row type="flex" align="middle" style="margin-top:10px;">
        <div style="padding-bottom:10px;">
          <span>车型：</span>
        </div>
        <el-select
          v-model="keywordIdSelect"
          style="width: 100px;margin-right:20px;"
          class="filter-item"
        >
          <el-option
            v-for="item in carListSelect"
            :key="item.name"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="listQuery.monitor_name"
          placeholder="媒体"
          style="width: 120px;margin-right:20px;"
          class="filter-item"
        />
        <el-input
          v-model="listQuery.author"
          placeholder="作者"
          style="width: 120px;margin-right:20px;"
          class="filter-item"
        />
        <div style="padding-bottom:10px;">
          <span>最小值：</span>
        </div>
        <el-input
          v-model="listQuery.min_likenum"
          placeholder="点赞数不低于"
          style="width: 120px;margin-right:20px;"
          class="filter-item"
        />
        <div style="padding-bottom:10px;">
          <span>最大值：</span>
        </div>
        <el-input
          v-model="listQuery.max_likenum"
          placeholder="点赞数不高于"
          style="width: 120px;margin-right:20px;"
          class="filter-item"
        />

        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          v-throttle="{callback:handleFilter,time:3000}"
        >搜索</el-button>
      </el-row>
    </div>

    <el-table
      v-show="mainTableIsShow"
      key="listTable"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      lazy
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <!-- 选择栏 -->
      <el-table-column type="selection" align="center" />
      <!-- 序号 -->
      <el-table-column label="序号" width="55px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.idx }}</span>
        </template>
      </el-table-column>
      <el-table-column label="视频标题" min-width="150px" align="center">
        <template slot-scope="{row}">
          <div style="display:flex;align-items:center;justify-content: flex-start;">
            <svg-icon
              v-if="row.property == 1"
              icon-class="positive"
              style="width:22px;height:22px;"
            />
            <svg-icon v-if="row.property == 0" icon-class="normal" style="width:22px;height:22px;" />
            <svg-icon
              v-if="row.property == 2"
              icon-class="negetive"
              style="width:22px;height:22px;"
            />
            <!-- 此处需要添加一个跳转 -->
            <a :href="row.url" target="_blank" class="overflow" style="width:90%;text-align:left;">
              &nbsp;&nbsp;
              <span class="link-type">{{ row.title }}</span>
            </a>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="媒体名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.monitorname || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.keywordcontent }}</span>
        </template>
      </el-table-column>

      <el-table-column label="调性" align="center">
        <template slot-scope="{row}">
          <span
            :class="row.property == 1?'text-emphasize link-type':'link-type'"
            @click="row.property = 1;changeEvaluation(row.id,1)"
          >正</span>
          <span
            :class="row.property == 0?'text-emphasize link-type':'link-type'"
            @click="row.property = 0;changeEvaluation(row.id,0)"
          >中</span>
          <span
            :class="row.property == 2?'text-emphasize link-type':'link-type'"
            @click="row.property = 2;changeEvaluation(row.id,2)"
          >负</span>
        </template>
      </el-table-column>

      <el-table-column label="发布时间" sortable="true" prop="releaseTime" align="center">
        <template slot-scope="{row}">
          <span>{{ row.pubtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="视频分类" align="center">
        <template slot-scope="{row}">
          <span>{{ row.classifyname || '其他' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="媒体类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.medianame || '无' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="点赞数" sortable="true" prop="likeNum" align="center" class-name>
        <template slot-scope="{row}">
          <span v-show="row.likenum < 10000">{{ row.likenum }}</span>
          <span v-show="row.likenum >= 10000">{{(row.likenum / 10000).toFixed(2)}}w</span>
        </template>
      </el-table-column>

      <el-table-column
        label="评论数量(负面数量)"
        sortable="true"
        prop="commentNum"
        align="center"
        class-name
      >
        <template slot-scope="{row}">
          <div @click="commentListShow(row.id);">
            <span v-show="row.comments_total < 10000">{{ row.comments_total || 0 }}</span>
            <span v-show="row.comments_total >= 10000">{{(row.comments_total / 10000).toFixed(2)}}w</span>
            <span
              style="color:red;cursor: pointer"
            >{{ '(' + (row.comments_negative_total || 0) + ')' }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="转发数" sortable="true" prop="zhuanNum" align="center" class-name>
        <template slot-scope="{row}">
          <span v-show="row.zhuannum < 10000">{{ row.zhuannum }}</span>
          <span v-show="row.zhuannum >= 10000">{{(row.zhuannum / 10000).toFixed(2)}}w</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="100px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <svg-icon
            icon-class="comments"
            @click="commentListShow(row.id);"
            style="font-size:20px;cursor: pointer;"
          />
          <i
            class="el-icon-delete"
            style="font-size:20px;cursor: pointer;color:#F29B23;"
            @click="deleteDatas(row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="mainTableIsShow && total>0"
      :total="total"
      prev-text="上一页"
      next-text="下一页"
      :page.sync="listQuery.page_num"
      :limit.sync="listQuery.page_size"
      @pagination="getList"
    />

    <div v-if="!mainTableIsShow" class="filter-container">
      <el-row type="flex" align="center">
        <el-button
          class="filter-item"
          style="margin-right:10px;"
          :disabled="commentMultipleSelection.length == 0"
          type="primary"
          @click="deleteCommentDatas(commentMultipleSelection)"
        >批量删除</el-button>
        <div style="display:inline-block;margin-left:auto;margin-right:0px;">
          <span style="font-size:16px;margin-left:auto;">共{{ commentTotal }}条评论，其中</span>负面评论有
          <span style="color:red;font-size:16px;font-weight:700;">{{ negaitveCommentTotal }}</span>条
          <span  v-if="commentTotal != 0" style="font-size:16px;margin-right:30px;">
            ，占比
            <span  v-if="commentTotal != 0"
              style="color:red;font-size:16px;font-weight:700;"
            >{{Math.floor(negaitveCommentTotal/commentTotal*10000)/100}}%</span>。
          </span>
        </div>
      </el-row>
      <el-row type="flex" align="top" style="margin-top:10px;">
        <!-- <el-input v-model="commentListQuery.author" placeholder="作者" style="width: 120px;margin-right:20px;" class="filter-item"/> -->
        <div style="padding-top:10px;">
          <span>评论调性：</span>
        </div>
        <el-select
          v-model="commentListQuery.property"
          style="width: 100px;margin-right:20px;"
          class="filter-item"
        >
          <el-option
            v-for="item in property"
            :key="item.name + 'property'"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <div style="margin-right:5px;padding-top:10px;">
          <span>时间选择：</span>
        </div>
        <div>
          <el-date-picker
            v-model="commentListQuery.starttime"
            type="datetime"
            default-time="['00:00:00']"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开始时间"
            style="width: 200px;"
          />
        </div>
        <div style="padding-top:10px;margin-right:3px;margin-left:3px;">
          <span>至</span>
        </div>
        <div>
          <el-date-picker
            v-model="commentListQuery.endtime"
            type="datetime"
            default-time="['23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择结束时间"
            style="width: 200px;margin-right:20px;"
          />
        </div>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          v-throttle="{callback:commnetHandleFilter,time:3000}"
        >搜索</el-button>
        <el-button
          v-waves
          class="filter-item"
          type="info"
          plain
          icon="el-icon-back"
          @click="mainTableIsShow = true"
        >返回</el-button>
      </el-row>
    </div>

    <el-table
      v-if="!mainTableIsShow"
      key="commentListTable"
      v-loading="listLoading"
      :data="commentList"
      border
      fit
      highlight-current-row
      lazy
      style="width: 100%;"
      @selection-change="commentHandleSelectionChange"
    >
      <!-- 选择栏 -->
      <el-table-column type="selection" align="center" />
      <!-- 序号 -->
      <el-table-column label="序号" width="55px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.idx }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评论内容" min-width="150px" align="center">
        <template slot-scope="{row}">
          <div style="display:flex;align-items:center;justify-content: flex-start;">
            <svg-icon
              v-if="row.property == 1"
              icon-class="positive"
              style="width:22px;height:22px;"
            />
            <svg-icon v-if="row.property == 0" icon-class="normal" style="width:22px;height:22px;" />
            <svg-icon
              v-if="row.property == 2"
              icon-class="negetive"
              style="width:22px;height:22px;"
            />&nbsp;&nbsp;
            <span style="width:90%;text-align:left;">{{ row.content }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="作者" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="调性" align="center">
        <template slot-scope="{row}">
          <span
            :class="row.property == 1?'text-emphasize link-type':'link-type'"
            @click="row.property = 1;changeCommnetEvaluation(row.id,1)"
          >正</span>
          <span
            :class="row.property == 0?'text-emphasize link-type':'link-type'"
            @click="row.property = 0;changeCommnetEvaluation(row.id,0)"
          >中</span>
          <span
            :class="row.property == 2?'text-emphasize link-type':'link-type'"
            @click="row.property = 2;changeCommnetEvaluation(row.id,2)"
          >负</span>
        </template>
      </el-table-column>
      <el-table-column label="评论时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="100px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <i
            class="el-icon-delete"
            style="color:#f29b23;font-size:20px;"
            @click="deleteCommentDatas(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      v-if="!mainTableIsShow && total>0"
      :total="commentTotal"
      prev-text="上一页"
      next-text="下一页"
      :page.sync="commentListQuery.page_num"
      :limit.sync="commentListQuery.page_size"
      @pagination="getCommentList"
    />
  </div>
</template>

<script>
import { YuqingList, YuqingDelete, YuqingProperty } from "@/api/articleResult";
import {
  CommentsList,
  CommentsDelete,
  CommentsProperty
} from "@/api/commentEvent";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "../components/Pagination"; // secondary package based on el-pagination
import md5 from "js-md5";
var timestamp = +new Date();

export default {
  name: "CommentVideoResult",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      multipleSelection: [],
      commentMultipleSelection: [],
      tableKey: 0,
      list: null,
      total: 0, // 舆情总条数
      negaitveTotal: 0, // 负面舆情条数
      commentList: null, // 评论页面的评论数据
      commentTotal: 0, // 评论总条数
      negaitveCommentTotal: 0, // 负面评论总条数
      listLoading: true,
      property: [
        {
          id: "",
          name: "全部"
        },
        {
          id: 0,
          name: "中性"
        },
        {
          id: 1,
          name: "正面"
        },
        {
          id: 2,
          name: "负面"
        }
      ],
      // 请求参数列表
      listQuery: {
        method: "YuqingList",
        timestamp: timestamp,
        sign: md5("YuqingList" + timestamp),
        page_num: 1,
        page_size: 20,
        type: 2, // 视频
        keyword_id: "",
        level: "",
        media: "",
        classify: "",
        hottopic: "",
        property: "",
        starttime: "",
        endtime: "",
        content_type: "",
        content_all: "",
        content_one: "",
        content_exclude: "",
        author: "",
        monitor_name: "",
        min_likenum: "",
        max_likenum: "",
        ordertype: "2,1",
        de_duplication: "0",
        has_comments: 1
      },
      // 评论列表的参数列表
      commentListQuery: {
        method: "CommentsList",
        timestamp: timestamp,
        sign: md5("CommentsList" + timestamp),
        page_num: 1,
        page_size: 10,
        articleid: "",
        property: "",
        author: "",
        starttime: "",
        endtime: ""
      },

      downloadLoading: false,
      carListSelect: [],
      keywordIdSelect: "",

      nowId: null, // 当前查看的评论的id
      mainTableIsShow: true
    };
  },
  created() {
    // this.getList()
  },
  mounted() {
    // 组件通信，接收面板传递的请求参数form
    const _this = this;
    this.bus.$on("form_submit_commentEvent", function(item) {
      _this.listQuery.keyword_id = item.keyword_id;
      _this.listQuery.level = item.level;
      _this.listQuery.media = item.media;
      _this.listQuery.classify = item.videoType; // 视频
      _this.listQuery.hottopic = item.hottopic;
      _this.listQuery.property = item.property;
      _this.listQuery.starttime = item.starttime;
      _this.listQuery.endtime = item.endtime;
      _this.listQuery.ordertype = item.ordertype;
      _this.listQuery.content_type = item.content_type;
      _this.listQuery.content_all = item.content_all;
      _this.listQuery.content_one = item.content_one;
      _this.listQuery.content_exclude = item.content_exclude;
      _this.listQuery.de_duplication = item.de_duplication;
      _this.listQuery.monitor_name = "";
      _this.listQuery.author = "";
      _this.keywordIdSelect = ""; // 清空车型选择
      _this.listQuery.min_likenum = "";
      _this.listQuery.max_likenum = "";
      _this.listQuery.page_num = 1;
      _this.getList();
    });

    this.bus.$on("carListSelect_commentEvent", function(item) {
      _this.carListSelect = item;
      let arr = [];
      _this.carListSelect.forEach((item, index) => {
        if (index) {
          arr.push(item.id);
        }
      });
      arr = arr.join("|");
      if (!_this.list) {
        _this.listQuery.keyword_id = arr;
        _this.getList();
      }
    });
  },

  methods: {
    commentListShow(id) {
      this.commentListQuery.articleid = id;
      this.commentListQuery.page_num = 1;
      this.getCommentList();
      this.mainTableIsShow = false;
    },
    // 文章/列表数据加载
    getList() {
      this.listLoading = true;
      YuqingList(this.listQuery).then(response => {
        this.list = response.data.list;
        this.list.forEach((item, index) => {
          this.$set(
            item,
            "idx",
            index + 1 + (this.listQuery.page_num - 1) * this.listQuery.page_size
          );
        });
        this.total = Number(response.data.total);
        this.negaitveTotal = Number(response.data.negaitve_total);
        setTimeout(() => {
          this.listLoading = false;
        }, 0.5 * 1000);
      });
    },

    // 评论列表请求
    getCommentList() {
      this.listLoading = true;
      CommentsList(this.commentListQuery).then(response => {
        this.commentList = response.data.list;
        this.commentList.forEach((item, index) => {
          this.$set(
            item,
            "idx",
            index +
              1 +
              (this.commentListQuery.page_num - 1) *
                this.commentListQuery.page_size
          );
        });
        this.commentTotal = Number(response.data.total);
        this.negaitveCommentTotal = Number(response.data.negaitve_total);
        setTimeout(() => {
          this.listLoading = false;
        }, 0.5 * 1000);
      });
    },

    // 搜索
    handleFilter() {
      this.listQuery.page_num = 1;
      this.listQuery.keyword_id =
        this.keywordIdSelect || this.carListSelect[0].id;
      this.getList();
    },

    // 评论搜索
    commnetHandleFilter() {
      this.commentListQuery.page_num = 1;
      this.commentListQuery.keyword_id =
        this.keywordIdSelect || this.carListSelect[0].id;
      this.getCommentList();
    },

    // 文章/视频多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 评论多选
    commentHandleSelectionChange(val) {
      this.commentMultipleSelection = val;
    },

    // 删除文章/视频
    deleteDatas(data) {
      let params = [];
      let str;
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          params.push(data[i].id);
        }
        str = params.join("|");
      } else {
        str = data.id;
      }
      this.$confirm("是否删除选中数据", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          var loadingInstance = this.$loading({
            fullscreen: true,
            lock: true,
            text: "删除中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          params = {
            method: "YuqingDelete",
            timestamp: +new Date(),
            yuqing_id: str
          };
          params.sign = md5(params.method + params.timestamp);
          YuqingDelete(params).then(response => {
            if (response.message === "success") {
              setTimeout(() => {
                this.$nextTick(() => {
                  loadingInstance.close();
                });
                this.$notify({
                  title: "提示",
                  message: "删除成功",
                  type: "success",
                  duration: 2000
                });
              }, 1500);
            }
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 删除评论
    deleteCommentDatas(data) {
      let params = [];
      let str;
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          params.push(data[i].id);
        }
        str = params.join("|");
      } else {
        str = data.id;
      }
      this.$confirm("是否删除选中数据", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          var loadingInstance = this.$loading({
            fullscreen: true,
            lock: true,
            text: "删除中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          params = {
            method: "CommentsDelete",
            timestamp: +new Date(),
            comments_id: str
          };
          params.sign = md5(params.method + params.timestamp);
          CommentsDelete(params).then(response => {
            if (response.message === "success") {
              setTimeout(() => {
                this.$nextTick(() => {
                  loadingInstance.close();
                });
                this.$notify({
                  title: "提示",
                  message: "删除成功",
                  type: "success",
                  duration: 2000
                });
              }, 1500);
            }
            this.getCommentList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 修改评论调性
    changeEvaluation(id, evalue) {
      const params = {};
      params.method = "YuqingProperty";
      params.timestamp = +new Date();
      params.yuqing_id = id;
      params.property = evalue;
      params.sign = md5(params.method + params.timestamp);
      YuqingProperty(params).then(response => {
        this.$notify({
          title: "提示",
          message: "修改成功",
          type: "success",
          duration: 1500
        });
      });
      this.getList();
    },

    // 修改评论调性
    changeCommnetEvaluation(id, evalue) {
      const params = {};
      params.method = "CommentsProperty";
      params.timestamp = +new Date();
      params.comments_id = id;
      params.property = evalue;
      params.sign = md5(params.method + params.timestamp);
      CommentsProperty(params).then(response => {
        this.$notify({
          title: "提示",
          message: "修改成功",
          type: "success",
          duration: 1500
        });
      });
      this.getCommentList();
    },

    sortChange(data) {
      if (data.prop === "likeNum") {
        this.sort = data.order === "ascending" ? 2 : 1;
        this.listQuery.ordertype = "3," + this.sort;
      }

      if (data.prop === "commentNum") {
        this.sort = data.order === "ascending" ? 2 : 1;
        this.listQuery.ordertype = "4," + this.sort;
      }

      if (data.prop === "zhuanNum") {
        this.sort = data.order === "ascending" ? 2 : 1;
        this.listQuery.ordertype = "5," + this.sort;
      }

      if (data.prop === "releaseTime") {
        this.sort = data.order === "ascending" ? 2 : 1;
        this.listQuery.ordertype = "2," + this.sort;
        this.getList();
      }
      this.getList();
    }
  }
};
</script>

<style scoped>
.text-emphasize {
  color: red;
}

.overflow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
