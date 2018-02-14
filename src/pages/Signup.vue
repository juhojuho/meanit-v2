<template>
  <div class="container">
    <img src="../assets/images/keep-going.png" class="welcome">
    <textarea class="email-input" :class="{'missing': missingInput === 'email'}" @input="typingEmail" :value="newEmail"></textarea>
    <div class="label">
      이메일
    </div>
    <textarea class="nickname-input" :class="{'missing': missingInput === 'nickname'}" @input="typingNickname" :value="newNickname"></textarea>
    <div class="label">
      닉네임(10자 이내, 특수문자 사용 불가)
    </div>
    <div style="width: 321px; text-align: left; margin:auto;">
      <select v-model="selectedYear" class="year">
        <option disabled value="">year</option>
        <option v-for="year in 28" :key="year" :value="2018 - year">
          {{ 2018 - year}}
        </option>
        <option :value="'more'">
          그 이상
        </option>
      </select>
      <select v-model="selectedMonth" class="month">
        <option disabled value="">month</option>
        <option v-for="month in 12" :key="month" :value="month">
          {{ month }}
        </option>
      </select>
    </div>
    <div class="label">
      생년월일
    </div>
    <div v-if="showWarningMessage" class="warning-message">
      {{ warningMessage }}
    </div>
    <img src="../assets/images/meaniter-button.png" @click="signup" class="button">
    <img src="../assets/images/meanit-logo.png" class="logo">
  </div>
</template>

<script>
export default {
  data() {
    return {
      newEmail: '',
      newNickname: '',
      selectedYear: '',
      selectedMonth: '',
      warningMessage: '',
      showWarningMessage: false,
      nicknames: [],
    };
  },
  computed: {
    missingInput() {
      if (this.showWarningMessage) {
        if (!this.newEmail) {
          return 'email';
        } else if (!this.newNickname) {
          return 'nickname';
        } else if (!this.selectedMonth) {
          return 'month';
        } else if (!this.selectedYear) {
          return 'year';
        }
      }
      return '';
    },
  },
  created() {
    this.$db.ref('/nicknames').once('value').then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const nickname = childSnapshot.val().nickname;
        this.nicknames.push(nickname);
      });
    });
  },
  methods: {
    typingEmail(e) {
      this.newEmail = e.target.value;
    },
    typingNickname(e) {
      this.newNickname = e.target.value;
    },
    signup() {
      this.showWarningMessage = true;
      if (this.validate()) {
        const updates = {};
        const uid = this.$store.state.user.uid;
        updates[`birth/year`] = this.selectedYear;
        updates[`birth/month`] = this.selectedMonth;
        updates[`nickname`] = this.newNickname;
        updates[`email`] = this.newEmail;
        updates[`addNickname`] = true;
        this.$db.ref(`/users/${uid}`).update(updates);
        this.$router.push('/');
      }
    },
    validate() {
      const regExp = /[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]/;
      const emailRegExp = /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (this.missingInput) {
        this.warningMessage = '모든 내용을 입력해주세요!';
        return false;
      } else if (regExp.test(this.newNickname)) {
        this.warningMessage = '닉네임을 바르게 입력해주세요!';
        return false;
      } else if (!emailRegExp.test(this.newEmail)) {
        this.warningMessage = '이메일을 바르게 입력해주세요!';
        return false;
      } else if (this.newNickname > 10) {
        this.warningMessage = '닉네임은 10자를 초과할 수 없습니다.';
        return false;
      } else if (this.nicknames.includes(this.newNickname)) {
        this.warningMessage = '이미 사용중인 닉네임입니다ㅠㅠ';
        return false;
      }
      this.warningMessage = '';
      return true;
    },
  },
};
</script>

<style scoped>
.welcome {
  width: 80px;
  margin: 140px auto 25px auto;
  display: block;
}

.container {
  text-align: center;
}

.email-input {
  width: 321px;
  height: 45px;
  background: url('../assets/images/empty.png') center center no-repeat;
  background-size: cover;
  resize: none;
  overflow: auto;
  border: none;
  outline: none;
  padding: 15px;
}

.nickname-input {
  width: 321px;
  height: 45px;
  background: url('../assets/images/nickname.png') center center no-repeat;
  background-size: cover;
  resize: none;
  overflow: auto;
  border: none;
  outline: none;
  padding: 15px;
}

.label {
  width: 321px;
  text-align: left;
  font-size: 12px;
  font-weight: bold;
  color: #4a4a4a;
  margin: 2px auto 13px auto;
}

.no-background {
  background: none;
  background-color: #f7f7f7;
}

.logo {
  margin-top: 125px;
  width: 80px;
}

.button {
  width: 149px;
  display: block;
  margin: 24px auto 0px auto;
  cursor: pointer;
}

.year {
  width: 70px;
  height: 22px;
  margin-right: 10px;
  border: solid 0.5px #6a6a6a;
  background-color: transparent;
  margin-bottom: 4px;
}

.month {
  width: 70px;
  height: 22px;
  border: solid 0.5px #6a6a6a;
  background-color: transparent;
}

.missing {
  border: solid 2px #ff0072;
  border-radius: 10px;
}

.warning-message {
  font-size: 12px;
  font-weight: bold;
  color: #ff0072;
}
</style>

