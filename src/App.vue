<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style>
@import url(//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSans-kr.css);
@import url("./assets/css/normalize.css");
@import url("./assets/css/animate.css");

@media all and (min-width: 412px) {
  html {
    width: 412px;
    margin: auto;
  }
}

html {
  background-color: #fbfbfb;
}

#app {
  font-family: 'Spoqa Han Sans', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  box-sizing: border-box;
  background-color: #fbfbfb;
}

* {
  box-sizing: border-box;
}

.profile {
  display: inline-block;
  width: 38px;
  height: 38px;
  object-fit: cover;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  margin-left: 2px;
  vertical-align: middle;
}

.big-profile {
  width: 96px;
  height: 96px;
  object-fit: contain;
  border-radius: 50%;
}

.middle-profile {
  width: 76px;
  height: 76px;
  object-fit: cover;
  border-radius: 50%;
}
</style>
