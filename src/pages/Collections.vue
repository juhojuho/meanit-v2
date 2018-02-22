<template>
  <div>
    <navigation></navigation>
    <search></search>
    <div class="container">
      <div v-for="(collection, index) in collections" :key="index" class="collection-container">
        <div class="it-button" @click="clickItButton(collection.key, index)">
          {{ collection.title }}
        </div>
        <div class="description">
          {{ collection.description }}
        </div>
        <div class="date">
          2017.02.14
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Navigation from "../components/Navigation";
import Search from "../components/Search";

export default {
  data() {
    return {
      prev: 0,
      next: 0
    };
  },
  components: {
    Navigation,
    Search
  },
  computed: {
    collections() {
      return this.$store.state.collections;
    }
  },
  created() {
    if (!this.collections) {
      this.$db
        .ref("/collections")
        .once("value")
        .then(collectionsSnapshot => {
          const collections = collectionsSnapshot.val();
          if (collections) {
            const keys = Object.keys(collections);
            const temp = [];
            keys.forEach(key => {
              collections[key].key = key;
              temp.push(collections[key]);
            });
            this.$store.commit("setCollections", temp);
          }
        });
    }
  },
  methods: {
    clickItButton(key, index) {
      this.$router.push(`/collection?cid=${key}&prev=${this.collections[(index - 1) % this.collections.length].key}&next=${this.collections[(index + 1) % this.collections.length].key}`);
    },
  },
};
</script>


<style scoped>
.container {
  padding: 166px 25px 20px 25px;
  text-align: center;
}

.collection-container {
  background-color: #ffffff;
  box-shadow: 6px 6px 0 0 rgba(199, 199, 199, 0.28);
  border: solid 1px #e3e3e3;
  padding: 27px 15px 18px 15px;
  margin-bottom: 15px;
}

.it-button {
  display: inline-block;
  border-radius: 22px;
  background-color: #fffa31;
  border: solid 2px #393939;
  padding: 8px 28px 8px 28px;
  font-size: 20px;
  font-weight: bold;
  color: #393939;
  cursor: pointer;
}

.description {
  font-size: 11px;
  line-height: 1.64;
  text-align: center;
  color: #4a4a4a;
  margin-top: 12px;
}

.date {
  font-size: 10px;
  font-weight: 300;
  color: #c0c0c0;
  margin-top: 10px;
}
</style>
