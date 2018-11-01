<template>
  <el-menu class="navbar" mode="horizontal">
    <div class="logo"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAA8CAYAAACEhkNqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0OGNjZDdiZi1kMDQxLTRlYzYtODMzNC1hMzhhZGQ3ZWQxN2QiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEJCMkM2NzFBQ0UyMTFFOEIyQjFDNzhCMUZCRTRFMEUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEJCMkM2NzBBQ0UyMTFFOEIyQjFDNzhCMUZCRTRFMEUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozYWY4ZTk5MC00OGQxLTQ1OWQtOGY0Zi1lZGZmNDAxOGUwYzIiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjNzYzYzEyOS1mNTU0LTExN2ItYjQ3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"/></div>
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>

    <!-- <breadcrumb class="breadcrumb-container"/> -->

    <div class="right-menu">
      <error-log class="errLog-container right-menu-item"/>

      <!-- <el-tooltip content="全屏" effect="dark" placement="bottom">
        <screenfull class="screenfull right-menu-item"/>
      </el-tooltip> -->

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img src="@/assets/face.jpg" class="user-avatar">
          <span>{{ managerName }}</span>
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/account">
            <el-dropdown-item>
              账户信息
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <div @click="logout">
              退出
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import ThemePicker from '@/components/ThemePicker'
import account from '@/api/account.js'
import Cookies from 'js-cookie'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    ThemePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ]),
    managerName() {
      return Cookies.get('username') || 'admin'
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      account.logOut().then(res => {
        this.$router.push({ path: '/login' })
      }).catch(() => {
        this.$router.push({ path: '/login' })
      })

      // this.$store.dispatch('LogOut').then(() => {
      //   location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      // })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.logo{height: 100%;float: left;padding: 0 10px;}
.navbar {
  height: 60px;
  line-height: 60px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 60px;
    height: 60px;
    float: left;
    padding: 0 10px;
    display: flex;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 60px;
      margin-right: 30px;
      .avatar-wrapper {
        display: flex;
        align-items: center;
        height: 100%;
        cursor: pointer;
        // margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 20px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
