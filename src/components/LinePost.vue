<template>
  <div class="line-post-container">
    <div class="it">
      <div class="name" @click="$router.push(`/it/${it}`)">{{ it }}</div>
      <div v-if="!folded" class="text">{{ text }}</div>
      <div v-if="folded" class="text" style="width: 190px;"></div>
      <img v-if="!folded" src="../assets/images/unfold-red.png" class="unfold" @click="fold">
      <img v-if="folded" src="../assets/images/fold-red.png" class="unfold" @click="unfold">
    </div>
    <div v-show="folded" class="post">
      <long-post v-for="(userInfo, index) in userInfo" :post="post" :userInfo="userInfo" :isTop="false" :isLong="false" :index="post.pid" :key="index"></long-post>
    </div>
  </div>
</template>

<script>
import LongPost from '../components/LongPost';
import { timestampToDate } from '../assets/js/time';

export default {
  data() {
    return {
      folded: false,
      post: {},
      userInfo: [],
    };
  },
  props: ['it', 'text', 'postKey'],
  methods: {
    fold() {
      this.folded = true;
      this.$db.ref(`/it/${this.postKey}`).once('value').then((itSnapshot) => {
        const itData = itSnapshot.val();
        if (itData) {
          this.$db.ref(`/users/${itData.user_id}`).once('value').then((userSnapshot) => {
            const userData = userSnapshot.val();
            if (userData) {
              if (itData.kk === undefined) {
                itData.kk = 0;
              }
              itData.pid = this.postKey;
              if (itData.timestamp === undefined) {
                itData.timestamp = 1501585200;
              }
              const date = timestampToDate(itData.timestamp);
              userData.month = date.month;
              userData.date = date.date;
              userData.uid = itData.user_id;
              if (userData.img_url === undefined) {
                userData.profileurl = 'https://www.appointbetterboards.co.nz/Custom/Appoint/img/avatar-large.png';
              } else {
                userData.profileurl = userData.img_url;
              }
              this.post = itData;
              this.userInfo.push(userData);
            }
          });
        }
      });
    },
    unfold() {
      this.folded = false;
    },
  },
  components: {
    LongPost,
  },
  watch: {
    $route() {
      location.reload();
    },
  },
};
</script>

<style scoped>
.name {
  display: inline-block;
  width: 90px;
  text-align: left;
  font-size: 16px;
  font-weight: 600;
  color: #393939;
  vertical-align: middle;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.text {
  display: inline-block;
  width: 190px;
  text-align: left;
  font-size: 13px;
  color: #6a6a6a;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 12px;
}

.line-post-container {
  margin-bottom: 25px;
  text-align: center;
}

.unfold {
  width: 14px;
  height: 14px;
  object-fit: contain;
  cursor: pointer;
}

.fold {
  width: 14px;
  height: 14px;
  object-fit: contain;
  margin-top: 24px;
  margin-left: 309px;
  margin-bottom: 20px;
  cursor: pointer;
}

.post {
  margin-top: 18px;
}
</style>
