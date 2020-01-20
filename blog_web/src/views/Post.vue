<!--
 * @Description: 
 * @Author: Li
 * @Date: 2019-11-04 20:11:26
 * @LastEditors: Li
 * @LastEditTime: 2019-11-07 17:19:49
 -->
<template>
  <div>
    <el-form
      :inline="true"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-form-inline"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="ruleForm.title" placeholder="文章标题"></el-input>
      </el-form-item>
      <el-form-item label="类别" prop="categoryId">
        <el-select v-model="ruleForm.categoryId" placeholder="文章分类">
          <el-option v-for="(item,i) in selectData" :label="item.name" :value="item.id" :key="i"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="tag">
        <el-input v-model="ruleForm.tag" placeholder="文章标签"></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="introduction">
        <el-input type="textarea" v-model="ruleForm.introduction" placeholder="文章简介"></el-input>
      </el-form-item>
    </el-form>
    <mavon-editor :ishljs="true" v-model="value" @save="submitForm" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      ruleForm: {
        title: "",
        categoryId: "",
        tag: "",
        introduction: ""
      },
      rules: {
        title: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        categoryId: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        tag: [
          {
            type: "string",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        introduction: [
          {
            type: "string",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ]
      },
      selectData: []
    };
  },
  mounted() {
    this.getCategory("Li2");
		this.sendHeader();
  },
  methods: {
    sendHeader(){
			 //func: 是父组件指定的传数据绑定的函数，this.msg:子组件给父组件传递的数据
             this.$emit('func',this.$route.name)
         },
    getCategory(author) {
      let params = {
        author: author
      };
      this.$api.article.getCategory(params).then(res => {
        console.log(res.data);
        this.selectData = res.data.data;
      });
    },
    submitForm(val, render) {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
			this.open(val)
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    save(val, render) {
      this.submitForm("ruleForm");
    },
    open(val) {
      this.$confirm("确认要提交此文章么", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          let params = {
            ...this.ruleForm,
            content: val,
            author: "Li2"
          };
          this.$api.article.create(params).then(res => {
            console.log(res.data);
          });
          console.log(val);
          this.$message({
            type: "success",
            message: "发表成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发表"
          });
        });
    }
  }
};
</script>

<style></style>
