<template>
  <transition name="search-transition" enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp">
    <div v-if="!isScrollingDown" class="search-container">
      <div style="position: relative">
        <autocomplete to=""></autocomplete>
        <img src="../assets/images/add.png" class="add" @click="toAdd">
        <img src="../assets/images/random.png" class="random" @click="toRandom">
      </div>
    </div>
  </transition>
</template>

<script>
import Autocomplete from '../components/Autocomplete';

export default {
  data() {
    return {
      isScrollingDown: false,
      lastScrollTop: 0,
      randomList: [],
    };
  },
  components: {
    Autocomplete,
  },
  computed: {
    its() {
      return this.$store.state.its;
    },
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
    this.$db.ref('/home/new').orderByChild('timestamp').limitToLast(10).once('value')
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          this.randomList.push(data.name);
        });
      });
  },
  methods: {
    toAdd() {
      if (this.$store.state.user) {
        this.$router.push('/add');
      } else {
        this.$router.push('/login');
      }
    },
    handleScroll() {
      const st = window.pageYOffset;
      if (st < 30) {
        this.isScrollingDown = false;
      } else if (st > this.lastScrollTop) {
        this.isScrollingDown = true;
      } else {
        this.isScrollingDown = false;
      }
      this.lastScrollTop = st;
    },
    toRandom() {
      if (this.its.length) {
        const random = Math.floor(Math.random() * this.its.length);
        this.$router.push(`/loading?next=${this.its[random]}`);
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>


<style scoped>
.search-container {
  position: fixed;
  top: 64px;
  width: 100%;
  height: 50px;
  text-align: center;
  z-index: 50;
  background-color: #fbfbfb;
  -webkit-animation-duration: .5s;
  animation-duration: .5s;
}


@media all and (min-width: 412px) {
  .search-container {
    width: 412px;
  }
}

.add {
  position: absolute;
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-right: 8px;
  margin-left: 13px;
  right: 60px;
  cursor: pointer;
}

.random {
  position: absolute;
  width: 40px;
  height: 40px;
  object-fit: contain;
  right: 16px;
  cursor: pointer;
}
</style>
