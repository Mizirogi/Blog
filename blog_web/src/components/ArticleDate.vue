<!--
 * @Description: 
 * @Author: Li
 * @Date: 2019-11-08 16:19:51
 * @LastEditors: Li
 * @LastEditTime: 2019-11-08 16:31:41
 -->
<template>
  <div class="date">
    <div class="day lg">{{day}}</div>
    <div class="my">
      <div>
        <div class="month">{{month}}</div>
        <div class="year">{{year}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "articledate",
  props: ["date"],
  data() {
    return {
      month: "",
      day: "",
      year: ""
    };
  },
  methods: {
    timeFormat() {
      let time = new Date(this.date);
      this.year = time.getFullYear();
      this.day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
      this.month = new Date("2018/1/13").toDateString().split(" ")[1];
    }
  },

  created() {
    this.timeFormat();
  }
};
</script>

<style scoped>
.date {
  display: flex;
  width: 80px;
  font-size: 13px;
  color: #b2b6b0;
}
.day {
  margin-right: 3px;
  font-size: 42px;
  background-image: linear-gradient(90deg, #4ebbaa, #6bc30d);
  background-clip: text;
  color: transparent;
}
.month {
  display: block;
  text-transform: uppercase;
}
.my {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
