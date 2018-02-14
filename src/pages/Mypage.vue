<template>
  <div class="container" @click="show = false">
    <navigation></navigation>
    <div class="user" id="user">
      <img :src="url" class="big-profile">
      <div class="nickname">
        {{ userInfo.nickname }}
        <img v-if="show" src="../assets/images/icon-more-on.png" class="icon-more">
        <img v-if="!show && isMe" src="../assets/images/icon-more-off.png" class="icon-more" @click="clickMore">
        <div v-if="show" src="../assets/images/logout-container.png" class="logout-container" @click="logout">
          로그아웃
        </div>
      </div>
      <div class="info" style="margin-right: 10px;">
        작성한 it
        <b style="font-weight: 900">{{ userInfo.num_it }}</b>
      </div>
      <div class="info">
        받은 리액션 수
        <b style="font-weight: 900">{{ userInfo.num_like }}</b>
      </div>
    </div>
    <div class="options">
      <div class="option" style="margin-right: 80px;" @click="option = 'write'; sortBy('time')">
        <img v-if="option === 'write'" src="../assets/images/write-on.png" class="option-image" style="width: 30px;">
        <img v-if="option !== 'write'" src="../assets/images/write-off.png" class="option-image" style="width: 13px;">
        <div class="option-text" :class="{'option-active': option === 'write'}">작성한 it</div>
      </div>
      <div class="option" style="margin-right: 80px;" @click="option = 'kk'; sortBy('time')">
        <img v-if="option === 'kk'" src="../assets/images/kk-on.png" class="option-image">
        <img v-if="option !== 'kk'" src="../assets/images/kk-off.png" class="option-image">
        <div class="option-text" :class="{'option-active': option === 'kk'}">반응한 it</div>
      </div>
      <div class="option" @click="option = 'bookmark'; sortBy('time')">
        <img v-if="option === 'bookmark'" src="../assets/images/bookmark-gary-on.png" class="option-image">
        <img v-if="option !== 'bookmark'" src="../assets/images/bookmark-gray-off.png" class="option-image">
        <div class="option-text" :class="{'option-active': option === 'bookmark'}">저장한 it</div>
      </div>
    </div>
    <div class="its">
      <div class="sortings" v-if="showSortingIcons">
        <img v-if="order === 'time'" src="../assets/images/icon-order-by-time-pink-on.png" class="icon-sorting">
        <img v-if="order === 'time'" src="../assets/images/icon-order-by-name-pink-off.png" class="icon-sorting" @click="sortBy('alphabet')" style="margin-right: 0px;">
        <img v-if="order === 'alphabet'" src="../assets/images/icon-order-by-time-pink-off.png" class="icon-sorting" @click="sortBy('time')">
        <img v-if="order === 'alphabet'" src="../assets/images/icon-order-by-name-pink-on.png" class="icon-sorting" style="margin-right: 0px;">
      </div>
      <template v-if="option === 'write'">
        <line-post v-for="(post, key, index) in its" :key="index" :it="post.it" :text="post.text" :postKey="post.pid">
        </line-post>
      </template>
    </div>
    <template v-if="option === 'kk'">
      <line-post v-for="(post, key, index) in kks" :key="index" :it="post.it" :text="post.text" :postKey="post.pid">
      </line-post>
    </template>
    <template v-if="option === 'bookmark'">
      <line-post v-for="(post, key, index) in bookmarks" :key="index" :it="post.it" :text="post.text" :postKey="post.pid">
      </line-post>
    </template>
    <div v-if="!showSortingIcons" class="container-no-it">
      <img src="../assets/images/image-no-mypage-it.png" class="image-no-it">
      <span v-if="option === 'write'">
        아직 작성한 it이 없습니다.
      </span>
      <span v-if="option === 'kk'">
        아직 반응한 it이 없습니다.
      </span>
      <span v-if="option === 'bookmark'">
        아직 저장한 it이 없습니다.
      </span>
      <a v-if="option === 'write'" class="button" @click="$router.push('/add')">
        추가하러가기
      </a>
      <a v-else class="button" @click="$router.push('/more')">
        둘러보러가기
      </a>
    </div>
  </div>
</template>

<script>
import Navigation from "../components/Navigation";
import LinePost from "../components/LinePost";

