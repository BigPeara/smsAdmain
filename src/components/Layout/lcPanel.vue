<template>
  <div class="lc-panel">
    <div v-if="title" class="lc-panel-header">
      <span>{{ title }}</span>
    </div>
    <div class="lc-panel-section">
      <slot/>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style scoped>
    .lc-panel{
        border: 1px solid #ebeef5;
    }
    .lc-panel-header{
        padding: 0 20px;
        line-height: 40px;
        border-bottom: 1px solid #ebeef5;
        background-color: #f5f7fa;
    }
    .lc-panel-section{
        padding: 20px;
    }
</style>

