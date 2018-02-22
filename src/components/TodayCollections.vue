<template>
  <div class="today-collections-container">
    <swiper :options="swiperOption" :not-next-tick="notNextTick" ref="collectionSwiper" class="swiper">
      <swiper-slide v-for="(collection, index) in collections" :key="index">
        <today-collection :collection="collection">
        </today-collection>
      </swiper-slide>
      <swiper-slide>
        <div class="more-collection-container">
          <div class="more-collection-title">
            다른 콜렉션이 궁금하다면?
          </div>
          <router-link class="more-collection-button" to="/collections">
            더 보러가기 >
          </router-link>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import TodayCollection from "../components/TodayCollection";
import { swiper, swiperSlide } from "vue-awesome-swiper";

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
        initialSlide: 0
      },
      activeIndex: 0
    };
  },
  computed: {
    swiper() {
      return this.$refs.collectionSwiper.swiper;
    },
    collections() {
      return this.$store.state.collections;
    }
  },
  components: {
    TodayCollection,
    swiper,
    swiperSlide
  },
  mounted() {
    this.swiper.on("slideChangeTransitionStart", () => {
      this.activeIndex = this.swiper.activeIndex;
    });
  },
  created() {
    if (!this.collections) {
      this.$db
        .ref("/collections")
        .once("value")
        .then(collectionsSnapshot => {
          const collections = collectionsSnapshot.val();
          if (collections) {
            const keys = Object.keys(collections);
            const temp = [];
            keys.forEach(key => {
              collections[key].key = key;
              temp.push(collections[key]);
            });
            this.$store.commit("setCollections", temp);
          }
        });
    }
  }
};
</script>

<style scoped>
.today-collections-container {
  margin-top: 30px;
}

.swiper-slide {
  width: 80%;
  height: 140px;
}

.more-collection-title {
  font-size: 20px;
  font-weight: bold;
  color: #393939;
}

.more-collection-button {
  display: inline-block;
  border-radius: 8px;
  background-color: #fff231;
  padding: 8px 26px 8px 26px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  text-decoration: none;
  margin-top: 20px;
}

.more-collection-container {
  width: 100%;
  height: 90%;
  background-color: #ffffff;
  box-shadow: 6px 6px 0 0 rgba(199, 199, 199, 0.28);
  border: solid 1px #e3e3e3;
  text-align: center;
  padding-top: 30px;
}
</style>
