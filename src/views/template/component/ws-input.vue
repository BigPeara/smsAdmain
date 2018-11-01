<template>
  <div class="ws-input">
    <input :type="type" :placeholder="text" class="input">
  </div>
</template>
<script>
export default {
  name: 'WsInput',
  props: {
    type: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    }
  }
}
</script>
<style scoped>
  .ws-input{height: 36px;line-height: 36px;margin-right: 15px;}
 .ws-input .input{height: 100%;border: 1px solid #ccc;border-radius: 4px;}
  .ws-input .input::placeholder{
    font-size: 14px;
    color: #ccc;
  }
</style>

