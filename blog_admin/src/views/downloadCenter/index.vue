<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="下载时间">
        <template slot-scope="{row}">
          <span>{{ row.downTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="筛选条件" min-width="200">
        <template slot-scope="{row}">
          <span>{{ row.filter }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center"  label="下载次数">
        <template slot-scope="{row}">
          <!--<svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />-->
          <span>{{ row.downCount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="100">
        <template slot-scope="{row}">
          <el-button
            type="success"
            size="small"
            icon="el-icon-download"
            @click="confirmDownload(row)"
          >
            下载
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-remove"
            @click="confirmDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import { fetchList } from '@/api/article'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
  name: 'InlineEditTable',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      testList: [
        {
          id: '1',
          downTime: Date.now(),
          filter: '时间为：2018-10-29 17:18_2018-12-12 17:18',
          downCount: 15
        },
        {
          id: '2',
          downTime: Date.now(),
          filter: '时间为：2018-10-29 17:18_2018-12-12 17:18',
          downCount: 25
        },
        {
          id: '3',
          downTime: Date.now(),
          filter: '时间为：2018-10-29 17:18_2018-12-12 17:18',
          downCount: 35
        },
        {
          id: '4',
          downTime: Date.now(),
          filter: '时间为：2018-10-29 17:18_2018-12-12 17:18',
          downCount: 55
        },
        {
          id: '5',
          downTime: Date.now(),
          filter: '时间为：2018-10-29 17:18_2018-12-12 17:18',
          downCount: 115
        },
        {
          id: '6',
          downTime: Date.now(),
          filter: '时间为：2018-10-29 17:18_2018-12-12 17:18',
          downCount: 77
        },
        {
          id: '7',
          downTime: Date.now(),
          filter: '时间为：2018-10-29 17:18_2018-12-12 17:18',
          downCount: 25
        },
        {
          id: '8',
          downTime: Date.now(),
          filter: '时间为：2018-10-29 17:18_2018-12-12 17:18',
          downCount: 35
        }
      ],
      total: 8,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      // const { data } = await fetchList(this.listQuery)
      // const items = data.items
      // this.total = data.total
      // this.list = items.map(v => {
      //   this.$set(v, 'edit', false)
      //   v.originalTitle = v.title
      //   return v
      // })
      this.list = this.testList
      this.listLoading = false
    },
    confirmDownload(row) {
      console.log(row)
      // row.title = row.originalTitle
      // row.edit = false
      // this.$message({
      //   message: 'The title has been restored to the original value',
      //   type: 'warning'
      // })
    },
    confirmDelete(row) {
      console.log(row)
    }
  }
}
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
