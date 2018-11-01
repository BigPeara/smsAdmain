<template>
  <div class="common-pagination">
    <el-pagination
      :current-page.sync="current"
      :page-size="100"
      :total="total"
      layout="prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>
  </div>
</template>
<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      current: 1
    }
  },
  created() {
    this.initCurrent()
  },
  methods: {
    routerPush(val) {
      const path = this.$route.path
      let query = this.$route.query
      query = Object.assign({}, query, { page: val })
      this.$router.push({ path, query })
    },
    initCurrent() {
      const query = this.$route.query
      if (query && query.page) {
        this.current = query.page
      } else {
        this.current = 1
      }
    },
    handleSizeChange(val) {
      this.routerPush(val)
    },
    handleCurrentChange(val) {
      this.routerPush(val)
    }
  }
}
</script>

