<template>
  <div class="container">
    <navigation></navigation>
    <search></search>
    <div class="header-container">
      <div class="option" :class="{active: selected === 0}" @click="selected = 0" style="margin-right: 60px">
        따끈따끈
      </div>
      <div class="option" :class="{active: selected === 1}" @click="selected = 1">
        실시간 ㅋ 상승
      </div>
    </div>
    <new v-if="selected === 0"></new>
    <trending v-if="selected === 1"></trending>
    <div class="title" style="margin: 30px 0px 18px 17px;">
      도움이 필요해!
    </div>
    <help></help>
    <div class="title" style="margin-top: 60px; margin-left: 34px;">
      모든 <img src="../assets/images/logo-it.png" class="logo-it">을</br>한번에 모아 보고 싶다면?
    </div>
    <div style="text-align: right">
      <img src="../assets/images/glossary.png" class="glossary" @click="$router.push('/glossary')">
    </div>
  </div>
</template>

<script>
import Trending from '../components/Trending';
import Help from '../components/Help';
import New from '../components/New';
import Search from '../components/Search';
import Navigation from '../components/Navigation';

export default {
  data() {
    return {
      selected: 0,
    };
  },
  components: {
    Trending,
    Help,
    New,
    Navigation,
    Search,
  },
  mounted() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  },
};
</script>

<style scoped>
.header-container {
  text-align: center;
  margin-top: 140px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  vertical-align: middle;
}

.logo-it {
  width: 30px;
  height: 24px;
  object-fit: contain;
  vertical-align: middle;
}

.glossary {
  width: 136px;
  height: 64px;
  object-fit: contain;
  margin-top: 10px;
  margin-right: 34px;
  margin-bottom: 47px;
  cursor: pointer;
}

.option {
  width: 120px;
  text-align: center;
  display: inline-block;
  font-size: 20px;
  color: #8d8d8d;
  padding-bottom: 14px;
  font-weight: 900;
  cursor: pointer;
}

.active {
  color: #ff0072;
}
</style>
