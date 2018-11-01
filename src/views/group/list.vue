<template>
  <div class="group">
    <lc-row>
      <lc-search>
        <el-form :inline="true">
          <el-form-item>
            <el-select v-model="site_id" placeholder="请选择站点">
              <el-option label="全部" value="0"/>
              <el-option
                v-for="item in site"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="搜索群组名称" class="temp-name">
            <el-input v-model="name" placeholder="搜索群组名称"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="el-btn" @click="searchBtn">搜索</el-button>
            <el-button type="primary" class="el-btn" @click="empty(),dialogFormVisible=true">添加群组</el-button>
            <el-button type="primary" class="el-btn" @click="removeList">批量删除</el-button>
          </el-form-item>
        </el-form>
      </lc-search>
    </lc-row>
    <lc-row>
      <lc-panel title="群组管理">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="this.list"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          tooltip-effect="dark"
          border
          stripe
          style="width: 100%"
          @select="selected"
          @select-all="selectedAll"
          >
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="name" label="群组名称"/>
          <el-table-column prop="num" label="组员个数"/>
          <el-table-column prop="site_name" label="站点"/>
          <el-table-column prop="mtime" label="更新时间"/>
          <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
              <el-row>
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="getInfo(scope.row),dialogForm=true"></el-button>
                <el-dropdown trigger="click">
                  <el-button type="primary" size='mini' @click="getInfo(scope.row)">
                    添加联系人<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><span @click="phoneInfo(),dialogAdd=true" class="addItem">手动添加</span></el-dropdown-item>
                    <el-dropdown-item>
                      <span class="importPhone">
                        text文件导入<input ref="input" type="file" accept=".txt" @change="selectedFile"  class="inputFile">
                      </span>
                      </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button type="danger" size="mini" icon="el-icon-delete"  @click="getInfo(scope.row),removeGroup()"></el-button>
                <el-button size="mini" @click="getInfo(scope.row),handleSetLineChartData()" icon="el-icon-search"></el-button>
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
    <el-dialog :visible.sync="dialogFormVisible" title="添加群组" width="600px">
      <el-form>
        <el-form-item :label-width="formLabelWidth" label="站点">
          <el-select v-model="otherMenu" placeholder="请选择站点">
            <el-option
              v-for="item in site"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="群组名称">
          <el-input v-model="groupCont" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGroup(),dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogForm" title="编辑" width="600px">
      <el-form>
        <el-form-item :label-width="formLabelWidth" label="群组名称">
          <el-input v-model="groupName" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm = false">取 消</el-button>
        <el-button type="primary" @click="editGroup(),dialogForm = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogAdd"
      title="添加联系人"
      width="600px">
      <el-form>
        <el-form-item :label-width="formLabelWidth" label="站点">
          <el-input v-model="siteInfo" auto-complete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="群组">
          <el-input v-model="groupInfo" auto-complete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="选择用户">
          <el-input v-model="phone" type="textarea" auto-complete="off" placeholder="请输入手机号码，多个请换行"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd = false">取消</el-button>
        <el-button type="primary" @click="addContact(),dialogAdd = false">确定</el-button>
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
  name: 'Group',
  components: {
    Group,
    lcRow,
    lcPanel,
    lcSearch
  },
  data() {
    return {
      pageSize:0,
      totaling:0,
      page:1,
      loading: false,
      formLabelWidth: '100px',
      dialogFormVisible: false,
      dialogForm: false,
      dialogAdd: false,
      list: [],
      otherSite: [],
      site: [],
      siteMenu: '',
      otherMenu: '',
      groupCont: '',
      id: 0,
      site_id: '',
      groupName: '',
      groupVal: '',
      siteInfo: '',
      groupInfo: '',
      phone: '',
      name: '',
      init: {
        name: '',
        site_id: 0,
        page: 1
      },
      rowObj:{}
    }
  },
  created() {
    this.loading = true
    this.groupList()
    this.dropSite()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex == 0) {
        return 'background:#EFEFEF'
      }
    },
    groupList() {
      Group.groupList(this).then((res) => {
        this.list = res.data.data.list;
        this.totaling=parseInt(res.data.data.total)||0
        this.pageSize=parseInt(res.data.data.pagesize)||0
        this.loading = false
      }, error => {
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.page = val
      this.loading = true
      this.groupList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.loading = true
      this.groupList()
    },
    dropSite() {
      Group.dropSite().then((res) => {
        this.site = res.data.data
        this.otherSite = res.data.data
        // this.addSite=res.data.data;
      })
    },
    empty() {
      this.groupCont=''
      this.otherMenu=''
    },
    searchBtn() {
          if(this.page!==1){
            this.page=1
          }
          this.loading = true
          this.groupList()
    },
    getInfo(row) {
      Group.getInfo(row).then((res) => {
        this.rowObj={
          id : res.data.data.id,
          site_id :res.data.data.site_id
        }
        // this.id = res.data.data.id
        // this.site_id = res.data.data.site_id
        this.groupName = res.data.data.name
      })
    },
    phoneInfo() {
      this.phone=''
      Group.phoneInfo(this.rowObj).then((res) => {
        this.siteInfo = res.data.data.site_name
        this.groupInfo = res.data.data.group_name
        // debugger
      })
    },
    addGroup() {
      var addUser = {
        site_id: this.otherMenu,
        name: this.groupCont
      }
      // debugger
      Group.addGroup(addUser).then((res) => {
        this.loading = true
        this.groupList()
      })
    },
    selectedAll(row){
      const rowStr = []
      for (var k in row) {
        rowStr[k] = row[k].id
      }
      this.id = rowStr.join()
      console.log(this.id)

    },
    selected(row) {
      // debugger
      const rowStr = []
      for (var k in row) {
        rowStr[k] = row[k].id
      }
      this.id = rowStr.join()
      console.log(this.id)
    },
    removeList() {
      Group.remove(this).then((res) => {
        if(res.data.code===200){
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.loading=true
          this.groupList()
        }
      })
    },
    addContact() {
      let add={
        id:this.rowObj.id,
        phone:this.phone
      }
      Group.addPhone(add).then((res) => {
        if(res.data.code===200){
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.loading = true
          this.groupList()
        }
      })
    },
    editGroup() {
      const list = {
        id: this.rowObj.id,
        site_id: this.rowObj.site_id,
        name: this.groupName
      }
      // debugger
      if (this.rowObj.site_id == '') {
        this.$message.error('请选择站点')
      } else if (this.groupName == '') {
        this.$message.error('群组名称不能为空')
      } else {
        Group.groupEdit(list).then((res) => {
          this.loading = true
          this.groupList()
        })
      }
    },
    resetInput() {
      // this.$refs.input.click()
      this.$refs['input']['value'] = ''
    },
    selectedFile(event) {
      const file = event.target.files[0]
      const formData = new FormData()
      if (!file) {
        this.$message.error('文件不存在')
        this.resetInput()
        return false
      }
      // debugger
      formData.append('file', file)
      formData.append('id', this.rowObj.id)
      Group.importPhone(formData).then((res) => {
        // debugger
        if (res.data.code == 200) {
          this.resetInput()
          this.$message({
            showClose: true,
            message: '恭喜你，这是一条成功消息',
            type: 'success'
          })
          this.groupList()
        }
      })
    },
    removeGroup() {
      this.$confirm('确认要删除该分组？同时也会删除分组下的联系人！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Group.remove(this.rowObj).then((res) => {
          this.loading = true
          this.groupList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSetLineChartData() {
      var _this = this
      setTimeout(function() {
        if (this.id !== 0) {
          _this.$router.push({
            path: '/group/contacts' + _this.rowObj.id,
            name: 'contacts',
            params: {
              id: _this.rowObj.id
            }
          })
        }
      }, 500)
    }
  }
}
</script>
<style scoped>
  input[type="file"] {
  color: transparent;
  }
  .addItem{display: block;width:100%;height: 100%;}
  .pagination{margin: 20px 0;}
  .temp-header  .el-form-item{margin-bottom: 0;}
  .importPhone{position: relative;cursor: pointer;}
  .inputFile{opacity: 0;position: absolute;width: 100%;height: 100%;left: 0;top: 0;}
 .group .temp-header{border: 1px solid #ebeef5;}
 .group .temp-header .temp-name{margin-left: 20px;}
 .group .temp-header .el-btn{margin: 0 10px;}
  .temp-container{margin:0 20px;border: 1px solid #ebeef5;}
 .temp-container .temp-title{border-bottom: 1px solid #ebeef5;background-color: #f5f7fa;font-size: 18px;color:#333;line-height: 60px;padding: 0 30px;}
  .container{padding: 20px;}

</style>

