<template>
  <el-container class="content-wrappr">
    <el-aside width="240px" class="aside-wrapper">
      <el-input placeholder="输入角色名称或编码进行过滤" v-model="roleFilter" size="small" class="small-bottom-interval"></el-input>
      <el-button-group class="line-wrapper">
        <el-button type="primary" size="mini" class="col-wrapper" @click="handleEditor">新增角色</el-button>
        <el-button type="primary" size="mini" class="col-wrapper" @click="handleRefresh" :loading="loading">刷新</el-button>
      </el-button-group>
      <el-tree class="filter-tree" :data="roles" :props="{ children: 'subRoleList', label: 'roleName'}" default-expand-all :filter-node-method="handleRoleFilter" ref="roleTree" :expand-on-click-node="false">
        <span slot-scope="{ node, data }" class="node-wrapper" @click="handleRoleSelect(data)">
          <el-tooltip effect="dark" :content="data.roleCode" placement="top">
            <div>
              <i v-if="data.admin" class="el-icon-star-on" style="color: orange"></i>
              <span>{{node.label}}</span>
            </div>
          </el-tooltip>
          <span>
            <el-popover placement="bottom-start">
              <ul>
                <li><el-button type="text" size="mini" style="width: 100%; text-align: start;" @click="handleEditor('create', data)">新增子角色</el-button></li>
                <li><el-button type="text" size="mini" style="width: 100%; text-align: start;" @click="handleEditor('update', data)">编辑</el-button></li>
                <li>
                  <el-popconfirm :title="'确定要删除角色 ' + data.roleName + ' 及其子角色吗？'" @confirm="handleDelete(data)">
                    <el-button slot="reference" type="text" size="mini" style="width: 100%; text-align: start;" :loading="editor.role.loading">删除</el-button>
                  </el-popconfirm>
                </li>
              </ul>
              <el-button slot="reference" type="text" @click.stop>操作</el-button>
            </el-popover>
          </span>
        </span>
      </el-tree>
    </el-aside>
    <el-main>
      <el-tabs v-if="editor.activeRoleId" type="border-card">
        <el-tab-pane label="角色分配用户">
          <el-row :gutter="12">
            <el-col :span="2" class="lable-wrapper">
              <label class="title" for="username">用户名称：</label>
            </el-col>
            <el-col :span="4" class="input-wrapper">
              <el-input size="small" clearable placeholder="请输入用户名..." v-model="editor.roleUser.condition.username" name="username"></el-input>
            </el-col>
            <el-col :span="2" class="lable-wrapper">
              <label class="title" for="email">邮箱：</label>
            </el-col>
            <el-col :span="4" class="input-wrapper">
              <el-input size="small" clearable placeholder="请输入邮箱..." v-model="editor.roleUser.condition.email" name="email"></el-input>
            </el-col>
            <el-col :span="4" class="button-wrapper">
              <el-button-group>
                <el-button size="small" icon="el-icon-delete" @click="handleRoleUserConditionReset">重置</el-button>
                <el-button type="primary" size="small" icon="el-icon-search" @click="handleRoleUserQueryAndResetPage">查询</el-button>
              </el-button-group>
            </el-col>
          </el-row>
          <el-row class="main-wrapper">
            <el-col :span="24" class="sub-wrapper">
              <el-button type="primary" size="small" icon="el-icon-plus" @click="handleRoleUserEditor">分配用户</el-button>
            </el-col>
            <el-col :span="24" class="sub-wrapper">
              <el-table :data="editor.roleUser.values"  row-key="roleUserId" style="width: 100%" border size="small" v-loading="editor.roleUser.loading" :row-style="{height: '0'}">
                <el-table-column prop="user.username" label="用户名称" width="200"></el-table-column>
                <el-table-column prop="user.nickname" label="用户昵称"></el-table-column>
                <el-table-column prop="user.email" label="邮箱" width="320"></el-table-column>
                <el-table-column prop="user.avatarUrl" label="用户头像" width="120">
                  <template slot-scope="scope">
                    <el-avatar size="small" :src="scope.row.user.avatarUrl"></el-avatar>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button @click="handleRoleUserDelete(scope.row)" type="text" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :offset="1" :span="22" class="pagination-wrapper">
              <el-pagination
                :current-page="editor.roleUser.pagable.page"
                :page-size="editor.roleUser.pagable.size"
                :total="editor.roleUser.pagable.total"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, jumper, prev, pager, next"
                @size-change="handleRoleUserSizeChange"
                @current-change="handleRoleUserPageChange"
                @prev-click="handleRoleUserPageChange"
                @next-click="handleRoleUserPageChange">
              </el-pagination>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="角色分配菜单"></el-tab-pane>
      </el-tabs>
    </el-main>
    <el-dialog :title="(editor.role.value.roleId ? '编辑' : '新建') + '角色'" :visible.sync="editor.role.visable" width="30%">
      <el-form :model="editor.role.value" :rules="editor.role.rules" label-width="80px" size="medium" class="form-wrapper" ref="editor">
        <el-form-item v-if="editor.role.value.parentId" label="父级角色" prop="parentName">
          <el-input v-model="editor.role.value.parentName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="editor.role.value.roleCode" :disabled="Boolean(editor.role.value.roleId)"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editor.role.value.roleName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="medium" @click="handleEditorClose">取 消</el-button>
        <el-button size="medium" type="primary" @click="handleEditorClose('save')" :loading="editor.role.loading">确 定</el-button>
      </div>
    </el-dialog>
    <table-selector title="选择用户"
      :visable="editor.roleUser.visable"
      :conditions="editor.roleUser.conditions"
      @closed="handleRoleUserEditorClosed"
      @confirm="handleRoleUserEditorConfirm"
      rowKey="userId"
      :rows="editor.roleUser.rows"
      :url="roleUserUrl"></table-selector>
  </el-container>
