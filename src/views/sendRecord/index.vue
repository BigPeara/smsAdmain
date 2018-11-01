<template>
  <div class="sendRecord">
    <lc-row>
      <lc-search>
        <el-form :inline="true" label-width="70px">
          <el-form-item label="发送时间">
            <el-date-picker
              v-model="time_obj"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="momentTime"/>
          </el-form-item>
          <el-form-item label="站点">
            <el-select v-model="site_id" placeholder="站点">
              <el-option label="全部" value="0" />
              <el-option
                v-for="item in this.siteInfo"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="短信状态">
            <el-select v-model="status" placeholder="全部">
              <el-option
                v-for="item in sendStatus"
                :label="item.label"
                :value="item.value"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="短信类型">
            <el-select v-model="type" placeholder="全部">
              <el-option
                v-for="item in sendType"
                :label="item.label"
                :value="item.value"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="短信内容">
            <el-input v-model="content" auto-complete="off" placeholder="搜索短信内容"/>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="phone" auto-complete="off" placeholder="输入手机号码"/>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" class="el-btn" @click="searchFun">搜索</el-button>
            <el-button type="primary" class="el-btn" @click="batchSend">批量重发</el-button>
          </el-form-item>
        </el-form>
      </lc-search>
    </lc-row>
    <lc-row>
      <lc-panel title="发送记录查询">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="this.sendLising"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          tooltip-effect="dark"
          border
          stripe
          style="width: 100%"
          @select="selected">
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="sendtime" label="发送时间"/>
          <el-table-column prop="phone" label="手机号码"/>
          <el-table-column prop="site_name" label="站点"/>
          <el-table-column prop="type" label="短信类型"/>
          <el-table-column prop="content" label="短信内容"/>
          <el-table-column prop="status" label="发送状态"/>
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
  </div>
</template>
<script>
import Group from '@/api/group'
import moment from 'moment'
import sendRecord from '@/api/sendRecord'
import lcRow from '@/components/Layout/lcRow.vue'
import lcSearch from '@/components/Layout/lcSearch.vue'
import lcPanel from '@/components/Layout/lcPanel.vue'
export default {
  name: 'SendRecord',
  components: {
    Group,
    sendRecord,
    lcRow,
    lcPanel,
    lcSearch
  },
  data() {
    return {
      loading: false,
      sendtime: '',
      time_obj: '',
      siteInfo: [],
      site_id: '',
      sendStatus: [
        {
          label: '全部',
          value: 0
        },
        {
          label: '成功',
          value: 1
        },
        {
          label: '失败',
          value: 2
        }
      ],
      sendType: [
        {
          label: '全部',
          value: 0
        },
        {
          label: '营销',
          value: 2
        },
        {
          label: '通知',
          value: 1
        }
      ],
      sendLising: [],
      type: 0,
      status: 0,
      content: '',
      id: 0,
      totaling:0,
      page:1,
      phone:'',
      init:{
        type:0,
        status:0,
        content:'',
        phone:'',
        page:1,
        site_id:0,
        sendtime:''
      },
      pageSize:0
    }
  },
  created() {
    this.loading = true
    this.dropSite()
    this.sendList()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex == 0) {
        return 'background:#EFEFEF'
      }
    },
    dropSite() {
      Group.dropSite().then(res => {
        this.siteInfo = res.data.data
        // debugger
      })
    },
    sendList() {
      sendRecord.search(this).then((res) => {
        this.sendLising = res.data.data.list
        this.totaling=parseInt(res.data.data.total)||0
        this.pageSize=parseInt(res.data.data.pagesize)||0
        this.loading = false
      })
    },
    momentTime(val) {
      let str = ''
      if (val === undefined || val === null || val === '') {
        this.sendtime = ''
        return
      }
      val.forEach((value, index) => {
        if (index === 0) {
          str += moment(value).format('YYYY-MM-DD')
        } else {
          str += `~${moment(value).format('YYYY-MM-DD')}`
        }
      })
      this.sendtime = str
    },
    handleSizeChange(val) {
      this.page = val
      this.sendList()
    },
    handleCurrentChange(val) {
      this.loading = true
      this.page = val
      this.sendList()
    },
    searchFun() {
      if (this.page !== 1) {
        this.page = 1
      } else if (
        this.content == '' &&
        this.status == '' &&
        this.type == '' &&
        this.sendtime == '' &&
        this.site_id == '' &&
        this.phone == ''
      ) {
        this.loading = true
        this.sendList()
      } else {
        this.loading = true
        const id = parseInt(this.site_id) || 0
        const obj = {
          page: this.page,
          sendtime: this.sendtime.toString(),
          site_id: id,
          type: this.type,
          status: this.status,
          content: this.content,
          phone: this.phone
        }
        if (
          this.content !== '' ||
          this.status !== '' ||
          this.type !== '' ||
          this.sendtime !== '' ||
          this.site_id !== '' ||
          this.phone !== ''
        ) {
          sendRecord.search(obj).then(res => {
            // debugger
            this.sendLising = res.data.data.list
            this.totaling = parseInt(res.data.data.total) || 0
            this.loading = false
          })
        }
      }
    },
    batchSend() {
      if (this.id == 0) {
        // this.$message.error('请选择需要重发的选项')
      } else {
        sendRecord.sendAgain(this).then(res => {
          this.loading = true
          this.sendList()
          this.id = 0
        })
      }
    },
    selected(row) {
      const rowStr = []
      for (var k in row) {
        rowStr[k] = row[k].id
      }
      this.id = rowStr.join()
      console.log(this.id)
      // debugger
    }
  }
}
</script>
<style scoped>
.sendRecord .temp-header {
  background-color: #f5f7fa;
  padding: 20px;
  margin: 20px;
}
.pagination {
  margin: 20px 0;
}
.temp-header .el-form-item {
  margin-bottom: 0;
}
.sendRecord .temp-header {
  border: 1px solid #ebeef5;
}
.sendRecord .temp-header .temp-name {
  margin-left: 20px;
}
.sendRecord .temp-header .el-btn {
  margin: 0 10px;
}
.temp-container {
  margin: 0 20px;
  border: 1px solid #ebeef5;
}
.temp-container .temp-title {
  border-bottom: 1px solid #ebeef5;
  background-color: #f5f7fa;
  font-size: 18px;
  color: #333;
  line-height: 60px;
  padding: 0 30px;
}
.container {
  padding: 20px;
}
</style>

