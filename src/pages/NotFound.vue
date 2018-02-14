<template>
  <div class="container">
    <div style="text-align: right">
      <img src="../assets/images/exit.png" class="exit" @click="back">
    </div>
    <img src="../assets/images/not-found.png" class="not-found">
    <div class="title">
      죄송합니다!
    </div>
    <div class="sub-title">
      검색하신 단어는 아직 미닛에 없습니다.</br>직접 추가해보시겠어요?
    </div>
    <img src="../assets/images/button-back.png" class="button" style="margin-right: 7px" @click="back">
    <img src="../assets/images/button-add.png" class="button" @click="$router.push(`/add?it=${$route.query.it}`)">
  </div>
</template>

<script>
export default {
  methods: {
    back() {
      this.$router.go(-1);
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

.not-found {
  display: block;
  width: 117px;
  margin: 92px auto 0px auto;
}

.title {
  font-size: 22px;
  font-weight: bold;
  line-height: 1.32;
  text-align: center;
  color: #393939;
  margin-top: 22px;
}

.sub-title {
  font-size: 16px;
  line-height: 1.31;
  text-align: center;
  color: #393939;
  margin-top: 12px;
}

.button {
  width: 120px;
  margin-top: 38px;
}
</style>
