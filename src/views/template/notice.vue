<template>
  <div class="temp">
    <lc-row>
      <lc-search>
        <el-form :inline="true">
          <el-form-item label="短信平台">
            <el-select v-model="plat_id" placeholder="请选择短信平台">
              <el-option label="全部" value="0"/>
              <el-option
                v-for="item in this.menu"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="模板名称" class="temp-name">
            <el-input v-model="name" placeholder="搜索模板名称"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="el-btn" @click="noticeQuery">查询</el-button>
            <el-button type="primary" class="el-btn" @click="empty(),dialogForm=true">新增</el-button>
          </el-form-item>
        </el-form>
      </lc-search>
    </lc-row>
    <lc-row>
      <lc-panel title="模板查询">
        <el-table
          v-loading="loading"
          :data="this.market"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          border
          stripe
          style="width: 100%">
          <el-table-column
            prop="id"
            label="ID"/>
          <el-table-column
            prop="name"
            label="模板名称"/>
          <el-table-column
            prop="plat_name"
            label="短信平台"/>
          <el-table-column
            prop="content"
            label="模板内容"/>
          <el-table-column
            prop="mtime"
            label="更新时间"/>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-row>
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="getInfo(scope.row),dialogFormVisible=true"/>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="getInfo(scope.row),removeTemp()"/>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </lc-panel>
    </lc-row>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="totaling" class="pagination">
    </el-pagination>
    <el-dialog :visible.sync="dialogFormVisible" title="编辑" width="600px">
      <el-form>
        <el-form-item :label-width="formLabelWidth" label="模板名称">
          <el-input v-model="tempName" auto-complete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="模板内容">
          <el-input v-model="tempContent" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editTemp(),dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogForm" title="新建模板" width="600px">
      <el-form>
        <el-form-item :label-width="formLabelWidth" label="短信平台">
          <el-select v-model="platform" placeholder="请选择短信平台" @change="change">
            <el-option
              v-for="item in plat"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="模板ID">
          <el-select v-model="templateId" @change="changId">
            <el-option
              v-for="item in tempId"
              :label="item.plat_template_id"
              :value="item"
              :key="item.plat_template_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="模板名称">
          <el-input v-model="templateName" auto-complete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="模板内容">
          <el-input :disabled="true" v-model="templateCont" type="textarea" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm = false">取 消</el-button>
        <el-button type="primary" @click="addNew(),dialogForm = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Api from '@/api/temp'
import lcRow from '@/components/Layout/lcRow.vue'
import lcSearch from '@/components/Layout/lcSearch.vue'
import lcPanel from '@/components/Layout/lcPanel.vue'

export default {
  name: 'Temp',
  components: {
    Api,
    lcRow,
    lcPanel,
    lcSearch
  },
  data() {
    return {
      tempContent:'',
      tempName:'',
       rowObj:{},
      pageSize:0,
      loading: false,
      formLabelWidth: '100px',
      market: [],
      dialogFormVisible: false,
      dialogForm: false,
      id: 0,
      name: '',
      content: '',
      plat_id: '',
      plat_template_id: 0,
      menu: [],
      menuID: '',
      searchVal: '',
      platform: '',
      plat: [],
      tempId: [],
      templateId: '',
      templateName: '',
      templateCont: '',
      totaling: 0,
      page: 1,
      init: {
        id: 0,
        name: '',
        content: '',
        plat_id: 0,
        plat_template_id: 0,
        page: 1
      }
    }
  },
  created() {
    this.loading = true
    this.temp()
    this.dropMenu()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex == 0) {
        return 'background:#EFEFEF'
      }
    },
    temp() {
      Api.listnotice(this).then((res) => {
        this.market = res.data.data.list
        this.totaling = parseInt(res.data.data.total) || 0
        this.pageSize=parseInt(res.data.data.pagesize)||10
        this.loading = false
      }, error => {
        this.loading = false
      })
    },
    initFn() {
      Api.listnotice(this.init).then((res) => {
        this.market = res.data.data.list
        this.totaling = parseInt(res.data.data.total)||0
        this.pageSize=parseInt(res.data.data.pagesize)||10
        this.loading = false
      }, error => {
        this.loading = false
      })
    },
    dropMenu() {
      Api.dropDown().then((res) => {
        this.menu = res.data.data
        this.plat = res.data.data
        // debugger
      })
    },
    change(val) {
      if (val !== '') {
        this.getSelect()
        this.templateId = ''
        this.templateName = ''
        this.templateCont = ''
        // debugger
      }
    },
    changId(val) {
      this.templateId = val.plat_template_id
      this.templateName = val.plat_template_name
      this.templateCont = val.content
    },
    getSelect() {
      const obj = {
        plat_id: this.platform
      }
      Api.getSelect(obj).then((res) => {
        this.tempId = res.data.data
      })
    },
    editTemp() {
      let editObj={
        id:this.rowObj.id,
        plat_id:this.rowObj.plat_id,
        plat_template_id:this.rowObj.plat_template_id,
        name:this.tempName,
        content:this.tempContent
      }
      if (this.tempContent == '') {
        this.$message.error('模板内容不能为空')
      } else if (this.tempName == '') {
        this.$message.error('模板名称不能为空')
      } else {
        Api.editTemp(editObj).then(res => {
          this.loading = true
          this.initFn()
        })
      }
    },
    handleSizeChange(val) {
      this.loading = true
      this.page = val
      this.temp()
    },
    handleCurrentChange(val) {
      this.page = val
      this.loading = true
      this.temp()
    },
    getInfo(row) {
      Api.getInfo(row).then((res) => {
        this.rowObj={
          name:res.data.data.name,
          content:res.data.data.content,
          id:res.data.data.id,
          plat_id:res.data.data.plat_id,
          plat_template_id:res.data.data.plat_template_id
        }
        this.tempContent=res.data.data.content
        this.tempName=res.data.data.name
      })
    },
    removeTemp() {
      this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Api.remove(this.rowObj).then((res) => {
          this.loading = true
          this.initFn()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    empty() {
      this.platform = ''
      this.templateId = ''
      this.templateName = ''
      this.templateCont = ''
    },
    noticeQuery() {
      if (this.page !== 1) {
        this.page = 1
      }
      this.loading=true
        this.temp()
    },
    addNew() {
      const other = {
        name: this.templateName,
        content: this.templateCont,
        plat_id: this.platform,
        plat_template_id: this.templateId
      }
      if (this.platform == '') {
        this.$message.error('请选择短信平台')
      } else if (this.templateId == '') {
        this.$message.error('请选择模板ID')
      } else {
        Api.addnotice(other).then((res) => {
          this.loading = true
          this.initFn()
        })
      }
      // debugger
    }
  }
}
</script>
