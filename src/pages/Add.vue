<template>
  <div class="container">
    <navigation></navigation>
    <search></search>
    <div class="title" style="margin-top: 150px;">
      나만의 it 추가하기
    </div>
    <textarea class="it-input" :class="{'no-background': newIt}" @input="typingIt" :value="newIt"></textarea>
    <textarea class="description-input" :class="{'no-background': newDescription}" @input="typingDescription" :value="newDescription"></textarea>
    <div v-if="newDescription" class="count" :class="{'active': letterCount > 200}">
      {{ letterCount }}/200
    </div>
    <div class="synonym-title">
      연관된 단어
    </div>
    <div style="position: relative; width: 321px; margin: auto; text-align: left;">
      <div v-for="(synonym, index) in synonyms" class="synonym" :key="index">
        <div style="display: inline-block; vertical-align: middle">
          {{ synonym }}
        </div>
        <img src="../assets/images/x.png" class="x" @click="removeSynonym(index)">
      </div>
      <textarea class="synonym-input" :class="{'no-background': newSynonym}" v-on:input="typingSynonym" :value="newSynonym" @input="change" @keyup.enter="suggestionClick(newSynonym)" @keyup.space="suggestionClick(newSynonym)"></textarea>
      <ul class="dropdown-menu" :class="{'hide': !openSuggestion}">
        <li class="dropdown-element" v-for="(suggestion, key, index) in matches" @click="suggestionClick(suggestion)" :key="suggestion.id">
          {{ suggestion }}
        </li>
      </ul>
    </div>
    <div style="margin-top: 38px" class="title">
      나만의 한 끗 더하기 (찡끗)
    </div>
    <div class="sub-title">
      이미지, 뉴스, 짤, 영상 등과 같은 다양한 방법으로<br>너의 생각을 더 표현해줘!
    </div>
    <div class="helper-container">
      <img v-if="helperMedia !== 'twitter'" @click="helperMedia = 'twitter'" class="helper-icon" src="../assets/images/twitter-off.png">
      <img v-if="helperMedia === 'twitter'" @click="helperMedia = ''" class="helper-icon" src="../assets/images/twitter-on.png">
      <img v-if="helperMedia !== 'instagram'" @click="helperMedia = 'instagram'" class="helper-icon" src="../assets/images/instagram-off.png">
      <img v-if="helperMedia === 'instagram'" class="helper-icon" src="../assets/images/instagram-on.png">
      <img v-if="helperMedia !== 'youtube'" @click="helperMedia = 'youtube'" class="helper-icon" src="../assets/images/youtube-off.png">
      <img v-if="helperMedia === 'youtube'" @click="helperMedia" class="helper-icon" src="../assets/images/youtube-on.png">
      <img v-if="helperMedia !== 'image'" @click="helperMedia = 'image'" class="helper-icon" src="../assets/images/image-off.png">
      <img v-if="helperMedia === 'image'" @click="helperMedia = ''" class="helper-icon" src="../assets/images/image-on.png">
      <img v-if="helperMedia !== 'gif'" @click="helperMedia = 'gif'" class="helper-icon" src="../assets/images/gif-off.png">
      <img v-if="helperMedia === 'gif'" @click="helperMedia = ''" class="helper-icon" src="../assets/images/gif-on.png">
      <img v-if="helperMedia !== 'news'" @click="helperMedia = 'news'" class="helper-icon" src="../assets/images/news-off.png">
      <img v-if="helperMedia === 'news'" @click="helperMedia = ''" class="helper-icon" src="../assets/images/news-on.png">
    </div>
    <div v-if="helperMedia" class="query-container">
      <textarea class="link-input" :class="{'no-background': newLink}" @input="typingLink" :value="newLink"></textarea>
      <img v-if="!newLink" src="../assets/images/icon-search-off.png" class="search">
      <img v-if="newLink" src="../assets/images/icon-search-on.png" class="search" @click="sendValidation">
    </div>
    <square-loader :loading="loading" :color="color" class="loader" :size="size"></square-loader>
    <div v-if="helperMedia && isValidUrl" class="url">
      <a :href="newLink" data-iframely-url class="iframely"></a>
    </div>
    <div v-if="showWarningMessage" class="warning-message">
      {{ warningMessage }}
    </div>
    <div class="button" @click="send">
      다음
    </div>
  </div>
</template>

<script>
import SquareLoader from 'vue-spinner/src/SquareLoader';
import Search from '../components/Search';
import Navigation from '../components/Navigation';

