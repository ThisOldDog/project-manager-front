<template>
  <el-dialog :title="title" :visible.sync="open" :width="width" @closed="handleClosed">
    <el-row v-if="conditionGroupMain.length >= 0" :gutter="12" class="condition-line-wrapper">
      <div v-for="mainCondition of conditionGroupMain" :key="mainCondition.code">
        <el-col :span="2" class="lable-wrapper">
          <label class="title" :for="mainCondition.code">{{mainCondition.name}}</label>
        </el-col>
        <el-col :span="7" class="input-wrapper">
          <el-input size="small" clearable :placeholder="'请输入' + mainCondition.name + '...'" v-model="condition[mainCondition.code]" :name="mainCondition.code"></el-input>
        </el-col>
      </div>
      <el-button-group>
        <el-button size="small" icon="el-icon-delete" @click="handleConditionReset">重置</el-button>
        <el-button type="primary" size="small" icon="el-icon-search" @click="handleQueryAndResetPage">查询</el-button>
      </el-button-group>
    </el-row>
    <el-collapse style="border: none; border-bottom: none;">
      <el-collapse-item title="更多查询条件" name="1" style="border: none; border-bottom: none;">
        <el-row v-for="(conditionGroup, groupIndex) of conditionGroupMinor" :key="groupIndex" :gutter="12" class="condition-line-wrapper">
          <div v-for="conditionItem of conditionGroup" :key="conditionItem.code">
            <el-col :span="2" class="lable-wrapper">
              <label class="title" :for="conditionItem.code">{{conditionItem.name}}</label>
            </el-col>
            <el-col :span="7" class="input-wrapper">
              <el-input size="small" clearable :placeholder="'请输入' + conditionItem.name + '...'" v-model="condition[conditionItem.code]" :name="conditionItem.code"></el-input>
            </el-col>
          </div>
        </el-row>
      </el-collapse-item>
    </el-collapse>
    <el-row class="main-wrapper">
      <el-col :span="24" class="sub-wrapper">
        <el-table :data="values"
          :row-key="rowKey"
          style="width: 100%"
          border size="small"
          v-loading="loading"
          @sort-change="handleSortChange"
          :row-style="{height: '0'}"
          @selection-change="handleSelectionChange"
          @current-change="handleCurrentChange"
          :highlight-current-row="!multiple">
          <el-table-column :type="multiple ? 'selection' : 'index'" width="55"></el-table-column>
          <el-table-column v-for="row of rows" :key="row.code" :prop="row.code" :label="row.name" :sortable="row.sortable ? 'custom' : false" :width="row.width"></el-table-column>
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
    <el-row :offset="1" :span="22" class="pagination-wrapper" style="margin-top: 16px;">
      <el-button-group>
        <el-button size="small" icon="el-icon-close" @click="handleClosed">关闭</el-button>
        <el-button type="primary" size="small" icon="el-icon-check" @click="handleConfirm" :disabled="selects.length === 0">确定</el-button>
      </el-button-group>
    </el-row>
  </el-dialog>
</template>

<script>
import ValueUtils from '@util/ValueUtils'
import RequestUtils from '@util/RequestUtils'
export default {
  name: 'table-selector',
  props: {
    title: {
      type: String,
      required: true
    },
    visable: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '40%'
    },
    conditions: Array,
    numberOfConditionInRow: {
      type: Number,
      default: 2
    },
    rowKey: {
      type: String,
      required: true
    },
    rows: {
      type: Array,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      conditionGroupMain: [],
      conditionGroupMinor: [],
      condition: {},
      values: [],
      open: false,
      loading: false,
      pagable: {
        page: 1,
        size: 10,
        total: 0,
        sort: {}
      },
      setted: false,
      multiple: false,
      selects: []
    }
  },
  methods: {
    handleClosed () {
      this.selects = []
      this.values = []
      this.open = false
      this.pagable.page = 1
      this.pagable.size = 10
      this.pagable.total = 0
      this.pagable.sort = {}
      this.$emit('closed')
    },
    handleConfirm () {
      this.$emit('confirm', this.selects)
      this.handleClosed()
    },
    handleSelectionChange (selects) {
      this.selects = selects
    },
    handleCurrentChange (select) {
      this.selects = []
      this.selects.push(select)
    },
    handleConditionReset () {
      ValueUtils.clear(this.condition)
    },
    handleQueryAndResetPage () {
      this.loading = true
      this.pagable.page = 1
      this.loadData()
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
      this.loading = true
      this.pagable.size = size
      this.handleQueryAndResetPage()
    },
    handlePageChange (page) {
      this.loading = true
      this.pagable.page = page
      this.handleQuery()
    },
    handleData (response) {
      this.values = response.data.records
      this.pagable.total = response.data.total
      this.pagable.size = response.data.size
      this.loading = false
    },
    loadData () {
      this.$axios.get(RequestUtils.appendQuery(this.url, this.condition, this.pagable))
        .then(this.handleData)
    }
  },
  watch: {
    visable (val) {
      if (val) {
        if (!this.setted) {
          // 分组查询条件
          for (let i = 0; i < this.conditions.length && i < this.numberOfConditionInRow; i++) {
            this.conditionGroupMain.push(this.conditions[i])
          }
          let hasNext = this.numberOfConditionInRow < this.conditions.length
          for (let rowIndex = 1; hasNext; rowIndex++) {
            let rowConditions = []
            this.conditionGroupMinor.push(rowConditions)
            for (let colIndex = 0; hasNext && colIndex < this.numberOfConditionInRow; colIndex++) {
              let conditionIndex = rowIndex * this.numberOfConditionInRow + colIndex
              hasNext = conditionIndex < this.conditions.length
              if (hasNext) {
                rowConditions.push(this.conditions[conditionIndex])
              }
            }
          }
          this.setted = true
        }
        // 初始化数据
        this.loading = true
        this.loadData()
      }
      this.open = val
    }
  }
}
</script>

<style lang="stylus" scoped>
  .el-collapse-item__header
    border none
  .condition-line-wrapper
    line-height 36px
    margin-bottom 4px
    .title
      font-size 14px
      color #606266
</style>
