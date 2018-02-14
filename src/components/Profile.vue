<template>
  <div class="profile-container" :class="{'auto': !isLong}">
    <img v-if="isTop" src="../assets/images/top-post-flag.png" class="flag">
    <div @click="toMyPage" style="display: inline-block;" :class="{'auto': !isLong, 'w-50': isLong, 'margin-left': isTop}">
      <img :src="url" class="profile">
      <div :id="index" class="nickname-container">
        <div class="nickname">
          {{ nickname }}
        </div>
        <div class="date">
          {{ month }}월 {{ date }}일
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clicked: false
    };
  },
  props: [
    "url",
    "nickname",
    "month",
    "date",
    "isTop",
    "index",
    "isLong",
    "uid"
  ],
  mounted() {
    if (this.url) {
      if (this.url === "random") {
        this.$storage
          .refFromURL("gs://meanit-91a3c.appspot.com/profile/random1.png")
          .getMetadata()
          .then(metadata => {
            this.url = metadata.downloadURLs[0];
          });
      } else {
        this.$storage
          .refFromURL(`gs://meanit-91a3c.appspot.com/profile/${this.uid}`)
          .getMetadata()
          .then(metadata => {
            this.url = metadata.downloadURLs[0];
          });
      }
    }
    /*
    if (this.url) {
      const temp = document.getElementById(this.index);
      temp.insertAdjacentHTML('beforebegin', `<img src="${this.url}" class="profile">`);
    }
    */
  },
  methods: {
    toMyPage(e) {
      this.$router.push(`/mypage/${this.uid}`);
      e.stopPropagation();
    }
  }
};
</script>

<style scoped>
.profile-container {
  display: inline-block;
  width: 100%;
  position: relative;
  cursor: pointer;
}

.auto {
  width: auto;
}

.w-50 {
  width: 50%;
}

.flag {
  position: absolute;
  display: inline-block;
  width: 76px;
  vertical-align: middle;
  left: -15px;
  top: -15px;
}

.nickname-container {
  display: inline-block;
  text-align: left;
  margin-left: 6px;
  vertical-align: middle;
}

.nickname {
  width: 50px;
  font-size: 12px;
  font-weight: 500;
  color: #393939;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.date {
  font-size: 12px;
  color: #c0c0c0;
}

.more {
  width: 20px;
  height: 21px;
  object-fit: contain;
  position: absolute;
  right: 0px;
  top: 8px;
}

.margin-left {
  margin-left: 50px;
}
</style>
