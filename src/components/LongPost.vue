<template>
  <div class="top-post-container">
    <div class="profile-container">
      <profile :url="url" :nickname="userInfo.nickname" :date="userInfo.date" :month="userInfo.month" :isTop="isTop" :index="index" :uid="userInfo.uid" isLong="true"></profile>
      <div class="background">
        <img src="../assets/images/icon-facebook.png" class="icon" @click="shareFacebook">
        <img src="../assets/images/icon-kakao.png" class="icon" @click="shareKakao">
        <a :href="'https://twitter.com/intent/tweet?url=' + encodedUrl" target="_blank"><img src="../assets/images/icon-twitter.png" class="icon" @click="shareTwitter"></a>
        <img v-if="bookmarked" src="../assets/images/bookmark-on.png" class="icon" style="margin-right: 0px" @click="addBookmark">
        <img v-if="!bookmarked" src="../assets/images/bookmark-off.png" class="icon" style="margin-right: 0px" @click="addBookmark">
      </div>
    </div>
    <div class="content-container">
      <div class="text" id="beforeIframely">
        {{ post.text }}
      </div>
      <div v-show="!loading" class="url" id="iframely" @click="sendEvent">
        <a :href="post.url" data-iframely-url class="iframely">
        </a>
      </div>
      <square-loader :loading="loading" :color="color" class="loader" :size="size"></square-loader>
      <div class="kks">{{ kks }}</div>
      <img draggable="false" src="../assets/images/kk.png" class="kk" @click="start">
      <div class="kk-num">{{ post.kk }}</div>
      <img src="../assets/images/icon-report.png" class="report" @click="$router.push(`/it/${$route.params.it}/report/${post.pid}`)">
    </div>
  </div>
</template>

<script>
import SquareLoader from "vue-spinner/src/SquareLoader";
import Profile from "./Profile";
import timeKey from "../assets/js/timeKey";

export default {
  data() {
    return {
      kk: 0,
      bookmarked: false,
      kks: "",
      totalKK: 0,
      initiated: false,
      color: "#ff0072",
      size: "20px",
      loading: true,
      url: ""
    };
  },
  props: ["post", "userInfo", "isTop", "index"],
  components: {
    Profile,
    SquareLoader
  },
  computed: {
    currUser() {
      return this.$store.state.user;
    },
    encodedUrl() {
      return encodeURIComponent(
        `https://meanit.me/sns?title=${encodeURIComponent(
          "요즘 이거 아냨ㅋㅋㅋ? [" + this.post.name + "]"
        )}&desc=${encodeURIComponent(this.post.text)}`
      );
    }
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
    const user = this.$store.state.user;
    const url = this.userInfo.img_url;
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
            `gs://meanit-91a3c.appspot.com/profile/${this.userInfo.uid}`
          )
          .getMetadata()
          .then(metadata => {
            this.url = metadata.downloadURLs[0];
          });
      }
    }
    this.$db
      .ref(`/users/${user.uid}/bookmarks`)
      .once("value")
      .then(bms => {
        const data = bms.val();
        if (data) {
          if (data[this.post.name]) {
            if (data[this.post.name][this.post.pid]) {
              this.bookmarked = true;
            }
          }
        }
      });
    this.$db
      .ref(`/users/${user.uid}/kks`)
      .once("value")
      .then(snapshot => {
        const data = snapshot.val();
        if (data) {
          if (data[this.post.name]) {
            if (data[this.post.name][this.post.pid]) {
              this.initiated = true;
              this.totalKK = data[this.post.name][this.post.pid].kk;
              this.kks = "ㅋ".repeat(data[this.post.name][this.post.pid].kk);
            }
          }
        }
      });
    window.iframely.load();
  },
  methods: {
    start() {
      if (this.currUser) {
        if (this.totalKK < 50) {
          this.post.kk += 1;
          this.kks += "ㅋ";
          this.totalKK += 1;
          const dateKey = timeKey();
          this.$db.ref(`it/${this.post.pid}/kk`).transaction(kk => {
            if (kk !== null) {
              kk += 1;
            }
            return kk;
          });
          this.$db
            .ref(`users/${this.userInfo.uid}/num_like`)
            .transaction(num => {
              if (num !== null) {
                num += 1;
              }
              return num;
            });
          this.$db.ref(`users/${this.currUser.uid}/my_kk`).transaction(num => {
            if (num !== null) {
              num += 1;
            }
            return num;
          });
          this.$db.ref("/home/total/kk").transaction(kk => {
            if (kk !== null) {
              kk = Number(kk);
              kk += 1;
            }
            return kk;
          });
          if (this.initiated) {
            this.$db
              .ref(
                `/users/${this.currUser.uid}/kks/${this.post.name}/${
                  this.post.pid
                }/kk`
              )
              .transaction(kk => {
                if (kk !== null) {
                  kk += 1;
                }
                return kk;
              });
          } else {
            this.$db
              .ref(
                `/users/${this.currUser.uid}/kks/${this.post.name}/${
                  this.post.pid
                }`
              )
              .set({
                text: this.post.text,
                timestamp: this.$firebase.database.ServerValue.TIMESTAMP,
                kk: 1,
                nickname: this.currUser.nickname,
                uid: this.userInfo.uid
              });
            this.initiated = true;
          }
          this.$db
            .ref(`/home/trending/${dateKey}`)
            .once("value")
            .then(snapshot => {
              const data = snapshot.val();
              if (data === null || data[this.post.pid] === undefined) {
                this.$db.ref(`/home/trending/${dateKey}/${this.post.pid}`).set({
                  name: this.post.name,
                  text: this.post.text,
                  kk: 1
                });
              } else {
                this.$db
                  .ref(`/home/trending/${dateKey}/${this.post.pid}`)
                  .transaction(post => {
                    if (post !== null) {
                      if (post.kk) {
                        post.kk += 1;
                      } else {
                        post.kk = 1;
                      }
                    }
                    return post;
                  });
              }
            });
        }
      } else {
        this.$router.push("/login");
      }
    },
    sendEvent() {
      console.log("Send Evnet!");
      this.$ga.event("끗", "외부유출", this.post.url);
    },
    addBookmark() {
      const user = this.$store.state.user;
      if (user) {
        if (!this.bookmarked) {
          this.$db
            .ref(
              `/users/${user.uid}/bookmarks/${this.post.name}/${this.post.pid}`
            )
            .set({
              text: this.post.text,
              timestamp: this.$firebase.database.ServerValue.TIMESTAMP
            });
          this.bookmarked = true;
        } else {
          this.$db
            .ref(
              `/users/${user.uid}/bookmarks/${this.post.name}/${this.post.pid}`
            )
            .set(null);
          this.bookmarked = false;
        }
      } else {
        this.$router.push("/login");
      }
    },
    shareFacebook() {
      this.$ga.event("공유", "페이스북", this.post.pid);
      const encodedTitle = encodeURIComponent(
        `요즘 이거 아냨ㅋㅋㅋ? [${this.post.name}]`
      );
      const encodedDesc = encodeURIComponent(this.post.text);
      window.FB.ui({
        method: "share",
        href: `https://meanit.me/sns?title=${encodedTitle}&desc=${encodedDesc}`
      });
    },
    shareKakao() {
      this.$ga.event("공유", "카카오톡", this.post.pid);
      window.Kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: `요즘 이거 아냨ㅋㅋㅋ? [${this.post.name}]`,
          description: this.post.text,
          imageUrl:
            "https://firebasestorage.googleapis.com/v0/b/meanit-91a3c.appspot.com/o/sns-thumbnail-square.png?alt=media&token=14594e89-2710-413b-b3da-99132171c72e",
          link: {
            mobileWebUrl: `https://meanit.me${this.$route.fullPath}`,
            webUrl: `https://meanit.me${this.$route.fullPath}`
          }
        },
        buttons: [
          {
            title: "궁금해?ㅋ",
            link: {
              mobileWebUrl: `https://meanit.me${this.$route.fullPath}`,
              webUrl: `https://meanit.me${this.$route.fullPath}`
            }
          }
        ]
      });
    },
    shareTwitter() {
      this.$ga.event("공유", "트위터", this.post.pid);
    }
  }
};
</script>

