<template lang="html">
  <section class="main-menu">
    <ul class="main-menu__list">
      <li class="main-menu__item">全局预览</li>
      <li class="main-menu__item main-menu__item--selected">性能统计</li>
      <li class="main-menu__item">资源统计</li>
      <li class="main-menu__item main-menu__group">
        <p class="main-menu__group-title">定位分析</p>
        <ul class="main-menu__list main-menu__group-list">
          <li class="main-menu__item main-menu__group-item">白屏时间</li>
          <li class="main-menu__item main-menu__group-item">首屏时间</li>
        </ul>
      </li>
      <li class="main-menu__item">浏览器</li>
      <li class="main-menu__item">版本分析</li>
      <li class="main-menu__item">网络环境</li>
      <li class="main-menu__item">错误跟踪</li>
      <li class="main-menu__item">任务调度</li>
      <li class="main-menu__item">站点管理</li>
    </ul>
  </section>
</template>

<script>
export default {
}
</script>

<style lang="less">
.main-menu {
  width: 200px;
  margin: 20px 0;
  border-right: 1px solid #e9e9e9;
}
.main-menu__item {
  height: 42px;
  line-height: 42px;
  padding: 0 16px 0 22px;
  cursor: pointer;
  transition: all 0.2s;
}
.main-menu__item:hover {
  color: #108ee9;
}
.main-menu__item--selected {
  color: #108ee9;
  background-color: #ecf6fd;
  border-right: 3px solid #108ee9;
}
.main-menu__group {
  height: auto;
}
.main-menu__group-item {
  font-size: 12px;
}
</style>
