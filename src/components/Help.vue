<template>
  <div class="container">
    <swiper :option="swiperOption" :not-next-tick="notNextTick" ref="helpSwiper">
      <swiper-slide v-for="(needHelp, index) in needHelps" :key="index">
        <div class="help-its">
          <div class="help-it" style="background-color: #ff0072; color: white; cursor: default;">
            <div class="t">
              <div class="tc">
                {{ needHelp.month }}월 {{ needHelp.day }}일
              </div>
            </div>
          </div>
          <div class="help-it" @click="$router.push(`/add?it=${needHelp.helps[0]}`)">
            <div class="t">
              <div class="tc">{{ needHelp.helps[0] }}
              </div>
            </div>
          </div>
          <div class="help-it" style="margin-right: 0px;" @click="$router.push(`/add?it=${needHelp.helps[1]}`)">
            <div class="t">
              <div class="tc">{{ needHelp.helps[1] }}
              </div>
            </div>
          </div>
        </div>
        <div class="help-its">
          <div class="help-it" @click="$router.push(`/add?it=${needHelp.helps[2]}`)">
            <div class="t">
              <div class="tc">{{ needHelp.helps[2] }}</div>
            </div>
          </div>
          <div class="help-it" @click="$router.push(`/add?it=${needHelp.helps[3]}`)">
            <div class="t">
              <div class="tc">{{ needHelp.helps[3] }}</div>
            </div>
          </div>
          <div class="help-it" @click="$router.push(`/add?it=${needHelp.helps[4]}`)" style="margin-right: 0px;">
            <div class="t">
              <div class="tc">{{ needHelp.helps[4] }}
              </div>
            </div>
          </div>
        </div>
        <div class="help-its">
          <div class="help-it" @click="$router.push(`/add?it=${needHelp.helps[5]}`)">
            <div class="t">
              <div class="tc">{{ needHelp.helps[5] }}</div>
            </div>
          </div>
          <div class="help-it" @click="$router.push(`/add?it=${needHelp.helps[6]}`)">
            <div class="t">
              <div class="tc">{{ needHelp.helps[6] }}</div>
            </div>
          </div>
          <div class="help-it" @click="$router.push('/help')" style="margin-right: 0px; background-color: #ff0072; color: white; font-size: 12px;">
            <div class="t">
              <div class="tc"> <img style="width: 20px; display: block; margin: auto; margin-bottom: 6px;" src="../assets/images/write-white.png"> 직접입력</div>
            </div>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="need-help" @click="$router.push('/add')">
          <div class="sub-title">흠, 뭔가 부족한데?</div>
          <div class="title">이런 <img src="../assets/images/it-logo-pink.png" class="it-logo">도 필요해!</div>
          <img src="../assets/images/plus.png" class="plus">
        </div>
      </swiper-slide>
    </swiper>
    <img src="../assets/images/right.png" class="right" @click="right">
    <img src="../assets/images/left.png" class="left" @click="left">
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import todayTimeKey from '../assets/js/timeKey';

export default {
  data() {
    return {
      notNextTick: true,
      swiperOption: {
        centeredSlides: true,
        paginationClickable: true,
        direction: 'horizontal',
        slidesPerView: 'auto',
        spaceBetween: 20,
      },
      needHelps: [],
    };
  },
  computed: {
    swiper() {
      return this.$refs.helpSwiper.swiper;
    },
  },
  components: {
    swiper,
    swiperSlide,
  },
  methods: {
    right() {
      this.swiper.slideTo(this.swiper.activeIndex + 1, 1000, false);
    },
    left() {
      this.swiper.slideTo(this.swiper.activeIndex - 1, 1000, false);
    },
  },
  created() {
    this.$db.ref('/home/need_help').orderByKey().endAt(todayTimeKey())
      .limitToLast(3)
      .once('value')
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          const month = childSnapshot.key.split('a')[1];
          const day = childSnapshot.key.split('a')[2];
          this.needHelps.push({
            helps: data,
            month,
            day,
          });
        });
        setTimeout(() => {
          this.swiper.slideTo(2, 1000, false);
        }, 100);
      });
  },
};
</script>

<style scoped>
.container {
  position: relative;
  text-align: center;
}

.need-help {
  position: relative;
  display: inline-block;
  width: 290px;
  height: 290px;
  background-color: #ffffff;
  box-shadow: 6px 6px 0 0 #d9d9d9;
  border: solid 1px #f1f1f1;
  padding-top: 115px;
  cursor: pointer;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #393939;
}

.sub-title {
  font-size: 16px;
  font-weight: 300;
  color: #393939;
  margin-bottom: 8px;
}

.it-logo {
  width: 31px;
  height: 24px;
  object-fit: contain;
  vertical-align: bottom;
}

.plus {
  width: 20px;
  height: 20px;
  object-fit: contain;
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.help-it {
  display: inline-block;
  width: 84px;
  height: 84px;
  font-size: 14px;
  font-weight: 500;
  color: #393939;
  background-color: #ffffff;
  box-shadow: 6px 6px 0 0 #d9d9d9;
  border: solid 1px #f1f1f1;
  margin-right: 16px;
  text-align: center;
  cursor: pointer;
}

.help-its {
  margin-bottom: 16px;
}

.right {
  position: absolute;
  width: 22px;
  height: 22px;
  object-fit: contain;
  top: 134px;
  right: 10px;
  z-index: 100;
  cursor: pointer;
}

.left {
  position: absolute;
  width: 22px;
  height: 22px;
  object-fit: contain;
  top: 134px;
  left: 10px;
  z-index: 100;
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
