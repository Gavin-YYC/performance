<template lang="html">
  <div class="app-container flex-column">
    <ui-header></ui-header>
    <main class="main-wrap flex-row">
      <ui-menu></ui-menu>
      <ui-content></ui-content>
    </main>
    <ui-footer></ui-footer>
  </div>
</template>

<script>
import uiHeader from '../components/header/header.vue';
import uiFooter from '../components/footer/footer.vue';
import uiContent from '../components/content/content.vue';
import uiMenu from '../components/menu/menu.vue';

export default {
  components: {
    uiHeader,
    uiFooter,
    uiContent,
    uiMenu
  }
}
</script>

<style lang="less">
.app-container {
  background-color: #ececec;
}
.main-wrap {
  width: 95%;
  margin: 10px auto;
  background-color: #fff;
}
</style>
