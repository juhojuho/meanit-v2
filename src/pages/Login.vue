<template>
  <div class="container">
    <div style="text-align: right">
      <img src="../assets/images/exit.png" class="exit" @click="back">
    </div>
    <img src="../assets/images/welcome.png" class="welcome">
    <div class="title">
      로그인하고 미니터 되자.
    </div>
    <div class="sub-title">
      이중 하나는 쓰겠지?
    </div>
    <img src="../assets/images/facebook-button.png" @click="signInWithFacebook" class="button">
    <img src="../assets/images/google-button.png" @click="signInWithGoogle" class="button">
    <img src="../assets/images/meanit-logo.png" class="logo">
  </div>
</template>

<script>
export default {
  methods: {
    back() {
      this.$router.go(-1);
    },
    signInWithGoogle() {
      const provider = new this.$firebase.auth.GoogleAuthProvider();
      this.$firebase.auth().signInWithRedirect(provider);
      this.$router.push('/loading');
    },
    signInWithFacebook() {
      const provider = new this.$firebase.auth.FacebookAuthProvider();
      this.$firebase.auth().signInWithRedirect(provider);
      this.$router.push('/loading');
    },
  },
};
</script>


<style scoped>
.container {
  text-align: center;
}

.exit {
  width: 25px;
  margin-top: 22px;
  margin-right: 26px;
  cursor: pointer;
}

.welcome {
  display: block;
  width: 80px;
  margin: 92px auto 0px auto;
}

.title {
  font-size: 22px;
  font-weight: bold;
  line-height: 1.36;
  color: #393939;
  margin-top: 22px;
}

.sub-title {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.57;
  color: #ff0072;
  margin-top: 28px;
}

.button {
  width: 149px;
  display: block;
  margin: 12px auto 0px auto;
  cursor: pointer;
}

.logo {
  margin-top: 125px;
  width: 80px;
}
</style>

