<!--
 * @Description:
 * @Author: Li
 * @Date: 2019-11-18 16:36:14
 * @LastEditors: Li
 * @LastEditTime: 2019-11-20 12:49:26
 -->
<template>
  <div class="select">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="主关键词">
        <el-row type="flex" class="row-bg" justify="space-between">
          <span>{{ form.keyword }}</span>
          <el-button @click="dialogKeywordForm = true">更多</el-button>
        </el-row>
      </el-form-item>
      <el-form-item label="对比关键词">
        <el-row type="flex" class="row-bg" justify="space-between">
          <span>{{ form.keyword }}</span>
          <el-button @click="dialogCompKeyword = true">更多</el-button>
        </el-row>
      </el-form-item>
      <el-form-item label="媒体类型">
        <el-checkbox-group v-model="form.type">
          <el-checkbox-button label="全部" name="type" />
          <el-checkbox-button label="传统网站" name="type" />
          <el-checkbox-button label="自媒体" name="type" />
          <el-checkbox-button label="问答类媒体" name="type" />
          <el-checkbox-button label="短视频类媒体" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="时间选择">
        <el-col :span="5">
          <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-col>
        <el-col :span="1" style="text-align:center">至</el-col>
        <el-col :span="5">
          <el-date-picker v-model="form.date2" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item label="文章调性">
        <el-checkbox-group v-model="form.character">
          <el-checkbox-button label="全部" name="character" />
          <el-checkbox-button label="传统网站" name="character" />
          <el-checkbox-button label="自媒体" name="character" />
          <el-checkbox-button label="问答类媒体" name="character" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="收货地址" :visible.sync="dialogKeywordForm">
      <el-form :model="form">
        <el-checkbox v-model="checkAll" :indeterminate="fIsIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;" />
        <el-checkbox-group v-model="cars" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="car in carOptions" :key="car" :label="car">{{ car }}</el-checkbox>
        </el-checkbox-group>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogKeywordForm = false">取 消</el-button>
        <el-button type="primary" @click="dialogKeywordForm = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="收货地址" :visible.sync="dialogCompKeyword">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="500">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="活动区域" :label-width="500">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCompKeyword = false">取 消</el-button>
        <el-button type="primary" @click="dialogCompKeyword = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Select',
  data() {
    return {
      form: {
        keyword: '请选择',
        comparKeyword: '',
        date1: '',
        date2: '',
        type: [],
        character: []
      },
      cars: [],
      dialogKeywordForm: false,
      carOptions: ['1', '2', '3', '4'],
      checkAll: false,
      fIsIndeterminate: true,
      dialogCompKeyword: false,
      sIsIndeterminate: true
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    handleCheckAllChange(val) {
      this.cars = val ? this.carOptions : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.cityOptions.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cityOptions.length
    }
  }
}
</script>
<style scoped>
.select {
  background: #ffffff;
  width: 1000px;
  padding: 10px;
}
</style>
