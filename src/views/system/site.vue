<template>
  <div class="system-site">
    <lc-row>
      <lc-search>
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="name" placeholder="搜索站点名称"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button :disabled="true" type="primary" @click="createShow">新建站点</el-button>
          </el-form-item>
        </el-form>
      </lc-search>
    </lc-row>
    <lc-row>
      <lc-panel title="站点查询">
        <el-table
          v-loading="loading"
          :data="list"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          border>
          <el-table-column prop="id" label="ID"/>
          <el-table-column prop="name" label="站点名称"/>
          <el-table-column prop="sitekey" label="Key"/>
          <el-table-column prop="remark" label="备注"/>
          <el-table-column prop="mtime" label="更新时间"/>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="editShow(scope.row)"/>
              <el-button :disabled="true" type="danger" size="mini" icon="el-icon-delete" @click="deleteShow(scope.row)"/>
            </template>
          </el-table-column>
        </el-table>
      </lc-panel>
    </lc-row>
    <lc-row>
      <el-pagination
        :current-page.sync="searchQuery.page"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </lc-row>
    <el-dialog :visible.sync="controlVisible" :title="controlTitle" width="600px">
      <div class="site-control">
        <el-form ref="ruleForm" :model="siteForm" :rules="rules" label-width="120px">
          <el-form-item label="站点名称" prop="name">
            <el-input v-model="siteForm.name"/>
          </el-form-item>
          <el-form-item label="站点key" required>
            <el-input :disabled="true" v-model="siteForm.sitekey"/>
          </el-form-item>
          <el-form-item label="站点密钥" required>
            <el-input :disabled="true" v-model="siteForm.sitesecret"/>
          </el-form-item>
          <el-form-item label="5分钟限制次数" prop="minlimit" required>
            <el-input v-model="siteForm.minlimit"/>
          </el-form-item>
          <el-form-item label="每天限制次数" prop="daylimit" required>
            <el-input v-model="siteForm.daylimit"/>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="siteForm.remark" type="textarea"/>
          </el-form-item>
          <el-form-item>
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import configsite from '@/api/configsite'
import lcRow from '@/components/Layout/lcRow.vue'
import lcSearch from '@/components/Layout/lcSearch.vue'
import lcPanel from '@/components/Layout/lcPanel.vue'

export default {
  components: {
    lcSearch,
    lcRow,
    lcPanel
  },
  data() {
    var validateDay = (rule, value, callback) => {
      var n = /^[1-9]\d*$/
      if (!n.test(value) && value != 0) {
        callback(new Error('每天限制次数必须为整数'))
      } else {
        callback()
      }
    }
    var validateMin = (rule, value, callback) => {
      var n = /^[1-9]\d*$/
      if (!n.test(value) && value != 0) {
        callback(new Error('5分钟限制次数必须为整数'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      name: '',
      total: 0,
      pageSize: 10,
      resetForm: {
        name: '',
        remark: '',
        sitekey: '',
        daylimit: 0,
        minlimit: 0,
        sitesecret: ''
      },
      siteForm: {
        name: '',
        remark: '',
        sitekey: '',
        daylimit: 0,
        minlimit: 0,
        sitesecret: ''
      },
      controlTitle: '新建',
      controlVisible: false,
      controlData: {},
      controlType: 'edit',
      list: [],
      searchQuery: {},
      rules: {
        name: [
          {
            required: true,
            message: '站点名称不能为空',
            trigger: 'blur'
          }
        ],
        daylimit: [
          { validator: validateDay, trigger: 'blur' }
        ],
        minlimit: [
          { validator: validateMin, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    cancel() {
      this.controlVisible = false
    },
    handleSizeChange(val) {
      this.searchQuery = Object.assign(this.searchQuery, { page: val })
      this.getList()
    },
    handleCurrentChange(val) {
      this.searchQuery = Object.assign(this.searchQuery, { page: val })
      this.getList()
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.controlType === 'edit') {
            configsite.updateSite(this.siteForm).then(res => {
              this.controlVisible = false
              this.getList()
            })
          } else {
            configsite.addSite(this.siteForm).then(res => {
              this.controlVisible = false
              this.getList()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetData() {
      this.siteForm = Object.assign({}, this.resetForm)
    },
    editShow(item) {
      configsite.siteDetail(item.id).then(res => {
        this.resetData()
        this.siteForm = res.data
        this.controlTitle = '编辑站点'
        this.controlType = 'edit'
        this.controlVisible = true;
      })
    },
    createShow() {
      this.resetData()
      this.controlType = 'create'
      this.controlTitle = '新建站点'
      this.controlVisible = true;
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
      });
    },
    deleteShow(item) {
      configsite.deleteSite(item.id).then(res => {
        this.getList()
      })
    },
    getList() {
      this.loading = true
      configsite.siteList(this.searchQuery).then(
        res => {
          this.list = res.data.data
          this.total = parseInt(res.data.totalCount) || 0
          this.pageSize = parseInt(res.data.pagesize) || 10
          this.loading = false
        },
        error => {
          this.loading = false
        }
      )
    },
    search() {
      this.searchQuery = Object.assign({}, this.searchQuery, {
        name: this.name,
        page: 1
      })
      this.getList()
    }
  }
}
</script>

