<template>
  <div class="trending-container">
    <swiper :option="swiperOption" :not-next-tick="notNextTick" ref="trendingSwiper">
      <swiper-slide>
        <div class="date">
          {{month}}월 {{date}}일
        </div>
        <it-list-post v-for="(trending, index) in trendingList" :key="index" :it="trending.name" :text="trending.text" :kk="trending.kk" :pid="trending.pid" :type="'trending'">
        </it-list-post>
      </swiper-slide>
    </swiper>
    <img src="../assets/images/right.png" class="right" @click="right">
    <img src="../assets/images/left.png" class="left" @click="left">
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import ItListPost from '../components/ItListPost';
import dateToTimeKey, { timeKeyToDate } from '../assets/js/timeKey';

export default {
  data() {
    return {
      month: 0,
      date: 0,
      notNextTick: true,
      swiperOption: {
        centeredSlides: true,
        paginationClickable: true,
        direction: 'horizontal',
        slidesPerView: 'auto',
        spaceBetween: 20,
      },
      trendingList: [],
      todayDateKey: '',
      currDateKey: '',
    };
  },
  created() {
    const dateKey = dateToTimeKey();
    const date = timeKeyToDate(dateKey);
    this.todayDateKey = dateKey;
    this.currDateKey = dateKey;
    this.month = date.month;
    this.date = date.date;
    this.$db.ref(`/home/trending/${dateKey}`).orderByChild('kk').limitToLast(10)
      .once('value')
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          this.trendingList.push(Object.assign({}, data, { pid: childSnapshot.key }));
        });
        this.trendingList.reverse();
      });
  },
  computed: {
    swiper() {
      return this.$refs.trendingSwiper.swiper;
    },
  },
  components: {
    swiper,
    swiperSlide,
    ItListPost,
  },
  methods: {
    right() {
      if (this.currDateKey !== this.todayDateKey) {
        const changedDate = Number(this.currDateKey[9]) + 1;
        const changedKey = this.currDateKey.substring(0, 9) + changedDate;
        this.$db.ref('/home/trending').orderByKey().startAt(changedKey).limitToFirst(1)
          .once('value')
          .then((snapshot) => {
            const newDateKey = Object.keys(snapshot.val())[0];
            const newDate = timeKeyToDate(newDateKey);
            this.currDateKey = newDateKey;
            this.month = newDate.month;
            this.date = newDate.date;
            this.trendingList = [];
            this.$db.ref(`/home/trending/${newDateKey}`).orderByChild('kk').limitToLast(10).once('value')
              .then((snapshot2) => {
                snapshot2.forEach((childSnapshot2) => {
                  const data2 = childSnapshot2.val();
                  this.trendingList.push(Object.assign({}, data2, { pid: childSnapshot2.key }));
                });
                this.trendingList.reverse();
              });
          });
      }
    },
    left() {
      const changedDate = Number(this.currDateKey[9]) - 1;
      const changedKey = this.currDateKey.substring(0, 9) + changedDate;
      this.$db.ref('/home/trending').orderByKey().endAt(changedKey).limitToLast(1)
        .once('value')
        .then((snapshot) => {
          if (snapshot.val() !== null) {
            const newDateKey = Object.keys(snapshot.val())[0];
            const newDate = timeKeyToDate(newDateKey);
            this.currDateKey = newDateKey;
            this.month = newDate.month;
            this.date = newDate.date;
            this.trendingList = [];
            this.$db.ref(`/home/trending/${newDateKey}`).orderByChild('kk').limitToLast(10).once('value')
              .then((snapshot2) => {
                snapshot2.forEach((childSnapshot2) => {
                  const data2 = childSnapshot2.val();
                  this.trendingList.push(Object.assign({}, data2, { pid: childSnapshot2.key }));
                });
                this.trendingList.reverse();
              });
          }
        });
    },
  },
};
</script>

<style scoped>
.trending-container {
  position: relative;
  background-color: #ffffff;
  border-top: solid 0.5px #eeeeee;
  border-bottom: solid 0.5px #eeeeee;
  text-align: center;
  padding-bottom: 20px;
}

.swiper-slide {
  min-height: 426px;
}

.date {
  font-size: 18px;
  font-weight: bold;
  color: #393939;
  background-color: #ffffff;
  border-bottom: solid 0.5px #eeeeee;
  padding-top: 15px;
  padding-bottom: 15px;
  margin-bottom: 21px;
}

.right {
  position: absolute;
  width: 22px;
  height: 22px;
  object-fit: contain;
  top: 15px;
  right: 10px;
  z-index: 100;
  cursor: pointer;
}

.left {
  position: absolute;
  width: 22px;
  height: 22px;
  object-fit: contain;
  top: 15px;
  left: 10px;
  z-index: 100;
  cursor: pointer;
}
</style>
