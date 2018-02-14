<template>
  <div class="container">
    <navigation></navigation>
    <search></search>
    <img src="../assets/images/kong-question.png" class="kong">
    <div class="title">
      엥 미닛에 없네, 난 이거 궁금한데!
    </div>
    <div class="sub-title">
      미니터들아 이것 좀 알려줘!</br>난 이 단어도 궁금해
    </div>
    <div style="position: relative; margin-top: 37px;">
      <form @submit.prevent="addNewHelpIt">
        <input class="help-it-input" :class="{'no-background': newHelpIt.length}" @input="typingHelpIt" :value="newHelpIt"></input>
      </form>
      <img v-if="!newHelpIt.length" class="add-button" src="../assets/images/button-add-gray.png">
      <img v-if="newHelpIt.length" class="add-button" src="../assets/images/add.png" @click="addNewHelpIt">
    </div>
    <div class="help-it-container">
      <div v-for="helpIt in helpIts" class="help-it">
        <div style="display: table; width: 100%; height: 100%;">
          <div style="display: table-cell; vertical-align: middle">{{ helpIt }}</div>
        </div>
      </div>
    </div>
    <a v-if="helpIts.length" class="button" @click="send">
      물어보기
    </a>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation';
import Search from '@/components/Search';

export default {
  data() {
    return {
      newHelpIt: '',
      helpIts: [],
    };
  },
  components: {
    Navigation,
    Search,
  },
  computed: {
    currentUser() {
      return this.$store.state.user;
    },
  },
  methods: {
    typingHelpIt(e) {
      this.newHelpIt = e.target.value;
    },
    addNewHelpIt() {
      if (this.newHelpIt) {
        this.$db.ref(`/search/${this.newHelpIt}`).once('value').then((snapshot) => {
          const data = snapshot.val();
          if (data) {
            console.log('이미 미닛에 있는 단어입니다.');
          } else if (!this.helpIts.includes(this.newHelpIt)) {
            this.helpIts.push(this.newHelpIt);
            this.newHelpIt = '';
          }
        });
      }
    },
    send() {
      if (this.helpIts.length) {
        this.$db.ref('/helps').push({
          uid: this.currentUser.uid,
          timestamp: this.$firebase.database.ServerValue.TIMESTAMP,
          its: this.helpIts,
        });
        this.$router.push('/');
      }
    },
  },
};
</script>

<style scoped>
.container {
  text-align: center;
  margin-top: 160px;
}

.kong {
  width: 75px;
}

.title {
  font-size: 22px;
  font-weight: bold;
  color: #393939;
  margin-top: 14px;
}

.sub-title {
  font-size: 16px;
  font-weight: 300;
  line-height: 22px;
  color: #393939;
  margin-top: 8px;
}

.help-it-input {
  width: 85%;
  height: 45px;
  padding: 13px;
  border: none;
  outline: none;
  background-color: #f4f4f4;
  background: url('../assets/images/help-placeholder.png') 13px center no-repeat;
  background-size: 160px auto;
  border-radius: 4px;
  margin-bottom: 32px;
}

.help-it-container {
  width: 80%;
  margin: auto;
  text-align: left;
}

.help-it {
  display: inline-block;
  text-align: center;
  width: 84px;
  height: 84px;
  object-fit: contain;
  background-color: #ffffff;
  box-shadow: 6px 6px 0 0 #d9d9d9;
  border: solid 1px #f1f1f1;
  font-size: 15px;
  font-weight: 500;
  color: #393939;
  margin-right: 16px;
  margin-bottom: 16px;
}

.button {
  display: block;
  margin: 34px auto 100px auto;
  width: 130px;
  height: 48px;
  line-height: 48px;
  background-color: #393939;
  color: white;
  border-radius: 10px;
  font-size: 15px;
}

.add-button {
  position: absolute;
  top: 12px;
  right: 40px;
  width: 23px;
  z-index: 100;
}

.no-background {
  background: none;
}
</style>
