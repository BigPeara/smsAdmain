<template>
  <div class="system-site">
    <lc-row>
      <lc-search>
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="name" placeholder="搜索短信平台名称"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button :disabled="true" type="primary" @click="createShow">添加短信平台</el-button>
          </el-form-item>
        </el-form>
      </lc-search>
    </lc-row>
    <lc-row>
      <lc-panel title="短信平台查询">
        <el-table
          v-loading="loading"
          :data="list"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          border>
          <el-table-column prop="id" label="ID"/>
          <el-table-column prop="name" label="短信平台"/>
          <el-table-column prop="appkey" label="Key"/>
          <el-table-column prop="appid" label="AppId"/>
          <el-table-column prop="mtime" label="更新时间"/>
          <el-table-column prop="remark" label="备注"/>
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
        <el-form label-width="100px" :model="platForm" :rules="rules" ref="ruleForm">
          <el-form-item label="短信平台" prop="name">
            <el-input v-model="platForm.name"/>
          </el-form-item>
          <el-form-item label="Key" prop="appkey">
            <el-input v-model="platForm.appkey"/>
          </el-form-item>
          <el-form-item label="APPID" prop="appid">
            <el-input v-model="platForm.appid"/>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="platForm.remark" type="textarea"/>
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
      name: "",
      total: 0,
      pageSize: 10,
      resetForm: {
        name: "",
        appkey: "",
        appid: "",
        remark: ""
      },
      platForm: {
        name: "",
        appkey: "",
        appid: "",
        remark: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "短信平台不能为空",
            trigger: "blur"
          }
        ],
        appkey: [
          {
            required: true,
            message: "Key不能为空 ",
            trigger: "blur"
          }
        ],
        appid: [
          {
            required: true,
            message: "APPID不能为空",
            trigger: "blur"
          }
        ]
      },
      controlTitle: "新建",
      controlVisible: false,
      controlData: {},
      controlType: "edit",
      list: [],
      searchQuery: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    cancel() {
      this.controlVisible = false;
    },
    handleSizeChange(val) {
      this.searchQuery = Object.assign(this.searchQuery, { page: val });
      this.getList();
      // debugger
    },
    handleCurrentChange(val) {
      this.searchQuery = Object.assign(this.searchQuery, { page: val });
      this.getList();
      // debugger
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.controlType === "edit") {
            configplatform.updatePlatform(this.platForm).then(res => {
              this.controlVisible = false;
              this.getList();
            });
          } else {
            configplatform.addPlatform(this.platForm).then(res => {
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
      this.platForm = Object.assign({}, this.resetForm);
    },
    editShow(item) {
      configplatform.platformDetail(item.id).then(res => {
        this.controlVisible = true;
        this.controlTitle = "编辑短信平台";
        this.controlType = "edit";
        this.platForm = Object.assign({},res.data);
        
      });
    },
    createShow() {
      this.resetData();
      this.controlType = "create";
      this.controlTitle = "添加短信平台";
      this.controlVisible = true;
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
      });
    },
    deleteShow(item) {
      configplatform.deletePlatform(item.id).then(res => {
        this.getList();
      });
    },
    getList() {
      this.loading = true;
      configplatform.platformList(this.searchQuery).then(
        res => {
          this.list = res.data.data;
          this.total = parseInt(res.data.totalCount) || 0;
          this.pageSize = parseInt(res.data.pagesize) || 10;
          this.loading = false;
        },
        error => {
          this.loading = false;
        }
      );
    },
    search() {
      this.searchQuery = Object.assign(this.searchQuery, {
        name: this.name,
        page: 1
      });
      this.getList();
    }
  }
};
</script>

