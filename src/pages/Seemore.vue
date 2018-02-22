<template>
  <div class="container">
    <navigation></navigation>
    <search></search>
    <div class="title">
      <span style="font-size: 22px; font-weight: bold;">{{ $route.params.name }}</span>하면 이거지
    </div>
    <div class="sub-title">
      마음에 드는 포스트에 너의 ㅋ를 날려봐.
    </div>
    <div style="text-align: right; margin-bottom: 9px;">
      <img v-if="order === 'kk'" src="../assets/images/icon-order-by-kk-on.png" class="icon-sorting">
      <img v-if="order === 'kk'" src="../assets/images/icon-order-by-time-off.png" class="icon-sorting" @click="sortByTime">
      <img v-if="order === 'time'" src="../assets/images/icon-order-by-kk-off.png" class="icon-sorting" @click="sortByKk">
      <img v-if="order === 'time'" src="../assets/images/icon-order-by-time-on.png" class="icon-sorting">
    </div>
    <long-post style="border: solid 2px #ff0072; border-radius: 1px; margin-bottom: 20px; box-shadow: 6px 6px 0 0 #dfdfdf;" v-for="(user, index) in topPostUserInfo" :post="topPost" :userInfo="user" :isTop="true" :isLong="true" :index="'top'" :key="index">
    </long-post>
    <long-post v-for="(post, index) in posts" :post="post" :key="index" :userInfo="postsUserInfo[index]" :index="index" :itTop="false" :isLong="true" style="margin-bottom: 20px"></long-post>
    <div style="padding-left: 20px; padding-right: 20px;">
      <div v-if="synonyms.length" class="synonym-header">
        <b>{{ it }}</b>와(과) 연관된 다른 it
      </div>
      <synonym :synonyms="synonyms" style="margin-bottom: 48px;"></synonym>
    </div>
    <div style="margin-top: 36px">
      <it-list></it-list>
    </div>
    <div style="font-size: 16px; font-weight: 500; color: #393939; margin-top: 30px;">내 생각은 다른데?</div>
    <div class="button" @click="$router.push(`/add?it=${it}`)">나도 미닝 추가하기</div>
    <img src="../assets/images/icon-to-top.png" class="to-top" @click="scrollToTop">
  </div>
</template>

<script>
import LongPost from "../components/LongPost";
import Synonym from "../components/Synonym";
import CustomFooter from "../components/CustomFooter";
import ShortPost from "../components/ShortPost";
import Navigation from "../components/Navigation";
import ItList from "../components/ItList";
import Search from "../components/Search";
import { timestampToDate } from "../assets/js/time";

