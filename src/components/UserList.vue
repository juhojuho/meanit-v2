<template>
  <div class="container">
    <div class="header-container">
      <span class="header" :class="{active: selected === 0}" @click="selectTrending(0)">
        파워미니터
      </span>
      <span class="header" :class="{active: selected === 1}" @click="selectTrending(1)">
        리액션갑
      </span>
      <span class="header" :class="{active: selected === 2}" @click="selectTrending(2)">
        추가머신
      </span>
    </div>
    <div class="content-container">
      <swiper :options="swiperOption" :not-next-tick="notNextTick" ref="userSwiper">
        <swiper-slide>
          <div v-for="(scoreTop, index) in scoreTopList" :key="index" :id="'scoreTop' + index" class="itTop" @click="$router.push(`/mypage/${scoreTop.uid}`)">
            <img :src="scoreTop.img_url" class="middle-profile">
            <div class="nickname">
              {{ scoreTop.nickname }}
            </div>
            <div class="it">
              {{ scoreTop.num_like }}점
            </div>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div v-for="(kkTop, index) in kkTopList" :key="index" :id="'kkTop' + index" class="itTop" @click="$router.push(`/mypage/${kkTop.uid}`)">
            <img :src="kkTop.img_url" class="middle-profile">
            <div class="nickname">
              {{ kkTop.nickname }}
            </div>
            <div class="it">
              {{ kkTop.my_kk }}ㅋ
            </div>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div v-for="(itTop, index) in itTopList" :key="index" :id="'itTop' + index" class="itTop" @click="$router.push(`/mypage/${itTop.uid}`)">
            <img :src="itTop.img_url" class="middle-profile">
            <div class="nickname">
              {{ itTop.nickname }}
            </div>
            <div class="it">
              {{ itTop.num_it }}개
            </div>
          </div>
        </swiper-slide>
      </swiper>
      <div class="more-text" @click="$router.push('/users')">
        <img src="../assets/images/button-more-user.png" style="width: 120px">
      </div>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";

export default {
  data() {
    return {
      selected: 0,
      notNextTick: true,
      swiperOption: {
        centeredSlides: true,
        paginationClickable: true,
        autoplay: 3000,
        direction: "horizontal",
        slidesPerView: 1,
        spaceBetween: 0
      },
      scoreTopList: [],
      kkTopList: [],
      itTopList: []
    };
  },
  methods: {
    selectTrending(index) {
      this.selected = index;
      this.swiper.slideTo(index, 1000, false);
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  computed: {
    swiper() {
      return this.$refs.userSwiper.swiper;
    }
  },
  created() {
    this.$db
      .ref("/users")
      .orderByChild("num_like")
      .limitToLast(3)
      .once("value")
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          const data = childSnapshot.val();
          data.uid = childSnapshot.key;
          if (data.img_url) {
            if (data.img_url === "random") {
              data.img_url =
                "https://firebasestorage.googleapis.com/v0/b/meanit-91a3c.appspot.com/o/profile%2Frandom1.png?alt=media&token=a36548ee-8375-4cd7-afad-5dd13e1c2745";
            } else {
              this.$storage
                .refFromURL(`gs://meanit-91a3c.appspot.com/profile/${data.uid}`)
                .getMetadata()
                .then(metadata => {
                  data.img_url = metadata.downloadURLs[0];
                });
            }
          }
          this.scoreTopList.unshift(data);
        });
      });
    this.$db
      .ref("/users")
      .orderByChild("my_kk")
      .limitToLast(3)
      .once("value")
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          const data = childSnapshot.val();
          data.uid = childSnapshot.key;
          if (data.img_url) {
            if (data.img_url === "random") {
              data.img_url =
                "https://firebasestorage.googleapis.com/v0/b/meanit-91a3c.appspot.com/o/profile%2Frandom1.png?alt=media&token=a36548ee-8375-4cd7-afad-5dd13e1c2745";
            } else {
              this.$storage
                .refFromURL(`gs://meanit-91a3c.appspot.com/profile/${data.uid}`)
                .getMetadata()
                .then(metadata => {
                  data.img_url = metadata.downloadURLs[0];
                });
            }
          }
          this.kkTopList.unshift(data);
        });
      });
    this.$db
      .ref("/users")
      .orderByChild("num_it")
      .limitToLast(3)
      .once("value")
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          const data = childSnapshot.val();
          data.uid = childSnapshot.key;
          if (data.img_url) {
            if (data.img_url === "random") {
              data.img_url =
                "https://firebasestorage.googleapis.com/v0/b/meanit-91a3c.appspot.com/o/profile%2Frandom1.png?alt=media&token=a36548ee-8375-4cd7-afad-5dd13e1c2745";
            } else {
              this.$storage
                .refFromURL(`gs://meanit-91a3c.appspot.com/profile/${data.uid}`)
                .getMetadata()
                .then(metadata => {
                  data.img_url = metadata.downloadURLs[0];
                });
            }
          }
          this.itTopList.unshift(data);
        });
      });
  },
  mounted() {
    this.swiper.on("slideChangeTransitionStart", () => {
      this.selected = this.swiper.activeIndex;
    });
  }
};
</script>

<style scoped>
.container {
  overflow-x: auto;
}

.header-container {
  margin-bottom: 11px;
}

.content-container {
  background-color: white;
  padding-top: 22px;
  padding-bottom: 25px;
  border-top: solid 1px #eeeeee;
  border-bottom: solid 1px #eeeeee;
}

.header {
  font-size: 15px;
  font-weight: bold;
  color: #6a6a6a;
  width: 30%;
  display: inline-block;
  text-align: center;
  cursor: pointer;
}

.active {
  color: #ff0072;
}

.itTop {
  display: inline-block;
  margin: 0px 12.5px 0px 12.5px;
  cursor: pointer;
}

.nickname {
  width: 76px;
  font-size: 14px;
  font-weight: bold;
  color: #393939;
  margin-top: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.it {
  font-size: 14px;
  font-weight: 300;
  color: #393939;
  margin-top: 5px;
}

.more-text {
  font-size: 13px;
  margin-top: 14px;
  font-weight: bold;
  color: #393939;
  cursor: pointer;
}
</style>
