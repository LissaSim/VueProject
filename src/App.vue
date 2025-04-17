<template>
  <AppHeader/>
  <router-view/>
</template>

<script>
import AppHeader from './components/AppHeader.vue';

export default {
  components: {
    AppHeader,
  }
}
</script>

<style lang="scss">
body{
  margin: 0;
  padding: 0
}
#app {
  font-family:Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
  background: linear-gradient(180deg, rgba(63, 15, 94, 0.837) 0%, rgba(255, 255, 255, 0.01) 100%);
  margin: 0;
  padding: 0;
  height: 100vh;
}
</style>