export default {
  data() {
    return {
      newIt: '',
      newDescription: '',
      newSynonym: '',
      newQuery: '',
      synonyms: [],
      newLink: '',
      helperType: '',
      helperMedia: '',
      open: false,
      suggestions: [],
      api: 'https://api.meanit.me',
      isValidUrl: false,
      searchResult: {},
      selectedResult: -1,
      warningMessage: '',
      showWarningMessage: false,
      loading: false,
      color: '#ff0072',
      size: '20px',
    };
  },
  computed: {
    letterCount() {
      return this.newDescription.length;
    },
    matches() {
      return this.suggestions.filter(str =>
        str.indexOf(this.newSynonym) >= 0,
      );
    },
    openSuggestion() {
      return this.newSynonym !== '' &&
        this.matches.length !== 0 &&
        this.open === true;
    },
    qualified() {
      if (!this.newIt) {
        this.warningMessage = '단어를 입력해 주세요.';
        return false;
      } else if (this.letterCount > 200) {
        this.warningMessage = '미닝이 200자를 초과했습니다.';
        return false;
      } else if (!this.newDescription) {
        this.warningMessage = '미닝을 입력해 주세요.';
        return false;
      } else if (!this.synonyms.length) {
        this.warningMessage = '연관된 단어를 적어도 하나 입력해 주세요.';
        return false;
      } else if (!this.newLink) {
        this.warningMessage = '나만의 한 끗을 입력해 주세요.';
        return false;
      } else if (!this.isValidUrl) {
        this.warningMessage = '유효한 한 끗을 입력해 주세요.';
        return false;
      }
      return true;
    },
  },
  created() {
    this.newIt = this.$route.query.it;
  },
  methods: {
    typingIt(e) {
      this.newIt = e.target.value;
    },
    typingDescription(e) {
      this.newDescription = e.target.value;
    },
    typingSynonym(e) {
      this.newSynonym = e.target.value;
      this.$db.ref('/search').orderByKey().startAt(this.newSynonym).limitToFirst(10)
        .once('value', (snapshot) => {
          this.suggestions = Object.keys(snapshot.val());
        });
    },
    typingLink(e) {
      this.newLink = e.target.value;
    },
    typingQuery(e) {
      this.newQuery = e.target.value;
    },
    change() {
      if (this.open === false) {
        this.open = true;
      }
    },
    suggestionClick(suggestion) {
      this.open = false;
      this.synonyms.push(suggestion);
      this.newSynonym = '';
    },
    removeSynonym(index) {
      this.synonyms.splice(index, 1);
    },
    send() {
      const user = this.$store.state.user;
      if (this.qualified && user != null) {
        const newKey = this.$db.ref(`its/${this.newIt}/`).push().key;
        this.$db.ref(`its/${this.newIt}/${newKey}`).set(true);
        this.$db.ref(`search/${this.newIt}`).set(true);
        this.$db.ref(`users/${user.uid}/its/${this.newIt}/${newKey}`).set({
          text: this.newDescription,
          timestamp: this.$firebase.database.ServerValue.TIMESTAMP,
        });
        this.$db.ref(`/users/${user.uid}/num_it`).transaction((num) => {
          if (num !== null) {
            num += 1;
          }
          return num;
        });
        this.$db.ref(`/it/${newKey}`).set({
          text: this.newDescription,
          type: this.helperMedia,
          timestamp: this.$firebase.database.ServerValue.TIMESTAMP,
          url: this.newLink,
          hashtags: this.synonyms,
          name: this.newIt,
          user_id: user.uid,
          kk: 0,
        }).then(() => {
          this.$router.push(`/it/${this.newIt}`);
        });
      } else {
        this.showWarningMessage = true;
      }
    },
    sendValidation() {
      this.loading = true;
      this.$axios.get(`https://us-central1-meanit-91a3c.cloudfunctions.net/isValid?url=${this.newLink}`).then((res) => {
        if (res.data.valid) {
          this.isValidUrl = true;
          this.loading = false;
          setTimeout(() => {
            window.iframely.load();
          }, 100);
        } else {
        }
      });
    },
  },
  components: {
    Navigation,
    Search,
    SquareLoader,
  },
};
</script>

<style scoped>
.container {
  text-align: center;
}

.title {
  font-size: 22px;
  font-weight: bold;
  color: #393939;
}

.it-input {
  width: 321px;
  height: 45px;
  background: url('../assets/images/it-placeholder.png') center center no-repeat;
  background-size: cover;
  padding: 13px;
  resize: none;
  overflow: auto;
  border: none;
  outline: none;
  margin-bottom: 8px;
  margin-top: 31px;
}

