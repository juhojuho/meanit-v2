<template>
  <div class="container">
    <navigation></navigation>
    <search></search>
    <div v-for="(it, index) in its" class="it" :key="index" @click="$router.push(`/it/${it}`)">
      {{ it }}
    </div>
  </div>
</template>

<script>
import Navigation from '../components/Navigation';
import Search from '../components/Search';

export default {
  computed: {
    its() {
      return this.$store.state.its;
    },
  },
  components: {
    Navigation,
    Search,
  },
};
</script>

<style scoped>
.container {
  margin-top: 144px;
}

.it {
  display: inline-block;
  font-size: 13px;
  width: 50%;
  font-weight: 500;
  text-align: center;
  color: #393939;
  margin-bottom: 7px;
  cursor: pointer;
}
</style>
