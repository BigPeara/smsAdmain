<template>
  <div class="temp">
    <div class="temp-header">
      <ws-input type="text" text="搜索模板关键字"/>
      <el-row>
        <el-button type="primary">主要按钮</el-button>
        <el-button type="primary">新建模板</el-button>
      </el-row>
    </div>
    <div class="todlist">
      <div class="todlist-title">短信模板</div>
      <div class="todlist-container">
        <div class="todlist-item">
          <p v-for="item in temps" class="sub-item">{{ item }}</p>
        </div>
        <div class="todlist-bar">
          <p class="sub-bar"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Temp from '@/api/temp'
import wsInput from './components/ws-input.vue'
export default {
  name: 'Temp',
  components: {
    Temp,
    wsInput
  },
  data() {
    return {
      arr: [],
      temps: ['ID', '模板名称', '模板类型', '模板内容', '更新时间', '操作']
    }
  },
  created() {
    this.temp()
  },
  methods: {
    temp() {
      Temp.tempadmin(this).then((res) => {
        if (res.status === 200) {
          if (res.data.code === 200) {
            this.arr.push(res.data.data.list[0])
            for (var k in this.arr) {
              for (var i in this.arr[k]) {
                console.log(this.arr[k][i])
              }
            }
          }
        }
      })
    }
  }
}
</script>
<style scoped>
  .temp{margin: 10px;}
 .temp .temp-header{
   display: flex;
   padding: 20px 30px;
   background-color: #99999987;
  }
  .todlist{margin-top: 20px;border: 1px solid #ccc;}
  .todlist .todlist-title{background-color: #99999987;font-size: 18px;color: #333;padding: 15px 30px;}
  .todlist .todlist-item{display: flex;justify-content: space-around;margin: 0 20px;line-height: 48px;border-bottom: 1px solid #666;}
  .todlist .sub-item{margin: 0;padding: 0;}
</style>

