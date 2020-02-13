<template>
  <div class="app-container">
    <!-- <div class="filter">
      <div style="margin-right:30px;">
        <span>媒体级别：</span>
        <el-select
          v-model="listQuery.level"
          placeholder="全部"
          clearable
          class="filter-item"
          style="width: 90px"
          @change="handleFilter()"
        >
        <el-option key="all" label="全部" :value="null"  />
          <el-option v-for="item in mediaLevel" :key="item.name" :label="item.name" :value="item.value" />
        </el-select>
      </div>
      <div style="margin-right:30px;">
        <span>是否监测媒体：</span>
        <el-select
          v-model="listQuery.article"
          placeholder="全部"
          clearable
          style="width: 90px"
          class="filter-item"
          @change="handleFilter()"
        >
        <el-option key="all" label="全部" :value="null" />
          <el-option label="是" :value="'1'" />
          <el-option label="否" :value="'0'" />
        </el-select>
      </div>
      <div style="margin-right:30px;"> 
        <span>是否监测评论：</span>
        <el-select
          v-model="listQuery.comment"
          placeholder="全部"
          clearable
          style="width: 90px"
          class="filter-item"
          @change="handleFilter()"
        >
        <el-option key="all" label="全部" :value="null" />
          <el-option label="是" :value="'1'" />
          <el-option label="否" :value="'0'" />
        </el-select>
      </div>
      <div style="">
        <span>搜索媒体：</span>
        <el-input
          v-model="listQuery.search"
          placeholder="名称"
          style="width: 120px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          @click="handleFilter"
        >搜索</el-button>
      </div>
    </div>-->

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      stripe
      fit
      highlight-current-row
      border
      style="width: 100%;"
    >
      <el-table-column label="名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="简介" align="center">
        <template slot-scope="{row}">
          <el-popover placement="top-start" width="300" trigger="hover" :content="row.introduction">
            <span
              slot="reference"
              style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
            >{{ row.introduction }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">{{ row.status }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="分类" align="center">
        <template slot-scope="{row}">
          <el-tag v-for="item in row.categories" :key="item.id">{{ item.name }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createdAt }}</span>
        </template>
      </el-table-column>

      <el-table-column label="阅读量" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.browser }}</span>
        </template>
      </el-table-column>
        <!-- <el-table-column label="文章是否显示" width="120px" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.article"
            active-value="1"
            active-color="#13ce66"
            inactive-value="0"
            inactive-color="#ff4949"
            @change="handleSwich(row)"
          />
        </template>
      </el-table-column> -->
     
      <el-table-column
        label="操作"
        align="center"
        width="180px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <router-link :to="'/edit/index?id='+row.id">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link>
          <el-button size="mini" :type="row.status!=='Deleted'?'danger':'info'" @click="deleteArticle(row.id,row.status)">{{row.status!=="Deleted"?'删除':"！删除"}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="params.page_num"
      :limit.sync="params.page_size"
      :scroll-location="110"
      @pagination="getList"
    />

    <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="150px" style="width: 400px; margin-left:50px;">
        <el-form-item label="媒体名称" prop="title">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="媒体域名" prop="domin">
          <span>{{ temp.domain }}</span>
        </el-form-item>
        <el-form-item label="媒体级别" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否监测" prop="timestamp">
          <el-switch
            v-model="temp.switch"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleSwich(row)"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getList, softDelete } from "@/api/article";

import qs from "qs";
export default {
  name: "KeywordAdmin",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        Published: "success",
        Draft: "info",
        Deleted: "danger"
      };
      return statusMap[status];
    }
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

      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,

      temp: {
        method: "MonitorEdit",
        id: undefined,
        comment: undefined,
        article: undefined
      },
      rules: {
        type: [
          { required: true, message: "请输入正确域名", trigger: "change" }
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" }
        ]
      },
      downloadLoading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;

      this.params = {
        author: this.author,
        pageIndex: this.currentPage,
        pageSize: 10,
        keyword: this.keyword
      };

      getList(qs.stringify(this.params)).then(response => {
        this.list = response.data.data;
        this.total = parseInt(response.data.totalCount);
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.params.pageIndex = 1;
      this.getList();
    },
    // 监测开关
    handleSwich(row) {
      const params = {
        method: "MonitorEdit",
        timestamp: +new Date(),
        id: row.id,
        comment: row.comment,
        article: row.article
      };
    },
    deleteArticle(id,status) {
      status==='Deleted'?status='Published':status='Deleted'
      let params = {
        id: id,
        status: status
      };
      softDelete(qs.stringify(params)).then(response => {
        
      });
      this.getList();
    },
    // 全选
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.filter {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
  margin-top: 5px;
}
</style>
