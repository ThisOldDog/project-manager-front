<template>
  <div>
    <el-row :gutter="12">
      <el-col :offset="1" :span="2" class="lable-wrapper">
        <label class="title" for="username">用户名称：</label>
      </el-col>
      <el-col :span="4" class="input-wrapper">
        <el-input size="medium" clearable placeholder="请输入用户名..." v-model="condition.username" name="username"></el-input>
      </el-col>
      <el-col :span="2" class="lable-wrapper">
        <label class="title" for="email">邮箱：</label>
      </el-col>
      <el-col :span="4" class="input-wrapper">
        <el-input size="medium" clearable placeholder="请输入邮箱..." v-model="condition.email" name="email"></el-input>
      </el-col>
      <el-col :span="2" class="lable-wrapper">
        <label class="title" for="admin">仅显示管理员：</label>
      </el-col>
      <el-col :span="4" class="input-wrapper">
        <el-checkbox v-model="condition.admin" name="admin"></el-checkbox>
      </el-col>
      <el-col :span="4" class="button-wrapper">
        <el-button-group>
          <el-button size="medium" icon="el-icon-delete" @click="handleConditionReset">重置</el-button>
          <el-button type="primary" size="medium" icon="el-icon-search" @click="handleQueryAndResetPage">查询</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row class="main-wrapper">
      <el-col :offset="1" :span="22" class="sub-wrapper">
        <el-table :data="users"  row-key="userId" style="width: 100%" border size="small" v-loading="loading" @sort-change="handleSortChange" :row-style="{height: '0'}">
          <el-table-column prop="username" label="用户名称" sortable="custom" width="200"></el-table-column>
          <el-table-column prop="nickname" label="用户昵称"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="320"></el-table-column>
          <el-table-column prop="avatarUrl" label="用户头像" width="120">
            <template slot-scope="scope">
              <el-avatar size="small" :src="scope.row.avatarUrl"></el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="admin" label="是否管理员" sortable="custom" width="200">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.admin" type="success" effect="dark">√</el-tag>
              <el-tag v-else type="info" effect="dark">×</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button v-if="scope.row.admin" @click="handleCancleAdmin(scope.row)" type="text" size="small">取消管理员</el-button>
              <el-button v-else @click="handleAssignAdmin(scope.row)" type="text" size="small">设置为管理员</el-button>
              <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :offset="1" :span="22" class="pagination-wrapper">
        <el-pagination
          :current-page="pagable.page"
          :page-size="pagable.size"
          :total="pagable.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, jumper, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          @prev-click="handlePageChange"
          @next-click="handlePageChange">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import RequestUtils from '@util/RequestUtils'
import ValueUtils from '@util/ValueUtils'
export default {
  name: 'user-management',
  data () {
    return {
      condition: {
        username: '',
        email: '',
        admin: false
      },
      pagable: {
        page: 1,
        size: 10,
        total: 0,
        sort: {}
      },
      loading: false,
      users: []
    }
  },
  methods: {
    handleConditionReset () {
      ValueUtils.clear(this.condition)
    },
    handleQueryAndResetPage () {
      this.loading = true
      this.pagable.page = 1
      this.loadUsers()
    },
    handleQuery () {
      this.loading = true
      this.loadUsers()
    },
    handleCancleAdmin (user) {
      this.loading = true
      this.$axios.put('/api/user/cancel-admin/' + user.userId)
        .then(res => {
          this.loadUsers()
        })
    },
    handleAssignAdmin (user) {
      this.loading = true
      this.$axios.put('/api/user/assign-admin/' + user.userId)
        .then(res => {
          this.loadUsers()
        })
    },
    handleDelete (user) {
      this.loading = true
      this.$axios.delete('/api/user/' + user.userId)
        .then(res => {
          this.loadUsers()
        })
    },
    handleSortChange (column) {
      if (column.prop) {
        // 因为 element-ui 暂不支持多列排序，需要清除之前的排序
        this.pagable.sort = {}
        if (column.order) {
          this.pagable.sort[column.prop] = (column.order === 'ascending' ? 'asc' : 'desc')
        } else {
          this.pagable.sort[column.prop] = null
        }
        this.handleQueryAndResetPage()
      }
    },
    handleSizeChange (size) {
      this.pagable.size = size
      this.handleQueryAndResetPage()
    },
    handlePageChange (page) {
      this.pagable.page = page
      this.handleQuery()
    },
    handleUsers (response) {
      this.users = response.data.records
      this.pagable.total = response.data.total
      this.pagable.size = response.data.size
      this.loading = false
    },
    loadUsers () {
      this.$axios.get('/api/user' + this.buildQuery())
        .then(this.handleUsers)
    },
    buildQuery () {
      return RequestUtils.buildQuery(this.condition, this.pagable)
    }
  },
  mounted () {
    this.loadUsers()
  }
}
</script>

<style lang="stylus" scoped>
</style>
