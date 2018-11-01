<template>
  <div class="message-index">
    <lc-row>
      <lc-panel title="平台设置">
        <el-form label-width="80px">
          <el-form-item label="站点">
            <el-select v-model="submitForm.site_id" @change="getGroup" placeholder="请选择站点">
              <el-option
                v-for="item in siteList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="短信平台">
            <el-select @change="templateEmpty" v-model="submitForm.plat_id" placeholder="请选择短信平台">
              <el-option
                v-for="item in platFormList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-form>
      </lc-panel>
      <lc-panel title="收件人">
        <el-tabs v-model="submitForm.send_type" tab-position="top" @tab-click="getGroup">
          <el-tab-pane label="TXT文件导入" name="2">
            <lc-row>
              <el-input
                :disabled="!uploadTextStatus.isEdit"
                :autosize="{ minRows: 2, name: 6}"
                v-model="submitForm.phone"
                type="textarea"
                placeholder="点击此处“直接填写手机号”或者点击下方按钮“上传txt文件”"/>
            </lc-row>
            <lc-row>
              <div class="votice">
                <span>提示：</span>
                <p>收件人为多个时，号码之间用逗号 “，” 隔开</p>
                <p>导入文件格式一致</p>
                <p>重复号码自动去重</p>
              </div>
            </lc-row>
            <lc-row>
              <div class="control">
                <el-button type="primary" class="speacial-up">
                  上传txt文件<i class="el-icon-upload el-icon--right"/>
                  <input ref="textInput" type="file" accept=".txt" @change="upText">
                </el-button>
                <el-button :disabled="submitForm.phone===''" type="primary" @click="resetText">清空联系人</el-button>
              </div>
            </lc-row>
            <lc-row>
              <el-alert
                :title="uploadTextStatus.info"
                :closable="false"
                type="info"/>
            </lc-row>
          </el-tab-pane>
          <el-tab-pane label="选择群组" name="1" :disabled="submitForm.site_id === null || submitForm.site_id === undefined">
            <el-form :inline="true">
              <el-form-item>
                <el-input type="text" v-model="group_name" placeholder="请输入群组名称"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getGroup">搜索</el-button>
              </el-form-item>
            </el-form>
            <el-table
              ref="multipleTable"
              :data="groupList"
              border
              stripe
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              style="width: 100%">
              <el-table-column label="选择">
                <template slot-scope="scope">
                  <el-radio :label="scope.row.id" :disabled="scope.row.num==0" v-model="groupCheck" @change="handleSelectionChange(scope.row)">选中</el-radio>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="群组名称"
                show-overflow-tooltip/>
              <el-table-column
                prop="num"
                label="组员个数"
                show-overflow-tooltip/>
            </el-table>
            <lc-row>
              <el-pagination
                :current-page.sync="page"
                :page-size="pageSize"
                :total="total"
                layout="prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"/>
            </lc-row>
          </el-tab-pane>
        </el-tabs>
      </lc-panel>
      <lc-panel title="编辑短信内容">
        <lc-row>
          <el-button type="primary" @click="templateShow">引用模板</el-button>
          <el-button :disabled="submitForm.content===''" type="primary" @click="templateEmpty">清空模板内容</el-button>
        </lc-row>
        <lc-row>
          <!-- :disabled="submitForm.template_id?true:false || submitForm.content.length>=500" -->
          <el-input
            :disabled="true"
            :autosize="{ minRows: 4, maxRows: 6}"
            v-model="submitForm.content"
            type="textarea"
            placeholder="现在仅提供选择模板！"/>
          <span class="textarea-votice">
            已输入字数 <span class="warning">{{ submitForm.content.length }}</span> 字，还可以输入 <span class="success">{{ 500 - submitForm.content.length }}</span> 字
          </span>
        </lc-row>
        <lc-row>
          <div class="votice">
            <span>提示：</span>
            <p>根据运营商政策规定，建议每次提交小于等于225个字符（含签名、符号等）。</p>
            <p>70字以内的短信计为1条，70字以上的短信每67个字计为1条。。</p>
          </div>
        </lc-row>
        <lc-row>
          <el-radio-group v-model="sendTimeType" @change="initSendTime">
            <el-radio :label="1">立即发送</el-radio>
            <el-radio :label="2">定时发送</el-radio>
          </el-radio-group>
        </lc-row>
        <lc-row v-if="sendTimeType == 2">
          <el-date-picker
            v-model="submitForm.send_time"
            type="datetime"
            placeholder="选择日期时间"/>
        </lc-row>
      </lc-panel>
      <lc-row>
        <el-button type="primary" @click="previewShow">发送手机预览</el-button>
        <el-button type="primary" @click="send">确认发送</el-button>
      </lc-row>
    </lc-row>
    <el-dialog :visible.sync="templateVisible" title="引用模板" width="600px">
      <div class="template-select">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="name" type="text" placeholder="请输入模板名称"/>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="name===''" type="primary" @click="searchTemplate">搜索</el-button>
          </el-form-item>
        </el-form>
        <div v-if="template_list.length>0" class="list-auto" >
          <ul class="template-list">
            <li v-for="(item,index) in template_list" :key="index" :class="{active:activeItem.id==item.id}" @click="checkTemplate(item)">
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div v-if="template_list.length===0" class="nodata">暂无数据</div>
        <div class="template-submit">
          <el-button @click="templateVisible=false">取消</el-button>
          <el-button :disabled="template_list.length===0 || activeItem.id ===undefined" type="primary" @click="submitTemplate">确定引用</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="previewVisible" title="预览" width="500px">
      <div class="template-select">
        <el-form label-position="left" label-width="80px">
          <el-form-item label="手机号" required>
            <el-input v-model="phone" type="text" placeholder="请输入接收预览短信的手机号"/>
          </el-form-item>
          <el-form-item>
            <el-button @click="previewVisible=false">取消</el-button>
            <el-button type="primary" @click="sendPreview">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import message from '@/api/message'
