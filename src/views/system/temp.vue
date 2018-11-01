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
          <el-form-item label="模板名称">
            <el-input v-model="name" placeholder="搜索模板名称"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="createShow">新增</el-button>
          </el-form-item>
        </el-form>
      </lc-search>
    </lc-row>
    <lc-row>
      <lc-panel title="模板查询">
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
         :data="list" border stripe>
          <el-table-column prop="id" label="ID"/>
          <el-table-column prop="name" label="模板名称"/>
          <el-table-column prop="plat_name" label="短信平台"/>
          <el-table-column label="模板内容">
               <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="scope.row.content" placement="top-start">
                    <span>
                        {{scope.row.short_content}}
                       <i class="el-icon-view"></i>
                    </span>
                  </el-tooltip>
              </template>
          </el-table-column>
          <el-table-column prop="mtime" label="更新时间"/>
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
        <el-form label-width="100px" :model="tempForm" :rules="rules" ref="ruleForm">
          <el-form-item label="短信平台" prop="plat_id">
            <el-select v-model="tempForm.plat_id" placeholder="请选择短信平台">
              <el-option
                v-for="item in platFormList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="模板ID" prop="template_id">
            <el-input v-model="tempForm.template_id" type="text"/>
          </el-form-item>
          <el-form-item label="模板名称" prop="name">
            <el-input v-model="tempForm.name" type="text"/>
          </el-form-item>
          <el-form-item label="模板内容">
            <el-input v-model="tempForm.content" type="textarea"/>
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
import configplatform from "@/api/configplatform";
import plattemp from "@/api/plattemp";
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
      name: "",
      total: 0,
      pageSize: 10,
      platFormList: [],
      resetForm: {
        name: "",
        content: "",
        plat_id: null,
        template_id: null
      },
      tempForm: {
        name: "",
        content: "",
        plat_id: null,
        template_id: null
      },
      controlTitle: "新建",
      controlVisible: false,
      controlData: {},
      controlType: "edit",
      list: [],
      searchQuery: {},
      rules: {
        template_id: [{
          required: true, message: '模板ID不能为空', trigger: 'blur'
        }],
        plat_id:[{
          required: true, message: '请选择短信平台 ', trigger: 'change'
        }],
        name: [{
          required: true, message: '模板名称不能为空', trigger: 'blur'
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
      this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (this.controlType === "edit") {
              plattemp.updatePlattemp(this.tempForm).then(res => {
                this.controlVisible = false;
                this.getList();
              });
            } else {
              plattemp.addPlattemp(this.tempForm).then(res => {
                this.controlVisible = false;
                this.getList();
              });
             }
          } else {
            console.log('error submit!!');
            return false;
          }
      });
    },
    resetData() {
      this.tempForm = Object.assign({}, this.resetForm);
    },
    editShow(item) {
      plattemp.plattempDetail(item.id).then(res => {
        this.resetData();
        this.tempForm = res.data;
        this.controlTitle = "编辑模板";
        this.controlType = "edit";
        this.controlVisible = true;
      });
    },
    createShow() {
      this.resetData();
      this.controlType = "create";
      this.controlTitle = "新建模板";
      this.controlVisible = true;
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
      });
    },
    deleteShow(item) {
      plattemp.deletePlattemp(item.id).then(res => {
        this.getList();
      });
    },
    getList() {
      this.loading = true;
      plattemp.plattempList(this.searchQuery).then(res => {
        this.list = res.data.list;
        this.total = parseInt(res.data.total) || 0;
        this.pageSize = parseInt(res.data.pagesize) || 10;
        this.loading = false;
      },error=>{
        this.loading = false;
      });
    },
    search() {
      this.searchQuery = Object.assign(this.searchQuery, {
        page: 1,
        plat_id: this.plat_id,
        name: this.name
      });
      this.getList();
    },
    initSelect() {
      configplatform.platformList().then(res => {
        this.platFormList = res.data.data;
      });
    }
  }
};
</script>