export default {
  data() {
    return {
      topPost: {},
      topPostUserInfo: [],
      posts: [],
      postsUserInfo: [],
      synonyms: [],
      timeOut: null,
      order: "",
      it: ""
    };
  },
  computed: {
    its() {
      return this.$store.state.its;
    },
  },
  created() {
    if (this.$route.query.sort === "time") {
      this.order = "time";
    } else {
      this.order = "kk";
    }
    this.it = decodeURIComponent(this.$route.params.name);
    this.loadData();
  },
  components: {
    LongPost,
    Synonym,
    CustomFooter,
    ShortPost,
    Navigation,
    Search,
    ItList
  },
  methods: {
    sortByTime() {
      location.assign(`/it/${this.it}?sort=time`);
    },
    sortByKk() {
      location.assign(`/it/${this.it}?sort=kk`);
    },
    scrollToTop() {
      if (
        document.body.scrollTop !== 0 ||
        document.documentElement.scrollTop !== 0
      ) {
        window.scrollBy(0, -50);
        this.timeOut = setTimeout(this.scrollToTop, 10);
      } else {
        clearTimeout(this.timeOut);
      }
    },
    compareByTime(a, b) {
      if (a.timestamp > b.timestamp) {
        return 1;
      }
      if (a.timestamp < b.timestamp) {
        return -1;
      }
      return 0;
    },
    compare(a, b) {
      if (a.freq > b.freq) {
        return -1;
      }
      if (a.freq < b.freq) {
        return 1;
      }
      return 0;
    },
    compareByKk(a, b) {
      if (a.kk > b.kk) {
        return -1;
      }
      if (a.kk < b.kk) {
        return 1;
      }
      return 0;
    },
    loadData() {
      const names = [];
      const freqs = [];
      const tempPosts = [];
      const tempUserInfos = [];
      this.$db
        .ref(`/its/${this.it}`)
        .once("value")
        .then(snapshot => {
          const data = snapshot.val();
          if (data) {
            const postKeys = Object.keys(data);
            let index = 0;
            postKeys.forEach(key => {
              this.$db
                .ref(`/it/${key}`)
                .once("value")
                .then(itSnapshot => {
                  const itData = itSnapshot.val();
                  if (itData) {
                    this.$db
                      .ref(`/users/${itData.user_id}`)
                      .once("value")
                      .then(userSnapshot => {
                        const userData = userSnapshot.val();
                        if (userData) {
                          index += 1;
                          const tempUserInfo = userData;
                          // hashtag
                          itData.hashtags.forEach(synonym => {
                            if (this.its.includes(synonym)) {
                              const synonymIndex = names.indexOf(synonym);
                              if (synonymIndex === -1) {
                                names.push(synonym);
                                freqs.push(1);
                              } else {
                                freqs[synonymIndex] += 1;
                              }
                            }
                          });
                          // kk
                          if (itData.kk === undefined) {
                            itData.kk = 0;
                          }
                          tempUserInfo.kk = itData.kk;
                          // pid
                          itData.pid = key;
                          // timestamp
                          if (itData.timestamp === undefined) {
                            itData.timestamp = 1501585200;
                          }
                          tempUserInfo.timestamp = itData.timestamp;
                          const date = timestampToDate(itData.timestamp);
                          tempUserInfo.month = date.month;
                          tempUserInfo.date = date.date;
                          // userInfo
                          tempUserInfo.uid = itData.user_id;
                          if (tempUserInfo.img_url === undefined) {
                            tempUserInfo.profileurl =
                              "https://www.appointbetterboards.co.nz/Custom/Appoint/img/avatar-large.png";
                          } else {
                            tempUserInfo.profileurl = tempUserInfo.img_url;
                          }
                          tempPosts.push(itData);
                          tempUserInfos.push(tempUserInfo);
                          if (index === postKeys.length) {
                            names.forEach((name, tempIndex) => {
                              this.synonyms.push({
                                synonym: name,
                                freq: freqs[tempIndex]
                              });
                            });
                            this.synonyms.sort(this.compare);
                            tempPosts.sort(this.compareByKk);
                            tempUserInfos.sort(this.compareByKk);
                            this.topPost = tempPosts[0];
                            this.topPostUserInfo.push(tempUserInfos[0]);
                            if (this.$route.query.sort === "time") {
                              tempPosts.sort(this.compareByTime);
                              tempUserInfos.sort(this.compareByTime);
                            }
                            this.posts = tempPosts.slice(1);
                            this.postsUserInfo = tempUserInfos.slice(1);
                          }
                        } else {
                          index += 1;
                          if (index === postKeys.length) {
                            names.forEach((name, tempIndex) => {
                              this.synonyms.push({
                                synonym: name,
                                freq: freqs[tempIndex]
                              });
                            });
                            this.synonyms.sort(this.compare);
                            tempPosts.sort(this.compareByKk);
                            tempUserInfos.sort(this.compareByKk);
                            this.topPost = tempPosts[0];
                            this.topPostUserInfo.push(tempUserInfos[0]);
                            if (this.$route.query.sort === "time") {
                              tempPosts.sort(this.compareByTime);
                              tempUserInfos.sort(this.compareByTime);
                            }
                            this.posts = tempPosts.slice(1);
                            this.postsUserInfo = tempUserInfos.slice(1);
                          }
                        }
                      });
                  } else {
                    index += 1;
                    if (index === postKeys.length) {
                      names.forEach((name, tempIndex) => {
                        this.synonyms.push({
                          synonym: name,
                          freq: freqs[tempIndex]
                        });
                      });
                      this.synonyms.sort(this.compare);
                      tempPosts.sort(this.compareByKk);
                      tempUserInfos.sort(this.compareByKk);
                      this.topPost = tempPosts[0];
                      this.topPostUserInfo.push(tempUserInfos[0]);
                      if (this.$route.query.sort === "time") {
                        tempPosts.sort(this.compareByTime);
                        tempUserInfos.sort(this.compareByTime);
                      }
                      this.posts = tempPosts.slice(1);
                      this.postsUserInfo = tempUserInfos.slice(1);
                    }
                  }
                });
            });
          }
        });
    }
  }
};
</script>

<style scoped>
.container {
  position: relative;
  text-align: center;
}

.title {
  font-size: 18px;
  font-weight: normal;
  color: #393939;
  margin-bottom: 8px;
  margin-top: 148px;
  padding-right: 10px;
  padding-left: 10px;
}

.sub-title {
  font-size: 14px;
  font-weight: 300;
  color: #393939;
  margin-bottom: 23px;
}

.synonym-header {
  font-size: 16px;
  font-weight: normal;
  color: #393939;
  margin-bottom: 12px;
  width: 80%;
  text-align: left;
  padding-top: 8px;
}

.button {
  display: inline-block;
  width: 240px;
  margin-top: 14px;
  background-color: #393939;
  color: white;
  border-radius: 15px;
  text-decoration: none;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
  font-weight: 600;
  margin-bottom: 22px;
  cursor: pointer;
}

.view {
  width: 26px;
  margin-bottom: -5px;
}

.icon-sorting {
  width: 22px;
  vertical-align: middle;
  margin-right: 16px;
  cursor: pointer;
}

.to-top {
  display: block;
  position: absolute;
  width: 29px;
  opacity: 0.75;
  right: 13px;
  padding-bottom: 40px;
  cursor: pointer;
}
</style>
