<template>
  <div class="container">
    <div class="header-container">
      <span class="header" :class="{active: selected === 0}" @click="selectTrending(0)">
        따끈따끈
      </span>
      <span class="header" :class="{active: selected === 1}" @click="selectTrending(1)">
        실시간 ㅋ 상승
      </span>
      <span class="header" :class="{active: selected === 2}" @click="selectTrending(2)">
        이것 좀 알려줘!
      </span>
    </div>
    <div class="content-container">
      <swiper :options="swiperOption" :not-next-tick="notNextTick" ref="itSwiper">
        <swiper-slide>
          <it-list-post v-for="(post, index) in newList" :key="index" :it="post.it" :text="post.text" :time="post.time" :pid="post.pid" :type="'new'">
          </it-list-post>
        </swiper-slide>
        <swiper-slide>
          <it-list-post v-for="(post, index) in trendingList" :key="index" :it="post.it" :text="post.text" :kk="post.kk" :pid="post.pid" :type="'trending'">
          </it-list-post>
        </swiper-slide>
        <swiper-slide>
          <div class="help-its" style="margin-bottom: 15px;">
            <div class="help-it" @click="$router.push(`/add?it=${helpList[0]}`)">
              <div class="t">
                <div class="tc">
                  {{helpList[0]}}
                </div>
              </div>
            </div>
            <div class="help-it" @click="$router.push(`/add?it=${helpList[1]}`)">
              <div class="t">
                <div class="tc">
                  {{helpList[1]}}
                </div>
              </div>
            </div>
            <div class="help-it" @click="$router.push(`/add?it=${helpList[2]}`)">
              <div class="t">
                <div class="tc">
                  {{helpList[2]}}
                </div>
              </div>
            </div>
            <div class="help-it" style="margin-right: 0px;" @click="$router.push(`/add?it=${helpList[3]}`)">
              <div class="t">
                <div class="tc">
                  {{helpList[3]}}
                </div>
              </div>
            </div>
          </div>
          <div class="help-its">
            <div class="help-it" @click="$router.push(`/add?it=${helpList[4]}`)">
              <div class="t">
                <div class="tc">
                  {{helpList[4]}}
                </div>
              </div>
            </div>
            <div class="help-it" @click="$router.push(`/add?it=${helpList[5]}`)">
              <div class="t">
                <div class="tc">
                  {{helpList[5]}}
                </div>
              </div>
            </div>
            <div class="help-it" @click="$router.push(`/add?it=${helpList[6]}`)">
              <div class="t">
                <div class="tc">
                  {{helpList[6]}}
                </div>
              </div>
            </div>
            <div class="help-it" style="margin-right: 0px; background-color: #ff0072; color: white; font-size: 10px;" @click="$router.push('/help')">
              <div class="t">
                <div class="tc">
                  <img style="width: 16px; display: block; margin: auto; margin-bottom: 2px;" src="../assets/images/write-white.png"> 직접입력
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
      <div class="more-text" @click="$router.push('/more')">
        <img src="../assets/images/button_more.png" style="width: 120px">
      </div>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import ItListPost from '../components/ItListPost';
import dateToTimeKey from '../assets/js/timeKey';
import timeConverter from '../assets/js/time';

export default {
  data() {
    return {
      selected: 0,
      notNextTick: true,
      swiperOption: {
        centeredSlides: true,
        paginationClickable: true,
        autoplay: 2500,
        direction: 'horizontal',
        slidesPerView: 1,
        spaceBetween: 0,
      },
      newList: [],
      trendingList: [],
      helpList: [],
    };
  },
  methods: {
    selectTrending(index) {
      this.selected = index;
      this.swiper.slideTo(index, 1000, false);
    },
  },
  components: {
    swiper,
    swiperSlide,
    ItListPost,
  },
  mounted() {
    this.swiper.on('slideChangeTransitionStart', () => {
      this.selected = this.swiper.activeIndex;
    });
  },
  computed: {
    swiper() {
      return this.$refs.itSwiper.swiper;
    },
  },
  created() {
    const dateKey = dateToTimeKey();
    this.$db.ref('/home/need_help/').orderByKey().limitToLast(1)
      .once('value')
      .then((snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          this.helpList = data[Object.keys(data)[0]];
        }
      });
    this.$db.ref(`/home/trending/${dateKey}`).orderByChild('kk').limitToLast(5)
      .once('value')
      .then((snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            if (childData.kk === undefined) {
              childData.kk = 0;
            }
            this.trendingList.push(Object.assign({}, {
              it: childData.name,
              text: childData.text,
              kk: childData.kk,
            }, { pid: childSnapshot.key }));
          });
          this.trendingList.reverse();
        }
      });
    this.$db.ref('/it/').orderByChild('timestamp').limitToLast(5)
      .once('value')
      .then((snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            if (childData.timestamp === undefined) {
              childData.timestamp = 1507200453;
            }
            this.newList.push(Object.assign({}, {
              it: childData.name,
              text: childData.text,
              time: timeConverter(childData.timestamp),
            }, { pid: childSnapshot.key }));
          });
          this.newList.reverse();
        }
      });
    this.$db.ref(`/home/need_help/${dateKey}`).once('value').then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.helpList = data;
      }
    });
  },
};
</script>

<style scoped>
.container {
  overflow-x: auto;
}

.header-container {
  margin-bottom: 11px;
  padding-right: 10px;
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

.new-it {
  margin-top: 13px;
  text-align: center;
}

.it-name {
  width: 97px;
  font-size: 14px;
  font-weight: 500;
  color: #393939;
  margin-right: 4px;
  text-align: left;
  display: inline-block;
}

.it-text {
  width: 118px;
  font-size: 13px;
  color: #8d8d8d;
  margin-right: 20px;
  text-align: left;
  display: inline-block;
}

.it-timestamp {
  width: 61px;
  font-size: 13px;
  color: #393939;
  text-align: left;
  display: inline-block;
}

.help-it {
  display: inline-block;
  width: 70px;
  height: 70px;
  font-size: 12px;
  font-weight: 500;
  color: #393939;
  background-color: #ffffff;
  box-shadow: 6px 6px 0 0 #d9d9d9;
  border: solid 1px #f1f1f1;
  margin-right: 15px;
  text-align: center;
  cursor: pointer;
}

.more-text {
  font-size: 13px;
  font-weight: bold;
  color: #393939;
  cursor: pointer;
}

.t {
  display: table;
  width: 100%;
  height: 100%;
}

.tc {
  display: table-cell;
  vertical-align: middle;
}
</style>