export default {
  data() {
    return {
      userInfo: {},
      option: "write",
      its: [],
      kks: [],
      bookmarks: [],
      order: "time",
      show: false,
      url: '',
    };
  },
  computed: {
    showSortingIcons() {
      return (
        (this.option === "write" && this.its.length) ||
        (this.option === "kk" && this.kks.length) ||
        (this.option === "bookmark" && this.bookmarks.length)
      );
    },
    user() {
      return this.$store.state.user;
    },
    isMe() {
      return this.$route.params.uid === this.user.uid;
    }
  },
  components: {
    Navigation,
    LinePost
  },
  created() {
    this.$db
      .ref(`/users/${this.$route.params.uid}`)
      .once("value")
      .then(snapshot => {
        this.userInfo = snapshot.val();
      });
    this.$db
      .ref(`/users/${this.$route.params.uid}/its`)
      .once("value")
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          childSnapshot.forEach(a => {
            this.its.push(
              Object.assign({}, a.val(), { pid: a.key, it: childSnapshot.key })
            );
            this.its.sort(this.sortByTime);
          });
        });
      });
    this.$db
      .ref(`/users/${this.$route.params.uid}/kks`)
      .once("value")
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          childSnapshot.forEach(a => {
            this.kks.push(
              Object.assign({}, a.val(), { pid: a.key, it: childSnapshot.key })
            );
            this.kks.sort(this.sortByTime);
          });
        });
      });
    this.$db
      .ref(`/users/${this.$route.params.uid}/bookmarks`)
      .once("value")
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          childSnapshot.forEach(a => {
            this.bookmarks.push(
              Object.assign({}, a.val(), { pid: a.key, it: childSnapshot.key })
            );
            this.bookmarks.sort(this.sortByTime);
          });
        });
      });
    this.$db
      .ref(`/users/${this.$route.params.uid}/`)
      .once("value")
      .then(snapshot => {
        const url = snapshot.val().img_url;
        if (url) {
          if (url === "random") {
            this.$storage
              .refFromURL("gs://meanit-91a3c.appspot.com/profile/random1.png")
              .getMetadata()
              .then(metadata => {
                this.url = metadata.downloadURLs[0];
              });
          } else {
            this.$storage
              .refFromURL(
                `gs://meanit-91a3c.appspot.com/profile/${this.$route.params.uid}`
              )
              .getMetadata()
              .then(metadata => {
                this.url = metadata.downloadURLs[0];
              });
          }
        }
      });
  },
  methods: {
    logout() {
      this.$firebase.auth().signOut();
      this.$store.commit("change", "");
      this.$router.push("/");
    },
    clickMore(e) {
      this.show = true;
      e.stopPropagation();
    },
    sortByAlphabet(a, b) {
      if (a.it < b.it) {
        return -1;
      }
      if (a.it > b.it) {
        return 1;
      }
      return 0;
    },
    sortByTime(a, b) {
      if (a.timestamp < b.timestamp) {
        return 1;
      }
      if (a.timestamp > b.timestamp) {
        return -1;
      }
      return 0;
    },
    sortBy(type) {
      if (type === "time") {
        this.order = "time";
        if (this.option === "write") {
          this.its.sort(this.sortByTime);
        } else if (this.option === "kk") {
          this.kks.sort(this.sortByTime);
        } else {
          this.bookmarks.sort(this.sortByTime);
        }
      }
      if (type === "alphabet") {
        this.order = "alphabet";
        if (this.option === "write") {
          this.its.sort(this.sortByAlphabet);
        } else if (this.option === "kk") {
          this.kks.sort(this.sortByAlphabet);
        } else {
          this.bookmarks.sort(this.sortByAlphabet);
        }
      }
    }
  }
};
</script>

<style scoped>
.user {
  text-align: right;
  margin-bottom: 20px;
  margin-right: 30px;
  margin-top: 116px;
}

.nickname {
  position: relative;
  font-size: 30px;
  font-weight: 900;
  text-align: right;
  color: #393939;
  margin-bottom: 10px;
  margin-top: 8px;
}

.info {
  display: inline-block;
  font-size: 12px;
  font-weight: 300;
  text-align: right;
  color: #393939;
}

.options {
  text-align: center;
  padding-top: 8px;
  padding-bottom: 8px;
  border-top: solid 0.4px #e9e9e9;
  border-bottom: solid 0.4px #e9e9e9;
}

.option {
  display: inline-block;
  cursor: pointer;
}

.option-image {
  display: inline-block;
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.option-text {
  font-size: 11px;
  font-weight: 300;
  text-align: right;
  color: #b7b7b7;
}

.option-active {
  color: #393939;
}

.its {
  margin-top: 10px;
}

.sortings {
  text-align: right;
  margin-bottom: 20px;
  padding-right: 32px;
}

.icon-sorting {
  width: 16px;
  vertical-align: middle;
  margin-right: 10px;
  cursor: pointer;
}

.active {
  font-weight: 700;
}

.icon-more {
  width: 15px;
  height: 21px;
  object-fit: contain;
  margin-left: 4px;
  cursor: pointer;
}

.logout-container {
  position: absolute;
  background: url("../assets/images/logout-container.png") center center
    no-repeat;
  background-size: cover;
  width: 80px;
  height: 40px;
  object-fit: contain;
  right: 9px;
  top: -1px;
  font-size: 12px;
  font-weight: 300;
  text-align: center;
  padding-top: 12px;
  padding-right: 8px;
}

.image-no-it {
  width: 57px;
  vertical-align: middle;
  margin-right: 16px;
}

.container-no-it {
  font-size: 14px;
  margin-top: 50px;
  color: #a7a7a7;
  text-align: center;
}

.button {
  display: block;
  width: 60%;
  margin: 20px auto 0px auto;
  font-size: 16px;
  background-color: #ff0072;
  color: white;
  border-radius: 10px;
  text-decoration: none;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
  font-weight: 600;
  cursor: pointer;
}
</style>
