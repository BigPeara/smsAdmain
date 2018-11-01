<template>
  <div class="system-site">
    <lc-row>
      <lc-search>
        <el-form :inline="true">
          <el-form-item label="短信平台">
            <el-select v-model="plat_id" placeholder="请选择">
              <el-option
                :value="0"
                label="全部"/>
              <el-option
                v-for="item in platFormList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="签名">
            <el-input v-model="sign" placeholder="搜索签名"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="createShow">添加签名</el-button>
          </el-form-item>
        </el-form>
      </lc-search>
    </lc-row>
    <lc-row>
      <lc-panel title="签名查询">
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          :data="list" border stripe>
          <el-table-column prop="id" label="ID"/>
          <el-table-column prop="sign" label="签名"/>
          <el-table-column prop="sitename" label="站点"/>
          <el-table-column prop="platformname" label="短信平台"/>
          <el-table-column prop="ctime" label="添加时间"/>
          <el-table-column prop="remark" label="备注"/>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="editShow(scope.row)"/>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteShow(scope.row)"/>
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
        <el-form label-width="100px" :rules="rules" ref="ruleForm" :model="signForm">
          <el-form-item label="站点" prop="site_id">
            <el-select v-model="signForm.site_id" :disabled="controlType=='edit'" placeholder="请选择">
              <el-option
                v-for="item in siteList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="短信平台" prop="plat_id">
            <el-select v-model="signForm.plat_id" :disabled="controlType=='edit'" placeholder="请选择">
              <el-option
                v-for="item in platFormList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="签名"  prop="sign">
            <el-input v-model="signForm.sign" type="text"/>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="signForm.remark" type="textarea"/>
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
import configplatformsign from "@/api/configplatformsign";
import configplatform from "@/api/configplatform";
import lcRow from "@/components/Layout/lcRow.vue";
import lcSearch from "@/components/Layout/lcSearch.vue";
import lcPanel from "@/components/Layout/lcPanel.vue";

export default {
  components: {
    lcSearch,
    lcRow,
    lcPanel
  },
  data() {
    return {
      loading: false,
      plat_id: null,
      searchQuery: {},
      sign: "",
      total: 0,
      pageSize: 10,
      siteList: [],
      platFormList: [],
      resetForm: {
        site_id: null,
        plat_id: null,
        sign: "",
        remark: ""
      },
      signForm: {
        site_id: null,
        plat_id: null,
        sign: "",
        remark: ""
      },
      controlTitle: "新建",
      controlVisible: false,
      controlData: {},
      controlType: "edit",
      list: [],
      rules: {
        site_id: [{
          required: true, message: '请选择站点', trigger: 'change'
        }],
        plat_id:[{
          required: true, message: '请选择短信平台', trigger: 'change'
        }],
        sign: [{
          required: true, message: '签名不能为空', trigger: 'blur'
        }]
      }
    };
  },
  created() {
    this.initSelect();
    this.getList();
  },
  methods: {
    cancel() {
      this.controlVisible = false;
    },
    handleSizeChange(val) {
      this.searchQuery = Object.assign(this.searchQuery, { page: val });
      this.getList();
    },
    handleCurrentChange(val) {
      this.searchQuery = Object.assign(this.searchQuery, { page: val });
      this.getList();
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.controlType === "edit") {
            configplatformsign.updateSign(this.signForm).then(res => {
              this.controlVisible = false;
              this.getList();
            });
          } else {
            configplatformsign.addSign(this.signForm).then(res => {
              this.controlVisible = false;
              this.getList();
            });
          }
        } else {
          return false;
        }
      });
    },
    resetData() {
      this.signForm = Object.assign({}, this.resetForm);
    },
    editShow(item) {
      configplatformsign.signDetail(item.id).then(res => {
        this.resetData();
        this.signForm = res.data;
        this.controlTitle = "编辑签名";
        this.controlType = "edit";
        this.controlVisible = true;
      });
    },
    createShow() {
      this.resetData();
      this.controlType = "create";
      this.controlTitle = "添加签名";
      this.controlVisible = true;
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
      });
    },
    deleteShow(item) {
      configplatformsign.deleteSign(item.id).then(res => {
        this.getList();
      });
    },
    getList() {
      this.loading = true;
      configplatformsign.signList(this.searchQuery).then(res => {
        this.list = res.data.data;
        this.total = parseInt(res.data.total) || 0;
        this.pageSize = parseInt(res.data.pagesize) || 10;
        this.loading = false;
      },error=>{
        this.loading = false;
      });
    },
    search() {
      this.searchQuery = Object.assign(this.searchQuery, {
        plat_id: this.plat_id,
        sign: this.sign,
        page: 1
      });
      this.getList();
    },
    initSelect() {
      configplatform.allselect().then(res => {
        this.siteList = res.data.site;
        this.platFormList = res.data.plat;
      });
    }
  }
};
</script>

