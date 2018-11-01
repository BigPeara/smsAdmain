<template>
  <div class="common-search">
    <div v-for="(item, index) in data" :key="index" class="search-item">
      <div v-if="'text'===item.type || 'number'===item.type">
        <div class="search-label">{{ item.label }}</div>
        <div class="search-input">
          <el-input v-model="form[item.model]" :type="item.type" :placeholder="item.placeholder || item.label" size="small" @keyup.enter.native="onSearch"/>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: [
        {
          label: '状态',
          type: 'select',
          model: 'status',
          data: [
            { id: 0, name: '未完成' },
            { id: 1, name: '已完成' },
            { id: 2, name: '已终止' }
          ]
        }
      ]
    }
  }
}
</script>

