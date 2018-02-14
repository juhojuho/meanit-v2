<template>
  <div class="user-ranking-container" style="text-align: center;">
    <div v-for="(user, index) in userList" :key="index" style="margin-bottom: 10px; cursor: pointer;" @click="$router.push(`/mypage/${user.uid}`)">
      <div class="index">{{ index + 1 }}</div>
      <img class="round-profile" :src="user.img_url" onerror="this.onerror=null; this.src='https://www.appointbetterboards.co.nz/Custom/Appoint/img/avatar-large.png'">
      <div class="nickname">{{user.nickname}}</div>
      <div class="score">
        <template v-if="rankingType === 'like'">
          {{user.num_like}}점
        </template>
        <template v-else-if="rankingType === 'kk'">
          {{user.my_kk}}ㅋ
        </template>
        <template v-else>
          {{user.num_it}}개
        </template>
      </div>
    </div>
    <img class="bottom" src="../assets/images/right.png" @click="getMore">
  </div>
</template>

<script>
export default {
  data() {
    return {
      userNum: 10,
      userList: [],
    };
  },
  mounted() {
    this.getUserRanking();
  },
  props: ['rankingType'],
  methods: {
    getMore() {
      this.userNum += 10;
      this.getUserRanking();
    },
    getUserRanking() {
      this.userList = [];
      if (this.rankingType === 'like') {
        this.$db.ref('/users/').orderByChild('num_like').limitToLast(this.userNum).once('value')
          .then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
              const data = childSnapshot.val();
              data.uid = childSnapshot.key;
              this.userList.unshift(data);
            });
          });
      } else if (this.rankingType === 'kk') {
        this.$db.ref('/users').orderByChild('my_kk').limitToLast(this.userNum).once('value')
          .then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
              const data = childSnapshot.val();
              data.uid = childSnapshot.key;
              this.userList.unshift(data);
            });
          });
      } else {
        this.$db.ref('/users').orderByChild('num_it').limitToLast(this.userNum).once('value')
          .then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
              const data = childSnapshot.val();
              data.uid = childSnapshot.key;
              this.userList.unshift(data);
            });
          });
      }
    },
  },
};
</script>

<style scoped>
.user-ranking-container {
  border-bottom: solid 1px #eeeeee;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.round-profile {
  width: 35px;
  height: 35px;
  object-fit: cover;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 32px;
}

.index {
  display: inline-block;
  font-size: 18px;
  color: #393939;
  vertical-align: middle;
  margin-right: 27px;
  width: 20px;
}

.nickname {
  display: inline-block;
  font-size: 14px;
  font-weight: bold;
  color: #393939;
  vertical-align: middle;
  width: 40%;
  text-align: left;
}

.score {
  width: 15%;
  display: inline-block;
  font-size: 13px;
  color: #6a6a6a;
  vertical-align: middle;
}

.bottom {
  width: 22px;
  margin-top: 10px;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  cursor: pointer;
}
</style>
