<template>
  <div class="container">
    <h4>날짜</h4>
    <p>연도a달a일로 입력</p>
    <p>예) 2017a10a08 2017a07a31</p>
    <p>주의) 달과 일은 반드시 두자리로 입력해야 함. 7 -> 07, 1 -> 01처럼 한자리 달과 일은 두자지로 바꿔서 입력</p>
    <input @input="typingDate" :value="date">
    <h4>도움이 필요한 잇</h4>
    <p>띄어쓰기로 구분. 반드시 8개를 입력해야 서버에 전송됨</p>
    <input @input="typingHelps" :value="helps">
    <h4>오늘의 잇</h4>
    <input @input="typingTodayIt" :value="todayIt">
    <div @click="sendHelp" style="margin-bottom: 20px">
      도움이 필요한 잇 보내기
    </div>
    <div @click="sendTodayIt">
      오늘의 잇 보내기
    </div>
    <div @click="kk">
      kk
    </div>
    <div @click="magic">
      매직이 일어남
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: '',
      helps: '',
      todayIt: '',
    };
  },
  methods: {
    typingDate(e) {
      this.date = e.target.value;
    },
    typingHelps(e) {
      this.helps = e.target.value;
    },
    typingTodayIt(e) {
      this.todayIt = e.target.value;
    },
    sendHelp() {
      if (this.validateHelp) {
        this.$db.ref(`/home/need_help/${this.date}`).set(this.helps.split(' '));
        alert('도움이 필요한 잇 전송 성공!');
      }
    },
    sendTodayIt() {
      if (this.validateTodayIt) {
        this.$db.ref(`/home/today_it/${this.date}`).set(this.todayIt);
        alert('오늘의 잇 전송 성공!');
      }
    },
    kk() {
      /*
      this.$db.ref('users').once('value').then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          if (data.img_url === undefined) {
            data.img_url = 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg';
          }
          this.$db.ref(`/users/${childSnapshot.key}`).set(data);
        });
      });
      */
    },
    magic() {
      const nicknames = [];
      this.$db.ref('users').once('value').then((userSnapshot) => {
        userSnapshot.forEach((childSnapshot) => {
          const user = childSnapshot.val();
          if (user.nickname) {
            nicknames.push(user.nickname);
          }
        });
        this.$db.ref('/nicknames').set(nicknames);
      });
    },
  },
  computed: {
    validateHelp() {
      return this.helps.split(' ').length === 8
        && this.date;
    },
    validateTodayIt() {
      return this.todayIt && this.date;
    },
  },
};
</script>

<style scoped>

</style>
