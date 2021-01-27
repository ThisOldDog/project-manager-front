<template>
  <el-container class="content-wrappr">
    <el-aside width="240px" class="aside-wrapper">
      <el-input placeholder="输入角色名称或编码进行过滤" v-model="roleFilter" size="small" class="small-bottom-interval"></el-input>
      <el-button-group class="line-wrapper">
        <el-button type="primary" size="mini" class="col-wrapper" @click="handleEditor">新增角色</el-button>
        <el-button type="primary" size="mini" class="col-wrapper" @click="handleRefresh" :loading="loading">刷新</el-button>
      </el-button-group>
      <el-tree class="filter-tree" :data="roles" :props="{ children: 'subRoleList', label: 'roleName'}" default-expand-all :filter-node-method="handleRoleFilter" ref="roleTree" :expand-on-click-node="false">
        <span slot-scope="{ node, data }" class="node-wrapper">
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
                    <el-button slot="reference" type="text" size="mini" style="width: 100%; text-align: start;" :loading="editor.loading">删除</el-button>
                  </el-popconfirm>
                </li>
              </ul>
              <el-button slot="reference" type="text">操作</el-button>
            </el-popover>
          </span>
        </span>
      </el-tree>
    </el-aside>
    <el-dialog :title="(editor.value.roleId ? '编辑' : '新建') + '角色'" :visible.sync="editor.visable" width="30%">
      <el-form :model="editor.value" :rules="editor.rules" label-width="80px" size="medium" class="form-wrapper" ref="editor">
        <el-form-item v-if="editor.value.parentId" label="父级角色" prop="parentName">
          <el-input v-model="editor.value.parentName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="editor.value.roleCode" :disabled="Boolean(editor.value.roleId)"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editor.value.roleName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="medium" @click="handleEditorClose">取 消</el-button>
        <el-button size="medium" type="primary" @click="handleEditorClose('save')" :loading="editor.loading">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import ValueUtils from '@util/ValueUtils'
export default {
  name: 'role-management',
  data () {
    return {
      roleFilter: '',
      loading: false,
      editor: {
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
      roles: []
    }
  },
  methods: {
    handleEditor (action, role) {
      if (action === 'create') {
        this.editor.value.parentId = role.roleId
        this.editor.value.parentName = role.roleName
      } else if (action === 'update') {
        ValueUtils.copy(role, this.editor.value)
      }
      this.editor.visable = true
    },
    handleEditorClose (action) {
      if (action) {
        this.$refs.editor.validate((valid) => {
          if (valid) {
            let editor = this.editor
            editor.loading = true
            this.$axios.request({
              url: this.editor.value.roleId ? ('/api/role/' + this.editor.value.roleId) : '/api/role',
              method: this.editor.value.roleId ? 'put' : 'post',
              data: this.editor.value
            }).then(_ => {
              this.handleEditorClose()
              this.loadRole()
            }).catch(function () {
              editor.loading = false
            })
          }
        })
      }
      this.editor.visable = false
      this.editor.loading = false
      ValueUtils.clear(this.editor.value)
    },
    handleDelete (role) {
      this.editor.loading = true
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
    handleRoleTree (response) {
      this.roles = response.data
      this.loading = false
    },
    loadRole () {
      this.$axios.get('/api/role/tree')
        .then(this.handleRoleTree)
    }
  },
  watch: {
    roleFilter (val) {
      this.$refs.roleTree.filter(val)
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
</style>
