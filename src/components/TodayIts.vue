<template>
  <div class="today-its-container">
    <swiper v-show="!loading" :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper" class="swiper">
      <swiper-slide v-for="(it, index) in todayItList" :key="index">
        <today-it :shown="activeIndex === index" :post="it.post" :date="it.date" :user="it.user" :index="index" :pid="it.pid">
        </today-it>
      </swiper-slide>
      <swiper-slide v-show="show">
        <div class="need-today-it" @click="$router.push('/add')">
          <div class="today-it-title">
            오늘의 <img src="../assets/images/it-logo-pink.png" class="it-logo-pink">,
          </div>
          <div class="today-it-title" style="margin-top: 6px">
            직접 추가해볼래?
          </div>
          <img src="../assets/images/plus.png" class="plus">
        </div>
      </swiper-slide>
    </swiper>
    <square-loader :loading="loading" :color="color" class="loader" :size="size"></square-loader>
  </div>
</template>

<script>
import SquareLoader from "vue-spinner/src/SquareLoader";
import TodayIt from "../components/TodayIt";
import { timeKeyToDate } from "../assets/js/timeKey";
import { swiper, swiperSlide } from 'vue-awesome-swiper';


export default {
  data() {
    return {
      notNextTick: true,
      swiperOption: {
        centeredSlides: true,
        paginationClickable: true,
        autoplay: 5000,
        direction: "horizontal",
        slidesPerView: "auto",
        spaceBetween: 20,
        initialSlide: 9
      },
      todayItList: [],
      activeIndex: 0,
      loading: true,
      color: "#ff0072",
      size: "30px",
      show: false
    };
  },
  created() {
    this.$db
      .ref("/home/today_it")
      .orderByKey()
      .limitToLast(10)
      .once("value")
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          const pid = childSnapshot.val();
          const date = timeKeyToDate(childSnapshot.key);
          this.$db
            .ref(`/it/${pid}`)
            .once("value")
            .then(postSnapshot => {
              const post = postSnapshot.val();
              if (post.kk === undefined) {
                post.kk = 0;
              }
              post.key = childSnapshot.key;
              this.$db
                .ref(`users/${post.user_id}`)
                .once("value")
                .then(userSnapshot => {
                  const user = userSnapshot.val();
                  user.uid = post.user_id;
                  this.todayItList.push({
                    post,
                    date,
                    user,
                    pid
                  });
                  this.todayItList.sort(this.compareKey);
                  if (this.todayItList.length === 10) {
                    this.loading = false;
                    setTimeout(() => {
                      this.show = true;
                      /*
                      this.swiper.slideTo(10, 1000, false);
                      */
                      this.activeIndex = this.swiper.activeIndex;
                    }, 200);
                  }
                });
            });
        });
      });
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  components: {
    TodayIt,
    SquareLoader,
    swiper,
    swiperSlide,
  },
  mounted() {
    this.swiper.on("slideChangeTransitionStart", () => {
      this.activeIndex = this.swiper.activeIndex;
    });
  },
  methods: {
    compareKey(a, b) {
      if (a.post.key < b.post.key) {
        return -1;
      }
      if (a.post.key > b.post.key) {
        return 1;
      }
      return 0;
    }
  }
};
</script>


<style scoped>
.today-its-container {
  position: relative;
  height: 226px;
}

.swiper-slide {
  width: 324px;
  height: 226px;
}

.swiper-slide-next {
  height: 180px;
  margin-top: 20px;
}

.swiper-slide-prev {
  height: 180px;
  margin-top: 20px;
}

.empty {
  width: 324px;
  height: 180px;
  margin-top: 20px;
}

.need-today-it {
  position: relative;
  background-color: #ffffff;
  box-shadow: 6px 6px 0 0 rgba(217, 217, 217, 0.28);
  border: solid 0.5px #eeeeee;
  text-align: center;
  margin-top: 6px;
  width: 100%;
  height: 90%;
  padding-top: 65px;
  cursor: pointer;
}

.today-it-title {
  font-size: 20px;
  font-weight: bold;
  color: #393939;
}

.plus {
  width: 20px;
  height: 20px;
  object-fit: contain;
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.it-logo-pink {
  width: 31px;
  height: 24px;
  object-fit: contain;
  vertical-align: bottom;
}

.loader {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -15px;
  margin-top: -15px;
}
</style>
