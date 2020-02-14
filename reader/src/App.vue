<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { SharedInfo } from "./services/store";
export default {
  name: "App",
  data() {
    return {
      shared: SharedInfo
    };
  },
  mounted() {}
};
</script>
