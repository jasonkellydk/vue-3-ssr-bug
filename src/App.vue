<template>
  <div class="fancy-styling">
    <h1>Hallo world</h1>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";

export default defineComponent({
  name: 'App',
  setup() {
    const fancyTheme = ref({
      backgroundColor: 'green',
      width: '250px',
      height: '250px'
    });

    return {
      fancyTheme
    }
  }
})
</script>

<style>
html, body {
  height: 100%;
}

#app {
  display: flex;
  align-items: center;
  justify-content: center;
}

.fancy-styling {
  width: v-bind('fancyTheme.width');
  height: v-bind('fancyTheme.height');
  background-color: v-bind('fancyTheme.backgroundColor');
}
</style>
