<template>
  <div class="today-collection-container">
    <div class="today-collection-title">
      오늘의 it 콜렉션!
    </div>
    <br>
    <router-link class="today-collection-button" :to="'/collection?cid=' + collection.key">{{ collection.title }}</router-link>
  </div>
</template>

<script>
export default {
  props: ['collection'],
};
</script>

<style scoped>
.today-collection-container {
  width: 100%;
  height: 90%;
  background-color: #ffffff;
  box-shadow: 6px 6px 0 0 rgba(199, 199, 199, 0.28);
  border: solid 1px #e3e3e3;
  text-align: center;
  padding-top: 18px;
}

.today-collection-title {
  font-size: 14px;
  font-weight: bold;
  color: #393939;
}

.today-collection-button {
  display: inline-block;
  border-radius: 22px;
  background-color: #fffa31;
  border: solid 2px #393939;
  padding: 10px 40px 10px 40px;
  font-size: 20px;
	font-weight: bold;
	text-align: center;
	color: #393939;
  text-decoration: none;
}
</style>