import lcPanel from '@/components/Layout/lcPanel.vue'
import lcRow from '@/components/Layout/lcRow.vue'
import tabTitle from '@/components/Common/tabTitle'
export default {
  components: {
    lcPanel,
    tabTitle,
    lcRow
  },
  data() {
    return {
      total: 0,
      pageSize: 10,
      page: 1,
      loading: false,
      name: '',
      phone: '',
      activeItem: {},
      templateVisible: false,
      previewVisible: false,
      siteList: [],
      groupList: [],
      platFormList: [],
      template_list: [],
      group_name: '',
      sendTimeType: 1,
      uploadTextStatus: {
        isEdit: true,
        info: '上传条数：0条 有效条数：0条'
      },
      groupCheck: '',
      resetForm: {
        site_id: null,
        plat_id: null,
        content: '',
        template_id: 0,
        phone: '',
        send_type: '2',
        send_time: '',
        group_id: '',
        is_sign: 1
      },
      submitForm: {
        site_id: null,
        plat_id: null,
        content: '',
        template_id: 0,
        phone: '',
        send_type: '2',
        send_time: '',
        group_id: '',
        is_sign: 1
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    handleSizeChange(val) {
      this.page = val;
      this.getGroup()
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getGroup()
    },
    checkTemplate(item) {
      if (this.activeItem === item) {
        this.activeItem = {}
        return
      }
      this.activeItem = item
    },
    handleSelectionChange(val) {
      this.submitForm.group_id = val.id
    },
    submitTemplate() {
      this.submitForm.template_id = this.activeItem.id
      this.submitForm.content = this.activeItem.content
      this.templateVisible = false
    },
    templateShow() {
      if (this.submitForm.plat_id === undefined || this.submitForm.plat_id === null) {
        this.$message.warning('请先选择短信平台！')
        return
      }
      this.name = ''
      this.getTemplate()
    },
    templateEmpty() {
      this.submitForm.template_id = 0
      this.submitForm.content = ''
    },
    getTemplate() {
      let query = {}
      if (this.name === '') {
        query = {
          plat_id: this.submitForm.plat_id
        }
      } else {
        query = {
          plat_id: this.submitForm.plat_id,
          name: this.name
        }
      }
      message.getTemplate(query).then(res => {
        this.templateVisible = true
        this.template_list = res.data
      })
    },
    searchTemplate() {
      this.getTemplate()
    },
    initData() {
      message.allselect().then(res => {
        this.siteList = res.data.sites
        this.platFormList = res.data.platforms
      })

    },
    getGroup(){
      if(this.submitForm.send_type == 1){
        this.loading = true;
        message.groupList({site_id:this.submitForm.site_id,name:this.group_name,page:this.page}).then(res => {
          this.groupList = res.data.list;
          this.total = parseInt(res.data.total) || 1;
          this.pageSize = parseInt(res.data.pagesize) || 10;
          this.loading = false;
        })
      }
    },
    searchGroup(){
       message.groupList().then(res => {
        this.groupList = res.data.list
      })
    },
    initSendTime() {
      if (this.sendTimeType === 1) {
        this.submitForm.send_time = ''
      }
    },
    resetInput() {
      this.$refs['textInput']['value'] = ''
    },
    upText(event) {
      console.log("出发",event)
      // debugger
      const file = event.target.files[0]
      const formData = new FormData()
      if (!file) {
        this.$message.error('文件不存在')
        this.resetInput()
        return false
      }
      formData.append('file', file)
      message.uploadText(formData).then(res => {
        this.resetInput()
        if(res.data && res.data.successCnt){
          this.submitForm.phone = res.data.successPhoneStr
          this.uploadTextStatus.isEdit = false
          this.uploadTextStatus.info = `上传条数：${parseInt(res.data.successCnt) + parseInt(res.data.failCnt)}条 有效条数：${res.data.successCnt}条`
        }
      })
    },
    resetText() {
      this.submitForm.phone = ''
      this.uploadTextStatus.isEdit = true
    },
    previewShow() {
      this.phone = '';
      this.previewVisible = true;
    },
    resetFormControl(){
      this.submitForm = Object.assign({},this.resetForm);
    },
    send() {
      if(this.sendTimeType==2){
        if(this.submitForm.send_time == ''){
          this.$message.error('定时不能为空！')
          return;
        }
        if(this.submitForm.send_time === undefined || this.submitForm.send_time === null || this.submitForm.send_time === ''){
          this.submitForm.send_time = ''
        }else{
          this.submitForm.send_time = moment(this.submitForm.send_time).format('YYYY-MM-DD HH:mm:ss')
        }
      }
      message.sendIndex(this.submitForm).then(res=>{
        this.resetFormControl();
      })
    },
    sendPreview() {
      if (this.phone === '') {
        this.$message.warning('请输入接收预览短信的手机号！')
        return
      }
      const query = {
        phone: this.phone,
        site_id: this.submitForm.site_id,
        plat_id: this.submitForm.plat_id,
        content: this.submitForm.content,
        template_id: this.submitForm.template_id,
        is_sign: 1
      }
      message.testSend(query).then(res => {
        this.previewVisible = false
      })
    }
  }
}
</script>
<style scoped>
    .list-auto{
        max-height: 400px;
        overflow-y: auto;
        border: 1px solid #ebeef5;
    }
    .template-list{
        margin: 0;
        padding: 0;
        border-bottom: none;
    }
    .template-list li{
        position: relative;
        margin: 0;
        list-style: none;
        padding: 20px;
        cursor: pointer;
        border-bottom: 1px solid #ebeef5;
    }
    .template-list li.active{
        background-color: rgba(0,0,0,.4)
    }
    .template-list li.active::before{
        content: "\E62D";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        font-family: element-icons!important;
        speak: none;
        font-style: normal;
        font-weight: 400;
        font-variant: normal;
        font-size: 24px;
        text-transform: none;
        line-height: 1;
        vertical-align: baseline;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
        color: #67C23A;
    }
    .template-submit{
        margin-top: 20px;
        text-align: center;
    }
    .nodata{
        padding: 20px;
        border: 1px solid #ebeef5;
        text-align: center;
        color: #cccccc;
    }
    .speacial-up{
        position: relative
    }
    .speacial-up input{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }
    .lc-panel{
      border-bottom: none;
    }
    .lc-panel:nth-child(3){
      border-bottom: 1px solid #ebeef5;
    }
    .votice,.textarea-votice{
      font-size: 12px;
      color: #999999;
    }
    .textarea-votice .warning{
      color: #E6A23C;
    }
    .textarea-votice .success{
      color: #67C23A;
    }
</style>