</template>

<script>
import ValueUtils from '@util/ValueUtils'
import RequestUtils from '@util/RequestUtils'
import TableSelector from '../../../../components/widget/TableSelector.vue'
export default {
  components: { TableSelector },
  name: 'role-management',
  data () {
    return {
      roleFilter: '',
      loading: false,
      roles: [],
      editor: {
        role: {
          visable: false,
          loading: false,
          value: {
            roleCode: '',
            roleName: '',
            parentId: 0,
            parentName: ''
          },
          rules: {
            roleCode: [
              { required: true, message: '请输入角色编码', trigger: 'blur' },
              { pattern: /^[A-Z0-9\\._-]+$/, message: '角色编码仅允许大写字母、数字、英文句号、下划线以及中划线', trigger: 'change' },
              { min: 4, max: 32, message: '角色编码长度必须在 4 到 32 之间', trigger: 'blur' }
            ],
            roleName: [
              { required: true, message: '请输入角色名称', trigger: 'blur' },
              { min: 2, max: 32, message: '角色名称长度必须在 2 到 32 之间', trigger: 'blur' }
            ]
          }
        },
        activeRoleId: null,
        roleUser: {
          condition: {
            username: '',
            email: ''
          },
          values: [],
          loading: false,
          pagable: {
            page: 1,
            size: 10,
            total: 0,
            sort: {}
          },
          visable: false,
          conditions: [{
            code: 'username',
            name: '用户名'
          }, {
            code: 'email',
            name: '邮箱'
          }, {
            code: 'nickname',
            name: '昵称'
          }],
          rows: [{
            code: 'username',
            name: '用户名',
            sortable: true,
            width: 140
          }, {
            code: 'nickname',
            name: '昵称'
          }, {
            code: 'email',
            name: '邮箱',
            width: 280
          }]
        }
      }
    }
  },
  methods: {
    // role
    handleEditor (action, role) {
      if (action === 'create') {
        this.editor.role.value.parentId = role.roleId
        this.editor.role.value.parentName = role.roleName
      } else if (action === 'update') {
        ValueUtils.copy(role, this.editor.role.value)
      }
      this.editor.role.visable = true
    },
    handleEditorClose (action) {
      if (action) {
        this.$refs.editor.validate((valid) => {
          if (valid) {
            let editor = this.editor
            editor.role.loading = true
            this.$axios.request({
              url: this.editor.role.value.roleId ? ('/api/role/' + this.editor.role.value.roleId) : '/api/role',
              method: this.editor.role.value.roleId ? 'put' : 'post',
              data: this.editor.role.value
            }).then(_ => {
              this.handleEditorClose()
              this.loadRole()
            }).catch(function () {
              editor.role.loading = false
            })
          }
        })
      }
      this.editor.role.visable = false
      this.editor.role.loading = false
      ValueUtils.clear(this.editor.role.value)
    },
    handleDelete (role) {
      this.editor.role.loading = true
      this.$axios.delete('/api/role/' + role.roleId)
        .then(_ => this.loadRole())
    },
    handleRefresh () {
      this.loadRole()
    },
    handleRoleFilter (value, data) {
      if (!value) {
        return true
      }
      return data.roleName.indexOf(value) !== -1 || data.roleCode.indexOf(value) !== -1
    },
    handleRoleSelect (role) {
      this.editor.activeRoleId = role.roleId
      this.loadRoleUser()
    },
    // role user
    handleRoleUserConditionReset () {
      ValueUtils.clear(this.editor.roleUser.condition)
    },
    handleRoleUserQueryAndResetPage () {
      this.editor.roleUser.loading = true
      this.editor.roleUser.pagable.page = 1
      this.loadRoleUser()
    },
    handleRoleUserDelete (roleUser) {
      this.editor.roleUser.loading = true
      this.$axios.delete('/api/role/user/' + roleUser.roleUserId)
        .then(_ => {
          this.loadRoleUser()
        })
    },
    handleRoleUserSizeChange (size) {
      this.editor.roleUser.pagable.size = size
      this.handleRoleUserQueryAndResetPage()
    },
    handleRoleUserPageChange (page) {
      this.editor.roleUser.pagable.page = page
      this.editor.roleUser.loading = true
      this.loadRoleUser()
    },
    handleRoleUserEditor () {
      this.editor.roleUser.visable = true
    },
    handleRoleUserEditorClosed () {
      this.editor.roleUser.visable = false
    },
    handleRoleUserEditorConfirm (users) {
      if (Array.isArray(users) && users.length > 0) {
        this.editor.roleUser.loading = true
        this.$axios.post('/api/role/' + this.editor.activeRoleId + '/user', users)
          .then(_ => {
            this.loadRoleUser()
          })
      }
    },
    // data
    handleRoleTree (response) {
      this.roles = response.data
      this.loading = false
    },
    handleRoleUser (response) {
      this.editor.roleUser.values = response.data.records
      this.editor.roleUser.pagable.total = response.data.total
      this.editor.roleUser.pagable.size = response.data.size
      this.editor.roleUser.loading = false
    },
    // request
    loadRole () {
      this.$axios.get('/api/role/tree')
        .then(this.handleRoleTree)
    },
    loadRoleUser () {
      this.$axios.get('/api/role/' + this.editor.activeRoleId + '/user' + RequestUtils.buildQuery(this.editor.roleUser.condition, this.editor.roleUser.pagable))
        .then(this.handleRoleUser)
    }
  },
  watch: {
    roleFilter (val) {
      this.$refs.roleTree.filter(val)
    }
  },
  computed: {
    roleUserUrl () {
      return '/api/user?withoutRoleId=' + this.editor.activeRoleId
    }
  },
  mounted () {
    this.loading = true
    this.loadRole()
  }
}
</script>

<style lang="stylus" scoped>
  .content-wrappr
    height 100%
    .line-wrapper
      width 100%
      margin-bottom 8px
      .col-wrapper
        width 50%
    .aside-wrapper
      height 100%
      padding-right 12px
      border-right-style: solid
      border-right-color: #cccccc
      border-right-width: 1px
      .node-wrapper
        flex: 1
        display: flex
        align-items: center
        justify-content: space-between
        font-size: 14px
        padding-right: 8px
    .title
      font-size 15px
</style>
