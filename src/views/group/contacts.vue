<template>
  <div class="contacts">
    <lc-row>
      <lc-search>
        <el-form :inline="true">
          <el-form-item class="temp-name">
            <el-input v-model="phone" placeholder="搜索手机号码"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="el-btn" @click="searchVal">搜索</el-button>
            <el-button type="primary" class="el-btn" @click="removeList">删除</el-button>
          </el-form-item>
        </el-form>
      </lc-search>
    </lc-row>
    <lc-row>
      <lc-panel title="联系人">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="this.contactsList"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          tooltip-effect="dark"
          border
          stripe
          style="width: 100%"
          @select="selected"
          @select-all="selectedAll">
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column prop="phone" label="手机号码"/>
          <el-table-column prop="site_name" label="站点"/>
          <el-table-column prop="group_name" label="群组名称"/>
          <el-table-column prop="ctime" label="添加时间"/>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-row>
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="getInfo(scope.row),dialogForm=true"/>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="getInfo(scope.row),removeContacts()"/>
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
    <el-dialog
      :visible.sync="dialogForm"
      title="编辑手机号码"
      width="600px">
      <el-form>
        <el-form-item :label-width="formLabelWidth" label="手机号码">
          <el-input v-model="editP" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogForm = false">取消</el-button>
        <el-button type="primary" @click="editContacts(),dialogForm = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Group from '@/api/group'
import lcRow from '@/components/Layout/lcRow.vue'
import lcSearch from '@/components/Layout/lcSearch.vue'
import lcPanel from '@/components/Layout/lcPanel.vue'
export default {
  name: 'Contacts',
  components: {
    Group,
    lcRow,
    lcPanel,
    lcSearch
  },
  data() {
    return {
      loading: false,
      formLabelWidth: '100px',
      dialogForm: false,
      id: 0,
      phone: '',
      contactsList: [],
      rowId:0,
      totaling:0,
      page:1,
      editP:"",
      pageSize:10
    }
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    '$route': 'getParams'
  },
  created() {
    this.loading = true
    this.getParams()
    // this.getPhone();
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex == 0) {
        return 'background:#EFEFEF'
      }
    },
    selectedAll(row){
      const rowStr = []
      for (var k in row) {
        rowStr[k] = row[k].id
      }
      this.rowId = rowStr.join()
      console.log(this.rowId)
    },
    selected(row) {
      const rowStr = []
      for (var k in row) {
        rowStr[k] = row[k].id
      }
      this.rowId = rowStr.join()
      console.log(this.rowId)
    },
    getParams() {
      if (this.$route.params.id !== 0) {
        this.id = this.$route.params.id
        this.lookPhone()
      }
    },
    getInfo(row) {
      this.rowId = row.id
      this.editP=row.phone
      this.getPhone()
    },
    getPhone() {
      // const phoneObj = {
      //   id: this.rowId
      // }
      // Group.getPhone(phoneObj).then((res) => {
      //   this.phone = res.data.data.phone
      // })
    },
    init() {
      const obj = {
        id: this.id,
        phone: '',
        page: 1
      }
      Group.lookPhone(obj).then((res) => {
        this.contactsList = res.data.data.list
        this.totaling=parseInt(res.data.data.total)||0
        this.pageSize=parseInt(res.data.data.pagesize)||10
        this.loading = false
      })
    },
    lookPhone() {
      Group.lookPhone(this).then((res) => {
        this.contactsList = res.data.data.list
        this.totaling = parseInt(res.data.data.total) || 0
        this.pageSize=parseInt(res.data.data.pagesize)|| 10
        this.loading = false
      }, error => {
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.page = val
      this.loading = true
      this.lookPhone()
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.lookPhone()
    },
    editContacts() {
      var editObj = {
        id: this.rowId,
        phone: this.editP
      }
      Group.editPhone(editObj).then((res) => {
        this.loading = true
        this.init()
      })
    },
    removeContacts() {
      const phoneObj = {
        id: this.rowId
      }
      Group.removePhone(phoneObj).then((res) => {
        this.loading = true
        this.init()
      })
    },
    removeList() {
      const phoneObj = {
        id: this.rowId
      }
      Group.removePhone(phoneObj).then((res) => {
        this.loading = true
        this.init()
      })
    },
    searchVal() {
      if (this.page !== 1) {
        this.page = 1
      }
      this.loading = true
      this.lookPhone()
    }
  }
}
</script>
