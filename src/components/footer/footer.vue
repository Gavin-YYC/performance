<template lang="html">
  <footer class="footer">
    <div class="footer__left">
      git地址
    </div>
    <div class="footer__center">
      参考文档
    </div>
    <div class="footer_right">
      icp
    </div>
  </footer>
</template>

<script>
export default {
}
</script>

<style lang="less">
@import "../../libs/css/var.less";
.footer {
  width: 95%;
  height: 100px;
  padding: 0 2.5%;
  background: #fff;
  .flex-row;
  .flex-h-between;
}
</style>
