<template>
  <div class="container">
    <navigation></navigation>
    <search></search>
    <div class="title">
      <span style="font-size: 22px; font-weight: bold;">{{ it }}</span>하면 이거지
    </div>
    <div class="sub-title">
      마음에 드는 포스트에 너의 ㅋ를 날려봐.
    </div>
    <long-post v-for="(user, index) in userInfo" :post="post" :userInfo="user" :isTop="false" :isLong="true" :index="'post'" :key="index"></long-post>
    <div class="bottom-container" @click="$router.push(`/it/${it}`)">
      {{ it }}<span style="font-size: 14px; font-weight: normal;">에 대한</span>
      <br>
      모든 포스트 보러가기
      <img src="../assets/images/bottom.png" class="bottom">
    </div>
  </div>
</template>

<script>
import LongPost from "../components/LongPost";
import Navigation from "../components/Navigation";
import Search from "../components/Search";
import { timestampToDate } from "../assets/js/time";

export default {
  data() {
    return {
      post: {},
      userInfo: [],
      it: ""
    };
  },
  created() {
    this.it = this.$route.params.it;
    this.loadData();
  },
  components: {
    LongPost,
    Navigation,
    Search
  },
  methods: {
    loadData() {
      const pid = this.$route.params.pid;
      let tempUserInfo = {};
      this.$db
        .ref(`it/${pid}`)
        .once("value")
        .then(snapshot => {
          const data = snapshot.val();
          if (data.kk === undefined) {
            data.kk = 0;
          }
          data.pid = pid;
          this.post = data;
          if (data.timestamp === undefined) {
            data.timestamp = 1501851600;
          }
          this.$db
            .ref(`users/${data.user_id}`)
            .once("value")
            .then(userSnapshot => {
              const userData = userSnapshot.val();
              tempUserInfo = userData;
              const date = timestampToDate(data.timestamp);
              tempUserInfo.month = date.month;
              tempUserInfo.date = date.date;
              tempUserInfo.uid = data.user_id;
              this.userInfo.push(tempUserInfo);
            });
        });
    }
  }
};
</script>


<style scoped>
.container {
  text-align: center;
}

.title {
  font-size: 18px;
  font-weight: normal;
  color: #393939;
  margin-bottom: 8px;
  margin-top: 148px;
  padding-right: 30px;
  padding-left: 30px;
}

.sub-title {
  font-size: 14px;
  font-weight: 300;
  color: #393939;
  margin-bottom: 51px;
}

.bottom-container {
  width: 90%;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 24px;
  height: 117px;
  background-color: #ffffff;
  box-shadow: 6px 6px 0 0 rgba(218, 218, 218, 0.29);
  border: solid 1px #eeeeee;
  font-size: 16px;
  color: #ff0072;
  line-height: 1.44;
  font-weight: bold;
  cursor: pointer;
}

.bottom {
  display: block;
  width: 21px;
  margin: 17px auto 0px auto;
}
</style>
