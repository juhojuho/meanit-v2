<template>
  <div class="today-it-container" @click="$router.push(`/post/${post.name}/${pid}`)">
    <div v-if="shown" class="date">
      {{ date.month }}월 {{ date.date }}일
    </div>
    <div v-if="shown" class="title" :class="{'small-font': post.name.length > 20}">
      {{ post.name }}
    </div>
    <div v-if="shown" class="content">
      {{ post.text }}
    </div>
    <div v-if="shown" class="user-info">
      <profile :url="user.img_url" :nickname="user.nickname" :month="10" :date="1" :isTop="false" :index="index" :isLong="false" :uid="user.uid"></profile>
    </div>
    <div v-if="shown" class="kk-container">
      <img src="../assets/images/kk.png" class="kk">
      <span class="kk-num">
        {{ post.kk }}
      </span>
    </div>
  </div>
</template>

<script>
import Profile from "../components/Profile";

export default {
  props: ["post", "date", "user", "index", "shown", "pid"],
  components: {
    Profile
  },
  mounted() {
    if (this.user) {
      if (this.user.img_url === "random") {
        this.$storage
          .refFromURL("gs://meanit-91a3c.appspot.com/profile/random1.png")
          .getMetadata()
          .then(metadata => {
            this.user.img_url = metadata.downloadURLs[0];
          });
      } else {
        this.$storage
          .refFromURL(`gs://meanit-91a3c.appspot.com/profile/${this.user.uid}`)
          .getMetadata()
          .then(metadata => {
            this.user.img_url = metadata.downloadURLs[0];
          });
      }
    }
  }
};
</script>

<style scoped>
.today-it-container {
  background-color: #ffffff;
  position: relative;
  box-shadow: 6px 6px 0 0 rgba(217, 217, 217, 0.28);
  border: solid 0.5px #eeeeee;
  text-align: center;
  margin-top: 6px;
  width: 100%;
  height: 90%;
  cursor: pointer;
}

.date {
  font-size: 14px;
  font-weight: 500;
  color: #393939;
  margin-top: 22px;
}

.title {
  font-size: 22px;
  font-weight: bold;
  color: #393939;
  margin-top: 13px;
}

.content {
  width: 280px;
  display: inline-block;
  font-size: 14px;
  line-height: 1.29;
  color: #8d8d8d;
  margin-top: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-info {
  display: inline-block;
  position: absolute;
  left: 22px;
  bottom: 22px;
}

.kk-container {
  display: inline-block;
  position: absolute;
  right: 25px;
  bottom: 22px;
}

.kk {
  width: 19px;
  vertical-align: middle;
}

.kk-num {
  margin-left: 2px;
  vertical-align: middle;
  font-size: 13px;
  font-weight: 500;
  color: #ff0072;
}

.small-font {
  font-size: 16px;
  margin-bottom: 6px;
}
</style>