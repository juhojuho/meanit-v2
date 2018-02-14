<template>
  <div class="container">
    <navigation></navigation>
    <search></search>
    <div class="header-container">
      <div class="option" :class="{active: selected === 'like'}" @click="selected = 'like'">
        파워미니터
      </div>
      <div class="option" :class="{active: selected === 'kk'}" @click="selected = 'kk'">
        리액션갑
      </div>
      <div class="option" :class="{active: selected === 'it'}" @click="selected = 'it'">
        추가머신
      </div>
    </div>
    <div class="users-container">
      <div v-if="selected === 'like'" class="title">
        이 구역의 미친 X은 나야나~٩( ᐛ )و
      </div>
      <div v-if="selected === 'kk'" class="title">
        제일 많이 웃어준 그대는 참 좋~은 사람~╰(*´︶`*)╯
      </div>
      <div v-if="selected === 'it'" class="title">
        이 정도면 오지고지리고렛잇고알파고ㅋ (*´Д｀*)
      </div>
      <user-ranking v-show="selected === 'like'" :rankingType="'like'"></user-ranking>
      <user-ranking v-show="selected === 'kk'" :rankingType="'kk'"></user-ranking>
      <user-ranking v-show="selected === 'it'" :rankingType="'it'"></user-ranking>
    </div>
  </div>
</template>

<script>
import Search from '@/components/Search';
import Navigation from '@/components/Navigation';
import UserRanking from '@/components/UserRanking';

export default {
  data() {
    return {
      selected: 'like',
    };
  },
  components: {
    Search,
    Navigation,
    UserRanking,
  },
  /*
  computed: {
    altImage() {
      return require('../assets/images/alt-profile-pink.png');
    },
  },
  */
};
</script>

<style scoped>
.header-container {
  margin-top: 150px;
  text-align: center;
}

.option {
  width: 30%;
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

.users-container {
  background-color: white;
}

.title {
  font-size: 16px;
  text-align: center;
  padding-top: 16px;
  padding-bottom: 16px;
  border-top: solid 1px #eeeeee;
  border-bottom: solid 1px #eeeeee;
  font-weight: bold;
  color: #393939;
}
</style>
