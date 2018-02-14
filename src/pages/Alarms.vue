<template>
  <div class="container">
    <navigation></navigation>
    <div div class="title">
      나의 알림
    </div>
    <alarm v-for="(alarm, index) in alarms" :key="index" :alarm="alarm">
    </alarm>
  </div>
</template>


<script>
import Alarm from '../components/Alarm';
import Navigation from '../components/Navigation';

export default {
  computed: {
    alarms() {
      return this.$store.state.alarms;
    },
    user() {
      return this.$store.state.user;
    },
  },
  components: {
    Alarm,
    Navigation,
  },
  beforeMount() {
    this.$store.commit('setAlarmsTime');
  },
  beforeDestroy() {
    this.alarms.forEach((alarm) => {
      if (!alarm.read) {
        this.$db.ref(`/alarms/${this.user.uid}/${alarm.aid}/read`).set(true);
      }
    });
    this.$store.commit('setAllAlramsRead');
  },
};
</script>


<style scoped>
.container {
  margin-top: 69px;
  background-color: #fafafa;
}
.title {
  font-size: 18px;
  font-weight: 900;
  text-align: center;
  color: #393939;
  margin-bottom: 13px;
}
</style>
