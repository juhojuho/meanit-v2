<template>
  <div class="synonym-container">
    <swiper :options="synonymSwiperOption" :not-next-tick="notNextTick" ref="synonymSwiper">
      <swiper-slide v-for="(it, key) in randomIts" :key="key">
        <div class="synonym" @click="toItPage(it)">
          {{ it }}
        </div>
      </swiper-slide>
    </swiper>
    <img src="../assets/images/left.png" class="left" @click="left">
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";

export default {
  data() {
    return {
      notNextTick: true,
      synonymSwiperOption: {
        slidesPerView: "auto",
        spaceBetween: 12
      }
    };
  },
  components: {
    swiper,
    swiperSlide
  },
  computed: {
    swiper() {
      return this.$refs.synonymSwiper.swiper;
    },
    its() {
      return this.$store.state.its;
    },
    randomIts() {
      const temp = [];
      for (let i = 0; i < 10; i ++) {
        const random = Math.floor(Math.random() * this.its.length);
        temp.push(this.its[random]);
      }
      return temp;
    }
  },
  methods: {
    toItPage(synonym) {
      this.$router.push(`/loading?next=${synonym}`);
    },
    left() {
      this.swiper.slideTo(0, 1000, false);
    }
  },
  updated() {
    this.swiper.update();
  }
};
</script>

<style scoped>
.synonym-container {
  position: relative;
  margin: auto;
}

.swiper-slide {
  width: 90px;
  height: 100px;
}

.synonym {
  display: inline-block;
  width: 100%;
  height: 90%;
  background-color: #ffffff;
  box-shadow: 6px 6px 0 0 #d9d9d9;
  border: solid 1px #ebebeb;
  font-size: 13px;
  font-weight: 900;
  color: #393939;
  text-align: center;
  padding-top: 35px;
  cursor: pointer;
}

.left {
  position: absolute;
  width: 22px;
  height: 22px;
  object-fit: contain;
  top: 34px;
  left: -8px;
  z-index: 100;
  cursor: pointer;
}
</style>
    