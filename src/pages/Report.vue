<template>
  <div class="container">
    <div style="text-align: right">
      <img src="../assets/images/exit.png" class="exit" @click="back">
    </div>
    <img src="../assets/images/kong-cop.png" class="cop">
    <div class="title">
      신고하기
    </div>
    <div class="sub-title">
      건전하고 깨끗한 미닛, 우리가 만들어 나갑니다.
    </div>
    <div class="option">
      <div class="text">
        부적절한 홍보 및 광고성 게시물
      </div>
      <div class="checkbox" :class="{'pink': ad}" @click="ad = !ad">
      </div>
    </div>
    <div class="option">
      <div class="text">
        음란성 또는 청소년에게 부적합한 내용
      </div>
      <div class="checkbox" :class="{'pink': sex}" @click="sex = !sex">
      </div>
    </div>
    <div class="option">
      <div class="text">
        특정인 대상의 비방/욕설
      </div>
      <div class="checkbox" :class="{'pink': sibal}" @click="sibal = !sibal">
      </div>
    </div>
    <div class="option">
      <div class="text">
        명예훼손/사생활 침해/저작권 침해 등
      </div>
      <div class="checkbox" :class="{'pink': abuse}" @click="abuse = !abuse">
      </div>
    </div>
    <div class="option">
      <div class="text">
        지역, 인종, 성별 등에 대한 차별적 발언
      </div>
      <div class="checkbox" :class="{'pink': disc}" @click="disc = !disc">
      </div>
    </div>
    <div class="option">
      <div class="text">
        기타
      </div>
      <div class="checkbox" :class="{'pink': etc}" @click="etc = !etc">
      </div>
    </div>
    <img src="../assets/images/button-confirm.png" class="button" @click="send">
    <img src="../assets/images/meanit-logo.png" class="logo">
  </div>
</template>

<script>
export default {
  data() {
    return {
      ad: false,
      sex: false,
      sibal: false,
      abuse: false,
      disc: false,
      etc: false,
    };
  },
  computed: {
    verified() {
      return this.ad || this.sex || this.sibal || this.abuse || this.disc || this.etc;
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    send() {
      if (this.verified) {
        this.$db.ref('reports').push({
          ad: this.ad,
          sex: this.sex,
          sibal: this.sibal,
          abuse: this.abuse,
          disc: this.disc,
          etc: this.etc,
          timestamp: this.$firebase.database.ServerValue.TIMESTAMP,
          pid: this.$route.params.pid,
          uid: this.user.uid,
        });
        this.$router.go(-1);
      }
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
}

.cop {
  width: 101px;
  margin-bottom: 12px;
  margin-top: 18px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #393939;
  margin-bottom: 3px;
}

.sub-title {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.57;
  text-align: center;
  color: #393939;
  margin-bottom: 20px;
}

.option {
  margin-bottom: 16px;
}

.text {
  display: inline-block;
  text-align: left;
  width: 200px;
  font-size: 12px;
  line-height: 1.67;
  color: #393939;
  margin-right: 50px;
}

.checkbox {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 3px;
  background-color: #d8d8d8;
}

.pink {
  background-color: #ff0072;
}

.button {
  width: 126px;
  margin-bottom: 52px;
  margin-top: 10px;
  display: inline-block;
}

.logo {
  display: block;
  margin-right: auto;
  margin-left: auto;
  width: 80px;
}
</style>
