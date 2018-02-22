<template>
  <section class="container" style="text-align: center">
    <navigation/>
    <search/>
    <div class="today-it">
      <div class="main-title">
        요즘 이거 아냨ㅋㅋㅋ?
      </div>
      <today-its></today-its>
    </div>
    <div class="it-list">
      <it-list>
      </it-list>
    </div>
    <today-collections></today-collections>
    <div class="header">
      찢었다. 이 사람들...
    </div>
    <user-list>
    </user-list>
    <total></total>
    <custom-footer></custom-footer>
  </section>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import Navigation from '../components/Navigation';
import Search from '../components/Search';
import ItList from '../components/ItList';
import Total from '../components/Total';
import UserList from '../components/UserList';
import TodayIts from '../components/TodayIts';
import CustomFooter from '../components/CustomFooter';
import TodayCollections from '../components/TodayCollections';

export default {
  components: {
    Navigation,
    Search,
    ItList,
    Total,
    UserList,
    TodayIts,
    CustomFooter,
    TodayCollections,
  },
  /*
  created() {
    this.$db.ref('/it').once('value').then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const post = childSnapshot.val();
        if (!post.kk) {
          post.kk = 0;
        }
        if (post.uid) {
          if (post.name) {
            this.$db.ref(`/tops/${post.name}`).once('value').then((topSnapshot) => {
              const topPost = topSnapshot.val();
              if (topPost === null) {
                this.$db.ref(`/tops/${post.name}`).set({
                  pid: childSnapshot.key,
                  kk: post.kk,
                });
              } else if (topPost.kk < post.kk) {
                this.$db.ref(`/tops/${post.name}`).set({
                  pid: childSnapshot.key,
                  kk: post.kk,
                  uid: post.uid,
                });
              }
            });
          }
        }
      });
    });
  },
  */
};
</script>

<style scoped>
.container {
  text-align: center;
}

.today-it {
  margin-top: 144px;
  margin-bottom: 30px;
}

.main-title {
  font-size: 24px;
  font-weight: 900;
  text-align: center;
  color: #393939;
  margin-bottom: 24px;
}

.hide {
  display: none;
}

.logo-it {
  width: 21px;
  height: 17px;
  object-fit: contain;
  margin-bottom: -2px;
}

.swiper {
  width: 100%;
}

.swiper-slide {
  width: 300px;
  display: block;
}

.swiper-slide-next {
  height: 100px;
}

.header {
  font-size: 23px;
  font-weight: bold;
  text-align: center;
  color: #393939;
  margin-bottom: 26px;
  margin-top: 37px;
}

.more {
  width: 58px;
  object-fit: contain;
  position: absolute;
  top: 6px;
  right: 10px;
}
</style>
