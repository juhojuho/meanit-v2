<template>
  <div style="position: absolute; left: 16px">
    <div class="autocomplete-container">
      <input class="form-control" :class="{'no-background': selection}" type="text" v-on:input="typing" :value="selection" @input="change" @keyup.enter="searchIt(selection)">
      <div class="line" :class="{'no-border': openSuggestion}"></div>
      <ul class="dropdown-menu" v-bind:class="{'hide': !openSuggestion}">
        <li class="dropdown-element" v-for="(suggestion, key, index) in matches" @click="suggestionClick(suggestion)" v-bind:key="suggestion.id">
          <img v-if="suggestion.type === 'it'" src="../assets/images/round-it.png" class="round-profile">
          <img v-if="suggestion.type === 'user'" :src="suggestion.img_url" class="round-profile">
          <span style="vertical-align: middle">
            {{ suggestion.search }}
          </span>
        </li>
      </ul>
      <img v-if="open" src="../assets/images/icon-search-on.png" class="button-search" @click="searchIt(selection)">
    </div>
  </div>
</template>

<script>
import timeKey from '../assets/js/timeKey';

export default {
  data() {
    return {
      open: false,
      selection: '',
      suggestions: [],
    };
  },
  props: ['suggestionss', 'placeholder', 'to'],
  computed: {
    matches() {
      return this.suggestions.filter(str =>
        str.search.indexOf(this.selection) >= 0,
      );
    },
    openSuggestion() {
      return this.selection !== '' &&
        this.matches.length !== 0 &&
        this.open === true;
    },
  },
  methods: {
    typing(e) {
      this.selection = e.target.value;
      this.$db.ref('/its').orderByKey().startAt(this.selection).limitToFirst(10)
        .once('value', (searchSnapshot) => {
          this.$db.ref('/users').orderByChild('nickname').startAt(this.selection).limitToFirst(10)
            .once('value', (nicknameSnapshot) => {
              this.suggestions = [];
              searchSnapshot.forEach((childSearchSnapshot) => {
                this.suggestions.push({
                  type: 'it',
                  search: childSearchSnapshot.key,
                });
              });
              nicknameSnapshot.forEach((childNicknameSnapshot) => {
                this.suggestions.push({
                  type: 'user',
                  search: childNicknameSnapshot.val().nickname,
                  uid: childNicknameSnapshot.key,
                  img_url: childNicknameSnapshot.val().img_url,
                });
              });
            });
        });
    },
    searchIt(it) {
      this.recordSearch(it);
      this.$db.ref('/search').orderByKey().equalTo(it).once('value')
        .then((snapshot) => {
          const exist = snapshot.val();
          if (exist) {
            this.$router.push(`/it/${Object.keys(exist)[0]}`);
          } else {
            this.$router.push(`/not-found?it=${it}`);
          }
        });
    },
    change() {
      if (this.open === false) {
        this.open = true;
      }
    },
    suggestionClick(suggestion) {
      this.open = false;
      if (suggestion.type === 'it') {
        this.recordSearch(suggestion.search);
      }
      if (this.matches.indexOf(suggestion) === -1) {
        this.$router.push(`/not-found?it=${suggestion.search}`);
      } else if (suggestion.type === 'it') {
        this.$router.push(`/loading?next=${suggestion.search}`);
        // this.$router.push(`/it/${suggestion.search}`);
      } else if (suggestion.type === 'user') {
        this.$router.push(`/mypage/${suggestion.uid}`);
      }
    },
    recordSearch(it) {
      const timekey = timeKey();
      this.$db.ref(`/records/search/${timekey}/${it}`).once('value').then((snapshot) => {
        const data = snapshot.val();
        if (data) {
          this.$db.ref(`/records/search/${timekey}/${it}`).transaction((num) => {
            if (num) {
              num += 1;
            }
            return num;
          });
        } else {
          this.$db.ref(`/records/search/${timekey}/${it}`).set(1);
        }
      });
    },
  },
};
</script>

<style>
.autocomplete-container {
  width: 246px;
  position: relative;
  display: inline-block;
  vertical-align: middle;
}

@media all and (min-width: 412px) {
  .autocomplete-container {
    width: 270px;
  }
}

@media all and (max-width: 320px) {
  .autocomplete-container {
    width: 190px;
  }
}

.dropdown-menu {
  width: 100%;
  z-index: 1000;
  padding: 13px 16px 0px 16px;
  margin: 0 auto 0 auto;
  color: #212529;
  text-align: left;
  list-style: none;
  background-clip: padding-box;
  border: 1px solid #ff0072;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  box-shadow: 0px 0px 10px 0px rgba(176, 176, 176, 0.5);
  background-color: white;
}

.form-control {
  display: inline-block;
  width: 100%;
  height: 38px;
  background: url('../assets/images/search-placeholder.png') 8px center no-repeat;
  background-size: 170px auto;
  text-align: left;
  font-size: 1rem;
  line-height: 2;
  color: #495057;
  outline: none;
  border: none;
  padding-left: 8px;
}

.hide {
  display: none;
}

.dropdown-element {
  font-size: 12px;
  font-weight: bold;
  color: #393939;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  margin-bottom: 10px;
  cursor: pointer;
}

.line {
  width: 100%;
  border: solid 1px #4a4a4a;
  border-radius: 10px;
}

.no-border {
  border: none;
}

.button-search {
  position: absolute;
  width: 15px;
  height: 15px;
  object-fit: contain;
  right: 10px;
  top: 10px;
  cursor: pointer;
}

.no-background {
  background: none;
  background-color: #fbfbfb;
}

.round-profile {
  width: 22px;
  height: 22px;
  object-fit: cover;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 18px;
}
</style>