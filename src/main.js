// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Firebase from 'firebase';
import Vue from 'vue';
import axios from 'axios';
import App from './App';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

// Production
const config = {
  apiKey: 'AIzaSyC7uPUFMl8EOTSueUW2xWarA12HRpaRLeQ',
  authDomain: 'meanit-91a3c.firebaseapp.com',
  databaseURL: 'https://meanit-91a3c.firebaseio.com',
  projectId: 'meanit-91a3c',
  storageBucket: 'meanit-91a3c.appspot.com',
  messagingSenderId: '5196940972',
};

// test
/*
const config = {
  apiKey: "AIzaSyDf5gQsOgSOO5752Q7Ci78kHbX6bIIH7wg",
  authDomain: "meanit-test-399a0.firebaseapp.com",
  databaseURL: "https://meanit-test-399a0.firebaseio.com",
  projectId: "meanit-test-399a0",
  storageBucket: "meanit-test-399a0.appspot.com",
  messagingSenderId: "1003107192109"
};
*/

Firebase.initializeApp(config);
const db = Firebase.database();
const storage = Firebase.storage();
Vue.prototype.$firebase = Firebase;
Vue.prototype.$db = db;
Vue.prototype.$storage = storage;
Vue.prototype.$axios = axios;

Firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log('Authentication Finished');
    db.ref(`/users/${user.uid}/`).once('value').then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        data.uid = user.uid;
        store.commit('change', data);
        if (!data.addNickname) {
          router.push('/signup');
        } else if (router.currentRoute.path === '/loading') {
          router.push('/');
        }
      } else {
        router.push('/signup');
      }
    });
    db.ref(`/alarms/${user.uid}`).orderByChild('timestamp').limitToLast(20)
      .once('value')
      .then((snapshot) => {
        snapshot.forEach((alarmSnapshot) => {
          const alarm = alarmSnapshot.val();
          if (alarm) {
            alarm.aid = alarmSnapshot.key;
            if (!alarm.read) {
              store.commit('increadUnread');
            }
            store.commit('pushAlarm', alarm);
          }
        });
      });
    db.ref('/its').once('value').then((snapshot) => {
      const its = snapshot.val();
      if (its) {
        store.commit('setIts', Object.keys(its));
      }
    });
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
