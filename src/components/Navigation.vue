<template>
  <div class="nav-container">
    <div style="position: relative">
      <img src="../assets/images/meanit-beta-logo.png" class="logo" @click="$router.push('/')">
      <div v-if="unread" class="unread-sign">
        {{ unread }}
      </div>
      <img src="../assets/images/alarm.png" class="alarm" @click="toAlarm">
      <img src="../assets/images/profile.png" class="profile" @click="toProfile">
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    unread() {
      return this.$store.state.unread;
    },
  },
  methods: {
    toProfile() {
      if (this.$store.state.user) {
        this.$router.push(`/mypage/${this.$store.state.user.uid}`);
      } else {
        this.$router.push('/login');
      }
    },
    toAlarm() {
      if (this.$store.state.user) {
        this.$router.push(`/alarm/${this.$store.state.user.uid}`);
      } else {
        this.$router.push('/login');
      }
    },
  },
};
</script>


<style scoped>
.nav-container {
  position: fixed;
  top: 0;
  width: 100%;
  height: 64px;
  padding-top: 20px;
  z-index: 100;
  background-color: #fbfbfb;
}

@media all and (min-width: 412px) {
  .nav-container {
    width: 412px;
  }
}

.logo {
  position: absolute;
  height: 21px;
  object-fit: contain;
  left: 18px;
  cursor: pointer;
}

.alarm {
  position: absolute;
  height: 20px;
  object-fit: contain;
  right: 60px;
  cursor: pointer;
}

.unread-sign {
  position: absolute;
  background-color: red;
  color: white;
  width: 14px;
  height: 14px;
  font-size: 10px;
  line-height: 14px;
  text-align: center;
  border-radius: 50%;
  right: 54px;
  top: 0px;
  z-index: 100;
}

.profile {
  position: absolute;
  height: 21px;
  object-fit: contain;
  right: 8px;
  cursor: pointer;
}

</style>
