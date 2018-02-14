<template>
  <div class="container" @click="$router.push('/glossary')">
    <div class="circle" style="margin-right: 19px;">
      <div class="circle-text">누적 단어 수</div>
      <div class="circle-num">{{ total.it }}</div>
    </div>
    <div class="circle" style="margin-right: 19px;">
      <div class="circle-text">누적 리액션 수</div>
      <div class="circle-num">{{ total.kk }}</div>
    </div>
    <div class="circle">
      <div class="circle-text">
        누적 게시물 수
      </div>
      <div class="circle-num">{{ total.post }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: {},
    };
  },
  created() {
    this.$db.ref('/home/total').once('value').then((snapshot) => {
      this.total = snapshot.val();
    });
  },
};
</script>

<style scoped>
.circle {
  display: inline-block;
  text-align: center;
  margin-bottom: 60px;
  margin-top: 27px;
  cursor: pointer;
}

.circle-text {
  width: 70px;
  font-size: 10px;
  color: #6a6a6a;
  margin: auto;
}

.circle-num {
  width: 70px;
  font-size: 16px;
  color: #6a6a6a;
  margin: auto;
  margin-top: 8px;
}
</style>
