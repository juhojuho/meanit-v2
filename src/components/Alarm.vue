<template>
  <div class="alarm-container" :class="{'read': alarm.read}">
    <div v-if="alarm.type==='welcome'">
      <img src="../assets/images/alarm-welcome.png" class="alarm-image">
      <div class="alarm-content">
        <div class="alarm-text">
          미닛에 온 것을 환영하오, 낯선 이여.
        </div>
        <div class="alarm-time">
          {{ alarm.time }}
        </div>
      </div>
    </div>
    <div v-else-if="alarm.type==='kk'" style="cursor: pointer" @click="$router.push(`/post/${alarm.it}/${alarm.pid}`)">
      <img src="../assets/images/kk.png" class="alarm-image">
      <div class="alarm-content">
        <div class="alarm-text">
          <b>{{ alarm.from }}</b>님이 <b>{{ alarm.it }}</b>에 ㅋ를 <b>{{ alarm.kk }}</b>번 눌렀습니다.
        </div>
        <div class="alarm-time">
          {{ alarm.time }}
        </div>
      </div>
    </div>
    <div v-else-if="alarm.type==='100kk'" style="cursor: pointer" @click="$router.push(`/post/${alarm.it}/${alarm.pid}`)">
      <img src="../assets/images/alarm-100kk.png" class="alarm-image">
      <div class="alarm-content">
        <div class="alarm-text">
          <b>{{ alarm.it }}</b>이(가) ㅋ를 <b>{{ alarm.kk }}</b>번 받았습니다.
        </div>
        <div class="alarm-time">
          {{ alarm.time }}
        </div> 
      </div>
    </div>
    <div v-else-if="alarm.type==='top'" style="cursor: pointer" @click="$router.push(`/post/${alarm.it}/${alarm.pid}`)">
      <img src="../assets/images/alarm-top.png" class="alarm-image">
      <div class="alarm-content">
        <div class="alarm-text">
          우리의 <b>{{ alarm.it }}</b>이(가) 1위를 탈환했습니다!
        </div>
        <div class="alarm-time">
          {{ alarm.time }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['alarm'],
};
</script>


<style scoped>
.alarm-container {
  background-color: white;
  width: 100%;
  margin: auto;
  border-top: solid 1px #eeeeee;
  padding: 15px 24px 15px 24px;
}

.alarm-image {
  width: 30px;
  height: 30px;
  object-fit: contain;
  margin-right: 28px;
  vertical-align: middle;
}

.alarm-content {
  display: inline-block;
  vertical-align: middle;
}

.alarm-text {
  font-size: 12px;
  color: #393939;
}

.alarm-time {
  font-size: 8px;
  color: #8d8d8d;
  margin-top: 6px;
}

.read {
  background-color: #fafafa;
  color: #8d8d8d;
}
</style>
