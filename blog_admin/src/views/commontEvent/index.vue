<template>
  <div class="app-container">
    <EventTotalView />
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane label="文章" name="article">
        <keep-alive>
          <commentResult />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="视频" name="video">
        <keep-alive>
          <commentVideoResult />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import EventTotalView from './components/EventTotalView'
import commentResult from './components/commentResult'
import commentVideoResult from './components/commentVideoResult'

export default {
  name: 'CommontEvent',
  components: { EventTotalView, commentResult, commentVideoResult },
  data() {
    return {
      tabMapOptions: [
        { label: '文章', key: 'article' },
        { label: '视频', key: 'video' }
      ],
      activeName: 'article'
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
  }
}
</script>
<style scoped>
</style>
