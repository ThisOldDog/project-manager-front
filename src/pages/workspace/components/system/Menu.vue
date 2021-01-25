<template>
  <div>
    <el-row :gutter="12">
      <el-col :offset="1" :span="2" class="lable-wrapper">
        <label class="title" for="menuCode">菜单编码：</label>
      </el-col>
      <el-col :span="4" class="input-wrapper">
        <el-input size="medium" clearable placeholder="请输入菜单编码..." v-model="condition.menuCode" name="menuCode"></el-input>
      </el-col>
      <el-col :span="2" class="lable-wrapper">
        <label class="title" for="menuName">菜单名称：</label>
      </el-col>
      <el-col :span="4" class="input-wrapper">
        <el-input size="medium" clearable placeholder="请输入菜单名称..." v-model="condition.menuName" name="menuName"></el-input>
      </el-col>
      <el-col :span="2" class="lable-wrapper">
        <label class="title" for="pageRoute">页面路由：</label>
      </el-col>
      <el-col :span="4" class="input-wrapper">
        <el-input size="medium" clearable placeholder="请输入页面路由..." v-model="condition.pageRoute" name="pageRoute"></el-input>
      </el-col>
      <el-col :span="4" class="button-wrapper">
        <el-button-group>
          <el-button size="medium" icon="el-icon-delete" @click="handleConditionReset">重置</el-button>
          <el-button type="primary" size="medium" icon="el-icon-search" @click="handleQuery">查询</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row class="main-wrapper">
      <el-col :offset="1" :span="22" class="sub-wrapper">
        <el-button-group>
          <el-button size="small" icon="el-icon-caret-bottom" @click="handleUnfold">全部展开</el-button>
          <el-button size="small" icon="el-icon-caret-top" @click="handleFold">全部收起</el-button>
        </el-button-group>
        <el-button type="primary" size="small" icon="el-icon-search" @click="handleEditor">新建菜单</el-button>
      </el-col>
      <el-col :offset="1" :span="22">
        <el-table ref="table" :data="menus" row-key="menuId"  style="width: 100%;" border size="small" default-expand-all :tree-props="{children: 'subMenuList'}" v-loading="loading">
          <el-table-column prop="menuCode" label="菜单编码" width="280"></el-table-column>
          <el-table-column prop="menuName" label="菜单名称" width="220"></el-table-column>
          <el-table-column prop="menuIcon" label="菜单图标" width="120">
            <template slot-scope="scope">
              <i :class="scope.row.menuIcon"></i>
            </template>
          </el-table-column>
          <el-table-column prop="sortNumber" label="菜单顺序" width="120">
            <template slot-scope="scope">
              <el-tag>{{scope.row.sortNumber}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="menuType" label="菜单类型" width="180">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.menuType === 'DIRECTORY'" type="info">目录</el-tag>
              <el-tag v-else>菜单</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="pageRoute" label="页面路由"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button v-if="scope.row.menuType === 'DIRECTORY'" @click="handleEditor(scope.row)" type="text" size="small">新建子菜单</el-button>
              <el-button @click="handleEditor(scope.row, 'update')" type="text" size="small">编辑</el-button>
              <el-popconfirm :title="'确定要删除菜单 ' + scope.row.menuName + ' 及其子菜单吗？'" @confirm="handleDelete(scope.row)">
                <el-button slot="reference" type="text" size="small">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-drawer title="新建菜单" :visible.sync="editor.visible" direction="rtl" label-width="80px" :before-close="handleEditorCloseWithButtonAction">
      <el-divider></el-divider>
      <el-form :model="editor.value" :rules="editor.rules" label-width="80px" size="medium" class="form-wrapper" ref="editor">
        <div class="form-body">
          <el-form-item v-if="editor.value.parentId" label="上级菜单" prop="parentName">
            <el-input v-model="editor.value.parentName" disabled></el-input>
          </el-form-item>
          <el-form-item label="菜单编码" prop="menuCode">
            <el-input v-model="editor.value.menuCode" :disabled="Boolean(editor.value.menuId)"></el-input>
          </el-form-item>
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="editor.value.menuName"></el-input>
          </el-form-item>
          <el-form-item label="菜单图标" prop="menuIcon">
            <el-select v-model="editor.value.menuIcon" filterable placeholder="请选择图标">
              <template slot="prefix">
                <i v-if="editor.value.menuIcon" :class="editor.value.menuIcon" style="margin-start: 8px;"></i>
              </template>
              <el-option v-for="icon in icons" :key="icon" :label="icon" :value="icon">
                <i :class="icon" style="margin-end: 8px;"></i>{{icon}}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单顺序" prop="sortNumber">
            <el-input-number size="medium" controls-position="right" v-model="editor.value.sortNumber" :min="-2147483648" :max="2147483647" label="菜单顺序" :step="10" :precision="0"></el-input-number>
          </el-form-item>
          <el-form-item label="菜单类型" prop="menuType">
            <el-select v-model="editor.value.menuType" filterable placeholder="请选择类型" :disabled="Boolean(editor.value.menuId)">
              <el-option v-for="menuType in menuTypes" :key="menuType.value" :label="menuType.meaning" :value="menuType.value">
                {{menuType.meaning}}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="pageRouteRequire" label="页面路由" prop="pageRoute">
            <el-input v-model="editor.value.pageRoute"></el-input>
          </el-form-item>
        </div>
        <el-divider></el-divider>
        <div class="form-footer">
          <el-button type="primary" size="small" @click="handleEditorSubmit(editor.value)" :loading="editor.loading">保 存</el-button>
          <el-button size="small" @click="handleEditorClose" :loading="editor.loading">取 消</el-button>
        </div>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import RequestUtils from '@util/RequestUtils'
import ValueUtils from '@util/ValueUtils'
import Icon from '@constant/Icon'
import MenuType from '@constant/MenuType'
export default {
  name: 'menu-management',
  data () {
    return {
      condition: {
        menuCode: '',
        menuName: '',
        pageRoute: ''
      },
      visible: {
        editor: false
      },
      menus: [],
      loading: false,
      editor: {
        visible: false,
        loading: false,
        value: {
          menuCode: '',
          menuName: '',
          menuIcon: '',
          sortNumber: 0,
          menuType: '',
          parentId: 0,
          parentName: '',
          pageRoute: null
        },
        rules: {
          menuCode: [
            { required: true, message: '请输入菜单编码', trigger: 'blur' },
            { pattern: /^[A-Z0-9\\._-]+$/, message: '菜单编码仅允许大写字母、数字、英文句号、下划线以及中划线', trigger: 'change' },
            { min: 4, max: 32, message: '菜单编码长度必须在 4 到 32 之间', trigger: 'blur' }
          ],
          menuName: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
            { min: 2, max: 32, message: '菜单名称长度必须在 2 到 32 之间', trigger: 'blur' }
          ],
          menuIcon: [
            { required: true, message: '请选择菜单图标', trigger: 'blur' }
          ],
          sortNumber: [
            { required: true, message: '请输入菜单顺序', trigger: 'blur' }
          ],
          menuType: [
            { required: true, message: '请选择菜单类型', trigger: 'blur' }
          ],
          pageRoute: [
            { required: false, message: '请输入页面路由', trigger: 'blur' }
          ]
        }
      },
      icons: Icon.values,
      menuTypes: MenuType.values
    }
  },
  methods: {
    handleConditionReset () {
      ValueUtils.clear(this.condition)
    },
    handleQuery () {
      this.loading = true
      this.loadMenu()
    },
    handleUnfold () {
      this.handleRow(this.menus, true)
    },
    handleFold () {
      this.handleRow(this.menus, false)
    },
    handleRow (menus, unfold) {
      menus.forEach(menu => {
        if (menu.subMenuList && menu.subMenuList.length > 0) {
          this.$refs.table.toggleRowExpansion(menu, unfold)
          this.handleRow(menu.subMenuList, unfold)
        }
      })
    },
    handleEditor (menu, mode) {
      if (!mode || mode === 'create') {
        if (menu.menuId && menu.menuName) {
          this.editor.value.parentId = menu.menuId
          this.editor.value.parentName = menu.menuName
        }
      } else if (mode === 'update') {
        ValueUtils.copy(menu, this.editor.value)
      }
      this.editor.visible = true
    },
    handleEditorClose () {
      this.editor.visible = false
      this.editor.loading = false
      ValueUtils.clear(this.editor.value)
    },
    handleEditorCloseWithButtonAction () {
      if (this.editor.loading) {
        return
      }
      this.$confirm('确定要推出编辑模式吗？未提交的内容会丢失!')
        .then(_ => {
          this.handleEditorClose()
        })
        .catch(_ => {})
    },
    handleEditorSubmit (menu) {
      this.$refs.editor.validate((valid) => {
        if (valid) {
          let editor = this.editor
          editor.loading = true
          this.$axios.request({
            url: menu.menuId ? ('/api/menu/' + menu.menuId) : '/api/menu',
            method: menu.menuId ? 'put' : 'post',
            data: menu
          }).then(_ => {
            this.handleEditorClose()
            this.loadMenu()
          }).catch(function () {
            editor.loading = false
          })
        }
      })
    },
    handleDelete (menu) {
      this.loading = true
      this.$axios.delete('/api/menu/' + menu.menuId)
        .then(_ => this.loadMenu())
    },
    handleMenuTree (response) {
      this.menus = response.data
      this.loading = false
    },
    loadMenu () {
      this.$axios.get('/api/menu/tree' + RequestUtils.buildQuery(this.condition))
        .then(this.handleMenuTree)
    }
  },
  computed: {
    pageRouteRequire () {
      return this.editor.value.menuType === 'PAGE'
    }
  },
  watch: {
    pageRouteRequire (isPageRouteRequire) {
      this.rules.pageRoute[0].required = isPageRouteRequire
    }
  },
  mounted () {
    this.loading = true
    this.loadMenu()
  }
}
</script>

<style lang="stylus" scoped>
  /deep/ :focus
    outline: 0
  .el-divider--horizontal
    display: block
    height: 1px
    width: 100%
    margin: 0
</style>
