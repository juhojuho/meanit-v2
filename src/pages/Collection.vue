<template>
  <div>
    <navigation></navigation>
    <search></search>
    <div class="container">
      <div class="title-container">
        <div class="title">
          {{ title }}
        </div>
        <img v-if="false" src="../assets/images/right.png" class="right-button" @click="$router.push(`/collection?cid=${next}`)">
        <img v-if="false" src="../assets/images/left.png" class="left-button" @click="$router.push(`/collection?cid=${prev}`)">
        <div class="description">
          {{ description }}
        </div>
      </div>
      <div class="it-container">
        <div class="sub-title">
          여기 있는 것만 알아도 다 안다고 할 수 있지
        </div>
        <div v-for="(post, index) in posts" :key="index">
          <a class="it" :href="'collection?cid='+$route.query.cid+'#'+index">
            {{ post.name }}
          </a>
          <br>
        </div>
        <square-loader :loading="loader.loading" :color="loader.color" :size="loader.size" style="margin-top: 40px; margin-bottom: 20px;"></square-loader>
      </div>
      <div class="posts-container">
        <div v-for="(post, index) in posts" :key="index" style="margin-bottom: 86px;">
          <div class="post-container">
            <router-link class="profile-container" :id="index" :to="`/mypage/${post.user.uid}`">
              <img :src="post.user.img_url" class="profile">
              <div class="user-info-container">
                <div class="nickname">
                  {{ post.user.nickname }}
                </div>
                <div class="date">
                  {{ post.date.month }}월 {{ post.date.date }}일
                </div>
              </div>
            </router-link>
            <router-link :to="'/it/' + post.name" class="post-it">
              {{ post.name }}
            </router-link>
            <div class="post-text">
              {{ post.text }}
            </div>
          </div>
          <div v-if="post.article" class="article-container">
            <img :src="post.article.links.thumbnail[0].href" class="thumbnail">
            <div class="article-title">{{ post.article.meta.title }}</div>
          </div>
        </div>
      </div>
      <router-link to="/collections" class="collections-button">
        다른 it 콜렉션 보러가기
      </router-link>
    </div>
  </div>
</template>

<script>
import Navigation from "../components/Navigation";
import Search from "../components/Search";
import SquareLoader from "vue-spinner/src/SquareLoader";
import { timestampToDate } from "../assets/js/time";

export default {
  data() {
    return {
      title: "",
      description: "",
      itList: [],
      posts: [],
      loader: {
        loading: true,
        color: "#ff0072",
        size: "40px"
      },
      next: 0,
      prev: 0
    };
  },
  components: {
    Navigation,
    Search,
    SquareLoader
  },
  created() {
    const cid = this.$route.query.cid;
    this.$db
      .ref(`/collections/${cid}`)
      .once("value")
      .then(collectionSnapshot => {
        const collection = collectionSnapshot.val();
        if (collection) {
          this.title = collection.title;
          this.description = collection.description;
          collection.itList.forEach((pid, index) => {
            this.$db
              .ref(`/it/${pid}`)
              .once("value")
              .then(postSnapshot => {
                const post = postSnapshot.val();
                if (post) {
                  this.$db
                    .ref(`/users/${post.user_id}`)
                    .once("value")
                    .then(userSnapshot => {
                      this.loader.loading = false;
                      const user = userSnapshot.val();
                      if (user) {
                        user.uid = userSnapshot.key;
                        if (!post.timestamp) {
                          post.timestamp = 1501585200;
                        }
                        if (
                          collection.articleList &&
                          collection.articleList[pid]
                        ) {
                          const encodedUrl = encodeURIComponent(
                            collection.articleList[pid]
                          );
                          this.$axios
                            .get(
                              `https://us-central1-meanit-91a3c.cloudfunctions.net/getIframely?url=${encodedUrl}`
                            )
                            .then(res => {
                              post.article = res.data;
                              post.user = user;
                              post.pid = pid;
                              post.date = timestampToDate(post.timestamp);
                              this.posts.push(post);
                              this.posts.sort((a, b) => {
                                return a.timestamp > b.timestamp
                                  ? -1
                                  : a.timestamp < b.timestamp ? 1 : 0;
                              });
                            });
                        } else {
                          post.user = user;
                          post.pid = pid;
                          post.date = timestampToDate(post.timestamp);
                          this.posts.push(post);
                          this.posts.sort((a, b) => {
                            return a.timestamp > b.timestamp
                              ? -1
                              : a.timestamp < b.timestamp ? 1 : 0;
                          });
                        }
                      }
                    });
                }
              });
          });
        }
      });
  }
};
</script>

<style scoped>
.title-container {
  position: relative;
}

.title {
  display: inline-block;
  border-radius: 22px;
  background-color: #fffa31;
  border: solid 2px #393939;
  padding: 8px 28px 8px 28px;
  font-size: 20px;
  font-weight: bold;
  color: #393939;
}

.description {
  color: #393939;
  margin-top: 16px;
  font-weight: 600;
}

.left-button {
  position: absolute;
  left: 0px;
  top: 10px;
  width: 22px;
}

.right-button {
  position: absolute;
  right: 0px;
  top: 10px;
  width: 22px;
}

.sub-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  color: #393939;
}

.container {
  text-align: center;
  margin-top: 168px;
  padding-left: 18px;
  padding-right: 18px;
  padding-bottom: 60px;
  box-sizing: border-box;
}

.it-container {
  border-radius: 0.5px;
  background-color: #ffffff;
  box-shadow: 3px 3px 0 0 rgba(241, 241, 241, 0.85);
  border: solid 0.6px #e5e5e5;
  margin-top: 25px;
  padding: 20px 0px 26px 0px;
  margin-bottom: 32px;
}

.it {
  display: inline-block;
  font-size: 15px;
  font-weight: bold;
  color: #ff0072;
  margin-top: 26px;
}

.post-container {
  width: auto;
  position: relative;
  text-align: left;
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 6px 6px 0 0 rgba(241, 241, 241, 0.85);
  border: solid 1px #e1e1e1;
  padding: 20px 17px 24px 17px;
}

.posts-container {
  border-left: solid 1px #9a9a9a;
  padding-left: 15px;
  padding-top: 44px;
}

.post-it {
  font-size: 17px;
  display: block;
  font-weight: bold;
  text-align: left;
  color: #ff0072;
  margin-bottom: 13px;
}

.post-text {
  font-size: 12px;
  line-height: 1.5;
  text-align: left;
  color: #393939;
}

.profile-container {
  position: absolute;
  display: block;
  text-decoration: none;
  top: -45px;
  left: -34px;
}

.profile {
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 50%;
  border: solid 1px#9a9a9a;
}

.user-info-container {
  display: inline-block;
  text-align: left;
  margin-left: 6px;
  vertical-align: middle;
}

.nickname {
  font-size: 12px;
  font-weight: bold;
  color: #5e5e5e;
  margin-bottom: 2px;
}

.date {
  font-size: 12px;
  font-weight: 300;
  color: #8d8d8d;
}

.thumbnail {
  display: inline-block;
  width: 54px;
  height: 54px;
  object-fit: cover;
}

.article-title {
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  color: #393939;
}

.article-container {
  border-radius: 4px;
  background-color: #ffffff;
  border: solid 1px #e1e1e1;
  margin-top: 11px;
}

.collections-button {
  display: inline-block;
  border-radius: 15px;
  background-color: #393939;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  padding: 20px 36px 20px 36px;
  text-decoration: none;
}
</style>
