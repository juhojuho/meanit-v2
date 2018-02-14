<template>
  <div class="new-container">
    <div class="date">
      따끈따끈 베이커리!
    </div>
    <it-list-post v-for="(post, index) in newList" v-if="index <= num" :key="index" :it="post.it" :text="post.text" :time="post.time" :pid="post.pid" :type="'new'">
    </it-list-post>
    <img v-if="num <= 49" src="../assets/images/round-bottom.png" class="bottom" @click="num += 10">
  </div>
</template>

<script>
import ItListPost from '../components/ItListPost';
import timeConverter from '../assets/js/time';

export default {
  data() {
    return {
      newList: [],
      num: 10,
    };
  },
  created() {
    this.$db.ref('it').orderByChild('timestamp').limitToLast(50).on('child_added', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.timestamp === undefined) {
          data.timestamp = 1507200453;
        }
        this.newList.unshift(Object.assign({}, {
          it: data.name,
          text: data.text,
          time: timeConverter(data.timestamp),
        }, { pid: snapshot.key }));
      }
    });
  },
  /*
  beforeDestroy() {
    this.$db.ref('/it').off();
  },
  */
  components: {
    ItListPost,
  },
};
</script>

<style scoped>
.new-container {
  background-color: white;
  border-top: solid 0.5px #eeeeee;
  border-bottom: solid 0.5px #eeeeee;
  text-align: center;
  padding-bottom: 20px;
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

.bottom {
  width: 22px;
  height: 22px;
  cursor: pointer;
}
</style>
