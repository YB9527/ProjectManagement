<template>

  <div id="app">
    <router-view name="Top"></router-view>
    <div class="container">
      <!--  <router-view name="Left" class="left"></router-view>-->
      <transition model="out-in">
        <router-view class="main"></router-view>
      </transition>
    </div>
  </div>

</template>

<script>
  import Top from '@/components/index/Top'
  import Left from '@/components/index/Left'
  import axios from 'axios'
  import Content from "../index/Content";

  export default {
        name: "Frontpage",


  }
</script>

<style scoped>

</style>