.description-input {
  width: 321px;
  height: 176px;
  background: url('../assets/images/description-placeholder.png') center center no-repeat;
  background-size: cover;
  padding: 13px;
  resize: none;
  overflow: auto;
  border: none;
  outline: none;
}

.synonym-input {
  width: 321px;
  height: 45px;
  display: block;
  margin: 12px auto 0px auto;
  background: url('../assets/images/synonym-placeholder.png') center center no-repeat;
  background-size: cover;
  padding: 13px;
  resize: none;
  overflow: auto;
  border: none;
  outline: none;
}

.link-input {
  position: relative;
  width: 282px;
  height: 45px;
  background: url('../assets/images/link-placeholder.png') left center no-repeat;
  background-size: cover;
  padding: 13px;
  resize: none;
  overflow: auto;
  border: none;
  outline: none;
  vertical-align: middle;
}

.search-input {
  position: relative;
  width: 321px;
  height: 45px;
  background: url('../assets/images/search-placeholder.png') 13px center no-repeat;
  background-size: 170px auto;
  padding: 13px;
  resize: none;
  overflow: auto;
  border: none;
  outline: none;
}

.synonym-title {
  font-size: 16px;
  font-weight: bold;
  color: #393939;
  margin-right: 245px;
  margin-bottom: 8px;
  margin-top: 15px;
}

.no-background {
  background: none;
  background-color: #f7f7f7;
}

.sub-title {
  font-size: 16px;
  font-weight: 300;
  line-height: 1.44;
  color: #393939;
  margin-top: 14px;
}

.count {
  width: 321px;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: #f6f6f6;
  margin: 0px auto 0px auto;
  font-size: 13px;
  color: #c0c0c0;
  text-align: right;
  padding-top: 10px;
  padding-right: 15px;
  padding-bottom: 12px;
  margin-top: -5px;
}

.icon-container {
  margin-top: 37px;
  display: inline-block;
}

.icon {
  width: 33px;
  height: 33px;
  margin-bottom: 6px;
}

.icon-legend {
  font-size: 12px;
  font-weight: 500;
  color: #6a6a6a;
}

.helper-container {
  width: 375px;
  height: 53px;
  background-color: #6a6a6a;
  margin-top: 23px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 23px;
  padding-top: 14px;
}

.helper-icon {
  display: inline-block;
  width: 26px;
  height: 26px;
  object-fit: contain;
  margin-right: 15px;
  background-color: transparent;
}

.button {
  display: block;
  width: 130px;
  margin-top: 20px;
  background-color: #393939;
  color: white;
  border-radius: 10px;
  text-decoration: none;
  padding-top: 14px;
  padding-bottom: 14px;
  text-align: center;
  font-weight: 600;
  margin-bottom: 47px;
  margin-left: auto;
  margin-right: auto;
}

.url {
  display: block;
  max-width: 300px;
  height: auto;
  margin: 12px auto 0px auto;
}

.hide {
  display: none;
}

.dropdown-element {
  font-size: 15px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  margin-bottom: 14px;
}

.dropdown-menu {
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  width: 321px;
  z-index: 1000;
  padding: 13px 16px 0px 16px;
  margin: 0 auto 0 auto;
  color: #212529;
  text-align: left;
  list-style: none;
  background-clip: padding-box;
  border: solid 1px #ff0072;
  border-bottom-left-radius: 5px;
  background-color: #ffffff;
  border-bottom-right-radius: 5px;
  box-shadow: 0 13px 16px 0 rgba(200, 200, 200, 0.5);
}

.synonym {
  font-size: 14px;
  text-align: center;
  color: #ffffff;
  display: inline-block;
  background-color: #ff0072;
  padding: 9px 16px 9px 16px;
  border-radius: 20px;
  margin-right: 8px;
}

.x {
  vertical-align: middle;
  margin-left: 7px;
}

.search {
  width: 24px;
  height: 24px;
  object-fit: contain;
  z-index: 10;
  vertical-align: middle;
  margin-left: 8px;
}

.query-container {
  position: relative;
}

.news-container {
  margin-top: 20px;
}

.news-title {
  width: 80%;
  margin: 0px auto 5px auto;
  font-weight: bold;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-description {
  width: 80%;
  margin: 0px auto 10px auto;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.twitter-description {
  width: 80%;
  margin: 0px auto 10px auto;
  font-size: 14px;
}

.active {
  color: #ff0072;
}

.warning-message {
  color: #ff0072;
  margin-top: 20px;
  font-weight: bold;
}
</style>