<style scoped>
.top-post-container {
  width: 90%;
  margin: auto;
  text-align: center;
  background-color: #ffffff;
  border: solid 1px #eeeeee;
  padding-top: 15px;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 15px;
  box-shadow: 6px 6px 0 0 rgba(218, 218, 218, 0.29);
}

.shadow {
  box-shadow: 6px 6px 0 0 rgba(218, 218, 218, 0.29);
}

.kk {
  width: 46px;
  height: 46px;
  margin-top: 18px;
  user-select: none;
  -webkit-touch-callout: none;
  touch-action: manipulation;
  cursor: pointer;
}

.content-container {
  position: relative;
  margin-top: 10px;
}

.kk-num {
  font-size: 14px;
  font-weight: 500;
  color: #ff0072;
  margin-top: 6px;
}

.url {
  display: block;
  margin-top: 10px;
  overflow: auto;
  width: 100%;
  z-index: 100;
}

.text {
  text-align: left;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.43;
  letter-spacing: 0.1px;
  color: #4a4a4a;
  white-space: pre-line;
  /* CSS3 */
  white-space: -moz-pre-line;
  /* Firefox */
  white-space: -pre-line;
  /* Opera <7 */
  white-space: -o-pre-line;
  /* Opera 7 */
  word-wrap: break-word;
  /* IE */
}

.profile-container {
  position: relative;
  text-align: left;
}

.report {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 14px;
  cursor: pointer;
}

.kks {
  font-weight: bold;
  color: #ff0072;
  font-size: 18px;
  margin-top: 10px;
  white-space: pre-line;
  /* CSS3 */
  white-space: -moz-pre-line;
  /* Firefox */
  white-space: -pre-line;
  /* Opera <7 */
  white-space: -o-pre-line;
  /* Opera 7 */
  word-wrap: break-word;
  /* IE */
}

.loader {
  margin-top: 30px;
  margin-bottom: 30px;
}

.icon {
  width: 24px;
  margin-right: 6px;
  cursor: pointer;
}

.background {
  display: inline-block;
  position: absolute;
  right: 0px;
  top: 0px;
  height: 38px;
  padding-left: 6px;
  padding-top: 4px;
}
</style>
