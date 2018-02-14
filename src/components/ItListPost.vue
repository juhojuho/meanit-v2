<template>
  <div class="it-list-post-container" @click="$router.push(`/post/${it}/${pid}`)">
    <div class="it">
      {{ it }}
    </div>
    <div class="text">
      {{ text }}
    </div>
    <div v-if="type === 'new'" class="time">
      {{ time }}
    </div>
    <div v-if="type === 'trending'" class="trending">
      <img src="../assets/images/kk-black.png" class="kk-black"> {{ kk }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['it', 'text', 'time', 'kk', 'type', 'pid'],
};
</script>

<style scoped>
.it-list-post-container {
  background-color: white;
  margin-bottom: 18px;
  width: 100%;
  text-align: center;
  display: inline-block;
  padding-left: 20px;
  padding-right: 20px;
  cursor: pointer;
}

.it {
  display: inline-block;
  text-align: left;
  width: 20%;
  margin-right: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #393939;
  vertical-align: middle;
  background-color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text {
  display: inline-block;
  text-align: left;
  width: 50%;
  font-size: 13px;
  font-weight: 300;
  color: #8d8d8d;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
  background-color: white;
  margin-right: 10px;
}

.time {
  display: inline-block;
  width: 20%;
  font-size: 13px;
  text-align: left;
  color: #393939;
  vertical-align: middle;
  background-color: white;
}

.trending {
  display: inline-block;
  width: 12%;
  text-align: left;
  font-size: 13px;
  color: #6a6a6a;
  vertical-align: middle;
  background-color: white;
}

.kk-black {
  width: 12px;
  height: 12px;
  object-fit: contain;
  vertical-align: middle;
  background-color: white;
}
</style>
