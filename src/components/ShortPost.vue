<template>
  <div class="short-post-container">
    <template v-if="!folded">
      <span class="profile-container">
        <profile :url="userInfo.profileurl" :nickname="userInfo.nickname" :date="userInfo.date" :month="userInfo.month" :isTop="false" :index="index"></profile>
      </span>
      <span class="text">
        {{ post.text }}
      </span>
      <img src="../assets/images/unfold.png" class="unfold" @click="folded = true">
    </template>
    <div v-if="folded" style="position: relative; padding-top: 8px; padding-bottom: 12px;">
      <long-post :post="post" :userInfo="userInfo" :isTop="false" :isLong="true" :index="index"></long-post>
    </div>
  </div>
</template>

<script>
import LongPost from '../components/LongPost';
import Profile from '../components/Profile';

export default {
  data() {
    return {
      folded: false,
    };
  },
  props: ['post', 'userInfo', 'index'],
  components: {
    LongPost,
    Profile,
  },
  updated() {
    window.iframely.load();
  },
};
</script>

<style scoped>
.short-post-container {
  margin-top: 16px;
}

.profile-container {
  text-align: left;
  margin-right: 5px;
}

.text {
  display: inline-block;
  width: 190px;
  font-size: 13px;
  color: #393939;
  margin-right: 12px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unfold {
  width: 14px;
  height: 14px;
  object-fit: contain;
}

.fold {
  width: 14px;
  height: 14px;
  object-fit: contain;
  position: absolute;
  right: 14px;
  bottom: 10px;
}


.content-container {
  margin-top: 10px;
}
</style>

