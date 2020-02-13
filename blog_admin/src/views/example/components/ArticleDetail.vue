<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+ postForm.status">
        <el-button
          v-loading="loading"
          style="margin-left: 10px;"
          type="success"
          @click="isEdit?submitUpdateForm():submitForm()"
        >发布</el-button>
        
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <div class="postInfo-container">
            <el-row>
              <el-col :span="8">
                <el-form-item style="margin-bottom: 25px;" prop="title">
                  <el-input v-model="postForm.title" :maxlength="100" name="name" required>
                    <template slot="prepend">标题</template>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item label-width="120px" label="分类选择:" class="postInfo-container-item">
                  <el-select
                    v-model="postForm.categories"
                    multiple
                    collapse-tags
                    style="margin-left: 20px;"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in categories"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label-width="90px" class="postInfo-container-item">
                  <el-switch   
                    v-model="postForm.status"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="Draft"
                    inactive-value="Published"
                    active-text="存入草稿"
                    inactive-text="直接发布"
                  ></el-switch>
                  <!-- <el-rate
                      v-model="postForm.importance"
                      :max="3"
                      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      :low-threshold="1"
                      :high-threshold="3"
                      style="display:inline-block"
                  />-->
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-row>

        <el-form-item style="margin-bottom: 25px;" label-width="50px" label="简介:">
          <el-input
            v-model="postForm.introduction"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="请输入内容"
          />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
        </el-form-item>

        <el-form-item prop="content">
          <MarkdownEditor
            ref="editor"
            v-model="postForm.content"
            style="line-height: normal"
            height="600px"
          />
        </el-form-item>

        <!-- <el-form-item prop="image_uri" style="margin-bottom: 30px;">
          <Upload v-model="postForm.image_uri" />
        </el-form-item>-->
      </div>
    </el-form>
  </div>
</template>

<script>
import MarkdownEditor from "@/components/MarkdownEditor";
import Sticky from "@/components/Sticky"; // 粘性header组件

import { getCategory } from "@/api/category";
import { create, detail, update } from "@/api/article";
import qs from "qs";

const defaultForm = {
  status: "Draft",
  title: "", // 文章题目
  author: "Li2",
  content: "", // 文章内容
  introduction: "", // 文章摘要
  categories: [],
  id: undefined,
  platforms: ["a-platform"],
  comment_disabled: false,
  importance: 0
};

export default {
  name: "ArticleDetail",
  components: { MarkdownEditor, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: rule.field + "为必填项",
          type: "error"
        });
        callback(new Error(rule.field + "为必填项"));
      } else {
        callback();
      }
    };
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }]
      },
      listQuery: {
        page_num: 1,
        page_size: 0,
        author: "Li2"
      },
      categories: []
    };
  },
  computed: {
    contentShortLength() {
      return this.postForm.introduction.length;
    },
  },
  created() {
    this.getCategoryList();
    if (this.isEdit) {
      const id = this.$route.query.id;
      console.log(this.$route.query.id);
      console.log(id);
      this.getDetail(id);
    }

  },
  methods: {
    getDetail(id) {
      console.log(id);
      detail(id)
        .then(response => {
          console.log(response);
          this.postForm = response.data;
          // // just for test
          console.log(this.postForm);
        })
        .catch(err => {
          console.log(err);
        });
    },
    getCategoryList() {
      getCategory(qs.stringify(this.listQuery)).then(response => {
        this.categories = response.data;
      });
    },

    submitForm() {
      console.log(this.postForm);
      this.$refs.postForm.validate(valid => {
        if (valid) {
          create(qs.stringify(this.postForm)).then(response => {
            this.loading = true;
            this.$notify({
              title: "成功",
              message: "发布文章成功",
              type: "success",
              duration: 2000
            });
            this.loading = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitUpdateForm() {
      console.log(this.postForm);
      this.$refs.postForm.validate(valid => {
        if (valid) {
          update(qs.stringify(this.postForm)).then(response => {
            this.loading = true;
            this.$notify({
              title: "成功",
              message: "编辑文章成功",
              type: "success",
              duration: 2000
            });
            this.loading = false;
          });
          this.$router.push({ path: "/articleList/index" });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 15px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
