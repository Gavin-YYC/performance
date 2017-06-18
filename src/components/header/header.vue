<template lang="html">
  <header class="header">
    <span class="header__title">前端性能数据平台</span>
    <nav></nav>
  </header>
</template>

<script>
export default {
}
</script>

<style lang="less">
@import "../../libs/css/var.less";
.header {
  height: 80px;
  width: 95%;
  padding: 0 2.5%;
  background-color: #fff;
  .flex-row;
  .flex-h-between;
  .flex-v-center;
}
.header__title {
  font-size: 18px;
}
</style>
