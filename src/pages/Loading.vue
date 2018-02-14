<template>
  <div class="container">
    <square-loader :loading="loading" :color="color" class="loader" :size="size"></square-loader>
  </div>
</template>

<script>
import SquareLoader from 'vue-spinner/src/SquareLoader';

export default {
  data() {
    return {
      loading: true,
      color: '#ff0072',
      size: '80px',
    };
  },
  components: {
    SquareLoader,
  },
  mounted() {
    if (this.$route.query.next) {
      const encode = encodeURIComponent(this.$route.query.next);
      setTimeout(() => {
        this.$router.push(`/it/${encode}`);
      }, 1000);
    }
  },
};
</script>

<style scoped>
.container {
  vertical-align: middle;
  margin: auto;
  text-align: center;
}

.loader {
  position: fixed;
  width: 80px;
  height: 80px;
  left: 50%;
  top: 50%;
  margin-left: -40px;
  margin-top: -40px;
}
</style>

