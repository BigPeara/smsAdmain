<template>
  <div class="account-info">
    <lc-panel title="账号信息">
      <el-button class="add-btn" size="small" @click="addUserShow">添加用户</el-button>
      <lc-row>
        <el-form label-width="100px" :model="changeForm" :rules="changeRules" ref="changeForm">
          <el-form-item label="账号">
            {{ managerName }}
          </el-form-item>
          <el-form-item label="原密码" prop="password">
            <el-input v-model="changeForm.password" type="password"/>
          </el-form-item>
          <el-form-item label="新密码" prop="newpwd">
            <el-input v-model="changeForm.newpwd" type="password"/>
          </el-form-item>
          <el-form-item label="确认密码" prop="currentpwd">
            <el-input v-model="changeForm.currentpwd" type="password"/>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="resetChange">重置</el-button>
            <el-button type="primary" size="small" @click="submit">确认</el-button>
          </el-form-item>
        </el-form>
      </lc-row>
    </lc-panel>
    <el-dialog :visible.sync="addVisible" title="添加用户" width="500px">
      <el-form ref="ruleForm" :rules="rules" :model="userForm" label-position="left" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" type="text" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" type="text" placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="addVisible=false">取消</el-button>
          <el-button type="primary" @click="addUser">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import lcRow from '@/components/Layout/lcRow.vue'
import lcPanel from '@/components/Layout/lcPanel.vue'
import Cookies from 'js-cookie'
import account from '@/api/account.js'
export default {
  components: {
    lcRow,
    lcPanel
  },
  data() {
    var validateNewpwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value !== this.changeForm.currentpwd && this.changeForm.currentpwd != '') {
          callback(new Error('两次输入密码不一致!'));
        }else {
          callback();
        }
      };
    var validateCurrentpwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.changeForm.newpwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
    };
    return {
      addVisible: false,
      resetForm: {
        password: '',
        newpwd: '',
        currentpwd: ''
      },
      changeForm: {
        password: '',
        newpwd: '',
        currentpwd: ''
      },
      userForm: {
        username: '',
        password: ''
      },
      changeRules:{
        password: [
          {
            required: true,
            message: '原密码不能为空！',
            trigger: 'blur'
          }
        ],
        newpwd: [
          {
            validator: validateNewpwd, trigger: 'change'
          }
        ],
        currentpwd: [
          {
            validator: validateCurrentpwd, trigger: 'change'
          }
        ]
      },
      rules: {
        username: [
          {
            required: true,
            message: '用户名不能为空！',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    managerName() {
      return Cookies.get('username') || 'admin'
    }
  },
  methods: {
    addUserShow() {
      this.userForm.username = ''
      this.userForm.password = ''
      this.addVisible = true
    },
    resetChange() {
      this.changeForm = Object.assign({}, this.resetForm)
    },
    submit() {
      this.$refs.changeForm.validate(valid => {
        if (valid) {
          account.changePwd(this.changeForm).then(res => {
            this.resetChange()
          })
        } else {
          return false
        }
      })
    },
    addUser() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          account
            .addManger({ username: this.userForm.username, password: this.userForm.password })
            .then(res => {
              this.addVisible = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
.account-info {
  position: relative;
  margin: 30px auto;
  max-width: 600px;
}
.add-btn {
  position: absolute;
  top: 5px;
  right: 20px;
}
</style>

