<template>
  <div class="shops">
    <img :style="imgStyle()" :src="imgUrl" alt="">
    <div class="name">{{ name }}</div>
    <div class="follow">{{ num }}人关注</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      size: '6rem',
      imgUrl: 'https://gss3.bdstatic.com/7Po3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=18c3b5d4753e6709be0042f903fcf800/7acb0a46f21fbe09d4268ae761600c338644adcd.jpg',
      name: '三只松鼠',
      num: 10022
    }
  },
  methods: {
    imgStyle() {
      return `width:${this.size};height:${this.size}`
    }
  }
}
</script>
<style scoped>
    .shops{
        text-align: center;
    }
    .shops img{
        border-radius: 100%;
    }
</style>

